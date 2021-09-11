import { useState, useEffect } from 'react'
import Router from 'next/router'
import Table from '@components/utils/table'
import EditableCell from '@components/utils/table/editable'
import Random from '@lib/random'
import styles from '@styles/modules/attendance.module.scss'

const Attendants = ({initialData, eventId}) => {
    const [originalData] = useState(initialData)
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
        rowData.map( async (data) => {
            if(originalData.filter(d => d.id ===data.id).length === 0 ) {
                try {
                    await fetch('/api/student', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    })
                } catch (error) {
                    console.error(error)
                }
            } else {
                try {
                    await fetch(`/api/student/${data.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    })
                } catch (error) {
                    console.error(error)
                }
            }

            Router.push(`/event/${data.eventId}`)
        })
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
        <p className="text-green-600">{JSON.stringify(originalData)/* for debugging reason */}</p>
        </>
    )
}

export default Attendants