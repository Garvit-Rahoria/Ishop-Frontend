import { Geist, Geist_Mono } from "next/font/google";
import '../globals.css'
import Header from "@/components/website/global/Header";
import Footer from "@/components/website/global/Footer";
import ReduxProvider from "@/redux/ReduxProvider";
import NextTopLoader from 'nextjs-toploader';
import { getMe } from "@/api/api-call";

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

export default async function RootLayout({ children }) {
  const { user } = await getMe();
  return (
    <html lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f3f4f6]`}
    >
      <body

      >
        <ReduxProvider>
          <Header user={user} />
          <NextTopLoader color="#009688"
          height={4}
          showSpinner={false}/>
          {children}
          <Footer />
        </ReduxProvider>

      </body>
    </html>
  );
}
