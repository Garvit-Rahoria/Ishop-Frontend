import { Geist, Geist_Mono } from "next/font/google";
import '.././(website-group)/globals.css'
import { ToastContainer } from 'react-toastify';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-Commerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"
    className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f3f4f6]`}
    >
      <body className="h-full w-full ">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

          {children}

      </body>
    </html>
  );
}
