
import { calculateResults } from "./assessmentUtils";

// Generate mock data for dashboard visualizations
export const getMockHistoricalData = () => {
  const today = new Date();
  const assessments = [];
  const checkIns = [];
  
  // Generate 10 days of historical data, ending yesterday
  for (let i = 11; i > 1; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Create mock answers that show improvement over time
    const improvementFactor = (11 - i) / 10; // 0 to 1 improvement
    
    // Assessment data (less frequent)
    if (i % 3 === 0) { // Every 3 days
      const mockAnswers = {
        mood: Math.min(10, Math.max(1, Math.round(4 + 3 * improvementFactor))),
        sleep: Math.min(10, Math.max(1, Math.round(3 + 4 * improvementFactor))),
        anxiety: Math.min(10, Math.max(1, Math.round(8 - 4 * improvementFactor))),
        energy: Math.min(10, Math.max(1, Math.round(3 + 5 * improvementFactor))),
        interest: Math.min(10, Math.max(1, Math.round(4 + 4 * improvementFactor))),
        concentration: Math.min(10, Math.max(1, Math.round(5 + 3 * improvementFactor))),
        appetite: ['Poor', 'Below average', 'Normal', 'Normal', 'Above average'][Math.min(4, Math.floor(improvementFactor * 5))],
      };
      
      const results = calculateResults(mockAnswers);
      
      assessments.push({
        date: date.toISOString(),
        answers: mockAnswers,
        results
      });
    }
    
    // Daily check-in data (every day)
    const randomVariation = () => Math.random() * 2 - 1; // -1 to +1 for natural variation
    
    checkIns.push({
      date: date.toISOString(),
      mood: Math.min(10, Math.max(1, Math.round(4 + 3 * improvementFactor + randomVariation()))),
      sleep: Math.min(10, Math.max(1, Math.round(3 + 4 * improvementFactor + randomVariation()))),
      energy: Math.min(10, Math.max(1, Math.round(3 + 5 * improvementFactor + randomVariation()))),
      notes: ""
    });
  }
  
  return { assessments, checkIns };
};
