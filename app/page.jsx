'use client';

import { useState } from 'react';
import DonutLogo from '@/components/DonutLogo';
import { BillProvider } from '@/context/BillContext';
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
  {
    id: 1,
    title: 'Atur',
    description: 'Nama sama list tagihan',
    icon: Receipt,
    component: BillSetup,
  },
  {
    id: 2,
    title: 'Siapa',
    description: 'yang ikutan menikmati',
    icon: Users,
    component: ParticipantManager,
  },
  {
    id: 3,
    title: 'Bagi',
    description: 'Siapa bayar apa',
    icon: CheckSquare,
    component: ItemAssigner,
  },
  {
    id: 4,
    title: 'Rekap',
    description: 'Total pembagian bill',
    icon: Calculator,
    component: FinalSummary,
  },
];

function BillSplitApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isHovering, setIsHovering] = useState(false);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const resetApp = () => {
    window.location.reload();
  };

  const CurrentComponent = steps[currentStep - 1].component;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 font-[DM Sans,sans-serif]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Background stickers - emoji */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[12%] left-[8%] opacity-20 blur-sm select-none text-7xl">🍩</div>
        <div className="absolute top-[65%] left-[85%] opacity-20 blur-sm select-none text-8xl">🍕</div>
        <div className="absolute top-[30%] left-[60%] opacity-15 blur-sm select-none text-8xl">🥤</div>
        <div className="absolute top-[70%] left-[12%] opacity-20 blur-sm select-none text-7xl">☕</div>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-3xl md:max-w-4xl relative z-10">
        {/* HEADER BARU */}
        <header className="mb-12 mt-3 relative z-10 flex flex-col items-center gap-3">
          {/* Emoji Lengkap only on md+ */}
          <div className="flex items-center gap-2">
            <span className="text-4xl spin-slow inline-block">🍩</span>
            <span className="text-4xl spin-reverse inline-block">🥤</span>
            <span className="text-4xl spin-slow inline-block">🍗</span>
            <span className="text-4xl spin-super-slow inline-block">🍕</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 drop-shadow text-center mt-2">
            Split Bill Dong!
          </h1>
          <div className="mt-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium shadow-sm flex items-center gap-2 text-base md:text-lg border border-emerald-100">
            <span>Makan bareng, bayar bareng 🤝</span>
          </div>
        </header>


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
                    className={`flex-1 p-4 text-center transition-all hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-b-2 border-blue-500' : ''
                      }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div
                          className={`font-medium text-sm ${isActive ? 'text-blue-700' : 'text-gray-700'
                            }`}
                        >
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
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              variant="outline"
              onClick={resetApp}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Step {currentStep} dari {steps.length}
            </Badge>

            {currentStep < steps.length && (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>

            )}
          </div>
        </div>

        {/* FOOTER BARU */}
        <footer className="mt-16 text-center text-xs md:text-sm text-gray-400 relative z-10 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-1">
            <span className="text-lg">🍬</span>
            <span className="text-lg">🍩</span>
            <span className="text-lg">🍰</span>
            <span className="text-lg">🍕</span>
          </div>
          <p>
            Built with ☕ by{' '}
            <a
              href="https://x.com/andreqve"
              className="text-emerald-500 hover:underline"
            >
              @andreqve
            </a>{' '}
            | Mau atur uang? cek{' '}
            <a
              href="https://www.monsy.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              monsy.app
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <BillProvider>
      <BillSplitApp />
    </BillProvider>
  );
}
