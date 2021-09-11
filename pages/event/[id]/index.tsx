import MainLayout from '@layouts/main'
import Attendants from '@components/sub/attendance'
import Card from '@components/home/card'
import type { GetServerSideProps, NextPage } from 'next'
import prisma from '@lib/prisma'
import { ConvertToLocalDate } from '@lib/date'
import Link from 'next/link'
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
            attendants: true,
            classes: true
        }
    })
    
    if (!data) {
        return { notFound: true }
    }

    return { props: {
        ...JSON.parse(JSON.stringify(data))
    }}
}


const EventPage: NextPage = (props) => {
    return (
        <MainLayout>
            <section className={styles.header}>
                <h1 className={styles.title}>{props['name']}</h1>
                <div className={styles.btn_container}>
                    <button className={styles.btn_danger} onClick={() => deleteEvent(props['id'])}><span>Hapus</span></button>
                    <Link href="/"><a className={styles.btn}>Kembali</a></Link>
                </div>
            </section>
            <section className={styles.info}>
                <h2>Diselenggarakan Oleh <strong>{props['organizer']}</strong></h2>
                <h2>{ConvertToLocalDate(props['startDate'])} - {ConvertToLocalDate(props['endDate'])}</h2>
            </section>
            <section className={styles.card_container}>
                {props['classes'].map(data => (
                    <Card title={data.name} dateStart={ConvertToLocalDate(data.schedule)} url={`#`} key={data.id} />
                ))}
                <Card title={'Tambah Materi'} url={'#'} />
            </section>
            <section className={styles.attendants}>
                <Attendants initialData={props['attendants']} eventId={props['id']}/>
            </section>
        </MainLayout>
    )
}

export default EventPage