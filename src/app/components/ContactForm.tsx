'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactForm: React.FC<{ isSwedish: boolean; setIsSwedish: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isSwedish }) => {
  const textConfig = {
    en: {
      title: 'Contact Us',
      description: "We'd love to hear from you!",
      namePlaceholder: 'Name',
      emailPlaceholder: 'Email',
      messagePlaceholder: 'Message',
      sendButton: 'Send message',
      emailButton: 'Send Email',
      statusSuccess: 'Message sent successfully!',
      statusFailure: 'Failed to send message.',
      statusError: 'Error occurred while sending message.',
    },
    sv: {
      title: 'Kontakta Oss',
      description: 'Vi vill gärna höra från dig! Har du några frågor om tjänsten Kontakta oss nedan ',
      namePlaceholder: 'Namn',
      emailPlaceholder: 'Email',
      messagePlaceholder: 'Meddelande',
      sendButton: 'Skicka Meddelande',
      emailButton: 'Skicka E-post',
      statusSuccess: 'Meddelandet skickades! Vi återkommer såfort vi kan',
      statusFailure: 'Misslyckades med att skicka meddelandet.',
      statusError: 'Ett fel inträffade vid skickandet av meddelandet.',
    },
  };

  const currentTextConfig = isSwedish ? textConfig.sv : textConfig.en;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      content: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
      const response = await fetch('https://discord.com/api/webhooks/1244006192036974653/9z535Xc5BMUI7V0rXCYZPO0yv__hXf1tWPH-MHBDj2CJgKBHowiK6eIL0zuYeQc-O5ZS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus(currentTextConfig.statusSuccess);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus(currentTextConfig.statusFailure);
      }
    } catch (error) {
      setStatus(currentTextConfig.statusError);
    }
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:carlhugojohansson@outlook.com';
  };

  return (
    <section id='Kontakta' className=" w-full ">
      <div className="max-w-7xl mx-auto " >
        <div className="flex flex-col justify-center text-center mb-8 ">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-[#c12043] mb-4 mt-12 "
          >
            {currentTextConfig.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-700 text-lg mb-6 ml-5 mr-5"
          >
            {currentTextConfig.description}
          </motion.p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mr-5 ml-5">
          <input
            type="text"
            placeholder={currentTextConfig.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full max-w-md p-2 m-2 border border-gray-300 bg-[#FAF8F6]  rounded text-black"
            required
          />
          <input
            type="email"
            placeholder={currentTextConfig.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-md p-2 m-2 border border-gray-300 rounded bg-[#FAF8F6]  text-black"
            required
          />
          <textarea
            placeholder={currentTextConfig.messagePlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full max-w-md p-2 m-2 border border-gray-300 bg-[#FAF8F6]  rounded text-black"
            rows={5}
            required
          />
          <button type="submit" className="bg-[#c12043] text-white py-2 px-4 rounded">
            {currentTextConfig.sendButton}
          </button>
          <button type="button" onClick={handleEmailClick} className="bg-[#c12043] text-white py-2 px-4 rounded mb-10">
            {currentTextConfig.emailButton}
          </button>
        </form>
        {status && <p className="text-center mt-4 mb-5 text-black">{status}</p>}
      </div>
    </section>
  );
};

export default ContactForm;