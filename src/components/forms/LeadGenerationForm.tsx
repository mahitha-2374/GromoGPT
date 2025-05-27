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
import { AlertCircle, CheckCircle2, Loader2, Users, TrendingUp } from "lucide-react";
import { suggestHighPotentialLeads, type SuggestHighPotentialLeadsInput, type SuggestHighPotentialLeadsOutput } from '@/ai/flows/suggest-high-potential-leads';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  pastPerformanceData: z.string().min(50, { message: "Past performance data is crucial (min 50 characters)." }),
  customerProfilesData: z.string().min(50, { message: "Customer profiles data helps in targeting (min 50 characters)." }),
  locationData: z.string().min(20, { message: "Location data is needed for geographical analysis (min 20 characters)." }),
  gromoPartnerId: z.string().min(3, { message: "Partner ID must be at least 3 characters." }),
});
type FormValues = z.infer<typeof formSchema>;

const LeadGenerationForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SuggestHighPotentialLeadsOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pastPerformanceData: "",
      customerProfilesData: "",
      locationData: "",
      gromoPartnerId: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await suggestHighPotentialLeads(values as SuggestHighPotentialLeadsInput);
      setResult(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred while suggesting leads.");
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
              <CardTitle className="text-2xl">Smart Lead Input</CardTitle>
              <CardDescription>Provide the necessary data for AI to identify high-potential leads for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="gromoPartnerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GroMo Partner ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., GPXYZ789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastPerformanceData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Past Performance Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Sales history, conversion rates, product preferences, etc." className="min-h-[100px] resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerProfilesData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Profiles Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Demographics, purchase history, engagement metrics of existing customers." className="min-h-[100px] resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Operating area, population density, average income, local market trends." className="min-h-[80px] resize-y" {...field} />
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
                    Analyzing Leads...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-5 w-5" />
                    Suggest Leads
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
            <p className="text-lg font-medium">Finding your next best customers...</p>
            <p className="text-sm text-muted-foreground">Our AI is crunching the numbers to find high-potential leads.</p>
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
              High-Potential Leads
            </CardTitle>
            <CardDescription>{result.summary}</CardDescription>
          </CardHeader>
          <CardContent>
            {result.suggestedLeads.length > 0 ? (
              <div className="space-y-4">
                {result.suggestedLeads.map((lead) => (
                  <Card key={lead.leadId} className="bg-secondary/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-accent-foreground"/>
                        Lead ID: {lead.leadId}
                      </CardTitle>
                      <CardDescription>
                        Conversion Probability: <span className="font-semibold text-primary">{(lead.probabilityOfConversion * 100).toFixed(1)}%</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm"><span className="font-medium">Reasoning:</span> {lead.reasoning}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No specific leads suggested based on the current data. Try refining your input.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadGenerationForm;
