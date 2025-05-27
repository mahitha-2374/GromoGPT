"use client";

import type { FC } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { getPersonalizedLearningRecommendations, type PersonalizedLearningRecommendationsInput, type PersonalizedLearningRecommendationsOutput } from '@/ai/flows/personalized-learning-recommendations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  salesPerformanceData: z.string().min(50, { message: "Please provide detailed sales performance data (min 50 characters)." }),
  partnerId: z.string().min(3, { message: "Partner ID must be at least 3 characters." }),
});
type FormValues = z.infer<typeof formSchema>;

const LearningCoachForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PersonalizedLearningRecommendationsOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salesPerformanceData: "",
      partnerId: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await getPersonalizedLearningRecommendations(values as PersonalizedLearningRecommendationsInput);
      setResult(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred while fetching recommendations.");
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
              <CardTitle className="text-2xl">Personalized Learning Input</CardTitle>
              <CardDescription>Enter your sales performance data and Partner ID to get tailored learning recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="partnerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Partner ID (e.g., GP12345)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesPerformanceData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sales Performance Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your recent sales performance, products sold, conversion rates, customer feedback, challenges faced, etc."
                        className="min-h-[150px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The more details you provide, the better the recommendations.
                    </FormDescription>
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
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Get Recommendations
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
            <p className="text-lg font-medium">Your AI Coach is thinking...</p>
            <p className="text-sm text-muted-foreground">Analyzing your performance to craft personalized advice.</p>
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
              Your Personalized Learning Plan
            </CardTitle>
            <CardDescription>{result.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Areas to Improve:</h3>
              {result.areasToImprove.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.areasToImprove.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No specific areas for improvement identified currently. Keep up the good work!</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Recommended Training Modules:</h3>
              {result.recommendedTrainingModules.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.recommendedTrainingModules.map((module, index) => (
                    <li key={index}>{module}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No specific training modules recommended at this time.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningCoachForm;
