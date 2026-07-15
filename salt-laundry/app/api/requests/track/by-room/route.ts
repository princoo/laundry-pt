import { NextResponse } from 'next/server'
import { getTrackableRequestsByRoom } from '@/services/trackRequest.service'
import { trackByRoomSchema } from '@/lib/validations/trackRequest.schema'
import { formatReference } from '@/lib/utils/formatting'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const parsed = trackByRoomSchema.safeParse({
    roomNumber: searchParams.get('room') ?? '',
  })
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const found = await getTrackableRequestsByRoom(parsed.data.roomNumber)
  const requests = found.map((r) => ({ ...r, reference: formatReference(r.seq, r.createdAt) }))

  return NextResponse.json({ requests })
}
