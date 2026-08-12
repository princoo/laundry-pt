import { prisma } from '@/lib/prisma'

// Author is nullable: notes written before authorship existed, and the
// automatic guest-edit audit note, have no User behind them.
const AUTHOR_SELECT = { author: { select: { name: true, roleNames: true } } } as const

export async function getNotesForRequest(requestId: string) {
  return prisma.requestNote.findMany({
    where: { requestId },
    orderBy: { createdAt: 'asc' },
    include: AUTHOR_SELECT,
  })
}

export async function addNoteToRequest(requestId: string, content: string, authorId: string) {
  return prisma.requestNote.create({
    data: { requestId, content, authorId },
    include: AUTHOR_SELECT,
  })
}
