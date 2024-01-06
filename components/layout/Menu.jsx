import React from 'react';
import { usePathname } from 'next/navigation';
import { sidebarLinks } from '@constants';
import Link from 'next/link';

const Menu = () => {
  // Check if the code is running on the client side
  const isClient = typeof window !== 'undefined';

  // Use usePathname only if running on the client side
  const pathname = isClient ? usePathname() : '';

  return (
    <div className='flex flex-col gap-2'>
      {sidebarLinks.map((link) => {
        const isActive = isClient && pathname === link.route;

        return (
          <Link key={link.label} href={link.route} className={`flex gap-4 justify-start rounded-lg py-2 px-4 ${isActive && "bg-purple-2"}`}>
            {link.icon} <p className='text-light-1'>{link.label}</p>
          </Link>
        );   
      })}
    </div>
  );
};

export default Menu;
