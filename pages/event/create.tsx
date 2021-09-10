import MainLayout from '@layouts/main'
import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import Router from 'next/router'
import Random from '@lib/random'
import styles from '@styles/modules/create.module.scss'


const CreateEvent: NextPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = async (data, event) => {
        event.preventDefault()
        try {
            await fetch('/api/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
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
                    <span>Tanggal Mulai</span>
                    <input type="date" {...register('startDate', {required: true})} />
                </label>
                <label>
                    <span>Tanggal Selesai</span>
                    <input type="date" {...register('endDate', {required: true})} />
                </label>
                <input type="hidden" value={`e_${Random()}`} {...register('id')} />
                <input type="submit" />
            </form>
        </MainLayout>
    )
}

export default CreateEvent