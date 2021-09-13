import BaseLayout from './base'
import { Toaster } from 'react-hot-toast'
import styles from '@styles/modules/main.module.scss'

const MainLayout = ({children}) => (
    <BaseLayout>
        <header></header>
        <main className={styles.main}>
            <section className={styles.content}>
                {children}
            </section>
            <Toaster position="bottom-right" />
        </main>
        <footer></footer>
    </BaseLayout>
)

export default MainLayout