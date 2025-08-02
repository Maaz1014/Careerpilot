'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getMarketInsights, MarketInsightsOutput } from '@/ai/flows/market-insights';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Briefcase, Lightbulb, BadgeDollarSign, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function MarketInsights() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [insights, setInsights] = useState<MarketInsightsOutput | null>(null);

  const handleGetInsights = async () => {
    if (!jobTitle || !location) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please enter both a job title and location.',
      });
      return;
    }
    setIsLoading(true);
    setInsights(null);
    try {
      const result = await getMarketInsights({ jobTitle, location });
      setInsights(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not fetch market insights. Please try again.',
      });
    }
    setIsLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: insights?.salaryBenchmark.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-heading flex items-center text-2xl">
          <TrendingUp className="mr-3 h-7 w-7 text-primary" />
          Real-Time Market Insights
        </CardTitle>
        <CardDescription>
          Get AI-powered insights into job market trends, in-demand skills, and salary benchmarks for any role.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="job-title-insights">Job Title</Label>
            <Input
              id="job-title-insights"
              placeholder="e.g., Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-insights">Location</Label>
            <Input
              id="location-insights"
              placeholder="e.g., San Francisco, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <Button onClick={handleGetInsights} disabled={isLoading} className="w-full">
          {isLoading ? 'Analyzing Market...' : 'Get Insights'}
        </Button>

        {insights && (
          <div className="mt-8 space-y-6">
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="font-heading text-lg font-semibold text-primary">Market Summary</h3>
              <p className="text-muted-foreground mt-1">{insights.summary}</p>
            </div>

            <Accordion type="single" collapsible defaultValue="skills" className="w-full">
              <AccordionItem value="skills">
                <AccordionTrigger className="font-heading text-lg"><Lightbulb className="mr-2 h-5 w-5" />Top 5 In-Demand Skills</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3">
                    {insights.inDemandSkills.map((item) => (
                      <li key={item.skill} className="p-3 bg-muted rounded-md">
                        <p className="font-semibold">{item.skill}</p>
                        <p className="text-xs text-muted-foreground">{item.reason}</p>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="salary">
                <AccordionTrigger className="font-heading text-lg"><BadgeDollarSign className="mr-2 h-5 w-5" />Salary Benchmark</AccordionTrigger>
                <AccordionContent className="text-center">
                    <p className="text-2xl font-bold text-primary">
                        {formatCurrency(insights.salaryBenchmark.low)} - {formatCurrency(insights.salaryBenchmark.high)}
                    </p>
                    <p className="text-sm text-muted-foreground">Estimated Annual Salary ({insights.salaryBenchmark.currency})</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="trending">
                <AccordionTrigger className="font-heading text-lg"><Sparkles className="mr-2 h-5 w-5" />Trending & Related Roles</AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                        {insights.trendingRoles.map(role => (
                            <div key={role} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm font-medium">
                                {role}
                            </div>
                        ))}
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
