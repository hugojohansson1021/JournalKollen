'use client'
import React from 'react';
import { motion } from 'framer-motion';

const Hurfunkardetcontainer: React.FC<{ isSwedish: boolean; setIsSwedish: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isSwedish }) => {
  const textConfig = {
    en: {
      title: 'Welcome..!',
      description: 'Here you can find information about who I am and what I like as well as my projects and interests',
      descriptiontwo: 'You can also chat with an AI bot I built that has information about who I am and what I did earlier in my life and so on.',
      steps: [
        { title: 'Step 1', description: 'Upload your medical documents.', icon: '/PDF-icon.png' },
        { title: 'Step 2', description: 'Our AI translates and explains the content in Swedish.', icon: '/Swish-icon.png' },
        { title: 'Step 3', description: 'Receive a detailed and understandable explanation.', icon: '/Chat-icon.png' },
      ],
    },
    sv: {
      title: 'Hur funkar det?', 
      description: 'Nedan kan du se steg för steg hur du som kund kan använda våran tjänst för att översätta "Läkare" till svenska',
      descriptiontwo: 'Vi har utvecklat ett AI verktyg där kunder kan ladda upp läkar svar, prov svar eller likanande och få det översatt till svenska. Med en bättre förklaring med mer förståelse.',
      steps: [
        { title: 'Steg 1', description: 'Ladda upp ditt medicinska dokument eller kopiera texten du vill ha förklarad.', icon: '/PDF-icon.png' },
        { title: 'Steg 2', description: 'Tryck på svara knappen och betala med swish', icon: '/Swish-icon.png' },
        { title: 'Steg 3', description: 'Efter du betalt med swish navigera till Journalkollen.se och invänta ditt generarade svar ', icon: '/Chat-icon.png' },
      ],
    },
  };

  const currentTextConfig = isSwedish ? textConfig.sv : textConfig.en;

  return (
    <section id='Hurfunkardet' className="bg-white py-12 w-full mt-24">
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
                <img src={step.icon} alt={`Icon for ${step.title}`} className="w-12 h-15 mx-auto mb-5" />
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