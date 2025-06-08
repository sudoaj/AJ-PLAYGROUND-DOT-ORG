'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Calculator, Users, DollarSign, Percent } from 'lucide-react';

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(18);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [customTip, setCustomTip] = useState<string>('');

  const bill = parseFloat(billAmount) || 0;
  const tip = customTip ? parseFloat(customTip) : tipPercentage;
  const tipAmount = (bill * tip) / 100;
  const totalAmount = bill + tipAmount;
  const perPersonAmount = totalAmount / numberOfPeople;
  const tipPerPerson = tipAmount / numberOfPeople;

  const commonTipPercentages = [15, 18, 20, 22, 25];

  const handleTipPercentageClick = (percentage: number) => {
    setTipPercentage(percentage);
    setCustomTip('');
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    if (value) {
      setTipPercentage(0);
    }
  };

  const reset = () => {
    setBillAmount('');
    setTipPercentage(18);
    setNumberOfPeople(1);
    setCustomTip('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-blue-50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="text-primary hover:text-black dark:hover:text-dark">
            <Link href="/playground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Playground
            </Link>
          </Button>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-6xl">💰</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Tip Calculator
              </h1>
              <Badge variant="secondary" className="mt-2">
                <Calculator className="w-3 h-3 mr-1" />
                Utility Tool
              </Badge>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate tips and split bills easily. Perfect for restaurants, cafes, and group dining!
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Bill Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bill Amount */}
              <div className="space-y-2">
                <Label htmlFor="bill-amount">Bill Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="bill-amount"
                    type="number"
                    placeholder="0.00"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="pl-10 text-lg"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* Tip Percentage */}
              <div className="space-y-3">
                <Label>Tip Percentage</Label>
                <div className="grid grid-cols-5 gap-2">
                  {commonTipPercentages.map((percentage) => (
                    <Button
                      key={percentage}
                      variant={tipPercentage === percentage && !customTip ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTipPercentageClick(percentage)}
                      className="text-sm"
                    >
                      {percentage}%
                    </Button>
                  ))}
                </div>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Custom tip %"
                    value={customTip}
                    onChange={(e) => handleCustomTipChange(e.target.value)}
                    className="pl-10"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Number of People */}
              <div className="space-y-2">
                <Label htmlFor="people-count">Number of People</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="people-count"
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                    className="pl-10"
                    min="1"
                  />
                </div>
              </div>

              <Button onClick={reset} variant="outline" className="w-full">
                Reset Calculator
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Bill Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Bill Amount</p>
                    <p className="text-xl font-semibold">${bill.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Tip ({customTip || tipPercentage}%)
                    </p>
                    <p className="text-xl font-semibold text-green-600">${tipAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-3xl font-bold text-primary">${totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Per Person Card */}
            {numberOfPeople > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Per Person ({numberOfPeople} people)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Amount per Person</p>
                      <p className="text-2xl font-bold">${perPersonAmount.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tip per Person</p>
                      <p className="text-xl font-semibold text-green-600">${tipPerPerson.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tip Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Tip Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Poor Service:</span>
                    <span className="font-medium">10-12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Service:</span>
                    <span className="font-medium">15-18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Good Service:</span>
                    <span className="font-medium">18-22%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Excellent Service:</span>
                    <span className="font-medium">22%+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild className="hover:text-black dark:hover:text-black">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
            <Button asChild className="hover:text-white dark:hover:text-black">
              <Link href="/playground">
                Explore More Tools
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
