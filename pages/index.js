import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import prisma from 'lib/prisma'
import { useSession } from 'next-auth/react'
import { getProducts } from 'lib/data'

export default function Home({ products }) {
    const { data: session, status } = useSession()

    return (
        <div>
            <Head>
                <title>Dread's Shop</title>
                <meta name='description' content='Shop' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <div className='text-center'>
                <h1 className='mt-10 font-extrabold text-4xl'>Dread's Shop</h1>
                <div className='mt-20 sm:mx-auto max-w-4xl mx-10'>
                    {products.map((product) => (
                        <div className='mb-4 grid sm:grid-cols-2' key={product.id}>
                            <div>
                                <Image src={`/` + product.iamge} width={'600'} height={'600'} />
                            </div>
                            <div className='sm:ml-10 mb-20 sm:mb-0'>
                                <h2 className='text-3xl font-extrabold'>{product.title}</h2>
                                <h3 className='text-2xl font-extrabold mb-4'>${product.price / 100}</h3>
                                <p className='text-xl'>{product.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <p className='mt-20'>If you are an Admin, <Link className='text-red-500 font-bold' href={session? 'admin' : 'http://localhost:3000/api/auth/signin'} >Click Here</Link> to login!</p>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const products = await getProducts(prisma)

    return {
        props: { products }
    }
}