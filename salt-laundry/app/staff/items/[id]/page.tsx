export default async function StaffItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <div>Item detail coming soon: {id}</div>
}
