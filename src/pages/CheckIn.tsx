
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CheckInData {
  date: string;
  mood: number;
  sleep: number;
  energy: number;
  notes: string;
}

const CheckIn = () => {
  const [checkInData, setCheckInData] = useState<CheckInData>({
    date: new Date().toISOString(),
    mood: 5,
    sleep: 5,
    energy: 5,
    notes: "",
  });
  
  const [checkedInToday, setCheckedInToday] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user already checked in today
    const todayCheckIn = localStorage.getItem("todayCheckIn");
    if (todayCheckIn) {
      const parsedData = JSON.parse(todayCheckIn);
      const checkInDate = new Date(parsedData.date);
      const today = new Date();
      
      if (
        checkInDate.getDate() === today.getDate() &&
        checkInDate.getMonth() === today.getMonth() &&
        checkInDate.getFullYear() === today.getFullYear()
      ) {
        setCheckedInToday(true);
        setCheckInData(parsedData);
      }
    }
  }, []);
  
  const handleSliderChange = (field: keyof CheckInData, value: number) => {
    setCheckInData({
      ...checkInData,
      [field]: value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save check-in data
    const checkInRecord = {
      ...checkInData,
      date: new Date().toISOString(),
    };
    
    // Store today's check-in
    localStorage.setItem("todayCheckIn", JSON.stringify(checkInRecord));
    
    // Get existing history
    const existingHistory = localStorage.getItem("checkInHistory");
    let checkInHistory = existingHistory ? JSON.parse(existingHistory) : [];
    
    // Add new check-in to history
    checkInHistory.push(checkInRecord);
    localStorage.setItem("checkInHistory", JSON.stringify(checkInHistory));
    
    toast({
      title: "Check-in recorded",
      description: "Your daily check-in has been saved successfully.",
    });
    
    setCheckedInToday(true);
    
    // Give the toast time to display before navigating away
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };
  
  return (
    <div className="max-w-2xl mx-auto py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-center">Daily Check-In</h1>
      <p className="text-muted-foreground text-center mb-8">
        Track your mood and wellbeing with a quick daily check-in
      </p>
      
      <form onSubmit={handleSubmit}>
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center">
              Today's Check-In
              <span className="ml-auto text-sm bg-accent py-1 px-3 rounded-full">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </CardTitle>
            <CardDescription>
              {checkedInToday 
                ? "You've already checked in today. You can view or update your entry." 
                : "How are you feeling today? Take a moment to reflect."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>
                <div className="flex justify-between mb-2">
                  <span>Mood</span>
                  <span className="text-muted-foreground text-sm">
                    {checkInData.mood < 4 ? "Low" : checkInData.mood > 7 ? "Great" : "Okay"}
                  </span>
                </div>
                <Slider
                  value={[checkInData.mood]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => handleSliderChange("mood", value[0])}
                  disabled={checkedInToday}
                />
              </Label>
            </div>
            
            <div className="space-y-4">
              <Label>
                <div className="flex justify-between mb-2">
                  <span>Sleep Quality</span>
                  <span className="text-muted-foreground text-sm">
                    {checkInData.sleep < 4 ? "Poor" : checkInData.sleep > 7 ? "Great" : "Fair"}
                  </span>
                </div>
                <Slider
                  value={[checkInData.sleep]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => handleSliderChange("sleep", value[0])}
                  disabled={checkedInToday}
                />
              </Label>
            </div>
            
            <div className="space-y-4">
              <Label>
                <div className="flex justify-between mb-2">
                  <span>Energy Level</span>
                  <span className="text-muted-foreground text-sm">
                    {checkInData.energy < 4 ? "Low" : checkInData.energy > 7 ? "High" : "Moderate"}
                  </span>
                </div>
                <Slider
                  value={[checkInData.energy]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => handleSliderChange("energy", value[0])}
                  disabled={checkedInToday}
                />
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any thoughts or reflections about your day..."
                value={checkInData.notes}
                onChange={(e) => setCheckInData({...checkInData, notes: e.target.value})}
                disabled={checkedInToday}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
            
            {!checkedInToday && (
              <Button type="submit">
                Submit Check-In
                <Send className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
      
      <div className="mt-8 p-4 bg-accent rounded-lg">
        <h3 className="text-lg font-medium mb-2">Why Check In Daily?</h3>
        <p className="text-muted-foreground">
          Regular check-ins help you become more aware of your mental health patterns and can help identify trends or triggers. Just a minute each day can provide valuable insights over time.
        </p>
      </div>
    </div>
  );
};

export default CheckIn;
