'use client';
import Image from "next/image";
import Chatbot from "./components/AiChat";
import Navbar from "./components/Navbar";
import { SetStateAction, useState } from "react";
import Header from "./components/Header";
import Hurfunkar from "./components/Hurfunkar";
import Securepage from "./components/securepage";

export default function Home() {
  const [isSwedish, setIsSwedish] = useState(true);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">


     <Navbar isSwedish={isSwedish} setIsSwedish={setIsSwedish} />

     <Header isSwedish={isSwedish} setIsSwedish={setIsSwedish} />

     
     <Chatbot apiEndpoint="/api/ai" />
   

     <Hurfunkar isSwedish={isSwedish} setIsSwedish={setIsSwedish} />

     <Securepage isSwedish={isSwedish} setIsSwedish={setIsSwedish} />
    </main>
  );
}
