import prisma from '@lib/prisma'

export default async function handle(req, res) {
    const id = req.query.id
    if (req.method === 'DELETE') {
        const ev = await prisma.student.delete({
            where: { id: String(id) }
        })
        res.json(ev)
    } else if (req.method === 'PUT') {
        const ev = await prisma.student.update({
            where: { id: String(id) },
            data: req.body
        })
        res.json(ev)
    }
}