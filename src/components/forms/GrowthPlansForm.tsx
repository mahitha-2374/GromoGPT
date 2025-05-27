"use client";

import type { FC } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, TrendingUp, ShieldAlert } from "lucide-react";
import { assessGrowthPotential, type AssessGrowthPotentialInput, type AssessGrowthPotentialOutput } from '@/ai/flows/ai-driven-growth-strategy';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  partnerPerformanceData: z.string().min(50, { message: "Detailed partner performance data is essential (min 50 characters)." }),
  marketTrendsData: z.string().min(30, { message: "Current market trends information is needed (min 30 characters)." }),
  partnerActivityData: z.string().min(30, { message: "Recent partner activity provides context (min 30 characters)." }),
});
type FormValues = z.infer<typeof formSchema>;

const GrowthPlansForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessGrowthPotentialOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerPerformanceData: "",
      marketTrendsData: "",
      partnerActivityData: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await assessGrowthPotential(values as AssessGrowthPotentialInput);
      setResult(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred while assessing growth potential.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">AI Growth Strategy Input</CardTitle>
              <CardDescription>Provide data for AI to assess your growth potential and suggest actionable strategies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="partnerPerformanceData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Performance Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Sales figures, customer profiles, product categories sold, conversion funnels, etc." className="min-h-[120px] resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketTrendsData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Trends Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Current trends in financial products, popular categories, competitor activities, etc." className="min-h-[100px] resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partnerActivityData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Activity Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Recent leads contacted, products pitched, training completed, customer interactions, etc." className="min-h-[100px] resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Assessing Growth...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Get Growth Plan
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {isLoading && (
        <Card className="shadow-md">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Mapping your growth trajectory...</p>
            <p className="text-sm text-muted-foreground">Our AI strategist is analyzing data to unlock your potential.</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="shadow-lg border-primary">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary">
              <CheckCircle2 className="mr-2 h-7 w-7" />
              AI-Driven Growth Insights
            </CardTitle>
            {result.riskOfStagnation && (
              <Badge variant="destructive" className="mt-2 w-fit">
                <ShieldAlert className="mr-1 h-4 w-4" /> Risk of Stagnation Detected
              </Badge>
            )}
            {!result.riskOfStagnation && (
                 <Badge variant="default" className="mt-2 bg-accent text-accent-foreground w-fit">
                 <CheckCircle2 className="mr-1 h-4 w-4" /> Looking Good! Low Risk of Stagnation.
               </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {result.suggestedPlaybooks && (
              <div>
                <h3 className="text-lg font-semibold mb-1">Suggested Playbooks:</h3>
                <p className="text-sm bg-secondary/30 p-3 rounded-md whitespace-pre-line">{result.suggestedPlaybooks}</p>
              </div>
            )}
            {result.suggestedIncomeBoosters && (
              <div>
                <h3 className="text-lg font-semibold mb-1">Suggested Income Boosters:</h3>
                <p className="text-sm bg-secondary/30 p-3 rounded-md whitespace-pre-line">{result.suggestedIncomeBoosters}</p>
              </div>
            )}
             {!result.suggestedPlaybooks && !result.suggestedIncomeBoosters && (
              <p className="text-sm text-muted-foreground">No specific playbooks or income boosters suggested at this time. Continue monitoring your performance and market trends.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GrowthPlansForm;
