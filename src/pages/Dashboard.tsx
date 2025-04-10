
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowRight, Calendar, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMockHistoricalData } from "@/utils/mockDataUtils";

interface AssessmentResult {
  date: string;
  answers: Record<string, number | string>;
  results?: {
    stressLevel: number;
    anxietyLevel: number;
    depressionRisk: number;
    wellnessScore: number;
  };
}

interface CheckInData {
  date: string;
  mood: number;
  sleep: number;
  energy: number;
  notes?: string;
}

const Dashboard = () => {
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);
  const [checkInHistory, setCheckInHistory] = useState<CheckInData[]>([]);
  const [hasData, setHasData] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get latest assessment result
    const latestAssessment = localStorage.getItem("assessmentResults");
    
    // Get historical data (in a real app, this would come from a database)
    const mockAssessmentData = getMockHistoricalData();
    
    if (latestAssessment) {
      try {
        const parsedData = JSON.parse(latestAssessment);
        setAssessmentHistory([parsedData, ...mockAssessmentData.assessments]);
        setCheckInHistory(mockAssessmentData.checkIns);
        setHasData(true);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    } else {
      setAssessmentHistory(mockAssessmentData.assessments);
      setCheckInHistory(mockAssessmentData.checkIns);
      setHasData(mockAssessmentData.assessments.length > 0);
    }
  }, []);

  // Format data for charts
  const formatAssessmentDataForChart = () => {
    return assessmentHistory.map(item => {
      const date = new Date(item.date);
      return {
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        stress: item.results?.stressLevel || 5,
        anxiety: item.results?.anxietyLevel || 4,
        depression: item.results?.depressionRisk || 3,
        wellness: item.results?.wellnessScore || 6,
      };
    }).reverse(); // Show oldest to newest
  };

  const formatCheckInDataForChart = () => {
    return checkInHistory.map(item => {
      const date = new Date(item.date);
      return {
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        mood: item.mood,
        sleep: item.sleep,
        energy: item.energy,
      };
    }).reverse(); // Show oldest to newest
  };

  if (!hasData) {
    return (
      <div className="text-center py-12 space-y-6 animate-fade-in">
        <h2 className="text-2xl font-semibold">No Data Available</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Complete an assessment and daily check-ins to see your mental health trends over time.
        </p>
        <Button onClick={() => navigate("/assessment")} className="mx-auto">
          Take Assessment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Progress Dashboard</h1>
          <p className="text-muted-foreground">Track your mental health journey over time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/assessment")}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
          <Button onClick={() => navigate("/check-in")}>
            <Calendar className="mr-2 h-4 w-4" />
            Daily Check-in
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="wellness" className="w-full">
        <TabsList>
          <TabsTrigger value="wellness">Wellness Score</TabsTrigger>
          <TabsTrigger value="mood">Mood & Energy</TabsTrigger>
          <TabsTrigger value="anxiety">Anxiety & Stress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wellness" className="mt-4">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Wellness Score Trend</CardTitle>
              <CardDescription>Your overall wellness score over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatAssessmentDataForChart()}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="wellness" 
                      name="Wellness Score"
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mood" className="mt-4">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Mood & Energy Trends</CardTitle>
              <CardDescription>Daily check-in data on mood and energy levels</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatCheckInDataForChart()}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      name="Mood"
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      name="Energy"
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--secondary))", r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sleep" 
                      name="Sleep Quality"
                      stroke="#d2edd4" 
                      strokeWidth={2}
                      dot={{ fill: "#d2edd4", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="anxiety" className="mt-4">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Anxiety & Stress Trends</CardTitle>
              <CardDescription>Assessment data on anxiety and stress levels</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatAssessmentDataForChart()}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="anxiety" 
                      name="Anxiety Level" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      dataKey="stress" 
                      name="Stress Level" 
                      fill="hsl(var(--secondary))" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      dataKey="depression" 
                      name="Depression Risk" 
                      fill="#fde1d3" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-skyblue/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Insights</CardTitle>
            <CardDescription>Based on your past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Your sleep quality has improved by 20% this week.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Anxiety levels have been decreasing steadily.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Your mood tends to be better on weekends.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-peach/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Personalized suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Try morning meditation to reduce anxiety.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Consider journaling before bed for better sleep quality.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Schedule regular breaks during your workday.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
