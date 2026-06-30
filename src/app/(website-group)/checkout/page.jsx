import { getMe } from '@/api/api-call'
import CheckoutPage from '@/components/website/Checkout/CheckoutPage'
import Breadcrumb from '@/components/website/global/Breadcrumb'
import React from 'react'


export default async function page() {

    const {user} = await getMe()

    return (
        <>
            <Breadcrumb />

            <CheckoutPage user={user} />
        </>
    )
}
