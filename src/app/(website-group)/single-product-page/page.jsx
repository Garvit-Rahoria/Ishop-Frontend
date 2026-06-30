import PathSection from '@/components/website/Store/Section_1/PathSection'
import SectionOne from '@/components/website/SingleProductPage/Section1/SectionOne'
import React from 'react'
import Breadcrumb from '@/components/website/global/Breadcrumb'
import SectionTwo from '@/components/website/SingleProductPage/Section2/SectionTwo'
import SectionThree from '@/components/website/SingleProductPage/Section3/SectionThree'
import SectionFour from '@/components/website/SingleProductPage/Section4/SectionFour'
import SectionFive from '@/components/website/SingleProductPage/Section5/SectionFive'

export default function page() {
    return (
        <>
            <Breadcrumb />
            <SectionOne />
            <SectionTwo />
            <SectionThree />
            <SectionFour />
            <SectionFive />
        </>
    )
}
