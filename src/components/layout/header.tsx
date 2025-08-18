'use client';

import Link from 'next/link';
import {
  ChevronDown,
  Languages,
  Palette,
  Search,
  ShoppingCart,
  User,
  Image as ImageIcon,
  Bot,
  Music,
  LayoutGrid,
  Settings,
  LogOut,
  LogIn
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { SmartSearch } from '../smart-search';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // In a real app, you would check for an auth token here
    // For this simulation, we'll just set it to false
    setIsLoggedIn(false);
  }, []);

  const navLinks = [
    { name: 'Explore', href: '/explore' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Learn', href: '/learn' },
    { name: 'Community', href: '/community' },
  ];

  const createLinks = [
    { name: 'Text-to-Art Generator', href: '/create/text-to-art', icon: <Palette /> },
    { name: 'Image-to-Art Transformer', href: '/create/image-to-art', icon: <ImageIcon /> },
    { name: 'AI Art Editor', href: '/create/ai-art-editor', icon: <Bot /> },
    { name: 'AI Music Generator', href: '/create/music-generator', icon: <Music /> },
  ];
  
  const renderUserMenu = () => {
    if (!isClient) {
      return null;
    }

    if (isLoggedIn) {
      return (
        <>
          <DropdownMenuItem asChild>
            <Link href="/account/profile">
              <User className="mr-2" /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
              <Link href="/account/my-collection">
              <LayoutGrid className="mr-2" /> My Collection
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
              <Link href="/account/settings">
              <Settings className="mr-2" /> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
            <LogOut className="mr-2" /> Log Out
          </DropdownMenuItem>
        </>
      );
    } else {
      return (
        <DropdownMenuItem asChild>
           <Link href="/login">
            <LogIn className="mr-2" /> Log In
           </Link>
        </DropdownMenuItem>
      );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo />
              <span className="font-bold">MuseAI</span>
            </Link>
            <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-3">
                    Create
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {createLinks.map((link) => (
                    <DropdownMenuItem key={link.name} asChild>
                      <Link href={link.href}>
                        {link.icon}
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="transition-colors hover:text-foreground/80">
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>

            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="icon" aria-label="Shopping Cart">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Language">
                <Languages className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="User Profile">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {renderUserMenu()}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <SmartSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}
