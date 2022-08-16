import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Home() {
    const { data: session, status } = useSession()

    return (
        <div>
            <Head>
                <title>Dread's Shop</title>
                <meta name='description' content='Shop' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <div className='text-center'>
                <h1 className='mt-10 font-extrabold text-2xl'>Dread & Brian's Shop</h1>
                <p className='mt-20'>If you are an Admin, <Link className='text-red-500 font-bold' href={session? 'admin' : 'http://localhost:3000/api/auth/signin'} >Click Here</Link> to login!</p>
            </div>
        </div>
    )
}