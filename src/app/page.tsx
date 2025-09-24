import Link from 'next/link';

import CronTool from '@/components/cron-tool';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import LearnMore from '@/components/learn-more';

export default function Home() {
  return (
    <div className="bg-background min-h-screen transition-colors">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Tool Section */}
      <CronTool />

      {/* Learn More Section */}
      <LearnMore />

      {/* Footer */}
      <footer className="border-border bg-background border-t px-4 py-12 font-sans transition-colors sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Project Info */}
            <div>
              <h4 className="text-foreground mb-4 font-mono text-lg font-bold">WhatTheCron</h4>
              <p className="text-muted-foreground mb-4 text-sm font-medium">
                Because remembering cron syntax is harder than writing it.
              </p>
            </div>

            {/* Links */}
            <div>
              <h5 className="text-foreground mb-4 font-semibold">Links</h5>
              <div className="space-y-3">
                <Link
                  href="https://github.com/de7ign/whatthecron"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground block text-sm"
                >
                  GitHub Repository
                </Link>
                <Link
                  target="_blank"
                  href="https://github.com/de7ign/whatthecron/issues"
                  className="text-muted-foreground hover:text-foreground block text-sm"
                >
                  Report Issues
                </Link>
                <Link
                  target="_blank"
                  href="https://github.com/de7ign/whatthecron/issues"
                  className="text-muted-foreground hover:text-foreground block text-sm"
                >
                  Feature Requests
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h5 className="text-foreground mb-4 font-semibold">Connect</h5>
              <div className="space-y-3">
                <Link
                  target="_blank"
                  href="https://github.com/de7ign"
                  className="text-muted-foreground hover:text-foreground block text-sm"
                >
                  GitHub Profile
                </Link>
                <Link
                  target="_blank"
                  href="https://x.com/dzndev"
                  className="text-muted-foreground hover:text-foreground block text-sm"
                >
                  Twitter/X
                </Link>
              </div>
            </div>
          </div>

          <div className="border-border mt-8 border-t pt-8 text-center">
            <Link
              className="text-muted-foreground hover:text-foreground text-sm"
              target="_blank"
              href="https://github.com/de7ign/whatthecron"
            >
              Like this project? Support it by ⭐ing on GitHub or submitting your suggestions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
