import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CourseCard from "./CourseCard";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  discounted_price?: number;
  rating: number;
  total_ratings: number;
  student_count: number;
  duration_hours: number;
  instructor_name: string;
  is_featured: boolean;
}

const FeaturedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('status', 'published')
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;

        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Online Courses</h2>
            <p className="text-muted-foreground text-lg">Master languages with our most popular courses</p>
          </div>
          <div className="course-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="course-card animate-pulse">
                <div className="h-48 bg-muted rounded-t-xl" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Online Courses</h2>
          <p className="text-muted-foreground text-lg">Master languages with our most popular courses</p>
        </div>
        
        <div className="course-grid">
          {courses.map((course, index) => (
            <div 
              key={course.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {courses.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;