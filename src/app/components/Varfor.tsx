'use client'
import React from 'react';
import { motion } from 'framer-motion';

const SecurityInfo: React.FC<{ isSwedish: boolean; setIsSwedish: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isSwedish }) => {
  const textConfig = {
    en: {
      title: 'Your Data Security is Our Priority',
      description: 'We take extensive measures to ensure that your data is safe and secure.',
      points: [
        { title: 'Data Encryption', description: 'All data uploaded to our service is encrypted both in transit and at rest using industry-standard encryption protocols.' },
        { title: 'Secure Servers', description: 'Our servers are located in highly secure data centers with 24/7 monitoring and advanced security measures.' },
        { title: 'Privacy Compliance', description: 'We comply with all relevant privacy laws and regulations, ensuring that your data is handled with the utmost care and confidentiality.' },
        { title: 'Access Control', description: 'Only authorized personnel have access to your data, and all access is logged and monitored for security purposes.' },
      ],
    },
    sv: {
      title: 'Varför Journal Kollen?',
      description: 'Vi vet att vänta på provsvar från 1177 eller läkare kan vara stressamt, när provresultaten sedan väl mottages så kan det vara svårt att förstå svaret, denna tjänst låter en AI översätta siffror och akronymer till förstålig text för gemene person, nedan finns några anledningar att använda våran tjänst för att hjälpa dig',
      points: [
        { title: 'Akronym översättning', description: 'Ett provsvar kan ibland bestå av mestadels akronymer och förkortningar, detta är något gemene person måste leta upp på egen hand men med våran tjänst så förklaras vad varje akronym ocg förkottning innefattar och betyder.  ' },
        { title: 'Avancerad retorik', description: 'Precis som jurister, har läkare ett eget språk med avancerad retorik för att kunna bedriva tydliga svar, detta är ett språk som kan avra svårt att förstå, våran tjänst hjälper till att förklara vad som menas.' },
        { title: 'Förklaring', description: 'Om en kund laddar upp en lista på provsvar med context vad provet handlar om kommer våran tjänst hjäpa till att ge en helhets förklaring på vad som ligger inom referensvärden och vad respektive betyder. ' },
        { title: 'Säkerhet', description: 'Våran tjänst sammlar ingen data, sparar ingen data eller ser ingen data, eftersom kunder kommer ladda upp test resultat och annan känslig information har vi skapat ett system där vi kan inte se vad kunderna frågar eller få för svar av AI:n.' },
      ],
    },
  };

  const currentTextConfig = isSwedish ? textConfig.sv : textConfig.en;

  return (
    <section id='Varför' className="bg-[#FAF8F6] py-12 px-4 sm:px-6 lg:px-8 mt-12 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-black mb-4"
          >
            {currentTextConfig.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-700 text-lg mb-6"
          >
            {currentTextConfig.description}
          </motion.p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {currentTextConfig.points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white text-black p-6 rounded-lg shadow-lg max-w-xs text-left"
            >
              <h4 className="text-xl font-semibold mb-4">{point.title}</h4>
              <p className="text-gray-700">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityInfo;