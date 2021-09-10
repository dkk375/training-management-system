import prisma from '@lib/prisma'

export default async function handle(req, res) {
    const id = req.query.id
    if (req.method === 'DELETE') {
        const ev = await prisma.event.delete({
            where: { id: String(id) }
        })
        res.json(ev)
    }
}