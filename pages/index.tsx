import React from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import prisma from '@lib/prisma'
import { ConvertToLocalDate } from '@lib/date'
import Table from '@components/table'

export const getServerSideProps:GetServerSideProps = async () => {
    const data = await prisma.event.findMany()
    return {
        props: { 
        data: data.map(item => {
            return {
            id: item.id,
            name: item.name,
            startDate: ConvertToLocalDate(item.startDate),
            endDate: ConvertToLocalDate(item.endDate)
            }
        })
        }
    }
}

const Home: NextPage = (props) => {
    const columns = [
        {
            Header: 'ID',
            accessor: 'id'
        },
        {
            Header: 'Agenda',
            accessor: 'name'
        },
        {
            Header: 'Tanggal Mulai',
            accessor: 'startDate'
        },
        {
            Header: 'Tanggal Selesai',
            accessor: 'endDate'
        }
    ]

    return (
        <>
            <Table columns={columns} data={props['data']}/>
        </>
    )
}

export default Home