import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface WorkflowStepperProps {
  steps: Step[];
  currentStep: string;
}

const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 ${
                step.completed 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : step.current 
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground text-muted-foreground'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </div>
              <div className="max-w-32">
                <p className={`text-sm font-medium ${
                  step.current ? 'text-primary' : step.completed ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {step.current && (
                <Badge className="mt-1 text-xs">Current</Badge>
              )}
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-5 h-5 text-muted-foreground mx-2 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WorkflowStepper;