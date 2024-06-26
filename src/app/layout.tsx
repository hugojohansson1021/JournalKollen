import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";





const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {

  title: "Medicinsk Journal förklaring",
  description:"Journalkollen erbjuder en tjänst som översätter avancerad medicinsk läkar svar och medicinska provsvar genom ett AI verktyg",
  keywords: "1177, Journal, läkare, journalkollen, journalförklaring, förklra journal, förklara provsvar, provsvar förklara"
,
  robots:{
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">

<head>
<link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>



  
      
      <body className={inter.className}>
      <GoogleAnalytics gaId="G-NG8FRQDKCQ" />
      {children}

      
      
      
      
      </body>
    </html>
  );
}
