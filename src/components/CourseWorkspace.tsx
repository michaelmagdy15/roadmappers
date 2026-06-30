'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  CheckCircle, 
  Circle, 
  ChevronRight, 
  MessageSquare, 
  BookOpen, 
  Link as LinkIcon, 
  HelpCircle,
  FileText,
  Send,
  CheckSquare
} from 'lucide-react';
import { toggleLessonProgressAction, postDiscussionCommentAction } from '@/app/actions/course';

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string | null;
  content: string | null;
  sortOrder: number;
  createdAt: number;
}

interface Quiz {
  id: string;
  courseId: string;
  lessonId: string | null;
  title: string;
  createdAt: number;
}

interface CommentItem {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: number;
}

interface CourseWorkspaceProps {
  course: {
    id: string;
    title: string;
    description: string;
    whopProductId: string;
  };
  lessons: Lesson[];
  initialCompletedLessonIds: string[];
  quizzes: Quiz[];
  initialDiscussions: CommentItem[];
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
}

export default function CourseWorkspace({
  course,
  lessons,
  initialCompletedLessonIds,
  quizzes,
  initialDiscussions,
  currentUser,
}: CourseWorkspaceProps) {
  const router = useRouter();
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(initialCompletedLessonIds);
  const [discussionsList, setDiscussionsList] = useState<CommentItem[]>(initialDiscussions);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'notes' | 'qa' | 'resources'>('notes');
  
  // Mobile checklist overlay toggle
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  const activeLesson = lessons[activeLessonIndex];
  const activeLessonQuiz = quizzes.find(q => q.lessonId === activeLesson?.id);

  const progressPercentage = lessons.length > 0 
    ? Math.round((completedLessonIds.length / lessons.length) * 100) 
    : 0;

  const handleToggleComplete = async (lessonId: string) => {
    const isCompleted = completedLessonIds.includes(lessonId);
    
    // Optimistic UI update
    if (isCompleted) {
      setCompletedLessonIds(prev => prev.filter(id => id !== lessonId));
    } else {
      setCompletedLessonIds(prev => [...prev, lessonId]);
    }

    try {
      const res = await toggleLessonProgressAction(lessonId, !isCompleted);
      if (!res.success) {
        // Rollback on failure
        if (isCompleted) {
          setCompletedLessonIds(prev => [...prev, lessonId]);
        } else {
          setCompletedLessonIds(prev => prev.filter(id => id !== lessonId));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const tempComment = newComment;
    setNewComment('');

    try {
      const res = await postDiscussionCommentAction({
        courseId: course.id,
        lessonId: activeLesson?.id,
        comment: tempComment,
      });

      if (res.success && res.comment) {
        setDiscussionsList(prev => [res.comment!, ...prev]);
      } else {
        alert(res.error || 'Failed to post comment.');
        setNewComment(tempComment);
      }
    } catch (err) {
      console.error(err);
      setNewComment(tempComment);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] lg:h-[calc(100vh-48px)] overflow-hidden relative">
      
      {/* TIMELINE CHECKLIST PANEL - Left Column (Desktop Only) */}
      <aside className="hidden lg:flex flex-col w-80 glass-card p-6 h-full overflow-y-auto shrink-0 border-white/5 bg-[#0f172a]/20">
        <div className="mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-neon-cyan">
            Course Roadmap
          </span>
          <h2 className="font-headers text-lg font-bold text-white mt-1 truncate">{course.title}</h2>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-lavender">Progress</span>
              <span className="font-bold text-neon-cyan">{progressPercentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-violet to-neon-cyan transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Vertical Nodes List */}
        <div className="flex flex-col gap-1 relative pl-4 border-l border-white/10 ml-2 py-2">
          {lessons.map((lesson, idx) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const isActive = idx === activeLessonIndex;
            const hasQuiz = quizzes.some(q => q.lessonId === lesson.id);

            return (
              <div key={lesson.id} className="relative py-3 group">
                {/* Connector Dot */}
                <div 
                  onClick={() => handleToggleComplete(lesson.id)}
                  className={`absolute -left-[25px] top-[22px] h-4 w-4 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer z-10 ${
                    isCompleted 
                      ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan' 
                      : isActive 
                      ? 'border-neon-violet bg-[#09090b] shadow-[0_0_8px_rgba(139,92,246,0.6)]' 
                      : 'border-white/20 bg-[#09090b]'
                  }`}
                >
                  {isCompleted && <div className="h-1.5 w-1.5 bg-neon-cyan rounded-full" />}
                </div>

                {/* Node Box */}
                <div 
                  className={`flex justify-between items-center p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive 
                      ? 'border-neon-violet/30 bg-neon-violet/5 text-white shadow-[0_0_15px_rgba(139,92,246,0.05)]' 
                      : 'border-transparent bg-transparent hover:bg-white/5 text-muted-lavender'
                  }`}
                  onClick={() => setActiveLessonIndex(idx)}
                >
                  <div className="flex items-start gap-2.5 overflow-hidden">
                    <span className="text-xs font-bold font-headers mt-0.5 text-muted-lavender/50">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="flex flex-col overflow-hidden">
                      <h4 className="text-sm font-semibold truncate text-white leading-snug">{lesson.title}</h4>
                      <p className="text-[10px] text-muted-lavender/60 truncate mt-0.5">{lesson.description}</p>
                    </div>
                  </div>
                  
                  {hasQuiz && (
                    <span title="Includes Quiz">
                      <HelpCircle className="h-4 w-4 text-neon-cyan shrink-0 ml-2" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* MOBILE TIMELINE EXPANDER BAR - Pinned below player on mobile */}
      <div className="lg:hidden flex items-center justify-between p-4 glass-card mx-2 border-white/5">
        <div className="flex-1 overflow-hidden pr-4">
          <span className="text-[9px] uppercase font-bold text-neon-cyan">Currently Playing</span>
          <h3 className="font-headers text-sm font-bold text-white truncate">
            {activeLesson ? activeLesson.title : 'No Lessons'}
          </h3>
        </div>
        <button 
          onClick={() => setIsChecklistOpen(true)}
          className="btn-primary py-2 px-4 text-xs shrink-0 cursor-pointer"
        >
          View Checklist ({progressPercentage}%)
        </button>
      </div>

      {/* MOBILE OVERLAY DRAWER - For Roadmap Checklist */}
      {isChecklistOpen && (
        <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-80 bg-[#0f172a] border-l border-white/10 p-6 flex flex-col h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headers font-bold text-white text-lg">Roadmap Checklist</h3>
              <button 
                onClick={() => setIsChecklistOpen(false)}
                className="text-muted-lavender hover:text-white font-bold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
            
            {/* Replicated checklist list */}
            <div className="flex flex-col gap-1 relative pl-4 border-l border-white/10 ml-2 py-2">
              {lessons.map((lesson, idx) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                const isActive = idx === activeLessonIndex;

                return (
                  <div key={lesson.id} className="relative py-2.5">
                    <div 
                      onClick={() => handleToggleComplete(lesson.id)}
                      className={`absolute -left-[25px] top-[19px] h-4 w-4 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer z-10 ${
                        isCompleted 
                          ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan' 
                          : isActive 
                          ? 'border-neon-violet bg-[#09090b]' 
                          : 'border-white/20 bg-[#09090b]'
                      }`}
                    >
                      {isCompleted && <div className="h-1.5 w-1.5 bg-neon-cyan rounded-full" />}
                    </div>
                    <div 
                      className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                        isActive ? 'border-neon-violet/30 bg-neon-violet/5 text-white' : 'border-transparent text-muted-lavender'
                      }`}
                      onClick={() => {
                        setActiveLessonIndex(idx);
                        setIsChecklistOpen(false);
                      }}
                    >
                      <h4 className="text-xs font-semibold truncate text-white leading-snug">{lesson.title}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CORE CONTENT PANE - Center/Right Column */}
      <div className="flex-1 flex flex-col overflow-y-auto h-full px-2 lg:px-0">
        {activeLesson ? (
          <div className="flex flex-col gap-6">
            
            {/* ASPECT-RATIO VIDEO PLAYER WRAPPER */}
            <div className="w-full aspect-video glass-card border-white/10 overflow-hidden relative shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              {activeLesson.videoUrl ? (
                /* Simple check: If videoUrl is an iframe embed (like Bunny Stream), use iframe, otherwise HTML5 Video */
                activeLesson.videoUrl.includes('<iframe') || activeLesson.videoUrl.includes('embed.whop.com') || activeLesson.videoUrl.includes('iframe.mediadelivery.net') ? (
                  <div 
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ 
                      __html: activeLesson.videoUrl.startsWith('<iframe') 
                        ? activeLesson.videoUrl 
                        : `<iframe src="${activeLesson.videoUrl}" style="border: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%;" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowfullscreen="true"></iframe>`
                    }}
                  />
                ) : (
                  <video 
                    src={activeLesson.videoUrl} 
                    controls 
                    className="w-full h-full object-cover" 
                    playsInline 
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#0f172a]/40 text-muted-lavender p-6">
                  <Play className="h-12 w-12 text-muted-lavender/30" />
                  <span className="text-sm font-medium">No video attached to this step. Read the lesson notes below.</span>
                </div>
              )}
            </div>

            {/* TABBAR & DETAILS AREA */}
            <div className="flex flex-col glass-card border-white/5 p-6 mb-6">
              
              {/* Tabs list */}
              <div className="flex border-b border-white/5 pb-3 gap-6 mb-6">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex items-center gap-2 pb-1 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
                    activeTab === 'notes' ? 'border-neon-violet text-white' : 'border-transparent text-muted-lavender hover:text-white'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Lesson Notes
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`flex items-center gap-2 pb-1 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
                    activeTab === 'qa' ? 'border-neon-violet text-white' : 'border-transparent text-muted-lavender hover:text-white'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Step Q&A
                </button>
                {activeLessonQuiz && (
                  <button
                    onClick={() => router.push(`/dashboard/courses/${course.id}/quiz/${activeLessonQuiz.id}`)}
                    className="flex items-center gap-2 pb-1 text-sm font-semibold tracking-wide border-b-2 border-transparent text-neon-cyan hover:text-white transition-all cursor-pointer"
                  >
                    <CheckSquare className="h-4 w-4" />
                    Take Step Quiz
                  </button>
                )}
              </div>

              {/* Tab Panel Content */}
              {activeTab === 'notes' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="font-headers text-xl font-bold text-white mb-2">{activeLesson.title}</h2>
                  <p className="text-sm text-muted-lavender leading-relaxed mb-6">{activeLesson.description}</p>
                  
                  {activeLesson.content ? (
                    <div className="text-sm text-white/90 leading-relaxed bg-white/2.5 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                      {activeLesson.content}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-lavender/50 italic">No additional reading materials provided.</p>
                  )}
                </div>
              )}

              {activeTab === 'qa' && (
                <div className="flex flex-col gap-6">
                  {/* Discussion Form */}
                  <form onSubmit={handlePostComment} className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Ask a question or share a note..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-muted-lavender/50 outline-none focus:border-neon-violet/50 h-11"
                    />
                    <button 
                      type="submit" 
                      className="btn-primary w-11 h-11 flex items-center justify-center p-0 shrink-0 cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>

                  {/* Comments Feed */}
                  <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 hide-scrollbar">
                    {discussionsList
                      .filter(c => c.id !== undefined) // filter safety
                      .map((comment) => (
                        <div key={comment.id} className="flex items-start gap-3 bg-white/2.5 border border-white/5 p-3.5 rounded-xl">
                          <div className="h-7 w-7 rounded-full bg-neon-violet/10 border border-neon-violet/20 flex items-center justify-center text-xs font-bold text-neon-violet shrink-0 mt-0.5">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white">{comment.userName}</span>
                              <span className="text-[10px] text-muted-lavender/50">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-muted-lavender mt-1 leading-relaxed">{comment.comment}</p>
                          </div>
                        </div>
                      ))}
                    {discussionsList.length === 0 && (
                      <p className="text-center text-xs text-muted-lavender/40 py-6">
                        No questions asked yet. Be the first to start the discussion!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-muted-lavender">
            <BookOpen className="h-12 w-12 text-muted-lavender/25 mb-2" />
            <span className="text-sm font-medium">This course does not contain any lessons yet.</span>
          </div>
        )}
      </div>

    </div>
  );
}
