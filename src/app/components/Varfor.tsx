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
      title: 'Din Datasäkerhet är Vår Prioritet',
      description: 'Vi vidtar omfattande åtgärder för att säkerställa att dina data är säkra och skyddade.',
      points: [
        { title: 'Datakryptering', description: 'All data som laddas upp till vår tjänst krypteras både under överföring och vid lagring med branschstandard krypteringsprotokoll.' },
        { title: 'Säkra Servrar', description: 'Våra servrar finns i mycket säkra datacenter med övervakning dygnet runt och avancerade säkerhetsåtgärder.' },
        { title: 'Efterlevnad av Integritetslagar', description: 'Vi följer alla relevanta integritetslagar och -förordningar för att säkerställa att dina data hanteras med största omsorg och sekretess.' },
        { title: 'Åtkomstkontroll', description: 'Endast auktoriserad personal har tillgång till dina data, och all åtkomst loggas och övervakas för säkerhetsändamål.' },
      ],
    },
  };

  const currentTextConfig = isSwedish ? textConfig.sv : textConfig.en;

  return (
    <section className="bg-[#FAF8F6] py-12 px-4 sm:px-6 lg:px-8 rounded-3xl mt-12 shadow-lg">
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