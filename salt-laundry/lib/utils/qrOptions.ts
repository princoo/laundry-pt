import type { Options } from 'qr-code-styling'
import { QR_LOGO_SRC, QR_SIZE, QR_BRAND_COLOR } from '@/lib/constants/qrCode'

// One source of truth for how every code is styled — the single generator and
// the bulk sheet both build from this, so they can never drift apart. `size` is
// the only thing that varies (the bulk sheet renders smaller cards).
export function buildQrOptions(data: string, size: number = QR_SIZE): Options {
  return {
    width: size,
    height: size,
    type: 'svg',
    data,
    image: QR_LOGO_SRC,
    margin: 6,
    // Highest error correction — the centre logo covers part of the code, so the
    // extra redundancy keeps it scannable.
    qrOptions: { errorCorrectionLevel: 'H' },
    dotsOptions: { type: 'rounded', color: QR_BRAND_COLOR },
    cornersSquareOptions: { type: 'extra-rounded', color: QR_BRAND_COLOR },
    cornersDotOptions: { type: 'dot', color: QR_BRAND_COLOR },
    backgroundOptions: { color: '#ffffff' },
    imageOptions: { crossOrigin: 'anonymous', margin: 4, imageSize: 0.24, hideBackgroundDots: true },
  }
}
