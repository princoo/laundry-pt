export const GUEST_BASE_URL =
  process.env.NEXT_PUBLIC_GUEST_URL ?? 'https://laundry.netiiv.com'

// Square logo dropped into the middle of every code (served from /public).
export const QR_LOGO_SRC = '/qrcode-logo.png'

// On-screen and printed pixel size of the code.
export const QR_SIZE = 260

export const QR_PNG_SIZE = 800
export const QR_PNG_BULK_SIZE = 512

// Code colour. Plain black scans most reliably across cameras and prints.
export const QR_BRAND_COLOR = '#000000'
