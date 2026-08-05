import { EditRequestContent } from '@/components/track/EditRequestContent'

export default async function EditRequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditRequestContent requestId={id} />
}
