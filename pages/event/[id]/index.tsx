import MainLayout from '@layouts/main'
import Attendants from '@components/sub/attendance'
import type { GetServerSideProps, NextPage } from 'next'
import prisma from '@lib/prisma'
import { ConvertToLocalDate } from '@lib/date'
import Router from 'next/router'
import styles from '@styles/modules/eventPage.module.scss'


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
        },
        include: {
            attendants: true
        }
    })
    
    if (!data) {
        return { notFound: true }
    }

    return { props: {
        id: data.id,
        name: data.name,
        organizer: data.organizer,
        startDate: ConvertToLocalDate(data.startDate),
        endDate: ConvertToLocalDate(data.endDate),
        attendants: data.attendants
    }}
}


const EventPage: NextPage = (props) => {
    return (
        <MainLayout>
            <section className={styles.header}>
                <h1 className={styles.title}>{props['name']}</h1>
                <div className={styles.btn_container}>
                    <button className={styles.btn_danger} onClick={() => deleteEvent(props['id'])}><span>Hapus</span></button>
                </div>
            </section>
            <section className={styles.info}>
                <h2>Diselenggarakan Oleh <strong>{props['organizer']}</strong></h2>
                <h2>{props['startDate']} - {props['endDate']}</h2>
            </section>
            <section className={styles.attendants}>
                <Attendants initialData={props['attendants']} eventId={props['id']}/>
            </section>
        </MainLayout>
    )
}

export default EventPage