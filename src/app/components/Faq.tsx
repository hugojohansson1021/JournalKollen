'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FaqProps {
  isSwedish: boolean;
  setIsSwedish: React.Dispatch<React.SetStateAction<boolean>>;
}

const Faq: React.FC<FaqProps> = ({ isSwedish, setIsSwedish }) => {
  const textConfig = {
    en: {
      questions: [
        {
          question: 'What is Next.js?',
          answer: 'Next.js is a React framework for production that makes it easy to build fast and user-friendly web applications.',
        },
        {
          question: 'What is TypeScript?',
          answer: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
        },
      ],
    },
    sv: {
      questions: [
        {
          question: 'Vad är Journalkollen.se',
          answer: 'Journalkollen.se är en internettjänst som erbjuder översättning av avancerade medicinska texter genom att använda en AI-modell. Denna AI-modell översätter medicinska termer och akronymer till begriplig text.',
        },
        {
          question: 'Hur funkar tjänsten?',
          answer: 'Så här fungerar tjänsten: Först klistrar du in ditt läkarsvar i chatten här. Sedan trycker du på "Översätt text"-knappen. Därefter betalar du 39 kr med Swish. När betalningen är klar navigerar du tillbaka till journalkollen.se, där ditt svar kommer att finnas i chatten, och du får även en kopia i PDF-format.',
        },
        {
          question: 'Hur ser ett översatt provsvar ut?',
          answer: 'AI:n kommer att dela upp ditt provsvar i stycken och översätta stycke för stycka, för att se en video exempel se HÄR ',
        },
        {
          question: 'Kostar denna tjänst?',
          answer: 'Ja, 39 kr. För att kunna erbjuda denna tjänst till så många som möjligt måste vi ta betalt för att kunna underhålla servrar, webbhotell, AI-modell och utvecklingskostnader.',
        },
        {
          question: 'Vilka kan använda tjänsten?',
          answer: 'Alla kan använda tjänsten, men det är viktigt att veta att om du har ett provsvar som är för stort (t.ex. 20 sidor) kommer AI-chatten att avvisa det, eftersom det blir för mycket text att översätta.',
        },
        {
          question: 'Vilka provsvar är vanligast att översätta?',
          answer: 'De vanligaste proverna som översätts är Biomarkörprov, blodprov och tumörmarkörer som: PSA (Prostataspecifikt antigen), CEA (Carcinoembryonic antigen), CA 19-9 (Cancerantigen 19-9), CA 125 (Cancerantigen 125), AFP (Alfafetoprotein), hCG (Humant koriongonadotropin), HER2 (Human epidermal tillväxtfaktorreceptor 2).',
        },
        {
          question: 'Hur får jag min översättning?',
          answer: 'Det översatta provsvaret kommer du att få på två sätt: först kommer svaret i chatten, men du får även en kopia automatiskt nedladdad till din enhet.',
        },
        {
          question: 'Kan jag lita på en AI?',
          answer: 'Ja, vår AI-chat använder sig av ett strikt svarprotokoll. Detta betyder att AI inte kommer att anta eller gissa något. Informationen som AI använder sig av kommer från strikt pålitliga medicinska publikationer.',
        },
        {
          question: 'Kommer jag få läkarrekomendationer?',
          answer: 'Nej, endast legitimerade läkare får ge medicinska utlåtanden och rekommendationer. Vår AI följer lagen. Vår tjänst översätter och förklarar medicinska termer. Vi rekommenderar ALLTID att alla som använder vår tjänst kontaktar sin läkare angående sina provsvar.',
        },
      ],
    },
  };

  const currentTextConfig = isSwedish ? textConfig.sv : textConfig.en;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id='Faq' className="w-full bg-white">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col justify-center text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-[#c12043] mb-4"
            >
              {isSwedish ? 'Vanliga frågor' : 'Frequently Asked Questions'}
            </motion.h2>
          </div>

          <div className="flex flex-wrap justify-center">
            {currentTextConfig.questions.map((item, index) => (
              <div key={index} className="w-full md:w-1/2 p-2">
                <div className="bg-[#faeef0] p-4 rounded-lg shadow-md">
                  <button
                    onClick={() => handleToggle(index)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <span className="text-lg font-medium text-gray-900">{item.question}</span>
                    <svg
                      className={`h-6 w-6 transform transition-transform ${
                        openIndex === index ? 'rotate-180' : 'rotate-0'
                      }`}
                      fill="black"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-2"
                    >
                      <div className="pl-6">
                        <p className="text-gray-700">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
