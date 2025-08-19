import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Headphones, 
  BookOpen, 
  FileText, 
  Target,
  ArrowRight,
  Clock,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Practice = () => {
  const practiceActivities = [
    {
      title: "Dictation Practice",
      description: "Listen to audio clips and type what you hear to improve your listening skills",
      icon: Headphones,
      difficulty: "All Levels",
      duration: "10-30 min",
      exercises: 25,
      link: "/practice/dictation",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Reading Comprehension",
      description: "Practice reading passages and answer questions to boost comprehension",
      icon: BookOpen,
      difficulty: "Intermediate",
      duration: "15-45 min",
      exercises: 18,
      link: "#",
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "Listening Comprehension",
      description: "Listen to conversations and answer multiple choice questions",
      icon: Target,
      difficulty: "All Levels",
      duration: "20-40 min",
      exercises: 32,
      link: "#",
      color: "from-purple-500/20 to-indigo-500/20"
    },
    {
      title: "Grammar & Vocabulary",
      description: "Fill in the blanks and complete sentences with proper grammar",
      icon: FileText,
      difficulty: "Beginner",
      duration: "5-20 min",
      exercises: 45,
      link: "#",
      color: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            TOEIC Practice Activities
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Improve your English skills with our comprehensive practice exercises designed specifically for TOEIC preparation
          </p>
        </div>

        {/* Practice Activities Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {practiceActivities.map((activity, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${activity.color}`} />
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${activity.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <activity.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{activity.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {activity.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <CardDescription className="text-base mb-6 leading-relaxed">
                  {activity.description}
                </CardDescription>

                {/* Activity Stats */}
                <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>{activity.exercises} exercises</span>
                  </div>
                </div>

                {/* Action Button */}
                {activity.link === "#" ? (
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    disabled
                  >
                    Coming Soon
                  </Button>
                ) : (
                  <Link to={activity.link} className="block">
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground group-hover:shadow-lg transition-all"
                    >
                      Start Practice
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Track Your Progress
            </h2>
            <p className="text-muted-foreground mb-6">
              Sign up to save your progress, track your scores, and get personalized recommendations
            </p>
            <Button size="lg" className="btn-primary">
              Create Account
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Practice;