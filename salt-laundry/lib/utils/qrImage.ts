import { buildQrOptions } from "@/lib/utils/qrOptions";

export async function renderQrPng(data: string, size: number): Promise<string> {
  const { default: QRCodeStyling } = await import("qr-code-styling");
  const qr = new QRCodeStyling({ ...buildQrOptions(data, size), type: "canvas" });

  const blob = await qr.getRawData("png");
  if (!blob || typeof (blob as Blob).arrayBuffer !== "function") {
    throw new Error("Could not rasterise QR code");
  }

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob as Blob);
  });
}
