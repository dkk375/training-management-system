import MainLayout from '@layouts/main'
import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import Router from 'next/router'
import Link from 'next/link'
import Random from '@lib/random'
import styles from '@styles/modules/create.module.scss'

import { defaultClassDM1 } from '@lib/defaultClasses'
import toast from 'react-hot-toast'

const CreateEvent: NextPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = async (data, event) => {
        event.preventDefault()

        let classData
        if(data.type === 'dm1') {
            classData = defaultClassDM1
            classData.map(d => {
                d.id = `c:${Random(5)}`
                d.eventId = data.id
                d.schedule = new Date(data.startDate)
            })
        }

        try {
            await fetch('/api/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if(classData) {
                await fetch('/api/class/createall', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(classData)
                })
            }
            await Router.push('/')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <MainLayout>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <h1>Tambah Event</h1>
                <label>
                    <span>Nama Event</span>
                    <input type="text" {...register('name', {required: true})} />
                    {errors['name']?.type === 'required' && <span className={styles.error}>Kolom ini wajib diisi.</span>}
                </label>
                <label>
                    <span>Jenis Event</span>
                    <select {...register('type')}>
                        <option value="dm1">Dauroh Marhalah 1</option>
                        <option value="dm2">Dauroh Marhalah 2</option>
                        <option value="dpmk">Dauroh Pemandu MK</option>
                        <option value="tfi">Training for Instructors</option>
                        <option value="dm3">Dauroh Marhalah 3</option>
                    </select>
                </label>
                <label>
                    <span>Organizer</span>
                    <input type="text" {...register('organizer', {required: false})} />
                </label>
                <label>
                    <span>Tanggal Mulai</span>
                    <input type="date" {...register('startDate', {required: true})} />
                    {errors['name']?.type === 'required' && <span className={styles.error}>Kolom ini wajib diisi.</span>}
                </label>
                <label>
                    <span>Tanggal Selesai</span>
                    <input type="date" {...register('endDate', {required: true})} />
                    {errors['name']?.type === 'required' && <span className={styles.error}>Kolom ini wajib diisi.</span>}
                </label>
                <input type="hidden" value={`e:${Random(7)}`} {...register('id')} />
                <div className={styles.btn_container}>
                    <input className={styles.btn} type="submit" />
                    <Link href="/"><a className={styles.btn}>Kembali</a></Link>
                </div>
            </form>
        </MainLayout>
    )
}

export default CreateEvent