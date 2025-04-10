
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, LineChart, CalendarCheck, ArrowRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: "Mental Health Assessment",
      description: "Complete a comprehensive questionnaire to evaluate your mental wellbeing",
      icon: <Brain className="h-12 w-12 text-primary" />,
      action: () => navigate("/assessment"),
    },
    {
      title: "Track Your Progress",
      description: "Monitor your mental health journey with personalized insights",
      icon: <LineChart className="h-12 w-12 text-secondary" />,
      action: () => navigate("/dashboard"),
    },
    {
      title: "Daily Check-In",
      description: "Quick daily mood and wellness tracking to maintain awareness",
      icon: <CalendarCheck className="h-12 w-12 text-primary" />,
      action: () => navigate("/check-in"),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center py-10">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Welcome to MindWell</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your companion for understanding and improving your mental wellbeing.
          Track your emotions, get personalized insights, and access helpful resources.
        </p>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="card-gradient p-6 flex flex-col items-center text-center shadow-md">
            <div className="mb-4 p-3 rounded-full bg-accent">{feature.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-muted-foreground mb-4 flex-grow">{feature.description}</p>
            <Button onClick={feature.action} className="group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Card>
        ))}
      </section>
      
      <section className="mt-12 p-6 bg-lavender/50 rounded-2xl backdrop-blur-sm shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Start Your Mental Health Journey</h2>
            <p className="text-muted-foreground">
              Take our comprehensive assessment to get personalized insights and recommendations
            </p>
          </div>
          <Button 
            size="lg"
            onClick={() => navigate("/assessment")}
            className="btn-gradient"
          >
            Begin Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
