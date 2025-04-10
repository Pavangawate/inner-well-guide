
import { toast } from "@/hooks/use-toast";

interface AssessmentAnswers {
  [key: string]: number | string;
}

export interface ResultData {
  stressLevel: number;
  anxietyLevel: number;
  depressionRisk: number;
  wellnessScore: number;
  suggestions: string[];
  summary: string;
}

// A simple rule-based algorithm to evaluate mental health based on questionnaire answers
export const calculateResults = (answers: AssessmentAnswers): ResultData => {
  try {
    // Extract numeric values for calculation
    const mood = typeof answers.mood === 'number' ? answers.mood : 5;
    const sleep = typeof answers.sleep === 'number' ? answers.sleep : 5;
    const anxiety = typeof answers.anxiety === 'number' ? answers.anxiety : 5;
    const energy = typeof answers.energy === 'number' ? answers.energy : 5;
    const interest = typeof answers.interest === 'number' ? answers.interest : 5;
    const concentration = typeof answers.concentration === 'number' ? answers.concentration : 5;
    
    // Convert text values to numeric if needed
    let appetiteScore = 5;
    if (typeof answers.appetite === 'string') {
      switch (answers.appetite) {
        case 'Poor':
          appetiteScore = 2;
          break;
        case 'Below average':
          appetiteScore = 4;
          break;
        case 'Normal':
          appetiteScore = 6;
          break;
        case 'Above average':
          appetiteScore = 8;
          break;
        case 'Excessive':
          appetiteScore = 5; // Middle value as both extremes can indicate issues
          break;
      }
    }

    // Calculate scores based on the answers
    // Note: Anxiety is inverted (10 = very anxious, which is bad for wellness)
    const anxietyLevel = Math.min(10, Math.max(1, Math.round(anxiety)));
    const stressLevel = Math.min(10, Math.max(1, Math.round((10 - sleep + anxiety + (10 - energy)) / 3)));
    
    // Depression risk factors: low mood, low interest, poor sleep, low energy
    const depressionRisk = Math.min(10, Math.max(1, Math.round(
      (10 - mood + 10 - interest + 10 - sleep + 10 - energy) / 4
    )));
    
    // Wellness is a positive measure
    const wellnessScore = Math.min(10, Math.max(1, Math.round(
      (mood + sleep + energy + interest + concentration + (10 - anxiety) + appetiteScore) / 7
    )));

    // Generate personalized suggestions
    const suggestions = generateSuggestions({
      mood, sleep, anxiety, energy, interest, concentration, appetiteScore, stressLevel, depressionRisk, wellnessScore
    });
    
    // Create summary text
    const summary = generateSummary({
      mood, sleep, anxiety, energy, interest, stressLevel, depressionRisk, wellnessScore
    });

    return {
      stressLevel,
      anxietyLevel,
      depressionRisk,
      wellnessScore,
      suggestions,
      summary
    };
  } catch (error) {
    console.error("Error calculating results:", error);
    
    toast({
      title: "Error analyzing results",
      description: "There was a problem processing your responses. Default values will be shown.",
      variant: "destructive",
    });
    
    // Return default values in case of error
    return {
      stressLevel: 5,
      anxietyLevel: 5, 
      depressionRisk: 4,
      wellnessScore: 6,
      suggestions: [
        "Practice regular mindfulness meditation",
        "Ensure you're getting 7-9 hours of sleep",
        "Stay physically active with regular exercise",
        "Consider talking to a mental health professional"
      ],
      summary: "We had trouble analyzing your specific responses, but we've provided some general wellness recommendations that may be helpful."
    };
  }
};

// Helper function to generate personalized suggestions
const generateSuggestions = (scores: {
  mood: number;
  sleep: number;
  anxiety: number;
  energy: number;
  interest: number;
  concentration: number;
  appetiteScore: number;
  stressLevel: number;
  depressionRisk: number;
  wellnessScore: number;
}): string[] => {
  const suggestions: string[] = [];
  
  // Add suggestions based on scores
  if (scores.sleep < 5) {
    suggestions.push("Improve your sleep routine by maintaining consistent sleep and wake times");
    suggestions.push("Avoid screens for at least an hour before bedtime");
  }
  
  if (scores.anxiety > 6) {
    suggestions.push("Try deep breathing exercises when feeling anxious");
    suggestions.push("Consider mindfulness meditation to reduce anxiety");
  }
  
  if (scores.mood < 5) {
    suggestions.push("Spend time outdoors in natural light each day");
    suggestions.push("Connect with friends or family members regularly");
  }
  
  if (scores.energy < 5) {
    suggestions.push("Incorporate short walks throughout your day to boost energy");
    suggestions.push("Ensure you're staying hydrated and eating regular meals");
  }
  
  if (scores.interest < 5) {
    suggestions.push("Schedule time for activities you've previously enjoyed");
    suggestions.push("Set small, achievable goals to rebuild a sense of accomplishment");
  }
  
  if (scores.depressionRisk > 7) {
    suggestions.push("Consider reaching out to a mental health professional");
    suggestions.push("Practice self-compassion and avoid self-criticism");
  }
  
  if (scores.stressLevel > 7) {
    suggestions.push("Identify specific stress triggers and develop coping strategies");
    suggestions.push("Try progressive muscle relaxation to reduce physical tension");
  }
  
  // Always add general wellness suggestions
  suggestions.push("Maintain a balanced diet rich in vegetables, fruits, and whole grains");
  suggestions.push("Practice gratitude by noting three positive things each day");
  
  // Limit to 5 most relevant suggestions
  return suggestions.slice(0, 5);
};

// Helper function to generate summary text
const generateSummary = (scores: {
  mood: number;
  sleep: number;
  anxiety: number;
  energy: number;
  interest: number;
  stressLevel: number;
  depressionRisk: number;
  wellnessScore: number;
}): string => {
  if (scores.wellnessScore >= 8) {
    return "Your responses suggest you're currently experiencing good mental wellbeing. You appear to be managing stress effectively and maintaining positive emotional health. Continue your current practices while monitoring any changes.";
  }
  else if (scores.wellnessScore >= 6) {
    return "Your mental wellbeing appears to be generally good, though there may be some areas where you could benefit from additional support or self-care. Focus on maintaining balance in your daily routine.";
  }
  else if (scores.wellnessScore >= 4) {
    return "Your responses indicate moderate challenges with your mental wellbeing. You may be experiencing stress, mood changes, or difficulties with sleep or energy. Consider implementing the suggested strategies and monitoring your progress.";
  }
  else {
    return "Your responses suggest you may be going through a difficult period with your mental health. Consider reaching out to a mental health professional for support. Remember that many mental health challenges are temporary and treatable with appropriate care.";
  }
};
