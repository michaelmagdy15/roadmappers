'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitQuizAnswersAction } from '@/app/actions/quiz';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Award, 
  RefreshCw,
  Home
} from 'lucide-react';

interface Question {
  id: string;
  questionText: string;
  options: string; // JSON string array
  correctOptionIndex: number;
}

interface QuizRunnerProps {
  courseId: string;
  quiz: {
    id: string;
    title: string;
  };
  questions: Question[];
}

export default function QuizRunner({ courseId, quiz, questions }: QuizRunnerProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  
  // State for submissions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    correctCount: number;
    totalCount: number;
  } | null>(null);

  const activeQuestion = questions[currentQuestionIndex];
  
  // Parse options safely
  let optionsList: string[] = [];
  try {
    optionsList = activeQuestion ? JSON.parse(activeQuestion.options) : [];
  } catch (e) {
    console.error('Failed to parse options for question', activeQuestion?.id);
  }

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitQuizAnswersAction(quiz.id, answers);
      if (res.success && res.score !== undefined) {
        setResult({
          score: res.score,
          correctCount: res.correctCount || 0,
          totalCount: res.totalCount || questions.length
        });
      } else {
        alert(res.error || 'Failed to submit quiz.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
  };

  const isOptionSelected = (idx: number) => answers[activeQuestion?.id] === idx;
  const isQuestionAnswered = answers[activeQuestion?.id] !== undefined;

  if (result) {
    const isSuccess = result.score >= 85;
    return (
      <div className="w-full max-w-xl mx-auto py-8">
        <div className={`glass-card p-8 flex flex-col items-center text-center gap-8 shadow-2xl border-white/5 ${
          isSuccess ? 'shadow-[0_0_50px_rgba(6,182,212,0.15)] border-neon-cyan/20' : 'shadow-[0_0_50px_rgba(139,92,246,0.15)] border-neon-violet/10'
        }`}>
          <div className={`h-20 w-20 rounded-full flex items-center justify-center border-2 ${
            isSuccess 
              ? 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan animate-bounce' 
              : 'bg-neon-violet/10 border-neon-violet/30 text-neon-violet'
          }`}>
            <Award className="h-10 w-10" />
          </div>

          <div>
            <h1 className="font-headers text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Quiz Completed!
            </h1>
            <p className="text-muted-lavender text-sm max-w-md mx-auto">
              You scored <strong>{result.score}%</strong> by answering <strong>{result.correctCount} of {result.totalCount}</strong> questions correctly.
            </p>
          </div>

          {/* Talent placement notification */}
          {isSuccess ? (
            <div className="bg-neon-cyan/5 border border-neon-cyan/25 rounded-2xl p-5 text-left max-w-md flex gap-3">
              <Check className="h-5 w-5 text-neon-cyan shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white text-sm">Talent Roster Eligible!</h4>
                <p className="text-xs text-muted-lavender mt-1 leading-relaxed">
                  Congratulations! Because your score is 85% or higher, your profile is eligible for our manual recruiter job placement roster. Make sure your Profile is fully updated!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-neon-violet/5 border border-neon-violet/25 rounded-2xl p-5 text-left max-w-md flex gap-3">
              <AlertCircle className="h-5 w-5 text-neon-violet shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white text-sm">Below Placement Threshold</h4>
                <p className="text-xs text-muted-lavender mt-1 leading-relaxed">
                  You scored below the 85% career placement requirement. Don't worry! Review the materials and retry the quiz to improve your score.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4 w-full mt-4">
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 rounded-full text-xs font-bold text-white h-11 transition-all cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" /> Retry Quiz
            </button>
            <button
              onClick={() => router.push(`/dashboard/courses/${courseId}`)}
              className="flex-1 btn-primary h-11 flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" /> Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      {/* Quiz details */}
      <div className="mb-6 flex justify-between items-baseline px-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neon-violet">Course Quiz</span>
          <h1 className="font-headers text-xl md:text-2xl font-bold text-white mt-0.5">{quiz.title}</h1>
        </div>
        <span className="text-xs font-bold text-muted-lavender/60">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      {activeQuestion ? (
        <div className="glass-card p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
            <div 
              className="h-full bg-gradient-to-r from-neon-violet to-neon-cyan transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="mt-2">
            <h2 className="text-base md:text-lg font-semibold text-white leading-relaxed">
              {activeQuestion.questionText}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {optionsList.map((option, idx) => {
              const selected = isOptionSelected(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border text-left text-sm md:text-base transition-all cursor-pointer flex items-center justify-between ${
                    selected 
                      ? 'border-neon-violet bg-neon-violet/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                      : 'border-white/5 bg-white/2.5 hover:bg-white/5 text-muted-lavender hover:text-white'
                  }`}
                >
                  <span>{option}</span>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ml-4 ${
                    selected ? 'border-neon-violet bg-neon-violet text-white' : 'border-white/20'
                  }`}>
                    {selected && <Check className="h-3 w-3" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 border-t border-white/5 pt-6 mt-2 justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-lavender hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!isQuestionAnswered || isSubmitting}
              className="btn-primary h-11 px-6 flex items-center justify-center gap-2 text-xs"
            >
              {currentQuestionIndex === questions.length - 1 ? (
                isSubmitting ? 'Grading...' : 'Submit Quiz'
              ) : (
                <>Next <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card p-8 text-center text-muted-lavender">
          No questions found.
        </div>
      )}
    </div>
  );
}
