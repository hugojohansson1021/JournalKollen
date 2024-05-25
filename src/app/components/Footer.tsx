'use client'
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between">
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-8 sm:mb-0">
            <h2 className="text-lg font-bold mb-4">Navigation</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-gray-400">Startsida</Link>
              </li>
              <li>
                <Link href="/hur-funkar-det" className="hover:text-gray-400">Hur funkar det?</Link>
              </li>
              <li>
                <Link href="/varfor" className="hover:text-gray-400">Varför</Link>
              </li>
              <li>
                <Link href="/kontakta" className="hover:text-gray-400">Kontakta</Link>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4">
            <h2 className="text-lg font-bold mb-4">Legal</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/leverans-vilkor" className="hover:text-gray-400">Leverans villkor</Link>
              </li>
              <li>
                <Link href="/anvandar-vilkor" className="hover:text-gray-400">Användar villkor</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;