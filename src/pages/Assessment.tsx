
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Send, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define question types
type QuestionType = 'slider' | 'radio' | 'textarea';

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  category: 'mood' | 'sleep' | 'anxiety' | 'energy' | 'appetite' | 'stress' | 'general';
}

// Assessment question bank
const questions: Question[] = [
  {
    id: 'mood',
    text: 'How would you rate your mood today?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    required: true,
    category: 'mood'
  },
  {
    id: 'sleep',
    text: 'How well did you sleep last night?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    required: true,
    category: 'sleep'
  },
  {
    id: 'anxiety',
    text: 'How anxious have you been feeling?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    required: true,
    category: 'anxiety'
  },
  {
    id: 'energy',
    text: 'How would you rate your energy level today?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    required: true,
    category: 'energy'
  },
  {
    id: 'appetite',
    text: 'How has your appetite been recently?',
    type: 'radio',
    options: ['Poor', 'Below average', 'Normal', 'Above average', 'Excessive'],
    required: true,
    category: 'appetite'
  },
  {
    id: 'interest',
    text: 'How interested are you in activities you usually enjoy?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    required: true,
    category: 'mood'
  },
  {
    id: 'concentration',
    text: 'How would you rate your ability to concentrate today?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    required: true,
    category: 'general'
  },
  {
    id: 'stressors',
    text: 'What are your main sources of stress currently?',
    type: 'textarea',
    required: false,
    category: 'stress'
  }
];

type Answers = {
  [key: string]: number | string;
};

const Assessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [sliderValue, setSliderValue] = useState<number>(5);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleNextQuestion = () => {
    // Save current answer
    if (currentQuestion.type === 'slider') {
      setAnswers({ ...answers, [currentQuestion.id]: sliderValue });
    }
    
    // Check if required and not answered
    if (currentQuestion.required && !answers[currentQuestion.id] && 
        (currentQuestion.type !== 'slider' || sliderValue === undefined)) {
      toast({
        title: "Required Field",
        description: "Please answer this question before continuing.",
        variant: "destructive",
      });
      return;
    }
    
    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Pre-set the slider value if it's a slider question
      const nextQuestion = questions[currentQuestionIndex + 1];
      if (nextQuestion.type === 'slider') {
        const savedAnswer = answers[nextQuestion.id];
        setSliderValue(typeof savedAnswer === 'number' ? savedAnswer : 5);
      }
    } else {
      // Save assessment results to localStorage
      localStorage.setItem('assessmentResults', JSON.stringify({
        answers,
        date: new Date().toISOString(),
      }));
      // Navigate to results page
      navigate('/results');
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Pre-set the slider value if it's a slider question
      const prevQuestion = questions[currentQuestionIndex - 1];
      if (prevQuestion.type === 'slider') {
        const savedAnswer = answers[prevQuestion.id];
        setSliderValue(typeof savedAnswer === 'number' ? savedAnswer : 5);
      }
    }
  };
  
  const handleRadioChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({ ...answers, [currentQuestion.id]: e.target.value });
  };

  // Render the appropriate input based on question type
  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'slider':
        return (
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
            <Slider
              value={[sliderValue]}
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={currentQuestion.step}
              onValueChange={(value) => setSliderValue(value[0])}
              className="py-4"
            />
            <div className="text-center font-medium text-lg">{sliderValue}</div>
          </div>
        );
      
      case 'radio':
        return (
          <RadioGroup 
            value={answers[currentQuestion.id]?.toString() || ""}
            onValueChange={handleRadioChange}
            className="space-y-3 py-4"
          >
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${option}`} />
                <Label htmlFor={`option-${option}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
        
      case 'textarea':
        return (
          <Textarea
            value={answers[currentQuestion.id]?.toString() || ""}
            onChange={handleTextareaChange}
            placeholder="Type your answer here..."
            className="mt-2"
            rows={4}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-center">Mental Health Assessment</h1>
      
      <div className="mb-6">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="text-center text-sm text-muted-foreground mt-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>
      
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
          {currentQuestion.required && (
            <CardDescription className="flex items-center gap-1 text-destructive">
              <AlertTriangle className="h-3 w-3" />
              Required
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {renderQuestionInput()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? (
              <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
            ) : (
              <>Submit <Send className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Assessment;
