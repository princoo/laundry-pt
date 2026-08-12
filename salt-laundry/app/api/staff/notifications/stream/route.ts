import { getCurrentUser, requirePermission } from "@/lib/utils/guards";
import { isExpired } from "@/lib/utils/soaSignIn";
import { getOpenAssignments } from "@/services/notification.service";
import {
  collectNotifications,
  initialCursors,
  type StreamCursors,
} from "@/services/notificationStream.service";

export const dynamic = "force-dynamic";

const POLL_INTERVAL_MS = 8000;

export async function GET(request: Request) {
  const authError = await requirePermission("LAUNDRY_REQUEST_VIEW");
  if (authError) return authError;

  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const encoder = new TextEncoder();
  let cursors: StreamCursors = initialCursors();
  let intervalId: ReturnType<typeof setInterval>;
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const stop = () => {
        if (closed) return;
        closed = true;
        clearInterval(intervalId);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      // Next.js does not reliably invoke cancel() on the Node runtime when a
      // client disconnects, so the abort signal is the cleanup hook that
      // actually fires. Without it the interval polls the database forever.
      request.signal.addEventListener("abort", stop);

      // Throws once the client is gone- that is how we learn to stop polling.
      const emit = (event: string, payload: unknown) => {
        controller.enqueue(
          encoder.encode(
            `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`,
          ),
        );
      };

      emit("connected", {});
      getOpenAssignments(user.id)
        .then((missed) => {
          if (missed.length > 0 && !closed) emit("assigned_to_you", missed);
        })
        .catch(() => {});

      intervalId = setInterval(async () => {
        // Ends with the SOA session rather than outliving it.
        if (closed || isExpired(user.expiresAt)) return stop();

        let batch;
        try {
          batch = await collectNotifications(user, cursors);
        } catch {
          return; // Transient DB error- keep the stream open and retry next tick.
        }

        cursors = batch.cursors;
        try {
          batch.events.forEach(({ event, payload }) => emit(event, payload));
        } catch {
          stop(); // Client disconnected mid-write.
        }
      }, POLL_INTERVAL_MS);
    },
    cancel() {
      closed = true;
      clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
