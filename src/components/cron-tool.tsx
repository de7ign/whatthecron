'use client';

import { useEffect, useRef, useState } from 'react';
import { getTimeZones, TimeZone } from '@vvo/tzdb';
import CronExpressionParser, { CronExpression } from 'cron-parser';
import cronstrue from 'cronstrue';
import { Calendar, Clock, Info } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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

export default function CronTool() {
  const isFirstRender = useRef(true);
  const [cronExpression, setCronExpression] = useState('*/15 9-17 * * MON-FRI');
  const [parsedResult, setParsedResult] = useState<ParsedResult | undefined>(undefined);
  const [timezone, setTimezone] = useState(getDefaultTimeZone());

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
  );
}
