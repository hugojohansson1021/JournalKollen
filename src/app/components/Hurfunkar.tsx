'use client'
import React from 'react';
import { motion } from 'framer-motion';
/* eslint-disable react/no-unescaped-entities */

const Hurfunkardetcontainer: React.FC<{ isSwedish: boolean; setIsSwedish: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isSwedish, setIsSwedish }) => {
  const textConfig = {
    en: {
      title: 'Welcome..!',
      description: 'Here you can find information about who I am and what I like as well as my projects and interests',
      descriptiontwo: 'You can also chat with an AI bot I built that has information about who I am and what I did earlier in my life and so on.',
      steps: [
        { title: 'Step 1', description: 'Upload your medical documents.' },
        { title: 'Step 2', description: 'Our AI translates and explains the content in Swedish.' },
        { title: 'Step 3', description: 'Receive a detailed and understandable explanation.' },
      ],
    },
    sv: {
      title: 'Hur funkar det?', 
      description: 'Nedan kan du se steg för steg hur du som kund kan använda våran tjänst för att översätta "Läkare" till svenska',
      descriptiontwo: 'Vi har utvecklat ett AI verktyg där kunder kan ladda upp läkar svar, prov svar eller likanande och få det översatt till svenska. Med en bättre förklaring med mer förståelse.',
      steps: [
        { title: 'Steg 1', description: 'Ladda upp dina medicinska dokument.' },
        { title: 'Steg 2', description: 'Vårt AI översätter och förklarar innehållet på svenska.' },
        { title: 'Steg 3', description: 'Få en detaljerad och förståelig förklaring.' },
      ],
    },
  };

  const currentTextConfig = isSwedish ? textConfig.sv : textConfig.en;

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-3xl mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-black mb-6 opacity-25"
          >
            {currentTextConfig.title}
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-black text-lg mb-8"
          >
            {currentTextConfig.description}
            <br />
            <br />
            
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {currentTextConfig.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-[#FAF8F6] text-black p-6 rounded-lg shadow-lg max-w-xs"
              >
                <h4 className="text-xl font-semibold mb-4">{step.title}</h4>
                <p className="text-gray-700">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hurfunkardetcontainer;