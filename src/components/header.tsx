'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Github, Moon, Sun } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="border-border bg-background sticky top-0 z-50 border-b shadow-sm transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-foreground font-mono text-2xl font-bold">WhatTheCron</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="bg-purple-500">Beta</Badge>
              </TooltipTrigger>
              <TooltipContent className="bg-background text-foreground max-w-xs border text-wrap">
                🧪 Beta — Still cooking! Got bugs or feature ideas? Drop them on GitHub.
              </TooltipContent>
            </Tooltip>
          </div>
          <nav className="flex items-center space-x-6">
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
            <Button
              asChild
              variant="ghost"
              size="sm"
            >
              <Link
                href="https://github.com/de7ign/whatthecron"
                target="_blank"
              >
                <Github className="h-5 w-5" />
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
