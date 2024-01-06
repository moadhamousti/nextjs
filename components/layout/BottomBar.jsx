"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { sidebarLinks } from '@constants';
import Link from 'next/link';

const BottomBar = () => {
  // Check if the code is running on the client side
  const isClient = typeof window !== 'undefined';

  // Use usePathname only if running on the client side
  const pathname = isClient ? usePathname() : '';

  return (
    <div className='flex bottom-0 z-20 w-full bg-dark-1 px-6 py-3 items-center justify-between md:hidden'>
      {sidebarLinks.map((link) => {
        const isActive = isClient && pathname === link.route;

        return (
          <Link 
            key={link.label} 
            href={link.route} 
            className={`flex gap-2 items-center rounded-lg py-2 px-4 ${isActive && "bg-purple-2"}`}>
            {link.icon} <p className='text-small-medium text-light-1 max-sm:hidden'>{link.label}</p>
          </Link>
        );   
      })}
    </div>
  );
};

export default BottomBar;
