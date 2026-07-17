import CheckoutPage from '@/components/website/Checkout/CheckoutPage'
import Breadcrumb from '@/components/website/global/Breadcrumb'

// CheckoutPage fetches user client-side via Bearer token (localStorage).
// force-dynamic ensures this page is never statically cached.
export const dynamic = "force-dynamic";

export default function page() {
    return (
        <>
            <Breadcrumb />
            <CheckoutPage />
        </>
    )
}
