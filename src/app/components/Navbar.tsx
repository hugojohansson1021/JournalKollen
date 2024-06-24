// Navbar.tsx

'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component from next/image
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-disable react/no-unescaped-entities */

const Navbar: React.FC<{ isSwedish: boolean; setIsSwedish: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isSwedish, setIsSwedish }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = useCallback((id: string) => {
    setIsMenuOpen(false);
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const debounce = (func: (id: string) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (id: string) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => func(id), delay);
    };
  };

  const debouncedHandleLinkClick = debounce(handleLinkClick, 100);

  const textConfig = {
    en: {
      descriptionone: 'AI',
      descriptiontwo: 'How it works',
      descriptiontree: 'Why AI',
      descriptionfour: 'Contact me',
    },
    sv: {
      descriptionone: 'AI',
      descriptiontwo: 'Hur funkar det',
      descriptiontree: 'Varför AI',
      descriptionfour: 'Kontakta',
    },
  };

  return (
    <>
      <nav className="fixed w-full z-50 p-2 bg-opacity-25 backdrop-blur-lg shadow-lg " style={{ backgroundColor: '#c12043' }}>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-black">
          {/* New container for site title and hamburger menu */}
          <div className="flex justify-between items-center w-full md:w-auto mr-3">
            <Link href="/" className="text-3xl font-bold text-center z-10 text-white py-2 px-4 rounded-full ">
              {/* Replace text with Image component */}
              <Image src="/FrameLogo.png" alt="Journal Kollen Logo" width={190} height={90} />
            </Link>

            {/* Updated clickable area for hamburger icon */}
            <div className={`md:hidden flex ${isMenuOpen ? 'is-active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className=" m-0">
                {/* Hamburger icon with three bars */}
                <span className="navbar_toggle bg-black bar "></span>
                <span className="navbar_toggle bg-black bar"></span>
                <span className="navbar_toggle bg-black bar"></span>
              </div>
            </div>
          </div>

          {/* Menu links */}
          <div className={`absolute md:relative top-full left-0 right-0 md:top-auto mt-4 md:mt-0 ${isMenuOpen ? 'flex' : 'hidden'} flex-col items-center md:flex md:flex-row`}>
            <div className="absolute top-0 mr-5 ml-5 w-full h-full bg-gray-700 bg-opacity-90 backdrop-blur-lg md:hidden rounded-2xl"></div>
            <ul className="relative w-full text-center md:flex md:flex-row md:space-x-4 ">
              <Link href="#" onClick={(event) => {
                event.stopPropagation();
                debouncedHandleLinkClick('Home');
              }}>
                <li className=" rounded-full text-white text-xl text-bold px-4 py-2  cursor-pointer hover:underline decoration-white">
                  {isSwedish ? textConfig.sv.descriptionone : textConfig.en.descriptionone}
                </li>
              </Link>
              <Link href="#" onClick={(event) => {
                event.stopPropagation();
                debouncedHandleLinkClick('Hurfunkardet');
              }}>
                <li className="rounded-full text-white text-xl text-bold px-4 py-2 cursor-pointer hover:underline decoration-white">
                  {isSwedish ? textConfig.sv.descriptiontwo : textConfig.en.descriptiontwo}
                </li>
              </Link>
              <Link href="#" onClick={(event) => {
                event.stopPropagation();
                debouncedHandleLinkClick('Varför');
              }}>
                <li className="rounded-full text-white text-xl text-bold px-4 py-2 cursor-pointer hover:underline decoration-white">
                  {isSwedish ? textConfig.sv.descriptiontree : textConfig.en.descriptiontree}
                </li>
              </Link>
              <Link href="#" onClick={(event) => {
                event.stopPropagation();
                debouncedHandleLinkClick('Kontakta');
              }}>
                <li className="rounded-full text-white text-xl text-bold px-4 py-2 cursor-pointer hover:underline decoration-white">
                  {isSwedish ? textConfig.sv.descriptionfour : textConfig.en.descriptionfour}
                </li>
              </Link>
            </ul>

            {/* Toggle switch */}
            <div className="flex items-center space-x-2 mt-4 mb-4 ">
              <span className={`text-white blur-none ${isSwedish ? 'font-bold blur-none text-black' : ''}`}>SV</span>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!isSwedish}
                  onChange={() => setIsSwedish(!isSwedish)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full filter-none  dark:bg-white peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-black peer-checked:bg-black"></div>
              </label>
              <span className={`text-white blur-none ${!isSwedish ? 'font-bold blur-none text-black' : ''}`}>EN</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
