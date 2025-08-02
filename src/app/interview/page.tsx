'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateQuestions, evaluateAnswer, summarizeInterview, type EvaluateAnswerOutput, type SummarizeInterviewOutput } from '@/ai/flows/interview-coach';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ArrowLeft, ArrowRight, Bot, Lightbulb, MessageSquare, Sparkles, Star, Award, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type InterviewHistoryItem = {
    question: string;
    answer: string;
    feedback: EvaluateAnswerOutput;
};

export default function InterviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<EvaluateAnswerOutput | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<InterviewHistoryItem[]>([]);
  const [summary, setSummary] = useState<SummarizeInterviewOutput | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleStartInterview = async () => {
    if (!jobTitle) {
      toast({
        variant: 'destructive',
        title: 'Job Title Required',
        description: 'Please enter a job title to start the interview.',
      });
      return;
    }
    setIsLoading(true);
    setQuestions([]);
    try {
      const result = await generateQuestions({ jobTitle });
      setQuestions(result.questions);
      setIsStarted(true);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate questions. Please try again.',
      });
    }
    setIsLoading(false);
  };
  
  const handleEvaluateAnswer = async () => {
    if (!userAnswer) {
      toast({
        variant: 'destructive',
        title: 'Answer Required',
        description: 'Please provide an answer before getting feedback.',
      });
      return;
    }
    setIsEvaluating(true);
    setFeedback(null);
    try {
      const result = await evaluateAnswer({
        jobTitle,
        question: questions[currentQuestionIndex],
        answer: userAnswer,
      });
      setFeedback(result);
      setInterviewHistory([...interviewHistory, { question: questions[currentQuestionIndex], answer: userAnswer, feedback: result }]);
    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Evaluation Failed',
            description: 'Could not evaluate your answer. Please try again.',
        });
    }
    setIsEvaluating(false);
  }
  
  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setFeedback(null);
    } else {
        setIsFinished(true);
        setIsSummarizing(true);
        try {
            const result = await summarizeInterview({ jobTitle, interviewHistory });
            setSummary(result);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Summarization Failed',
                description: 'Could not generate your interview summary. Please try again.',
            });
        }
        setIsSummarizing(false);
    }
  }

  const handleReset = () => {
    setIsStarted(false);
    setIsFinished(false);
    setJobTitle('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setInterviewHistory([]);
    setSummary(null);
  }
  
  const renderStars = (score: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return '#ef4444'; // red-500
    if (score < 80) return '#f97316'; // orange-500
    return 'hsl(var(--primary))'; // green-500
  }

  const renderSetupScreen = () => (
     <div className="max-w-xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-heading text-3xl flex items-center justify-center">
                    <MessageSquare className="mr-3 h-8 w-8 text-primary" />
                    AI Mock Interview
                </CardTitle>
                <CardDescription className="text-center">
                    Practice for your next interview. Enter a job title, and our AI coach will ask you relevant questions and provide instant feedback.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="job-title-interview">Job Title You're Interviewing For</Label>
                    <Input
                        id="job-title-interview"
                        placeholder="e.g., Senior Software Engineer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <Button onClick={handleStartInterview} disabled={isLoading} className="w-full" size="lg">
                    {isLoading ? 'Preparing Questions...' : 'Start Interview'}
                </Button>
            </CardContent>
        </Card>
     </div>
  );
  
  const renderInterviewScreen = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-heading">Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                    <CardDescription>Read the question below and type your answer. Be as detailed as you would be in a real interview.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold mb-4">{questions[currentQuestionIndex]}</p>
                    <Textarea 
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        rows={10}
                        placeholder="Type your answer here..."
                        className="text-base"
                        disabled={isEvaluating}
                    />
                    <div className="mt-4 flex flex-wrap gap-2 justify-between">
                         <Button onClick={handleEvaluateAnswer} disabled={isEvaluating || !userAnswer || !!feedback}>
                            {isEvaluating ? 'Evaluating...' : 'Get Feedback'}
                            <Sparkles className="ml-2 h-4 w-4" />
                        </Button>
                         <Button onClick={handleNextQuestion} variant="secondary" disabled={isEvaluating || !feedback}>
                           {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish & See Report'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
             <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle className="font-heading flex items-center">
                        <Lightbulb className="mr-2 h-6 w-6 text-primary" />AI Feedback
                    </CardTitle>
                     <CardDescription>Our AI coach's evaluation of your answer will appear here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isEvaluating ? (
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    ) : feedback ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold">Your Score:</h4>
                                {renderStars(feedback.score)}
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p>{feedback.feedback}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            <p>Your feedback will be shown here once you submit an answer.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );

  const renderSummaryScreen = () => (
     <div className="max-w-3xl mx-auto">
        <Card>
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <Award className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-heading text-3xl">Interview Report Card</CardTitle>
                <CardDescription>
                    Here's a summary of your performance for the **{jobTitle}** mock interview.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 {isSummarizing ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Bot className="h-12 w-12 animate-bounce text-primary" />
                        <p className="mt-4 text-muted-foreground">Your personal AI coach is analyzing your results...</p>
                    </div>
                 ) : summary ? (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center">
                             <div className="w-48 h-48">
                                <CircularProgressbar
                                    value={summary.overallScore}
                                    text={`${summary.overallScore}`}
                                    styles={buildStyles({
                                        textSize: '20px',
                                        pathTransitionDuration: 0.5,
                                        pathColor: getScoreColor(summary.overallScore),
                                        textColor: getScoreColor(summary.overallScore),
                                        trailColor: 'hsl(var(--muted))',
                                    })}
                                />
                            </div>
                            <p className="text-xl font-bold mt-4">Overall Score</p>
                        </div>
                        
                        <div>
                            <h3 className="font-heading text-xl font-semibold mb-2">Performance Summary</h3>
                            <p className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none">{summary.summary}</p>
                        </div>

                         <div>
                            <h3 className="font-heading text-xl font-semibold mb-2">Key Suggestions for Improvement</h3>
                            <ul className="space-y-2">
                                {summary.suggestions.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                        <span className="text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                 ) : (
                    <p>Could not load summary.</p>
                 )}
            </CardContent>
        </Card>
     </div>
  );

  const renderContent = () => {
    if (isFinished) {
        return renderSummaryScreen();
    }
    if (isStarted) {
        return renderInterviewScreen();
    }
    return renderSetupScreen();
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-muted/40">
        <AppHeader auth={true} />
        <main className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button variant="outline" onClick={() => isStarted ? handleReset() : router.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                   {isStarted ? 'End Interview & Start Over' : 'Back to Dashboard'}
                </Button>
            </div>
            {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
}
