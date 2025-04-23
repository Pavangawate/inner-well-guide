
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart3, ArrowRight, Home, CalendarCheck, youtube } from "lucide-react";
import { calculateResults } from "@/utils/assessmentUtils";
import { useToast } from "@/hooks/use-toast";

interface ResultData {
  stressLevel: number;
  anxietyLevel: number;
  depressionRisk: number;
  wellnessScore: number;
  suggestions: string[];
  summary: string;
}

const YOUTUBE_VIDEO_URL = "https://www.youtube.com/embed/inpok4MKVLM"; // Mindfulness Meditation - "The Honest Guys"

const Results = () => {
  const [results, setResults] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const assessmentData = localStorage.getItem("assessmentResults");
    
    if (!assessmentData) {
      toast({
        title: "No Assessment Data",
        description: "Please complete the assessment first.",
        variant: "destructive",
      });
      navigate("/assessment");
      return;
    }
    
    try {
      const parsedData = JSON.parse(assessmentData);
      // Calculate results based on answers
      const calculatedResults = calculateResults(parsedData.answers);
      setResults(calculatedResults);
    } catch (error) {
      console.error("Error processing assessment data:", error);
      toast({
        title: "Error",
        description: "There was a problem analyzing your results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Analyzing your responses...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
        <p className="mb-6 text-muted-foreground">We couldn't process your assessment results.</p>
        <Button onClick={() => navigate("/assessment")}>
          Retake Assessment
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2 text-center">Your Mental Health Results</h1>
      <p className="text-center text-muted-foreground mb-8">
        Based on your responses, here's an overview of your current mental wellbeing
      </p>
      
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="text-xl">Summary</CardTitle>
          <CardDescription>Overall analysis of your responses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{results.summary}</p>
          
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Wellness Score</span>
                <span className="font-medium">{results.wellnessScore}/10</span>
              </div>
              <Progress value={results.wellnessScore * 10} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Stress Level</span>
                <span className="font-medium">{results.stressLevel}/10</span>
              </div>
              <Progress value={results.stressLevel * 10} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Anxiety Level</span>
                <span className="font-medium">{results.anxietyLevel}/10</span>
              </div>
              <Progress value={results.anxietyLevel * 10} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Depression Risk</span>
                <span className="font-medium">{results.depressionRisk}/10</span>
              </div>
              <Progress value={results.depressionRisk * 10} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-lavender/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Personalized Suggestions</CardTitle>
          <CardDescription>Based on your current mental health state</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.suggestions.map((suggestion, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* YouTube Video Suggestion Section */}
      <Card className="bg-orange-50 border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <youtube className="h-5 w-5 text-red-500" />
          <CardTitle className="text-lg">
            Take a mindful break – Watch this relaxing meditation video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md bg-black flex justify-center items-center">
            <iframe
              width="100%"
              height="100%"
              src={YOUTUBE_VIDEO_URL}
              title="Mindfulness Meditation for Relaxation"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-xl border-none"
              loading="lazy"
            ></iframe>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          View Progress Dashboard
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate("/check-in")}
          className="flex items-center gap-2"
        >
          <CalendarCheck className="h-4 w-4" />
          Complete Daily Check-In
        </Button>
      </div>
      
      <div className="text-center pt-4">
        <Button 
          variant="link"
          onClick={() => navigate("/")}
          className="text-muted-foreground"
        >
          <Home className="mr-1 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Results;
