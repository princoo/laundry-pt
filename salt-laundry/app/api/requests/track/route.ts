import { NextResponse } from 'next/server'
import { getRequestByRoomAndReference } from '@/services/trackRequest.service'
import { trackRequestSchema } from '@/lib/validations/trackRequest.schema'
import { formatReference, parseReference } from '@/lib/utils/formatting'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const parsed = trackRequestSchema.safeParse({
    roomNumber: searchParams.get('room') ?? '',
    reference: searchParams.get('reference') ?? '',
  })
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const ref = parseReference(parsed.data.reference)
  if (!ref) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  const found = await getRequestByRoomAndReference(parsed.data.roomNumber, ref.seq)
  if (!found) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  return NextResponse.json({ ...found, reference: formatReference(found.seq, found.createdAt) })
}
