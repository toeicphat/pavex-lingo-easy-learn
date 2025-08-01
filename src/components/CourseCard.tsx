import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock } from "lucide-react";

interface CourseCardProps {
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

const CourseCard = ({ course }: { course: CourseCardProps }) => {
  const discount = course.discounted_price 
    ? Math.round((1 - course.discounted_price / course.price) * 100)
    : 0;

  return (
    <Card className="course-card group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-xl">
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {course.is_featured && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
              -{discount}%
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{course.rating}</span>
            <span>({course.total_ratings})</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.student_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration_hours}h</span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-4">
          By {course.instructor_name}
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {course.discounted_price ? (
              <>
                <span className="text-2xl font-bold text-primary">
                  ${course.discounted_price}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${course.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">
                ${course.price}
              </span>
            )}
          </div>
          <Button className="btn-primary">
            Enroll Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;