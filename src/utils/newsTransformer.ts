
import { NewsItem } from '@/hooks/useNews';

export interface TransformedNewsItem {
  id: number;
  headline: string;
  summary: string;
  image: string;
  source: string;
  impact: string;
  content: string;
  aiAnalysis: string[];
}

const getRelevantImage = (title: string, content: string): string => {
  const text = (title + ' ' + content).toLowerCase();
  
  // Tech/Apple related
  if (text.includes('apple') || text.includes('iphone') || text.includes('tech') || text.includes('smartphone')) {
    return "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=400&fit=crop";
  }
  
  // Tesla/EV/Auto related
  if (text.includes('tesla') || text.includes('electric') || text.includes('ev') || text.includes('car') || text.includes('automotive')) {
    return "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=400&fit=crop";
  }
  
  // Finance/Fed/Banking related
  if (text.includes('fed') || text.includes('rate') || text.includes('bank') || text.includes('finance') || text.includes('monetary')) {
    return "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=400&fit=crop";
  }
  
  // Energy/Oil related
  if (text.includes('oil') || text.includes('energy') || text.includes('gas') || text.includes('petroleum')) {
    return "https://images.unsplash.com/photo-1497493292307-31c376b6e479?w=800&h=400&fit=crop";
  }
  
  // Crypto/Bitcoin related
  if (text.includes('bitcoin') || text.includes('crypto') || text.includes('blockchain') || text.includes('digital currency')) {
    return "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop";
  }
  
  // Healthcare/Pharma related
  if (text.includes('health') || text.includes('pharma') || text.includes('medical') || text.includes('drug')) {
    return "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop";
  }
  
  // Default financial/market image
  return "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop";
};

const mapSentimentToImpact = (sentiment: string): string => {
  if (!sentiment) return 'Mixed';
  
  const sentimentLower = sentiment.toLowerCase();
  if (sentimentLower.includes('positive') || sentimentLower.includes('bullish')) {
    return 'Bullish';
  } else if (sentimentLower.includes('negative') || sentimentLower.includes('bearish')) {
    return 'Bearish';
  }
  return 'Mixed';
};

const generateAIAnalysis = (title: string, content: string, sentiment: string): string[] => {
  const analysis = [];
  
  // Generate relevant analysis points based on content
  if (content && content.length > 0) {
    const text = (title + ' ' + content).toLowerCase();
    
    if (text.includes('earnings') || text.includes('revenue')) {
      analysis.push('Strong financial performance indicates healthy business fundamentals');
    }
    
    if (text.includes('growth') || text.includes('increase')) {
      analysis.push('Growth trajectory suggests positive market momentum');
    }
    
    if (text.includes('market') || text.includes('sector')) {
      analysis.push('Market dynamics could influence broader sector performance');
    }
    
    if (text.includes('production') || text.includes('manufacturing')) {
      analysis.push('Production developments may impact supply chain and pricing');
    }
  }
  
  // Add sentiment-based analysis
  const impact = mapSentimentToImpact(sentiment);
  if (impact === 'Bullish') {
    analysis.push('Positive sentiment indicates potential upside for investors');
  } else if (impact === 'Bearish') {
    analysis.push('Negative sentiment suggests caution for market participants');
  } else {
    analysis.push('Mixed signals require careful analysis of risk-reward dynamics');
  }
  
  // Ensure we have at least 3 analysis points
  while (analysis.length < 3) {
    analysis.push('Market participants should monitor developments for further insights');
  }
  
  return analysis.slice(0, 4); // Max 4 points
};

export const transformNewsData = (newsItems: NewsItem[]): TransformedNewsItem[] => {
  return newsItems.map(item => ({
    id: item.id,
    headline: item.title || 'Market Update',
    summary: item.content ? item.content.substring(0, 200) + '...' : 'No summary available',
    image: getRelevantImage(item.title || '', item.content || ''),
    source: item.tag || 'Financial News',
    impact: mapSentimentToImpact(item.sentiment),
    content: item.content || 'Full content not available',
    aiAnalysis: generateAIAnalysis(item.title || '', item.content || '', item.sentiment || '')
  }));
};

export const generateDailyBrief = (newsItems: NewsItem[]) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const keyPoints = newsItems.slice(0, 5).map(item => {
    if (item.title && item.content) {
      return `${item.title.substring(0, 80)}${item.title.length > 80 ? '...' : ''}`;
    }
    return 'Market update available';
  });

  // Generate summary based on sentiment distribution
  const sentiments = newsItems.map(item => item.sentiment?.toLowerCase() || '');
  const bullishCount = sentiments.filter(s => s.includes('positive') || s.includes('bullish')).length;
  const bearishCount = sentiments.filter(s => s.includes('negative') || s.includes('bearish')).length;
  
  let summary = 'Markets showed mixed signals today';
  if (bullishCount > bearishCount) {
    summary = 'Markets displayed positive momentum today with optimistic investor sentiment';
  } else if (bearishCount > bullishCount) {
    summary = 'Markets faced headwinds today as investors remained cautious';
  }

  return {
    date: today,
    summary,
    keyPoints,
    marketOutlook: 'Investors continue to monitor key economic indicators and corporate developments for market direction.'
  };
};
