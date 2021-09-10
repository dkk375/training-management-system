import BaseLayout from './base'
import styles from '@styles/modules/main.module.scss'

const MainLayout = ({children}) => (
    <BaseLayout>
        <header></header>
        <main className={styles.main}>
            <section className={styles.content}>
                {children}
            </section>
        </main>
        <footer></footer>
    </BaseLayout>
)

export default MainLayout