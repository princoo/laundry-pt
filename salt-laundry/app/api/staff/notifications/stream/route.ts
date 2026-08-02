import { getCurrentUser } from '@/lib/utils/guards'
import {
  getRequestsCreatedSince, getRequestsAssignedTo,
  getUnacknowledgedAssignments, getUnassignedNotifications,
} from '@/services/notification.service'

export const dynamic = 'force-dynamic'

const POLL_INTERVAL_MS = 8000

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const encoder = new TextEncoder()
  let lastNewChecked = new Date()
  let lastAssignedChecked = new Date()
  let lastUnassignedChecked = new Date()
  let intervalId: ReturnType<typeof setInterval>

  const stream = new ReadableStream({
    start(controller) {
      const emit = (event: string, payload: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`))
      }
      controller.enqueue(encoder.encode(`event: connected\ndata: {}\n\n`))

      getUnacknowledgedAssignments(user.id)
        .then((missed) => { if (missed.length > 0) emit('assigned_to_you', missed) })
        .catch(() => {})

      intervalId = setInterval(async () => {
        try {
          if (user.role !== 'HOUSEKEEPER') {
            const newRequests = await getRequestsCreatedSince(lastNewChecked)
            if (newRequests.length > 0) {
              lastNewChecked = new Date()
              emit('new_requests', newRequests)
            }
          }

          const assigned = await getRequestsAssignedTo(user.id, lastAssignedChecked)
          if (assigned.length > 0) {
            lastAssignedChecked = new Date()
            emit('assigned_to_you', assigned)
          }

          const unassigned = await getUnassignedNotifications(user.id, lastUnassignedChecked)
          if (unassigned.length > 0) {
            lastUnassignedChecked = new Date()
            emit('assigned_to_you', unassigned)
          }
        } catch {
          // Keep the connection alive through a transient DB hiccup — the next poll retries.
        }
      }, POLL_INTERVAL_MS)
    },
    cancel() {
      clearInterval(intervalId)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
