'use client'
import React from 'react';
import Link from 'next/link';

const Footer: React.FC<{ isSwedish: boolean; setIsSwedish: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isSwedish }) => {
  const textConfig = {
    en: {
      navigation: {
        title: 'Navigation',
        links: [
          { href: '/', text: 'Home' },
          { href: '/hur-funkar-det', text: 'How it works' },
          { href: '/varfor', text: 'Why' },
          { href: '/kontakta', text: 'Contact' },
        ],
      },
      legal: {
        title: 'Legal',
        links: [
          { href: '/leverans-vilkor', text: 'Delivery Terms' },
          { href: '/anvandar-vilkor', text: 'User Terms' },
        ],
      },
      allRightsReserved: 'All rights reserved.',
    },
    sv: {
      navigation: {
        title: 'Navigation',
        links: [
          { href: '/', text: 'Startsida' },
          { href: '/hur-funkar-det', text: 'Hur funkar det?' },
          { href: '/varfor', text: 'Varför' },
          { href: '/kontakta', text: 'Kontakta' },
        ],
      },
      legal: {
        title: 'Juridiskt',
        links: [
          { href: '/leverans-vilkor', text: 'Leveransvillkor' },
          { href: '/anvandar-vilkor', text: 'Användarvillkor' },
        ],
      },
      allRightsReserved: 'Alla rättigheter förbehållna.',
    },
  };

  const currentTextConfig = isSwedish ? textConfig.sv : textConfig.en;

  return (
    <footer className="bg-[#e31837] text-white w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="mb-8 sm:mb-0">
            <h2 className="text-lg font-bold mb-4">{currentTextConfig.navigation.title}</h2>
            <ul className="space-y-2">
              {currentTextConfig.navigation.links.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span className="hover:text-gray-400 cursor-pointer">{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">{currentTextConfig.legal.title}</h2>
            <ul className="space-y-2">
              {currentTextConfig.legal.links.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span className="hover:text-gray-400 cursor-pointer">{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} {currentTextConfig.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;