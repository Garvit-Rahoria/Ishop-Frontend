import SectionOne from '@/components/website/Store/Section_1/SectionOne'
import SectionTwo from '@/components/website/Store/Section_2/SectionTwo'
import SectionThree from '@/components/website/Store/Section_3/SectionThree'
import React from 'react'

export default async function page({ searchParams }) {
    const params = await searchParams
    return (
        <>
            <SectionOne />
            <SectionTwo />
            <SectionThree params={params} />
        </>
    )
}
