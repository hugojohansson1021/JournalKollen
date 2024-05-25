'use client';
import Image from "next/image";
import Chatbot from "./components/AiChat";
import Navbar from "./components/Navbar";
import { SetStateAction, useState } from "react";

export default function Home() {
  const [isSwedish, setIsSwedish] = useState(true);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">


     <Navbar isSwedish={isSwedish} setIsSwedish={setIsSwedish} />
     <Chatbot apiEndpoint="/api/ai" />
    </main>
  );
}
