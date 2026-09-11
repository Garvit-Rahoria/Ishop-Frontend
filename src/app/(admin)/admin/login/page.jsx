'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Old /admin/login URL → /admin pe bhej do (login wahi dikhega) */
export default function AdminLoginRedirectPage() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/admin')
    }, [router])

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white">
            Redirecting to admin login...
        </div>
    )
}
