'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { getTimeZones, TimeZone } from '@vvo/tzdb';
import { CronExpression, CronExpressionParser } from 'cron-parser';
import cronstrue from 'cronstrue';
import { Box, Calendar, Clock, Github, Hash, Info, Moon, Star, Sun, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ParsedResultField {
  field: string;
  value: string;
  description: string;
}
interface ParsedResult {
  fields?: ParsedResultField[];
  humanReadable?: string;
  nextRuns?: string[];
  error?: string;
}

export default function Home() {
  const isFirstRender = useRef(true);
  const [cronExpression, setCronExpression] = useState('*/15 9-17 * * MON-FRI');
  const [parsedResult, setParsedResult] = useState<ParsedResult | undefined>(undefined);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [timezone, setTimezone] = useState(getDefaultTimeZone());
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Re-parse cron expression when timezone changes
    if (cronExpression.trim()) {
      parseCronExpression(cronExpression);
    }
    // disabling exhaustive-deps because we only want to run this effect when timezone changes
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timezone]);

  function formatTimeZoneLabel(tz: TimeZone) {
    const offsetMinutes = tz.currentTimeOffsetInMinutes;
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absMinutes = Math.abs(offsetMinutes);
    const hours = Math.floor(absMinutes / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (absMinutes % 60).toString().padStart(2, '0');
    const offset = `UTC${sign}${hours}:${minutes}`;

    const city = tz.name;
    return `${offset} ${city} - ${tz.alternativeName}`;
  }

  function getTimeZoneOptions() {
    const zones = getTimeZones();
    // Deduplicate by group leader only
    const uniqueZones = zones.filter((z) => z.group[0] === z.name);

    // Sort by UTC offset
    uniqueZones.sort((a, b) => a.currentTimeOffsetInMinutes - b.currentTimeOffsetInMinutes);

    return uniqueZones.map((tz) => ({
      value: tz.name, // e.g. "America/New_York"
      label: formatTimeZoneLabel(tz),
    }));
  }

  const timeZoneOptions = getTimeZoneOptions();

  function getDefaultTimeZone() {
    const zones = getTimeZones();
    const currentTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const found = zones.find((tz) => tz.name === currentTZ || tz.group.includes(currentTZ));
    return found ? found.name : 'UTC';
  }

  const parseCronExpression = (expression: string) => {
    // Simple cron parser for demo purposes
    const parts: string[] = expression.trim().split(/\s+/);
    if (!(parts.length === 5 || parts.length === 6)) {
      setParsedResult({ error: 'Invalid cron expression. Must have 5 or 6 fields.' });
      return;
    }

    const finalParts: string[] = parts.length === 5 ? ['0', ...parts] : parts;
    const finalExpression: string = finalParts.join(' ');

    // validate using cron-parser
    try {
      const interval: CronExpression = CronExpressionParser.parse(finalExpression, {
        strict: true,
        tz: timezone,
      });

      const fields: ParsedResultField[] = generateFieldDescription(finalParts);
      const humanReadable: string = generateHumanReadable(finalExpression);
      const nextRuns: string[] = generateNextRuns(interval);

      setParsedResult({
        fields,
        humanReadable,
        nextRuns,
      });
    } catch (e) {
      setParsedResult({ error: 'Error parsing cron expression.' });
      console.error(e);
      return;
    }
  };

  const generateFieldDescription = (parts: string[]): ParsedResultField[] => {
    const getFieldDescription = (field: string, value: string) => {
      if (value === '*') return 'Every value';
      if (value.includes('/')) return `Every ${value.split('/')[1]} ${field}(s)`;
      if (value.includes('-')) return `From ${value.split('-')[0]} to ${value.split('-')[1]}`;
      if (value.includes(',')) return `On ${value.replace(/,/g, ', ')}`;
      return `At ${value}`;
    };

    const [second, minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    const fieldExplanations = [
      { field: 'Minute', value: minute, description: getFieldDescription('minute', minute) },
      { field: 'Hour', value: hour, description: getFieldDescription('hour', hour) },
      {
        field: 'Day of Month',
        value: dayOfMonth,
        description: getFieldDescription('dayOfMonth', dayOfMonth),
      },
      { field: 'Month', value: month, description: getFieldDescription('month', month) },
      {
        field: 'Day of Week',
        value: dayOfWeek,
        description: getFieldDescription('dayOfWeek', dayOfWeek),
      },
    ];

    if (second !== '0') {
      fieldExplanations.unshift({
        field: 'Second',
        value: second,
        description: getFieldDescription('second', second),
      });
    }

    return fieldExplanations;
  };

  const generateHumanReadable = (expression: string) => {
    return cronstrue.toString(expression, { use24HourTimeFormat: true });
  };

  const generateNextRuns = (interval: CronExpression) => {
    return interval.take(5).map((date) => {
      return date.toDate().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    });
  };

  return (
    <div className="bg-background min-h-screen transition-colors">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-foreground mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Ever looked at a cron job and thought…{' '}
            <span className="text-purple-500">what the cron?</span> 🤯
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Instantly decode, explain, and preview your cron schedules.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="px-8 py-3"
              onClick={() =>
                document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <Zap className="mr-2 h-5 w-5" />
              Try It Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3"
              onClick={() =>
                document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Learn Cron Syntax
            </Button>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section
        id="tool"
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h3 className="text-foreground mb-2 text-2xl font-bold">Enter a cron expression</h3>
          </div>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="*/15 9-17 * * MON-FRI"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              className="flex-1 p-4 font-mono text-lg"
            />
            <Button
              onClick={() => parseCronExpression(cronExpression)}
              className="px-8"
              disabled={!cronExpression.trim()}
            >
              Parse
            </Button>
          </div>

          {parsedResult && (
            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="text-primary h-5 w-5" />
                  Cron Expression Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {parsedResult.error ? (
                  <div className="text-destructive font-medium">{parsedResult.error}</div>
                ) : (
                  <>
                    {/* Field Breakdown */}
                    <div>
                      <h4 className="text-foreground mb-3 font-semibold">Field Breakdown</h4>
                      <div className="space-y-2">
                        {parsedResult.fields?.map((field: ParsedResultField, index: number) => (
                          <div
                            key={index}
                            className="bg-accent flex items-center justify-between rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="outline"
                                className="font-mono"
                              >
                                {field.value}
                              </Badge>
                              <span className="font-medium">{field.field}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{field.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <span>{field.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Human Readable */}
                    <div>
                      <h4 className="text-foreground mb-2 font-semibold">Human-Readable Summary</h4>
                      <p className="rounded-lg bg-purple-50 p-4 text-lg font-medium text-purple-600 dark:bg-purple-900/20 dark:text-purple-300">
                        {parsedResult.humanReadable}
                      </p>
                    </div>

                    {/* Next Run Times */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-foreground font-semibold">Next Run Times</h4>

                        {/* TODO: Handle timezone and DST*/}
                        {/* <Select
                          value={timezone}
                          onValueChange={(value) => setTimezone(value)}
                          open={showTimezoneDropdown}
                          onOpenChange={setShowTimezoneDropdown}
                        >
                          <SelectTrigger className="hover:bg-accent text-primary border-0 bg-transparent py-2 font-medium shadow-none">
                            <SelectValue>Change Timezone ({timezone})</SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-popover text-popover-foreground z-50 overflow-y-auto">
                            {timeZoneOptions.map((tz) => (
                              <SelectItem
                                key={tz.value}
                                value={tz.value}
                                className="text-foreground"
                              >
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select> */}
                      </div>
                      <div className="space-y-2">
                        {parsedResult.nextRuns?.map((time: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded bg-green-50 p-2 dark:bg-green-900/20"
                          >
                            <Calendar className="text-primary h-4 w-4" />
                            <span className="text-foreground font-mono text-sm">{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

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
