import CategorySidebar from "./CategorySidebar"
import HeroBanner from './HeroBanner'
import FeaturedBrands from "./FeaturedBrands"
import TopCategories from './TopCategories'


export default function SectionOne() {

   

    return (
        <section className="max-w-7xl mx-auto px-4 py-6">

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <CategorySidebar  />
                <HeroBanner />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <FeaturedBrands />
                <TopCategories />
            </div>
        </section>
    )
}
