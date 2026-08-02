import { prisma } from '@/lib/prisma'

export async function getNotesForRequest(requestId: string) {
  return prisma.requestNote.findMany({
    where: { requestId },
    orderBy: { createdAt: 'asc' },
  })
}

export async function addNoteToRequest(requestId: string, content: string) {
  return prisma.requestNote.create({
    data: { requestId, content },
  })
}
