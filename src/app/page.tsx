import Link from 'next/link';
import { Box, Calendar, Clock, Hash, Star } from 'lucide-react';

import CronTool from '@/components/cron-tool';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      <section
        id="learn"
        className="bg-background px-4 py-16 transition-colors sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <h3 className="text-foreground mb-8 text-center text-3xl font-bold">Cron Cheatsheet</h3>

          <Tabs
            defaultValue="basics"
            className="w-full"
          >
            <TabsList className="border-border bg-accent grid h-auto w-full grid-cols-2 gap-2 border-2 sm:grid-cols-4">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="special">Special Characters</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="mistakes">Common Mistakes</TabsTrigger>
            </TabsList>

            <TabsContent
              value="basics"
              className="mt-6"
            >
              <Card className="bg-card shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Hash className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">
                          Cron format:{' '}
                          <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                            minute hour day month weekday
                          </code>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Box className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">
                          Some systems (Quartz, Spring, etc.) support 6 fields with{' '}
                          <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                            seconds
                          </code>{' '}
                          at the start
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Fields ranges:</p>
                        <ul
                          role="list"
                          className="mt-2 list-disc space-y-1 pl-5 text-sm marker:text-gray-400"
                        >
                          <li>
                            Seconds: 0–59 <span className="italic">(if supported)</span>
                          </li>
                          <li>Minutes: 0–59</li>
                          <li>Hours: 0–23</li>
                          <li>Day of Month: 1–31</li>
                          <li>
                            Month: 1–12 <span className="italic">(or JAN–DEC)</span>
                          </li>
                          <li>
                            Day of Week: 0–7{' '}
                            <span className="italic">(0 and 7 = Sunday, or SUN–SAT)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">
                          Use{' '}
                          <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                            *
                          </code>{' '}
                          to match any value in that field
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Sunday can be represented as either 0 or 7</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="special"
              className="mt-6"
            >
              <Card className="bg-card shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        *
                      </code>
                      <div>
                        <p className="font-medium">Matches any value (wildcard)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        /
                      </code>
                      <div>
                        <p className="font-medium">
                          Step values -{' '}
                          <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                            */5
                          </code>{' '}
                          means every 5 units
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        -
                      </code>
                      <div>
                        <p className="font-medium">
                          Range -{' '}
                          <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                            1-5
                          </code>{' '}
                          means 1 through 5
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        ,
                      </code>
                      <div>
                        <p className="font-medium">
                          List -{' '}
                          <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                            1,3,5
                          </code>{' '}
                          means 1, 3, and 5
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        ?
                      </code>
                      <div>
                        <p className="font-medium">
                          “no specific value” (only in Quartz, for day/month fields)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        L
                      </code>
                      <div>
                        <p className="font-medium">
                          “last” (e.g. last day of month, or last weekday)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        #
                      </code>
                      <div>
                        <p className="font-medium">
                          “nth weekday” (e.g. 2#1 = first Monday of the month)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="examples"
              className="mt-6"
            >
              <Card className="bg-card shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        0 0 * * *
                      </code>
                      <div>
                        <p className="font-medium">Every day at midnight</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        */15 * * * *
                      </code>
                      <div>
                        <p className="font-medium">Every 15 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        0 9 * * MON-FRI
                      </code>
                      <div>
                        <p className="font-medium">9 AM on weekdays</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        0 0 1 * *
                      </code>
                      <div>
                        <p className="font-medium">First day of every month at midnight</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        0 0 12 25 12
                      </code>
                      <div>
                        <p className="font-medium">Every Christman at noon</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-accent rounded border px-2 py-1 font-mono text-sm">
                        0 */10 * * * *
                      </code>
                      <div>
                        <p className="font-medium">Every 10 minutes at 0 seconds (if supported)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="mistakes"
              className="mt-6"
            >
              <Card className="bg-card shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-destructive mt-2 h-2 w-2 rounded-full"></div>
                      <div>
                        <p className="font-medium">
                          Using both day-of-month and day-of-week: it’s OR logic, not AND
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-destructive mt-2 h-2 w-2 rounded-full"></div>
                      <div>
                        <p className="font-medium">Forgetting that months are 1–12, not 0–11</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-destructive mt-2 h-2 w-2 rounded-full"></div>
                      <div>
                        <p className="font-medium">
                          Confusing Sunday as 0 vs 7 (both are valid in many systems)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-destructive mt-2 h-2 w-2 rounded-full"></div>
                      <div>
                        <p className="font-medium">
                          Assuming all systems support seconds (many only use 5 fields)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-destructive mt-2 h-2 w-2 rounded-full"></div>
                      <div>
                        <p className="font-medium">
                          Not accounting for <b>timezone differences</b> in production
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-destructive mt-2 h-2 w-2 rounded-full"></div>
                      <div>
                        <p className="font-medium">
                          Forgetting DST changes if you schedule in a local timezone
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-destructive mt-2 h-2 w-2 rounded-full"></div>
                      <div>
                        <p className="font-medium">
                          Not testing your cron expression before deploying
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

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
