import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, TrendingUp, Calendar, Sparkles, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for demonstration
const mockNews = [{
  id: 1,
  headline: "Apple Reports Record Q4 Earnings, Beats Analyst Expectations",
  summary: "Apple Inc. reported quarterly revenue of $94.9 billion, up 6% year-over-year, driven by strong iPhone 15 sales and services growth.",
  image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=400&fit=crop",
  source: "Reuters",
  impact: "Bullish",
  content: "Apple Inc. exceeded Wall Street expectations with its fourth-quarter results, reporting revenue of $94.9 billion compared to analysts' estimates of $94.4 billion. The tech giant's iPhone segment generated $46.2 billion in revenue, marking a 3% increase from the previous year. The company's services division, including the App Store, iCloud, and Apple Music, contributed $22.3 billion, representing a 16% year-over-year growth. CEO Tim Cook highlighted the strong adoption of iPhone 15 and the growing ecosystem of Apple services as key drivers of the quarter's success.",
  aiAnalysis: [
    "Strong consumer demand for Apple's premium products despite economic headwinds",
    "16% growth in services revenue represents Apple's highest-margin business segment",
    "Sustainable long-term growth beyond hardware sales indicates strong ecosystem lock-in",
    "Beat analyst expectations suggests continued market confidence in Apple's strategy"
  ]
}, {
  id: 2,
  headline: "Tesla Stock Surges 12% on Cybertruck Production Update",
  summary: "Tesla announces accelerated Cybertruck production timeline, with first deliveries expected in Q1 2024, driving investor optimism.",
  image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=400&fit=crop",
  source: "Bloomberg",
  impact: "Bullish",
  content: "Tesla Inc. shares jumped 12% in after-hours trading following the company's announcement of an accelerated production timeline for its highly anticipated Cybertruck. The electric vehicle manufacturer revealed that it has overcome key manufacturing challenges and expects to begin customer deliveries in Q1 2024, earlier than the previously projected Q2 timeline. The company also announced that it has received over 1.5 million pre-orders for the Cybertruck, with production capacity expected to reach 250,000 units annually by 2025.",
  aiAnalysis: [
    "Earlier-than-expected Cybertruck launch could significantly boost Tesla's market share",
    "1.5 million pre-orders indicate strong pent-up demand in electric pickup segment",
    "Production capacity of 250,000 units annually represents substantial revenue potential",
    "Overcoming manufacturing challenges demonstrates Tesla's operational excellence"
  ]
}, {
  id: 3,
  headline: "Federal Reserve Hints at Rate Cut in December Meeting",
  summary: "Fed Chair Powell suggests monetary policy may shift to accommodate slowing inflation, with markets pricing in 75% chance of December rate cut.",
  image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=400&fit=crop",
  source: "Wall Street Journal",
  impact: "Mixed",
  content: "Federal Reserve Chair Jerome Powell indicated that the central bank may consider cutting interest rates at its December meeting, citing recent data showing inflation trending toward the Fed's 2% target. Core PCE inflation has declined to 3.2% year-over-year, down from its peak of 5.4% in early 2023. Powell emphasized that any rate decisions will be data-dependent, but acknowledged that the current restrictive monetary policy stance may no longer be necessary if inflation continues to moderate. Market participants are now pricing in a 75% probability of a 25 basis point rate cut in December.",
  aiAnalysis: [
    "Lower interest rates typically benefit growth stocks and borrowing-sensitive sectors",
    "Rate cuts often signal economic weakness, potentially impacting cyclical sectors negatively",
    "75% market probability suggests high confidence in Fed's dovish pivot",
    "Continued inflation moderation creates room for monetary policy accommodation"
  ]
}];
const dailyBrief = {
  date: "November 15, 2024",
  summary: "Markets showed mixed signals today with tech stocks leading gains while financials lagged on rate cut expectations.",
  keyPoints: ["S&P 500 closed up 0.8% led by technology sector gains", "10-year Treasury yields fell to 4.2% on Fed dovish signals", "Oil prices dropped 2.1% on China demand concerns", "Bitcoin reached new 2024 high of $44,200", "Weekly jobless claims came in below expectations at 217K"],
  marketOutlook: "Cautiously optimistic with focus on upcoming inflation data and earnings reports from major retailers."
};
type SwipeDirection = 'center' | 'left' | 'right';
const Index = () => {
  const [currentNews, setCurrentNews] = useState(0);
  const [currentView, setCurrentView] = useState<SwipeDirection>('center');
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    // Check system preference for dark mode
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentView !== 'left') {
        setCurrentView('left');
      } else if (diffX < 0 && currentView !== 'right') {
        setCurrentView('right');
      }
    }
    setIsDragging(false);
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const endX = e.clientX;
    const diffX = startX - endX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentView !== 'left') {
        setCurrentView('left');
      } else if (diffX < 0 && currentView !== 'right') {
        setCurrentView('right');
      }
    }
    setIsDragging(false);
  };
  const nextNews = () => {
    setCurrentNews(prev => (prev + 1) % mockNews.length);
  };
  const prevNews = () => {
    setCurrentNews(prev => (prev - 1 + mockNews.length) % mockNews.length);
  };
  const currentNewsItem = mockNews[currentNews];

  // Helper function to highlight keywords in text
  const highlightKeywords = (text: string, keywords: string[] = ['Apple', 'Tesla', 'Federal Reserve', 'revenue', 'earnings', 'production', 'rate cut', 'inflation']) => {
    let highlightedText = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="text-primary font-semibold">${keyword}</span>`);
    });
    return highlightedText;
  };

  return <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-accent/10 text-foreground relative">
      {/* Theme Toggle Button */}
      <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="absolute top-4 right-4 z-30 bg-card/80 backdrop-blur-sm hover:bg-card">
        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>

      {/* Main Content Container */}
      <div className={`flex w-[300%] h-full transition-transform duration-300 ease-out ${currentView === 'center' ? '-translate-x-[33.333%]' : currentView === 'left' ? '-translate-x-[66.666%]' : '-translate-x-0'}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        {/* Daily Brief Page */}
        <div className="w-1/3 h-full flex flex-col bg-gradient-to-br from-accent/90 to-primary/20 p-4 overflow-y-auto">
          <div className="flex items-center mb-6 pt-8">
            <Calendar className="w-7 h-7 mr-3 text-accent-foreground" />
            <div>
              <h1 className="text-2xl font-bold text-accent-foreground">Daily Brief</h1>
              <p className="text-accent-foreground/80 text-sm">{dailyBrief.date}</p>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            {/* Market Summary Card */}
            <Card className="bg-card/90 border-primary/30 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-card-foreground text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Market Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{dailyBrief.summary}</p>
              </CardContent>
            </Card>

            {/* Key Highlights Card */}
            <Card className="bg-card/90 border-primary/30 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-card-foreground text-lg">Key Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyBrief.keyPoints.map((point, index) => <div key={index} className="flex items-start group">
                      <div className="w-6 h-6 bg-primary rounded-full mt-0.5 mr-3 flex-shrink-0 flex items-center justify-center">
                        <span className="text-primary-foreground text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                        {point}
                      </span>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Market Outlook Card */}
            <Card className="bg-gradient-to-r from-card/90 to-secondary/50 border-accent/30 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-card-foreground text-lg flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-accent" />
                  Market Outlook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{dailyBrief.marketOutlook}</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-6 pb-4">
            <Button variant="ghost" onClick={() => setCurrentView('center')} className="text-accent-foreground/80 hover:text-accent-foreground hover:bg-card/50 transition-all duration-200">
              <ChevronRight className="w-4 h-4 mr-1" />
              Swipe to News Feed
            </Button>
          </div>
        </div>

        {/* News Feed Page */}
        <div className="w-1/3 h-full relative">
          <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: `url(${currentNewsItem.image})`
        }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  currentNewsItem.impact === 'Bullish' ? 'bg-green-600 text-white' : 
                  currentNewsItem.impact === 'Bearish' ? 'bg-red-600 text-white' : 
                  'bg-gray-600 text-white'
                }`}>
                  {currentNewsItem.impact}
                </span>
                <span className="text-muted-foreground text-sm ml-2">{currentNewsItem.source}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-3 leading-tight text-foreground">
                {currentNewsItem.headline}
              </h2>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                {currentNewsItem.summary}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('right')} className="text-foreground/80 hover:text-foreground hover:bg-card/50">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Daily Brief
              </Button>

              <div className="flex flex-col items-center space-y-2">
                <Button variant="ghost" size="sm" onClick={prevNews} className="text-foreground/80 hover:text-foreground hover:bg-card/50">
                  <ChevronDown className="w-4 h-4 rotate-180" />
                </Button>
                
                <Button variant="ghost" size="sm" onClick={nextNews} className="text-foreground/80 hover:text-foreground hover:bg-card/50">
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={() => setCurrentView('left')} className="text-foreground/80 hover:text-foreground hover:bg-card/50">
                AI Summary
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* AI Summary Page */}
        <div className="w-1/3 h-full bg-gradient-to-br from-background to-secondary/20 p-6 overflow-y-auto">
          {/* Hero Image */}
          <div className="mb-6">
            <img src={currentNewsItem.image} alt={currentNewsItem.headline} className="w-full h-48 object-cover rounded-lg shadow-lg" />
          </div>

          {/* Headline with highlighted keywords */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold leading-tight" dangerouslySetInnerHTML={{
              __html: highlightKeywords(currentNewsItem.headline)
            }} />
          </div>

          {/* Article content with highlighted keywords */}
          <div className="mb-6">
            <p className="text-muted-foreground leading-relaxed text-base" dangerouslySetInnerHTML={{
              __html: highlightKeywords(currentNewsItem.content)
            }} />
          </div>

          {/* Impact Analysis with bullet points */}
          <Card className="bg-card/80 border-accent/30 backdrop-blur-sm mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-accent flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {currentNewsItem.aiAnalysis.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2.5 mr-3 flex-shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Source */}
          <Card className="bg-card/60 border-primary/30 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-primary">Source</CardTitle>
            </CardHeader>
            <CardContent>
              <a href="#" className="text-accent hover:text-accent/80 underline" target="_blank" rel="noopener noreferrer">
                Read original article on {currentNewsItem.source}
              </a>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="ghost" onClick={() => setCurrentView('center')} className="text-muted-foreground hover:text-foreground hover:bg-card/50">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to News Feed
            </Button>
          </div>
        </div>
      </div>
    </div>;
};

export default Index;
