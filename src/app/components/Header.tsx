'use client'
import React from 'react';
import { motion } from 'framer-motion';
/* eslint-disable react/no-unescaped-entities */

const headercontainer: React.FC<{ isSwedish: boolean; setIsSwedish: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isSwedish, setIsSwedish }) => {
  const textConfig = {
    en: {
      title: 'Welcome to Journalkollen',
      description: 'We offer a service where customers can translate their doctors answers into simpler text that explains what the answer means',
      descriptiontwo: 'We have developed an AI tool where customers can upload medical answers, test answers or similar and have it translated into Swedish. With a better explanation with more understanding.',
      descriptiontre: ' Try our Beta version free ',
    },
    sv: {
      title: 'Välkommen till Journal Kollen', 
      description: (
        <span>
          Vi erbjuder en tjänst där kunder kan <span className="underline">översätta</span> läkarsvar eller provsvar för att få en bredare uppfattning om resultatet
        </span>
      ),
      descriptiontwo:(
        <span>
          Vi har utvecklat ett <span className="underline"> AI verktyg</span> där kunder kan ladda upp läkarsvar, provsvar eller likanande och få det översatt till svenska. Med en bättre förklaring med mer förståelse.
        </span>
      ),
      descriptiontre: ' Testa våran Beta version Gratis nedan  ',
    },
  };

  return (
    <section id='Home' className="bg-white py-12 w-full mt-24">
      <div className="max-w-7xl mx-auto">
        
          <div className="flex flex-col justify-center text-center">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl ml-5 mr-5 font-bold text-black mb-6 opacity-25"
            >
              {isSwedish ? textConfig.sv.title : textConfig.en.title}
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-black mr-5 ml-5 text-lg mb-8 "
            >
              {isSwedish ? textConfig.sv.description : textConfig.en.description}
              <br />
              <br />
              {isSwedish ? textConfig.sv.descriptiontwo : textConfig.en.descriptiontwo}
              <br />
              <br />
              {isSwedish ? textConfig.sv.descriptiontre : textConfig.en.descriptiontre}
            </motion.h3>
          
          
           




            
          </div>
        
      </div>
    </section>
  );
};

export default headercontainer;