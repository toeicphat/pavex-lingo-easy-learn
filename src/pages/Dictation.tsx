import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  Save, 
  Headphones,
  ArrowLeft,
  Volume2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dictation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);
  const { toast } = useToast();

  // Admin form states
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchExercises();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();
      
      setIsAdmin(profile?.is_admin || false);
    }
  };

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('dictation_exercises')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExercises(data || []);
      if (data && data.length > 0) {
        setSelectedExercise(data[0]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch exercises",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !selectedExercise) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const handleCheckAnswer = () => {
    setShowAnswer(true);
  };

  const calculateAccuracy = () => {
    if (!selectedExercise || !userInput.trim()) return 0;
    
    const original = selectedExercise.transcript.toLowerCase().trim();
    const input = userInput.toLowerCase().trim();
    
    const originalWords = original.split(/\s+/);
    const inputWords = input.split(/\s+/);
    
    let correct = 0;
    const maxLength = Math.max(originalWords.length, inputWords.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (originalWords[i] === inputWords[i]) {
        correct++;
      }
    }
    
    return Math.round((correct / originalWords.length) * 100);
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAudioFile(file);
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    if (!audioFile || !title || !transcript) {
      toast({
        title: "Error", 
        description: "Please fill all fields and upload an audio file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload audio file
      const fileName = `${Date.now()}_${audioFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, audioFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName);

      // Create exercise record
      const { error: insertError } = await supabase
        .from('dictation_exercises')
        .insert({
          title,
          transcript,
          difficulty_level: difficulty,
          audio_url: urlData.publicUrl,
          duration_seconds: null, // Will be updated later if needed
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Exercise created successfully!",
      });

      // Reset form
      setTitle("");
      setTranscript("");
      setDifficulty("beginner");
      setAudioFile(null);
      
      // Refresh exercises
      await fetchExercises();

    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading exercises...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/practice" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Practice
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dictation Practice</h1>
              <p className="text-muted-foreground">Listen carefully and type what you hear</p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <Tabs defaultValue="practice" className="max-w-6xl mx-auto">
            <TabsList className="mb-8">
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="admin">Manage Exercises</TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Dictation Exercise</CardTitle>
                  <CardDescription>
                    Upload audio files and create exercises for students to practice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateExercise} className="space-y-6">
                    <div>
                      <Label htmlFor="title">Exercise Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Business Meeting Conversation"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="audio">Audio File</Label>
                      <Input
                        id="audio"
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        required
                      />
                      {audioFile && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Selected: {audioFile.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="transcript">Transcript</Label>
                      <Textarea
                        id="transcript"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Enter the exact transcript of the audio..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={uploading} className="w-full">
                      {uploading ? "Creating Exercise..." : "Create Exercise"}
                      <Save className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="practice">
              {exercises.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Headphones className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No exercises available</h3>
                    <p className="text-muted-foreground">Check back later for new dictation exercises</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {/* Exercise List */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Available Exercises</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {exercises.map((exercise) => (
                          <div
                            key={exercise.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedExercise?.id === exercise.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => {
                              setSelectedExercise(exercise);
                              setUserInput("");
                              setShowAnswer(false);
                              setIsPlaying(false);
                            }}
                          >
                            <h4 className="font-medium mb-1">{exercise.title}</h4>
                          <Badge variant="outline">
                            {exercise.difficulty_level}
                          </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Practice Area */}
                  <div className="lg:col-span-2">
                    {selectedExercise && (
                      <div className="space-y-6">
                        {/* Audio Player */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Volume2 className="w-5 h-5" />
                              {selectedExercise.title}
                            </CardTitle>
                            <CardDescription>
                              Listen to the audio and type what you hear below
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <audio
                              ref={audioRef}
                              src={selectedExercise.audio_url}
                              onEnded={() => setIsPlaying(false)}
                              onLoadedData={() => {
                                // Audio loaded successfully
                              }}
                            />
                            
                            <div className="flex items-center gap-4">
                              <Button
                                onClick={handlePlayPause}
                                size="lg"
                                className="bg-gradient-to-r from-primary to-primary/90"
                              >
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                {isPlaying ? 'Pause' : 'Play'}
                              </Button>
                              
                              <Button
                                onClick={handleRestart}
                                variant="outline"
                                size="lg"
                              >
                                <RotateCcw className="w-5 h-5 mr-2" />
                                Restart
                              </Button>

                              <Badge variant="secondary">
                                {selectedExercise.difficulty_level}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Input Area */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Your Answer</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Textarea
                              value={userInput}
                              onChange={(e) => setUserInput(e.target.value)}
                              placeholder="Start typing what you hear..."
                              rows={4}
                              className="w-full"
                            />
                            
                            <Button 
                              onClick={handleCheckAnswer}
                              disabled={!userInput.trim()}
                              className="w-full"
                            >
                              Check Answer
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Results */}
                        {showAnswer && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                {calculateAccuracy() >= 80 ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-500" />
                                )}
                                Results
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="text-2xl font-bold">
                                  {calculateAccuracy()}%
                                </div>
                                <div className="text-muted-foreground">
                                  Accuracy Score
                                </div>
                              </div>
                              
                              <div>
                                <Label className="font-semibold">Correct Answer:</Label>
                                <div className="bg-muted/50 p-3 rounded-lg mt-1">
                                  {selectedExercise.transcript}
                                </div>
                              </div>
                              
                              <div>
                                <Label className="font-semibold">Your Answer:</Label>
                                <div className="bg-muted/30 p-3 rounded-lg mt-1">
                                  {userInput}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {!isAdmin && (
          <>
            {exercises.length === 0 ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="py-12 text-center">
                  <Headphones className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No exercises available</h3>
                  <p className="text-muted-foreground">Check back later for new dictation exercises</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Exercise List */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Available Exercises</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedExercise?.id === exercise.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => {
                            setSelectedExercise(exercise);
                            setUserInput("");
                            setShowAnswer(false);
                            setIsPlaying(false);
                          }}
                        >
                          <h4 className="font-medium mb-1">{exercise.title}</h4>
                        <Badge variant="outline">
                          {exercise.difficulty_level}
                        </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Practice Area */}
                <div className="lg:col-span-2">
                  {selectedExercise && (
                    <div className="space-y-6">
                      {/* Audio Player */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Volume2 className="w-5 h-5" />
                            {selectedExercise.title}
                          </CardTitle>
                          <CardDescription>
                            Listen to the audio and type what you hear below
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <audio
                            ref={audioRef}
                            src={selectedExercise.audio_url}
                            onEnded={() => setIsPlaying(false)}
                            onLoadedData={() => {
                              // Audio loaded successfully
                            }}
                          />
                          
                          <div className="flex items-center gap-4">
                            <Button
                              onClick={handlePlayPause}
                              size="lg"
                              className="bg-gradient-to-r from-primary to-primary/90"
                            >
                              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                              {isPlaying ? 'Pause' : 'Play'}
                            </Button>
                            
                            <Button
                              onClick={handleRestart}
                              variant="outline"
                              size="lg"
                            >
                              <RotateCcw className="w-5 h-5 mr-2" />
                              Restart
                            </Button>

                            <Badge variant="secondary">
                              {selectedExercise.difficulty_level}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Input Area */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Your Answer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Start typing what you hear..."
                            rows={4}
                            className="w-full"
                          />
                          
                          <Button 
                            onClick={handleCheckAnswer}
                            disabled={!userInput.trim()}
                            className="w-full"
                          >
                            Check Answer
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Results */}
                      {showAnswer && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              {calculateAccuracy() >= 80 ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                              Results
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="text-2xl font-bold">
                                {calculateAccuracy()}%
                              </div>
                              <div className="text-muted-foreground">
                                Accuracy Score
                              </div>
                            </div>
                            
                            <div>
                              <Label className="font-semibold">Correct Answer:</Label>
                              <div className="bg-muted/50 p-3 rounded-lg mt-1">
                                {selectedExercise.transcript}
                              </div>
                            </div>
                            
                            <div>
                              <Label className="font-semibold">Your Answer:</Label>
                              <div className="bg-muted/30 p-3 rounded-lg mt-1">
                                {userInput}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dictation;