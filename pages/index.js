import Head from 'next/head'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Blog</title>
        <meta name="description" content="Blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Feed
        </h1>
      </main>
    </div>
  )
}
