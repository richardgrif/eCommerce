import Head from 'next/head'

export default function Home() {
    return (
        <div>
            <Head>
                <title>Dread's Shop</title>
                <meta name='description' content='Shop' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <div className='text-center'>
                <h1 className='mt-10 font-extrabold text-2xl'>Dread & Brian's Shop</h1>
            </div>
        </div>
    )
}