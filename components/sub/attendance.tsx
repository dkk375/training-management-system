import { useState, useEffect } from 'react'
import Router from 'next/router'
import Table from '@components/utils/table'
import EditableCell from '@components/utils/table/editable'
import Random from '@lib/random'
import axios from 'axios'
import toast from 'react-hot-toast'
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
                id: `at:${Random(5)}`, 
                name:'', 
                campus: '', 
                email: '', 
                phoneNum:'', 
                eventId: eventId
            })
        )
    }

    const onSaveData = async () => { 
        let promises:Promise<void>[] = []
        rowData.forEach((data) => {
            promises.push(new Promise((res, rej) => {
                if(originalData.filter(d => d.id === data.id).length === 0 ) {
                    if(originalData.indexOf(data) === -1) {
                        axios({
                            'url': '/api/student/',
                            'method': 'POST',
                            'headers': { 'Content-Type': 'application/json' },
                            'data': JSON.stringify(data)
                        }).then(() => res()).catch(rej)
                    }
                } else {
                    axios({
                        'url': `/api/student/${data.id}`,
                        'method': 'PUT',
                        'headers': { 'Content-Type': 'application/json' },
                        'data': JSON.stringify(data)
                    }).then(() => res()).catch(rej)
                }
            }))
        })
        Promise.all(promises)
        .then(() => toast.success('Data telah disimpan.'))
        .catch((e) => {
            console.error(e)
            toast.error('Terjadi kesalahan: (' + e + ')')
        })
    }

    const onDelete = async (id) => {
        const updatedData = rowData.filter(row => row.id !== id)
        setRowData(updatedData)
        await axios(`/api/student/${id}`, {
            method: 'DELETE'
        }).then(() => toast.success('Data peserta berhasil dihapus'))
        .catch((e) => toast.error('Terjadi kesalahan: (' + e + ')'))
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
        },
        {
            Header: 'Aksi',
            Cell: function DeleteAttendantsButton({ row }) {
                 return <span className="text-red-600 hover:underline cursor-pointer text-center block" onClick={() => onDelete(row.original.id)}>Hapus</span>}
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
        </>
    )
}

export default Attendants