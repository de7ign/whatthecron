import CronTool from '@/components/cron-tool';
import Footer from '@/components/footer';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import LearnMore from '@/components/learn-more';

export default function Home() {
  return (
    <div className="bg-background min-h-screen transition-colors">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Tool Section */}
      <CronTool />

      {/* Learn More Section */}
      <LearnMore />

      {/* Footer */}
      <Footer />
    </div>
  );
}
