import MainLayout from '@layouts/main'
import type { GetServerSideProps, NextPage } from 'next'
import prisma from '@lib/prisma'
import { ConvertToLocalDate } from '@lib/date'
import Router from 'next/router'

async function deleteEvent(id:string):Promise<void> {
    await fetch(`/api/event/${id}`, {
        method: 'DELETE'
    })
    Router.push('/')
} 

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const data = await prisma.event.findUnique({
        where: {
            id: String(params?.id)
        }
    })
    if (!data) {
        return { notFound: true }
    }
    return { props: {
        id: data.id,
        name: data.name,
        eventType: data.type,
        startDate: ConvertToLocalDate(data.startDate),
        endDate: ConvertToLocalDate(data.endDate)
    }}
}

const EventPage: NextPage = (props) => {
    return (
        <MainLayout>
            <h1>{props['id']}</h1>
            <button onClick={() => deleteEvent(props['id'])}>Hapus</button>
        </MainLayout>
    )
}

export default EventPage