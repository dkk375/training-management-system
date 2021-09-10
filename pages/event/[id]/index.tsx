import { useState, useEffect, useMemo } from 'react'
import MainLayout from '@layouts/main'
import type { GetServerSideProps, NextPage } from 'next'
import Table from '@components/utils/table'
import EditableCell from '@components/utils/table/editable'
import prisma from '@lib/prisma'
import { ConvertToLocalDate } from '@lib/date'
import { useMutation } from 'react-query'
import Router from 'next/router'
import styles from '@styles/modules/eventPage.module.scss'
import Random from '@lib/random'


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
            attendants: {
                select: {
                    id: true, 
                    name: true, 
                    campus: true,
                    phoneNum: true,
                    email: true,
                    eventId: true
                }
            }
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

const Attendants = ({initialData, eventId}) => {
    const [rowData, setRowData] = useState(initialData)
    const [skipPageReset, setSkipPageReset] = useState(false)

    useEffect(() => {
        setSkipPageReset(false)
    }, [rowData])

    const onAddRowClick = () => {
        setRowData(
            rowData.concat({
                id: `at_${Random(5)}`, 
                name:'', 
                campus: '', 
                email: '', 
                phoneNum:'', 
                eventId: eventId
            })
        )
    }

    const onSaveData = async () => {
        console.warn(rowData)
    }

    const updateMyData = (rowIndex, columnId, value) => {
        setSkipPageReset(true)
        setRowData((old) => old.map((row, index) => {
            if(index == rowIndex) {
                return {
                    ...old[rowIndex],
                    [columnId]: value
                }
            }
            return row
        }))
    }

    const columns = [
        {
            Header: 'Nama',
            accessor: 'name',
            Cell: EditableCell
        },
        {
            Header: 'Asal Kampus',
            accessor: 'campus',
            Cell: EditableCell
        },
        {
            Header: 'Email',
            accessor: 'email',
            Cell: EditableCell
        },
        {
            Header: 'Nomor Telepon',
            accessor: 'phoneNum',
            Cell: EditableCell
        }
    ]

    return (
        <>
        <div className={styles.table_title}> 
            <h2>Daftar Peserta</h2>
            <div className={styles.btn_container}>
                <button className={styles.btn} onClick={onSaveData}>Simpan Data</button>
                <button className={styles.btn} onClick={onAddRowClick}>Tambah Peserta</button>
            </div>
        </div>
        <Table columns={columns} data={rowData} updateMyData={updateMyData} skipPageReset={skipPageReset}/>
        <p className="text-red-600">{JSON.stringify(rowData)/* for debugging reason */}</p>
        </>
    )
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