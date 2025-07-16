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

const getNewsImage = (title: string, symbol: string): string => {
  const titleLower = title?.toLowerCase() || '';
  const symbolLower = symbol?.toLowerCase() || '';
  
  // Technology/AI companies
  if (titleLower.includes('apple') || symbolLower.includes('aapl')) {
    return 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=400&fit=crop';
  }
  if (titleLower.includes('tesla') || symbolLower.includes('tsla')) {
    return 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=400&fit=crop';
  }
  if (titleLower.includes('nvidia') || symbolLower.includes('nvda')) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop';
  }
  if (titleLower.includes('microsoft') || symbolLower.includes('msft')) {
    return 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&h=400&fit=crop';
  }
  if (titleLower.includes('google') || titleLower.includes('alphabet') || symbolLower.includes('googl')) {
    return 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&h=400&fit=crop';
  }
  
  // Financial/Banking
  if (titleLower.includes('fed') || titleLower.includes('federal reserve') || titleLower.includes('rate') || titleLower.includes('inflation')) {
    return 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=400&fit=crop';
  }
  if (titleLower.includes('bank') || titleLower.includes('jpmorgan') || titleLower.includes('goldman')) {
    return 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&h=400&fit=crop';
  }
  
  // Energy/Oil
  if (titleLower.includes('oil') || titleLower.includes('energy') || titleLower.includes('exxon') || titleLower.includes('chevron')) {
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop';
  }
  
  // Cryptocurrency
  if (titleLower.includes('bitcoin') || titleLower.includes('crypto') || titleLower.includes('ethereum')) {
    return 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop';
  }
  
  // Healthcare/Pharma
  if (titleLower.includes('pfizer') || titleLower.includes('johnson') || titleLower.includes('healthcare') || titleLower.includes('drug')) {
    return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop';
  }
  
  // Retail/Consumer
  if (titleLower.includes('amazon') || titleLower.includes('walmart') || titleLower.includes('target')) {
    return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop';
  }
  
  // Default financial/market image
  return 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop';
};

const generateAIAnalysis = (title: string, content: string, sentiment: string): string[] => {
  const analysis = [];
  
  // Base analysis based on sentiment
  if (sentiment === 'positive') {
    analysis.push("Positive market sentiment could drive increased investor confidence");
    analysis.push("Strong fundamentals suggest sustainable growth potential");
  } else if (sentiment === 'negative') {
    analysis.push("Market volatility expected as investors digest negative developments");
    analysis.push("Risk management strategies should be considered for exposed positions");
  } else {
    analysis.push("Mixed signals require careful analysis of underlying fundamentals");
    analysis.push("Market uncertainty suggests cautious optimism for near-term outlook");
  }
  
  // Content-specific analysis
  const titleLower = title?.toLowerCase() || '';
  const contentLower = content?.toLowerCase() || '';
  
  if (titleLower.includes('earnings') || contentLower.includes('revenue')) {
    analysis.push("Earnings performance will be closely watched by institutional investors");
  }
  
  if (titleLower.includes('fed') || titleLower.includes('rate') || contentLower.includes('interest')) {
    analysis.push("Monetary policy changes could have broad market implications");
  }
  
  if (titleLower.includes('merger') || titleLower.includes('acquisition') || contentLower.includes('deal')) {
    analysis.push("M&A activity signals confidence in sector consolidation opportunities");
  }
  
  // Ensure we always have 4 analysis points
  while (analysis.length < 4) {
    analysis.push("Market dynamics continue to evolve with changing economic conditions");
  }
  
  return analysis.slice(0, 4);
};

const mapSentimentToImpact = (sentiment: string | null): string => {
  if (!sentiment) return 'Mixed';
  
  switch (sentiment.toLowerCase()) {
    case 'positive':
    case 'bullish':
      return 'Bullish';
    case 'negative':
    case 'bearish':
      return 'Bearish';
    default:
      return 'Mixed';
  }
};

export const transformNewsItem = (newsItem: NewsItem): TransformedNewsItem => {
  const headline = newsItem.title || 'Market Update';
  const content = newsItem.content || 'Content not available';
  const summary = content.length > 200 ? content.substring(0, 200) + '...' : content;
  
  return {
    id: newsItem.id,
    headline,
    summary,
    image: getNewsImage(headline, newsItem.symbol || ''),
    source: newsItem.symbol || 'Market News',
    impact: mapSentimentToImpact(newsItem.sentiment),
    content,
    aiAnalysis: generateAIAnalysis(headline, content, newsItem.sentiment || '')
  };
};

export const generateDailyBrief = (newsItems: NewsItem[]) => {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Analyze sentiment distribution
  const sentiments = newsItems.map(item => item.sentiment?.toLowerCase()).filter(Boolean);
  const positiveSentiments = sentiments.filter(s => s === 'positive' || s === 'bullish').length;
  const negativeSentiments = sentiments.filter(s => s === 'negative' || s === 'bearish').length;
  
  let marketSummary = '';
  if (positiveSentiments > negativeSentiments) {
    marketSummary = 'Markets showed positive momentum today with optimistic investor sentiment driving gains across key sectors.';
  } else if (negativeSentiments > positiveSentiments) {
    marketSummary = 'Markets faced headwinds today with cautious investor sentiment as traders digested mixed economic signals.';
  } else {
    marketSummary = 'Markets showed mixed signals today with investors weighing various economic factors and corporate developments.';
  }
  
  // Generate key points from news
  const keyPoints = newsItems.slice(0, 5).map((item, index) => {
    const title = item.title || 'Market development';
    const symbol = item.symbol ? ` (${item.symbol})` : '';
    return `${title}${symbol} shows ${item.sentiment || 'mixed'} market impact`;
  });
  
  // Add some general market points if we don't have enough news
  while (keyPoints.length < 5) {
    keyPoints.push('Continued monitoring of economic indicators and corporate earnings');
  }
  
  const marketOutlook = newsItems.length > 0 
    ? 'Market outlook remains data-dependent with focus on upcoming earnings and economic indicators.'
    : 'Cautiously optimistic with focus on upcoming economic data and corporate earnings reports.';
  
  return {
    date: today,
    summary: marketSummary,
    keyPoints,
    marketOutlook
  };
};