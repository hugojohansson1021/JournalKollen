'use client';

import { useState } from "react";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Vilkor from "../components/Vilkor";





export default function Home() {
  const [isSwedish, setIsSwedish] = useState(true);
  return (
    <main className=" flex min-h-screen flex-col items-center justify-between ">


     <Navbar isSwedish={isSwedish} setIsSwedish={setIsSwedish} />

     <Vilkor isSwedish={isSwedish} setIsSwedish={setIsSwedish}/>

     

     <ContactForm isSwedish={isSwedish} setIsSwedish={setIsSwedish} />

     <Footer isSwedish={isSwedish} setIsSwedish={setIsSwedish} />
    
    
    </main>
  );
}
