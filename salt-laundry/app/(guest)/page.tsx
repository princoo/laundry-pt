import { GuestNav } from '@/components/guest/GuestNav'
import { GuestFooter } from '@/components/guest/GuestFooter'
import { GuestFormHeader } from '@/components/guest/GuestFormHeader'
import { RequestForm } from '@/components/guest/RequestForm'
import { readRoomParam } from '@/lib/utils/roomParam'

interface Props {
  searchParams: Promise<{ room?: string | string[] }>
}

export default async function Home({ searchParams }: Props) {
  const { room } = await searchParams
  const scannedRoom = readRoomParam(room)

  return (
    <div className="min-h-screen bg-salt-cream pb-24 md:pb-0 flex flex-col">
      <GuestNav active="new" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <GuestFormHeader />
        <RequestForm mode="create" scannedRoom={scannedRoom} />
      </div>

      <GuestFooter />
    </div>
  )
}
