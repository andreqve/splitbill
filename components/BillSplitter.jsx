// File: components/BillSplitter.jsx (File Baru)
'use client';

import { useState } from 'react';
import { useBill } from '@/context/BillContext';
import BillSetup from '@/components/BillSetup';
import ParticipantManager from '@/components/ParticipantManager';
import ItemAssigner from '@/components/ItemAssigner';
import FinalSummary from '@/components/FinalSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Receipt,
  Users,
  CheckSquare,
  Calculator,
  RotateCcw,
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Atur', description: 'Nama sama list tagihan', icon: Receipt, component: BillSetup },
  { id: 2, title: 'Siapa', description: 'yang ikutan menikmati', icon: Users, component: ParticipantManager },
  { id: 3, title: 'Bagi', description: 'Siapa bayar apa', icon: CheckSquare, component: ItemAssigner },
  { id: 4, title: 'Rekap', description: 'Total pembagian bill', icon: Calculator, component: FinalSummary },
];

export default function BillSplitter() {
  const [currentStep, setCurrentStep] = useState(1);
  const { dispatch, actions } = useBill();

  const nextStep = () => currentStep < steps.length && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);
  const goToStep = (step) => setCurrentStep(step);

  // Fungsi reset yang lebih baik tanpa reload halaman
  const resetApp = () => {
    dispatch({ type: actions.RESET_STATE });
    setCurrentStep(1);
  };

  const CurrentComponent = steps[currentStep - 1].component;

  return (
    <>
      {/* Step Indicator */}
      <Card className="mb-8 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`flex-1 p-4 text-center transition-all hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-b-2 border-blue-500' : ''}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="mb-8">
        <CurrentComponent />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <Button onClick={resetApp} variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-700">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Step {currentStep} dari {steps.length}</Badge>
          {currentStep < steps.length && (
            <Button onClick={nextStep} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}