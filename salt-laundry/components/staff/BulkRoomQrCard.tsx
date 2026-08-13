import { useStaticQrCode } from "@/lib/hooks/useRoomQrCode";
import { RoomQrCard } from "@/components/staff/RoomQrCard";
import { QR_PNG_BULK_SIZE } from "@/lib/constants/qrCode";

interface Props {
  room: string;
  url: string;
}

// One card on the bulk sheet- the same RoomQrCard used by the single generator,
// in its compact size, so every card looks identical however it's produced.
export function BulkRoomQrCard({ room, url }: Props) {
  const pngUrl = useStaticQrCode(url, QR_PNG_BULK_SIZE);
  return <RoomQrCard room={room} url={url} qrSrc={pngUrl} compact />;
}
