import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { getProducts } from 'lib/data'
import Link from 'next/link'
import prisma from 'lib/prisma'

export default function Admin({ products }) {
    const router = useRouter()

    const { data: session, status } = useSession()

    const loading = status === 'loading'

    if (loading) return null

    if (!session) {
        router.push('/')
        return
    }

    if (!session.user.isAdmin) {
        router.push('/')
        return
    }

    return (
        <div className='text-center'>
            <h1 className='mt-10 font-extrabold text-2xl mb-8'>Admin Section</h1>

            <Link href='/admin/new'>
                <a className='inline mx-auto bg-grey-800 text-white px-3 py-1 text-lg'>
                    Add a new product
                </a>
            </Link>
            <div className='mt-20 mx-auto max-w-sm'>
                {products.map((product) => (
                <div className='mb-4 border border-Red-500' key={product.id}>
                    {product.title} (${product.price / 100})
                </div>
                ))}
            </div>
            <Link href='/'>Back to Home</Link>
        </div>
    )
}

export async function getServerSideProps(context) {
    const products = await getProducts(prisma)
  
    return {
      props: {
        products,
      },
    }
  }