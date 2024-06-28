'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.FC<{ isSwedish: boolean; setIsSwedish: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isSwedish, setIsSwedish }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = useCallback((id: string) => {
    setIsMenuOpen(false);
    
    if (pathname === '/') {
      // If on homepage, scroll to the section
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to homepage with hash
      router.push(`/#${id}`);
    }
  }, [pathname, router]);

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

  useEffect(() => {
    // Check if there's a hash in the URL
    if (typeof window !== 'undefined' && window.location.hash) {
      // Get the target element
      const targetElement = document.getElementById(window.location.hash.slice(1));
      if (targetElement) {
        // Scroll to the target element
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [pathname]);

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

  const baseUrl = 'https://www.journalkollen.se';

  return (
    <nav className="fixed w-full z-50 p-2 bg-opacity-25 backdrop-blur-lg shadow-lg" style={{ backgroundColor: '#c12043' }}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-black">
        <div className="flex justify-between items-center w-full md:w-auto mr-3">
          <Link href={`${baseUrl}/`} className="flex justify-center items-center w-full md:w-auto text-3xl font-bold text-center z-10 text-white rounded-full ml-10">
            <Image
              src="/Logo.png"
              alt="Journal Kollen Logo"
              width={230}
              height={90}
              className="sm:w-auto"
            />
          </Link>
          <div className={`md:hidden flex ${isMenuOpen ? 'is-active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="m-0">
              <span className="navbar_toggle bg-black bar"></span>
              <span className="navbar_toggle bg-black bar"></span>
              <span className="navbar_toggle bg-black bar"></span>
            </div>
          </div>
        </div>

        <div className={`absolute md:relative top-full left-0 right-0 md:top-auto mt-4 md:mt-0 ${isMenuOpen ? 'flex' : 'hidden'} flex-col items-center md:flex md:flex-row`}>
          <div className="absolute top-0 mr-5 ml-5 w-full h-full bg-[#d1566b] bg-opacity-90 backdrop-blur-lg md:hidden rounded-2xl"></div>
          <ul className="relative w-full text-center md:flex md:flex-row md:space-x-4">
            <li onClick={() => debouncedHandleLinkClick('Home')} className="rounded-full text-white text-xl text-bold px-4 py-2 cursor-pointer hover:underline decoration-white">
              {isSwedish ? textConfig.sv.descriptionone : textConfig.en.descriptionone}
            </li>
            <li onClick={() => debouncedHandleLinkClick('Hurfunkardet')} className="rounded-full text-white text-xl text-bold px-4 py-2 cursor-pointer hover:underline decoration-white">
              {isSwedish ? textConfig.sv.descriptiontwo : textConfig.en.descriptiontwo}
            </li>
            <li onClick={() => debouncedHandleLinkClick('Varför')} className="rounded-full text-white text-xl text-bold px-4 py-2 cursor-pointer hover:underline decoration-white">
              {isSwedish ? textConfig.sv.descriptiontree : textConfig.en.descriptiontree}
            </li>
            <li onClick={() => debouncedHandleLinkClick('Kontakta')} className="rounded-full text-white text-xl text-bold px-4 py-2 cursor-pointer hover:underline decoration-white">
              {isSwedish ? textConfig.sv.descriptionfour : textConfig.en.descriptionfour}
            </li>
          </ul>
          <div className="flex items-center space-x-2 mt-4 mb-4">
            <span className={`text-white blur-none ${isSwedish ? 'font-bold blur-none text-black' : ''}`}>SV</span>
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!isSwedish}
                onChange={() => setIsSwedish(!isSwedish)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full filter-none dark:bg-white peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-black peer-checked:bg-black"></div>
            </label>
            <span className={`text-white blur-none ${!isSwedish ? 'font-bold blur-none text-black' : ''}`}>EN</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;