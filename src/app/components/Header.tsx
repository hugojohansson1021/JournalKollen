'use client'
import React from 'react';
import { motion } from 'framer-motion';
/* eslint-disable react/no-unescaped-entities */

const headercontainer: React.FC<{ isSwedish: boolean; setIsSwedish: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isSwedish, setIsSwedish }) => {
  const textConfig = {
    en: {
      title: 'Welcome..!',
      description: 'Here you can find information about who I am and what I like as well as my projects and interests',
      descriptiontwo: 'You can also chat with an AI bot I built that has information about who I am and what I did earlier in my life and so on.',
    },
    sv: {
      title: 'Välkommen till Journal Förklaring', 
      description: 'Precis som Jurister har läkare ett eget språk, ibland med många akronymer, förkortningar och siffror.',
      descriptiontwo: 'Vi har utvecklat ett AI verktyg där kunder kan ladda upp läkar svar, prov svar eller likanande och få det översatt till svenska. Med en bättre förklaring med mer förståelse. ',
    },
  };

  return (
    <section className="bg-white py-12 w-full mt-24">
      <div className="max-w-7xl mx-auto">
        
          <div className="flex flex-col justify-center text-center">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-black mb-6 opacity-25"
            >
              {isSwedish ? textConfig.sv.title : textConfig.en.title}
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-black text-lg mb-8"
            >
              {isSwedish ? textConfig.sv.description : textConfig.en.description}
              <br />
              <br />
              {isSwedish ? textConfig.sv.descriptiontwo : textConfig.en.descriptiontwo}
            </motion.h3>
          
          
           




            
          </div>
        
      </div>
    </section>
  );
};

export default headercontainer;