-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-files', 'audio-files', true);

-- Create dictation_exercises table
CREATE TABLE public.dictation_exercises (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    transcript TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    duration_seconds INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dictation_exercises ENABLE ROW LEVEL SECURITY;

-- Create policies for dictation_exercises
CREATE POLICY "Dictation exercises are viewable by everyone" 
ON public.dictation_exercises 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage dictation exercises" 
ON public.dictation_exercises 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id::text = auth.uid()::text 
    AND profiles.is_admin = true
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dictation_exercises_updated_at
BEFORE UPDATE ON public.dictation_exercises
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage policies for audio files
CREATE POLICY "Audio files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio-files');

CREATE POLICY "Admins can upload audio files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
    bucket_id = 'audio-files' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.user_id::text = auth.uid()::text 
        AND profiles.is_admin = true
    )
);

CREATE POLICY "Admins can update audio files" 
ON storage.objects 
FOR UPDATE 
USING (
    bucket_id = 'audio-files' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.user_id::text = auth.uid()::text 
        AND profiles.is_admin = true
    )
);

CREATE POLICY "Admins can delete audio files" 
ON storage.objects 
FOR DELETE 
USING (
    bucket_id = 'audio-files' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.user_id::text = auth.uid()::text 
        AND profiles.is_admin = true
    )
);