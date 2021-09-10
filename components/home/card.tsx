import Link from 'next/link'
import styles from '@styles/modules/card.module.scss'


const Card = ({title, subtitle='', dateStart='', url}) => {
    return (
        <Link href={url}>
        <a className={styles.card}>
            <div>
                <h1>{title}</h1>
                <h2>{subtitle}</h2>
                <p>{dateStart}</p>
            </div>
        </a>
        </Link>
    )
}

export default Card