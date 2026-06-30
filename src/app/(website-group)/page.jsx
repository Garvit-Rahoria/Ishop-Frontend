import SectionOne from '@/components/website/Home/Section_1/SectionOne'
import SectionTwo from '@/components/website/Home/Section_2/SectionTwo'
import SectionThree from '@/components/website/Home/Section_3/SectionThree'
import SectionFour from '@/components/website/Home/Section_4/SectionFour'
import SectionFive from '@/components/website/Home/Section_5/SectionFive'
import SectionSix from '@/components/website/Home/Section_6/SectionSix'
import SectionSeven from '@/components/website/Home/Section_7/SectionSeven'
import React from 'react'

export default function page() {
  return (
    <div className='w-full'>
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <SectionFive />
      <SectionSix />
      <SectionSeven />
    </div>
  )
}
