import prisma from '@lib/prisma'

export default async function handle(req, res) {
    const data = req.body
    const result = await prisma.event.create({
        data: {
            id: data.id,
            name: data.name,
            type: data.type,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate)
        }
    })
    res.json(result)
}