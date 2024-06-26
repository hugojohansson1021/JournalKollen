'use client';

import Navbar from "./components/Navbar";
import { SetStateAction, useState } from "react";
import Header from "./components/Header";
import Hurfunkar from "./components/Hurfunkar";
import Securepage from "./components/Varfor";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Chatbot from "./components/AiChat";
import Faq from "./components/Faq";


export default function Home() {
  const [isSwedish, setIsSwedish] = useState(true);
  return (
    <main className=" flex min-h-screen flex-col items-center justify-between ">


     <Navbar isSwedish={isSwedish} setIsSwedish={setIsSwedish} />

     <Header isSwedish={isSwedish} setIsSwedish={setIsSwedish} />

     <Chatbot apiEndpoint="/api/ai" />
     
   

     <Hurfunkar isSwedish={isSwedish} setIsSwedish={setIsSwedish} />

     <Securepage isSwedish={isSwedish} setIsSwedish={setIsSwedish} />

     <Faq isSwedish={isSwedish} setIsSwedish={setIsSwedish} />

     <ContactForm isSwedish={isSwedish} setIsSwedish={setIsSwedish} />

     <Footer isSwedish={isSwedish} setIsSwedish={setIsSwedish} />
    
    
    </main>
  );
}
