import Head from 'next/head'
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
                    'Content-Type':'application/json'
                }
            })
        }

        if (session_id) {
            call().then(() => {
                router.push('/thanks')
            })
        }
    }, [])
}