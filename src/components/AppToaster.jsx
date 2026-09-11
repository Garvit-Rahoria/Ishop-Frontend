'use client'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/**
 * Single toast UI for the whole app (website, auth, admin).
 * Always use `notify()` from `@/utils/helper` — don't create other ToastContainers.
 */
export default function AppToaster() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
            limit={3}
            style={{ zIndex: 99999 }}
        />
    )
}
