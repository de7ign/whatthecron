import { Zap } from 'lucide-react';

import { Button } from './ui/button';
import ExplodingHead from './ui/exploding-head';

export default function HeroSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-foreground mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
          Ever looked at a cron job and thought…{' '}
          <span className="text-purple-500">what the cron?</span>{' '}
          <ExplodingHead
            width="1.1em"
            height="1.1em"
            className="inline-block align-text-bottom"
          />
        </h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
          Instantly decode, explain, and preview your cron schedules.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="px-8 py-3"
            onClick={() => document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Zap className="mr-2 h-5 w-5" />
            Try It Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3"
            onClick={() => document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn Cron Syntax
          </Button>
        </div>
      </div>
    </section>
  );
}
