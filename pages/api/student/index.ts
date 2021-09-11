import prisma from '@lib/prisma'

export default async function handle(req, res) {
    const data = req.body
    const result = await prisma.student.create({
        data: data
    })
    res.json(result)
}