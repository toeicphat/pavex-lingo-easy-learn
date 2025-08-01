import { Button } from "@/components/ui/button";
import { Play, Users, BookOpen, Award } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="hero-section py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Master Languages{" "}
              <span className="gradient-text">Online</span>{" "}
              Without Limits
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              • Comprehensive language tests: IELTS, TOEIC, HSK, TOPIK, and more<br/>
              • Interactive interface, real-time lessons with native speakers<br/>
              • Choose your own part and practice time according to your needs<br/>
              • Multiple tools: highlight, take notes, dictionary...<br/>
              • Automatic scoring report + detailed score analysis for each test
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="btn-primary text-lg px-8 py-4 h-auto">
                <Play className="w-5 h-5 mr-2" />
                Start Learning Now
              </Button>
              <Button variant="outline" className="text-lg px-8 py-4 h-auto">
                View Courses
              </Button>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6 animate-fade-in">
            <div className="stats-card">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">Active Students</div>
            </div>
            <div className="stats-card">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">3000+</div>
              <div className="text-sm text-muted-foreground">Practice Tests</div>
            </div>
            <div className="stats-card">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="stats-card">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <Play className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Learning Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;