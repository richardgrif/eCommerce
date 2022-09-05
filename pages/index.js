import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import prisma from 'lib/prisma'
import Script from 'next/script'
import * as localForage from 'localforage'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { getProducts } from 'lib/data'

export default function Home({ products }) {
    const { data: session, status } = useSession()
    const [cart, setCart] = useState([])

    useEffect(() => {
        localForage.getItem('cart', function (err, value) {
            if (value) {
                setCart(value)
            }
        })
    }, [])

    useEffect(() => {
        localForage.setItem('cart', cart)
    }, [cart])

    return (
        <div>
            <Script src='https://js.stripe.com/v3/' />
            <Head>
                <title>Dread's Shop</title>
                <meta name='description' content='Shop' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            
            <div className='text-center'>
                <h1 className='mt-10 font-extrabold text-4xl'>Dread's Shop</h1>
                {cart.length > 0 && (
                    <div className='mt-20 sm:mx-auto max-w-4xl mx-10 border-2 border-gray-500'>
                        <h3 className='py-2 font-extrabold text-2xl text-center'>Your cart</h3>
                        {cart.map((item, index) => (
                            <div key={index} className='px-4 py-2 border-y border-gray-500 flex'>
                                
                                <div className='mt-5 pl-4'>
                                    <span>{item.product.title}</span> - quantity: {item.quantity}
                                </div>
                            </div>
                        ))}
                        <button
                            className='mx-auto bg-gray-500 text-white px-3 py-1 my-4 text-xl font-bold justify-center flex'
                            onClick={async () => {
                                const res = await fetch('/api/stripe/session', {                                    
                                    body: JSON.stringify({
                                        cart,
                                    }),
                                    headers: { 'Content-Type':'application/json' },
                                    method: 'POST'
                                })

                                const data = await res.json()

                                if (data.status === 'error') {
                                    alert(data.message)
                                    return
                                }

                                const sessionId = data.sessionId
                                const stripePublicKey = data.stripePublicKey

                                const stripe = Stripe(stripePublicKey)
                                const { error } = await stripe.redirectToCheckout({
                                    sessionId,
                                })

                                setCart([])
                            }}
                        >Go to Checkout</button>

                        <button 
                            className='mx-auto bg-gray-500 text-white px-3 py-1 my-4 text-sm justify-center flex'
                            onClick={() => setCart([])}
                        >Clear Cart</button>
                    </div>
                )}
                <div className='mt-20 sm:mx-auto max-w-4xl mx-10'>
                    {products.map((product) => (
                        <div className='mb-4 grid sm:grid-cols-2' key={product.id}>
                            {/* <div>
                                <Image src={`/` + product.image} width={'600'} height={'600'} />
                            </div> */}
                            <div className='sm:ml-10 mb-20 sm:mb-0 text-left'>
                                <h2 className='text-3xl font-extrabold'>{product.title}</h2>
                                <h3 className='text-2xl font-extrabold mb-4'>${product.price / 100}</h3>
                                <button 
                                    onClick={() => {
                                        const itemsInCartWithThisId = cart.filter((item) => {
                                            return item.product.id === product.id
                                        })

                                        if (itemsInCartWithThisId.length > 0) {
                                            setCart([
                                                ...cart.filter((item) => {
                                                    return item.product.id !== product.id
                                                }),
                                                {
                                                    product: itemsInCartWithThisId[0].product,
                                                    quantity: itemsInCartWithThisId[0].quantity + 1,
                                                }
                                            ])
                                        } else {
                                            setCart([...cart, { product, quantity: 1 }])
                                        }
                                    }}

                                    className='mb-4 mx-auto bg-gray-500 text-white px-3 py-1 text-lg'
                                >
                                Add to cart
                                </button>
                                <p className='text-xl text-justify'>{product.description}</p>
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