
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, LineChart, CalendarCheck, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Home = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const features = [
    {
      title: "Mental Health Assessment",
      description: "Complete a comprehensive questionnaire to evaluate your mental wellbeing",
      icon: <Brain className="h-10 w-10 md:h-12 md:w-12 text-primary" />,
      action: () => navigate("/assessment"),
    },
    {
      title: "Track Your Progress",
      description: "Monitor your mental health journey with personalized insights",
      icon: <LineChart className="h-10 w-10 md:h-12 md:w-12 text-secondary" />,
      action: () => navigate("/dashboard"),
    },
    {
      title: "Daily Check-In",
      description: "Quick daily mood and wellness tracking to maintain awareness",
      icon: <CalendarCheck className="h-10 w-10 md:h-12 md:w-12 text-primary" />,
      action: () => navigate("/check-in"),
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12 md:pb-0">
      <section className="text-center py-6 md:py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-foreground">Welcome to MindWell</h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Your companion for understanding and improving your mental wellbeing.
        </p>
      </section>
      
      <section className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-3'} gap-4 md:gap-6 px-3 md:px-0`}>
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="card-gradient p-5 md:p-6 flex flex-col items-center text-center shadow-md touch-button mobile-card"
          >
            <div className="mb-3 md:mb-4 p-3 rounded-full bg-accent">{feature.icon}</div>
            <h2 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4 flex-grow">{feature.description}</p>
            <Button onClick={feature.action} className="group w-full sm:w-auto">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Card>
        ))}
      </section>
      
      <section className="mt-8 md:mt-12 p-4 md:p-6 mx-3 md:mx-0 bg-lavender/50 rounded-xl md:rounded-2xl backdrop-blur-sm shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-center md:text-left">Start Your Mental Health Journey</h2>
            <p className="text-sm md:text-base text-muted-foreground text-center md:text-left">
              Take our comprehensive assessment to get personalized insights
            </p>
          </div>
          <Button 
            size={isMobile ? "default" : "lg"}
            onClick={() => navigate("/assessment")}
            className="btn-gradient w-full md:w-auto"
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
