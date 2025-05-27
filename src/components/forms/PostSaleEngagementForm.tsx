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
import { AlertCircle, CheckCircle2, Loader2, MessageSquare, CalendarClock } from "lucide-react";
import { automateCustomerQueryResponses, type AutomateCustomerQueryResponsesInput, type AutomateCustomerQueryResponsesOutput } from '@/ai/flows/automate-customer-query-responses';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";


const formSchema = z.object({
  customerQuery: z.string().min(10, { message: "Customer query must be at least 10 characters." }),
  customerName: z.string().min(2, { message: "Customer name is required." }),
  productDetails: z.string().min(10, { message: "Product details are necessary for context." }),
  renewalDate: z.string().optional(), // Making renewalDate optional for the form, handled by DatePicker
});
type FormValues = z.infer<typeof formSchema>;

const PostSaleEngagementForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AutomateCustomerQueryResponsesOutput | null>(null);
  const [date, setDate] = useState<Date | undefined>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerQuery: "",
      customerName: "",
      productDetails: "",
      renewalDate: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    const payload: AutomateCustomerQueryResponsesInput = {
      ...values,
      renewalDate: date ? format(date, "yyyy-MM-dd") : "", // Format date or pass empty string
    };

    try {
      const response = await automateCustomerQueryResponses(payload);
      setResult(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred while generating response.");
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
              <CardTitle className="text-2xl">Automated Query Response</CardTitle>
              <CardDescription>Let AI handle common customer queries. Input the details below to generate a response.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Priya Sharma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerQuery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Query</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., What is the status of my claim? or How do I renew my policy?" className="min-h-[100px] resize-y" {...field} />
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
                      <Textarea placeholder="e.g., Health Insurance Policy X, Sum Insured 5 Lakhs" className="min-h-[80px] resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="renewalDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Renewal Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarClock className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => {
                            setDate(selectedDate);
                            field.onChange(selectedDate ? format(selectedDate, "yyyy-MM-dd") : "");
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      If relevant, select the customer's product renewal date.
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
                    Generating Response...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Generate Response
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
            <p className="text-lg font-medium">Crafting the perfect reply...</p>
            <p className="text-sm text-muted-foreground">Our AI is preparing a helpful response for your customer.</p>
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
              AI Generated Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm bg-secondary/30 p-4 rounded-md whitespace-pre-line">{result.response}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PostSaleEngagementForm;
