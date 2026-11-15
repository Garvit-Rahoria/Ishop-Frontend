import { Geist, Geist_Mono } from "next/font/google";
import './globals.css'
import Header from "@/components/website/global/Header";
import Footer from "@/components/website/global/Footer";
import AppToaster from "@/components/AppToaster";
import ReduxProvider from "@/redux/ReduxProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import NextTopLoader from 'nextjs-toploader';
import { getMe } from "@/api/api-call";

export const dynamic = "force-dynamic";

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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f3f4f6] dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 transition-colors duration-200`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('ishop_theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&d)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-transparent min-h-screen flex flex-col">
        <ReduxProvider>
          <ThemeProvider>
            <AppToaster />
            <Header user={user} />
            <NextTopLoader color="#009688" height={4} showSpinner={false} />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
