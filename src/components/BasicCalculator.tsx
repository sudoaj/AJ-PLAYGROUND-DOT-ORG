'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleOperation = (op: string) => {
    if (op === '=') {
      if (operation && previousValue !== null) {
        const inputValue = parseFloat(display);
        const newValue = calculate(previousValue, inputValue, operation);
        setDisplay(String(newValue));
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
      }
    } else {
      performOperation(op);
    }
  };

  const buttonClass = "h-16 text-lg font-semibold transition-all duration-200 hover:scale-105";
  const numberButtonClass = `${buttonClass} bg-gray-100 hover:bg-gray-200 text-gray-800`;
  const operatorButtonClass = `${buttonClass} bg-blue-500 hover:bg-blue-600 text-white`;
  const clearButtonClass = `${buttonClass} bg-red-500 hover:bg-red-600 text-white`;
  const equalsButtonClass = `${buttonClass} bg-green-500 hover:bg-green-600 text-white`;

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-lg font-bold text-muted-foreground">
          Basic Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display */}
        <div className="bg-black text-white p-4 rounded-lg text-right">
          <div className="text-3xl font-mono min-h-[3rem] flex items-center justify-end overflow-hidden">
            {display}
          </div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <Button 
            onClick={clear} 
            className={`${clearButtonClass} col-span-2`}
          >
            Clear
          </Button>
          <Button 
            onClick={() => handleOperation('÷')} 
            className={operatorButtonClass}
          >
            ÷
          </Button>
          <Button 
            onClick={() => handleOperation('×')} 
            className={operatorButtonClass}
          >
            ×
          </Button>

          {/* Row 2 */}
          <Button 
            onClick={() => inputNumber('7')} 
            className={numberButtonClass}
          >
            7
          </Button>
          <Button 
            onClick={() => inputNumber('8')} 
            className={numberButtonClass}
          >
            8
          </Button>
          <Button 
            onClick={() => inputNumber('9')} 
            className={numberButtonClass}
          >
            9
          </Button>
          <Button 
            onClick={() => handleOperation('-')} 
            className={operatorButtonClass}
          >
            -
          </Button>

          {/* Row 3 */}
          <Button 
            onClick={() => inputNumber('4')} 
            className={numberButtonClass}
          >
            4
          </Button>
          <Button 
            onClick={() => inputNumber('5')} 
            className={numberButtonClass}
          >
            5
          </Button>
          <Button 
            onClick={() => inputNumber('6')} 
            className={numberButtonClass}
          >
            6
          </Button>
          <Button 
            onClick={() => handleOperation('+')} 
            className={operatorButtonClass}
          >
            +
          </Button>

          {/* Row 4 */}
          <Button 
            onClick={() => inputNumber('1')} 
            className={numberButtonClass}
          >
            1
          </Button>
          <Button 
            onClick={() => inputNumber('2')} 
            className={numberButtonClass}
          >
            2
          </Button>
          <Button 
            onClick={() => inputNumber('3')} 
            className={numberButtonClass}
          >
            3
          </Button>
          <Button 
            onClick={() => handleOperation('=')} 
            className={`${equalsButtonClass} row-span-2`}
          >
            =
          </Button>

          {/* Row 5 */}
          <Button 
            onClick={() => inputNumber('0')} 
            className={`${numberButtonClass} col-span-2`}
          >
            0
          </Button>
          <Button 
            onClick={inputDecimal} 
            className={numberButtonClass}
          >
            .
          </Button>
        </div>

        {/* Abandoned Notice */}
        <div className="text-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            This project is not working as intended and has been abandoned.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
