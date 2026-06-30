import { getMe } from '@/api/api-call'
import Breadcrumb from '@/components/website/global/Breadcrumb'
import ProfilePage from '@/components/website/Profile/ProfilePage'
import React from 'react'

export default async function page() {
    const { user } = await getMe()
    return (
        <>
            <Breadcrumb />
            <ProfilePage user={user} />
        </>
    )
}
