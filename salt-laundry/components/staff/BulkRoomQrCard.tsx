import { useStaticQrCode } from "@/lib/hooks/useRoomQrCode";
import { RoomQrCard } from "@/components/staff/RoomQrCard";

const BULK_QR_SIZE = 150;

interface Props {
  room: string;
  url: string;
}

// One card on the bulk sheet- the same RoomQrCard used by the single generator,
// in its compact size, so every card looks identical however it's produced.
export function BulkRoomQrCard({ room, url }: Props) {
  const containerRef = useStaticQrCode(url, BULK_QR_SIZE);
  return (
    <RoomQrCard room={room} url={url} containerRef={containerRef} compact />
  );
}
