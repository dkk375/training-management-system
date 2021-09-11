import MainLayout from '@layouts/main'
import type { GetServerSideProps, NextPage } from 'next'
import prisma from '@lib/prisma'
import { ConvertToLocalDate } from '@lib/date'
import Card from '@components/home/card'
import styles from '@styles/modules/home.module.scss'

export const getServerSideProps: GetServerSideProps = async () => {
    const data = await prisma.event.findMany()
    return {
        props: { 
            data: Object.values(JSON.parse(JSON.stringify(data)))
        }
    }
}

const Home: NextPage = (props) => {
    return (
        <MainLayout>
        <section className={styles.card_container}>
            {props['data'].map(data => (
                <Card title={data.name} subtitle={data.type.toUpperCase()} dateStart={ConvertToLocalDate(data.startDate)} url={`/event/${data.id}`} key={data.id} />
            ))}
            <Card title={'Tambah Dauroh'} url={'/event/create'} />
        </section>
        </MainLayout>
    )
}

export default Home