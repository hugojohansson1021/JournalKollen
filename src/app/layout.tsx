import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


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
      
      <body className={inter.className}>{children}
      </body>
    </html>
  );
}
