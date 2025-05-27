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
import { AlertCircle, CheckCircle2, Loader2, Bot, Zap } from "lucide-react";
import { assistSales, type AssistSalesInput, type AssistSalesOutput } from '@/ai/flows/ai-sales-assistance';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  context: z.string().min(20, { message: "Provide sufficient context about the conversation (min 20 characters)." }),
  productDetails: z.string().min(20, { message: "Describe the product being discussed (min 20 characters)." }),
  customerProfile: z.string().min(20, { message: "Share key customer details (min 20 characters)." }),
});
type FormValues = z.infer<typeof formSchema>;

const SalesCopilotForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssistSalesOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      context: "",
      productDetails: "",
      customerProfile: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await assistSales(values as AssistSalesInput);
      setResult(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred while getting sales assistance.");
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
              <CardTitle className="text-2xl">AI Sales Copilot Input</CardTitle>
              <CardDescription>Get real-time assistance for your sales calls or chats. Describe the situation below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conversation Context</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Customer is asking about loan interest rates after initial product introduction..." className="min-h-[100px] resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Details</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Personal Loan, amount up to 5 lakhs, tenure 1-5 years, for salaried individuals..." className="min-h-[80px] resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Profile</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Young professional, age 28, looking for funds for higher education, first-time borrower..." className="min-h-[80px] resize-y" {...field} />
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
                    Assisting...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-5 w-5" />
                    Get Assistance
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
            <p className="text-lg font-medium">Your Copilot is on the line...</p>
            <p className="text-sm text-muted-foreground">Preparing smart suggestions for your conversation.</p>
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
              Sales Copilot Suggestions
            </CardTitle>
            {result.warmLeadDetected && (
              <Badge variant="default" className="mt-2 bg-accent text-accent-foreground w-fit">
                <Zap className="mr-1 h-4 w-4" /> Warm Lead Detected!
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {result.suggestedPitch && (
              <div>
                <h3 className="text-lg font-semibold mb-1">Suggested Pitch Line:</h3>
                <p className="text-sm bg-secondary/50 p-3 rounded-md">{result.suggestedPitch}</p>
              </div>
            )}
            {result.objectionCounter && (
               <div>
                <h3 className="text-lg font-semibold mb-1">Objection Counter:</h3>
                <p className="text-sm bg-secondary/50 p-3 rounded-md">{result.objectionCounter}</p>
              </div>
            )}
            {!result.suggestedPitch && !result.objectionCounter && (
              <p className="text-sm text-muted-foreground">No specific pitch or objection counter suggested for this scenario. Consider general best practices.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesCopilotForm;
