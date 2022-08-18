import Head from 'next/head'
import Link from 'next/link'
import { Router, useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Thanks() {
    const router = useRouter()
    const { session_id } = router.query

    useEffect(() => {
        const call = async () => {
          await fetch('/api/stripe/success', {
            method: 'POST',
            body: JSON.stringify({
              session_id,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }
    
        if (session_id) {
            call().then(() => {
                router.push('/thanks')
            })
        }
    }, [])

    return (
        <div>
            <Head>
                <title>Shop</title>
                <meta name='description' content='Shop' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <div className=''>
                <h1 className='mt-10 font-extrabold text-4xl text-center'>Dread's Shop</h1>
                <h3 className='mt-20 py-2 text-2xl text-center'>
                    Thanks for your order!
                </h3>
                <h3 className='py-2 text-2xl text-center'>
                    Check your confirmation email
                </h3>
                <div  className='text-center mt-20'><Link href='/'><a>Home</a></Link></div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    
    return {
        props: {},
    }
}