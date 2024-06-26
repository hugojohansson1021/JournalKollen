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
          question: 'Vad är Next.js?',
          answer: 'Next.js är ett React-ramverk för produktion som gör det enkelt att bygga snabba och användarvänliga webbapplikationer.',
        },
        {
          question: 'Vad är TypeScript?',
          answer: 'TypeScript är ett starkt typat programmeringsspråk som bygger på JavaScript och ger dig bättre verktyg i alla skala.',
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 mt-12 shadow-lg">
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

        <div className="space-y-4">
          {currentTextConfig.questions.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <button
                onClick={() => handleToggle(index)}
                className="flex justify-between items-center w-[350px] text-left"
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
                  <div className="pl-6 w-[350px]">
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
