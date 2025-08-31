"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Github, Info, Clock, Calendar, Hash, Star, Zap } from "lucide-react"
import cronstrue from 'cronstrue';
import { CronExpression, CronExpressionParser } from 'cron-parser';

export default function Home() {
  const [cronExpression, setCronExpression] = useState("*/15 9-17 * * MON-FRI")
  const [parsedResult, setParsedResult] = useState<any>(null)
  const [timezone, setTimezone] = useState("UTC")

  const parseCronExpression = (expression: string) => {
    // Simple cron parser for demo purposes
    const parts = expression.trim().split(/\s+/)
    if (!(parts.length === 5 || parts.length === 6)) {
      setParsedResult({ error: "Invalid cron expression. Must have 5 or 6 fields." })
      return
    }

    const finalParts = parts.length === 5 ? ['0', ...parts] : parts
    const finalExpression = finalParts.join(' ')

    // validate using cron-parser
    try {
      const interval = CronExpressionParser.parse(finalExpression, { strict: true });

      const fields = generateFieldDescription(finalParts);
      const humanReadable = generateHumanReadable(finalExpression)
      const nextRuns = generateNextRuns(interval)

      setParsedResult({
        fields,
        humanReadable,
        nextRuns,
      })

    } catch (e) {
      setParsedResult({ error: "Error parsing cron expression." })
      console.error(e)
      return
    }
  }

  const generateFieldDescription = (parts: string[]) => {
    const getFieldDescription = (field: string, value: string) => {
      if (value === "*") return "Every value"
      if (value.includes("/")) return `Every ${value.split("/")[1]} ${field}(s)`
      if (value.includes("-")) return `From ${value.split("-")[0]} to ${value.split("-")[1]}`
      if (value.includes(",")) return `On ${value.replace(/,/g, ", ")}`
      return `At ${value}`
    }

    const [second, minute, hour, dayOfMonth, month, dayOfWeek] = parts

    const fieldExplanations = [
      { field: "Minute", value: minute, description: getFieldDescription("minute", minute) },
      { field: "Hour", value: hour, description: getFieldDescription("hour", hour) },
      { field: "Day of Month", value: dayOfMonth, description: getFieldDescription("dayOfMonth", dayOfMonth) },
      { field: "Month", value: month, description: getFieldDescription("month", month) },
      { field: "Day of Week", value: dayOfWeek, description: getFieldDescription("dayOfWeek", dayOfWeek) },
    ]

    if (second !== '0') {
      fieldExplanations.unshift({ field: "Second", value: second, description: getFieldDescription("second", second) })
    }

    return fieldExplanations;
  }


  const generateHumanReadable = (expression: string) => {
    return cronstrue.toString(expression, { use24HourTimeFormat: true });
  }

  const generateNextRuns = (interval: CronExpression) => {

    return interval.take(5).map(date => {

      return date.toDate().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 font-mono">WhatTheCron</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Button variant="ghost" size="sm">
                <Github className="h-5 w-5" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Ever looked at a cron job and thought… <span className="text-purple-500">what the cron?</span> 🤯
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Instantly decode, explain, and preview your cron schedules.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
              onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Zap className="mr-2 h-5 w-5" />
              Try It Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 bg-transparent"
              onClick={() => document.getElementById("learn")?.scrollIntoView({ behavior: "smooth" })}
            >
              Learn Cron Syntax
            </Button>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section id="tool" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enter a cron expression</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Input
              placeholder="*/15 9-17 * * MON-FRI"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              className="flex-1 font-mono text-lg p-4"
            />
            <Button
              onClick={() => parseCronExpression(cronExpression)}
              className="bg-green-500 hover:bg-green-600 text-white px-8"
              disabled={!cronExpression.trim()}
            >
              Parse
            </Button>
          </div>



          {parsedResult && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Cron Expression Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {parsedResult.error ? (
                  <div className="text-red-600 font-medium">{parsedResult.error}</div>
                ) : (
                  <>
                    {/* Field Breakdown */}
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900">Field Breakdown</h4>
                      <div className="space-y-2">
                        {parsedResult.fields.map((field: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="font-mono">
                                {field.value}
                              </Badge>
                              <span className="font-medium">{field.field}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{field.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <span className="text-gray-600">{field.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Human Readable */}
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Human-Readable Summary</h4>
                      <p className="text-lg font-medium text-purple-600 bg-purple-50 p-4 rounded-lg">
                        {parsedResult.humanReadable}
                      </p>
                    </div>

                    {/* Next Run Times */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Next Run Times</h4>
                        <Button variant="link" className="text-green-500 p-0">
                          Change Timezone ({timezone})
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {parsedResult.nextRuns.map((time: string, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-green-50 rounded">
                            <Calendar className="h-4 w-4 text-green-500" />
                            <span className="font-mono text-sm">{time}</span>
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
      <section id="learn" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Cron Cheatsheet</h3>

          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-2 border-2 h-auto sm:grid-cols-4">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="special">Special Characters</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="mistakes">Common Mistakes</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Hash className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          Cron format:{" "}
                          <code className="bg-gray-100 px-2 py-1 rounded font-mono">minute hour day month weekday</code>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          Fields range from 0-59 (minutes), 0-23 (hours), 1-31 (days), 1-12 (months), 0-7 (weekdays)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          Use <code className="bg-gray-100 px-2 py-1 rounded font-mono">*</code> to match any value in
                          that field
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Sunday can be represented as either 0 or 7</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="special" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">*</div>
                      <div>
                        <p className="font-medium">Matches any value (wildcard)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">/</div>
                      <div>
                        <p className="font-medium">
                          Step values - <code className="font-mono">*/5</code> means every 5 units
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">-</div>
                      <div>
                        <p className="font-medium">
                          Range - <code className="font-mono">1-5</code> means 1 through 5
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">,</div>
                      <div>
                        <p className="font-medium">
                          List - <code className="font-mono">1,3,5</code> means 1, 3, and 5
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">0 0 * * *</code>
                      <div>
                        <p className="font-medium">Every day at midnight</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">*/15 * * * *</code>
                      <div>
                        <p className="font-medium">Every 15 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">0 9 * * MON-FRI</code>
                      <div>
                        <p className="font-medium">9 AM on weekdays</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">0 0 1 * *</code>
                      <div>
                        <p className="font-medium">First day of every month at midnight</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mistakes" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">
                          Don't use both day-of-month and day-of-week unless you want OR logic
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">
                          Remember that months are 1-12, not 0-11 like in some programming languages
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Be careful with timezone differences in production environments</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Test your cron expressions before deploying to production</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
