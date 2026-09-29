import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Send,
  Flag,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  Save,
  Check,
  XCircle,
  BookOpen,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import interviewService from '../services/interviewService';
import { useAuth } from '../context/AuthContext';

export default function MockInterviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Screen Stages: 'config' | 'in_progress' | 'completed'
  const [stage, setStage] = useState('config');

  // Setup Configuration
  const [config, setConfig] = useState({
    role: user?.targetRole || 'Software Developer',
    difficulty: user?.preferredDifficulty || 'Intermediate',
    questionCount: 3,
    timerMinutes: 15,
  });

  // Active Session State
  const [session, setSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnswerSaved, setIsAnswerSaved] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // AI Evaluation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins default
  const timerRef = useRef(null);

  // Confirmation Modals
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  // Initialize timer when moving to 'in_progress'
  useEffect(() => {
    if (stage === 'in_progress' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // Start interview session handler
  const handleStartInterview = async () => {
    setLoading(true);
    setError(null);
    setHasEvaluated(false);

    try {
      const data = await interviewService.createSession({
        role: config.role,
        difficulty: config.difficulty,
        questionCount: config.questionCount,
        timerMinutes: config.timerMinutes,
      });

      if (data.success && data.session) {
        setSession(data.session);
        setCurrentIndex(0);
        setTimeLeft(data.session.timerMinutes * 60);

        // Pre-fill answers map
        const initialAnswers = {};
        data.session.questions.forEach((q, idx) => {
          initialAnswers[idx] = q.userAnswer || '';
        });
        setAnswers(initialAnswers);
        setStage('in_progress');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to launch interview session. Please verify backend connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle student typing in answer textarea
  const handleAnswerChange = (e) => {
    const val = e.target.value;
    setAnswers((prev) => ({ ...prev, [currentIndex]: val }));
    setIsAnswerSaved(false);
  };

  // Save current answer to backend
  const handleSaveDraft = async () => {
    if (!session) return;
    try {
      const currentAns = answers[currentIndex] || '';
      await interviewService.saveAnswer(session._id, {
        questionIndex: currentIndex,
        answer: currentAns,
        timeRemainingSeconds: timeLeft,
      });
      setIsAnswerSaved(true);
    } catch (err) {
      console.warn('Failed to save answer draft', err);
    }
  };

  // Next Question
  const handleNext = async () => {
    await handleSaveDraft();
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Previous Question
  const handlePrev = async () => {
    await handleSaveDraft();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Auto finish when timer runs out
  const handleAutoFinish = async () => {
    alert('Time has expired! Submitting your interview responses for evaluation...');
    await handleCompleteInterview();
  };

  // Complete interview handler
  const handleCompleteInterview = async () => {
    setShowFinishConfirm(false);
    setLoading(true);
    try {
      await handleSaveDraft();
      const data = await interviewService.finishSession(session._id, {
        timeRemainingSeconds: timeLeft,
      });

      if (data.success) {
        setSession(data.session);
        setStage('completed');
      }
    } catch (err) {
      alert('Error finalizing interview session: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger AI Evaluation on all session answers
  const handleEvaluateAI = async () => {
    if (!session) return;
    setIsEvaluating(true);
    try {
      const data = await interviewService.evaluateSession(session._id);
      if (data.success && data.session) {
        setSession(data.session);
        setHasEvaluated(true);
      }
    } catch (err) {
      alert('Evaluation error: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsEvaluating(false);
    }
  };

  const toggleCard = (idx) => {
    setExpandedCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const countWords = (str) => {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  };

  const currentQ = session?.questions[currentIndex];
  const answeredCount = Object.values(answers).filter((a) => a && a.trim().length > 0).length;

  // ==========================================
  // STAGE 1: CONFIGURATION / SETUP SCREEN
  // ==========================================
  if (stage === 'config') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="primary" size="lg" className="gap-1.5 shadow-sm">
            <Layers className="w-4 h-4 text-indigo-600" />
            Interview Simulation Engine
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Configure Your Mock Interview
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Simulate realistic placement rounds with timed questions, structured text answers, and instant AI rubric feedback.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <Card className="space-y-6 shadow-md border-slate-200">
          {/* Role Track */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">
              1. Select Placement Track
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Software Developer', label: '💻 SDE Track' },
                { name: 'Data Analyst', label: '📊 Data Analyst' },
                { name: 'ECE / Core Electronics', label: '⚡ ECE Core' },
              ].map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => setConfig({ ...config, role: r.name })}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    config.role === r.name
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">
              2. Target Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setConfig({ ...config, difficulty: diff })}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    config.difficulty === diff
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count & Timer Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Number of Questions
              </label>
              <select
                value={config.questionCount}
                onChange={(e) =>
                  setConfig({ ...config, questionCount: parseInt(e.target.value, 10) })
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={3}>3 Questions (Quick Drill ~ 10 mins)</option>
                <option value={5}>5 Questions (Standard Mock ~ 15 mins)</option>
                <option value={10}>10 Questions (Full Round ~ 30 mins)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Timer Duration (Minutes)
              </label>
              <select
                value={config.timerMinutes}
                onChange={(e) =>
                  setConfig({ ...config, timerMinutes: parseInt(e.target.value, 10) })
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes (Recommended)</option>
                <option value={30}>30 Minutes</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartInterview}
              isLoading={loading}
              leftIcon={Play}
              className="w-full sm:w-auto shadow-md shadow-indigo-100"
            >
              Start Timed Interview
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ==========================================
  // STAGE 2: LIVE INTERVIEW RUNNER SCREEN
  // ==========================================
  if (stage === 'in_progress' && session && currentQ) {
    const isLastQuestion = currentIndex === session.questions.length - 1;
    const progressPercent = Math.round(((currentIndex + 1) / session.questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Control Bar: Timer & Progress */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge
              variant={
                session.role === 'Software Developer'
                  ? 'sde'
                  : session.role === 'Data Analyst'
                  ? 'data'
                  : 'ece'
              }
              size="sm"
            >
              {session.role}
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              Question {currentIndex + 1} of {session.questions.length}
            </span>
          </div>

          {/* Timer Display */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
              timeLeft < 120
                ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                : timeLeft < 300
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExitConfirm(true)}
              className="text-slate-500 hover:text-red-600"
            >
              Quit Session
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowFinishConfirm(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Finish Interview
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-1.5 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Prompt Card */}
        <Card className="space-y-4 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Topic: {currentQ.topic}
            </span>
            <Badge variant={currentQ.difficulty.toLowerCase()} size="sm">
              {currentQ.difficulty}
            </Badge>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {currentQ.questionText}
          </h2>

          {/* Hints Accordion */}
          {currentQ.hints && currentQ.hints.length > 0 && (
            <div className="pt-2">
              <details className="text-xs text-slate-500 group">
                <summary className="cursor-pointer font-medium text-amber-700 hover:text-amber-800 list-none flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Stuck? Click for Interviewer Hint</span>
                </summary>
                <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900 space-y-1">
                  {currentQ.hints.map((h, i) => (
                    <p key={i}>• {h}</p>
                  ))}
                </div>
              </details>
            </div>
          )}
        </Card>

        {/* Technical Answer Textarea Area */}
        <Card className="space-y-3 border-slate-200">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Your Technical Answer:
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{countWords(answers[currentIndex] || '')} words</span>
              <span>•</span>
              <span className={isAnswerSaved ? 'text-emerald-600 font-medium' : 'text-amber-600'}>
                {isAnswerSaved ? 'Draft saved' : 'Unsaved changes'}
              </span>
            </div>
          </div>

          <textarea
            rows={8}
            value={answers[currentIndex] || ''}
            onChange={handleAnswerChange}
            onBlur={handleSaveDraft}
            placeholder="Structure your answer clearly. Mention key terminology, algorithms, trade-offs, and practical engineering examples..."
            className="w-full p-4 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed resize-y"
          />

          {/* Footer Controls for Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={ChevronLeft}
              disabled={currentIndex === 0}
              onClick={handlePrev}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                leftIcon={Save}
                onClick={handleSaveDraft}
                className="text-slate-600"
              >
                Save Answer
              </Button>

              {isLastQuestion ? (
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={Send}
                  onClick={() => setShowFinishConfirm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Submit Final Interview
                </Button>
              ) : (
                <Button variant="primary" size="md" rightIcon={ChevronRight} onClick={handleNext}>
                  Next Question
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Quit Confirmation Dialog */}
        {showExitConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">Quit Interview Session?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to exit? Your answers entered so far will remain saved in your history, but the session will be marked as finished.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowExitConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={() => navigate('/dashboard')}>
                  Quit to Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Finish Interview Confirmation Dialog */}
        {showFinishConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">Submit Mock Interview?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have answered <strong>{answeredCount}</strong> out of{' '}
                <strong>{session.questions.length}</strong> questions.
                {answeredCount < session.questions.length && (
                  <span className="block mt-1 text-amber-600 font-medium">
                    ⚠️ You have unanswered questions. Unanswered questions will receive 0 score.
                  </span>
                )}
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowFinishConfirm(false)}>
                  Keep Answering
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={loading}
                  onClick={handleCompleteInterview}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Confirm & Submit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // STAGE 3: SESSION COMPLETED & AI SCORECARD SCREEN
  // ==========================================
  if (stage === 'completed' && session) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900">
            Mock Interview Completed!
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Session recorded for <strong>{session.role}</strong> ({session.difficulty} level).
          </p>
        </div>

        {/* Performance Overview Card */}
        <Card className="p-6 space-y-6 border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Session Metrics</h2>
              <p className="text-xs text-slate-500">
                Duration: {Math.max(1, Math.round(session.durationSeconds / 60))} mins • {session.questions.length} questions attempted
              </p>
            </div>

            {hasEvaluated ? (
              <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-600 block">
                    AI Rubric Score
                  </span>
                  <span className="text-2xl font-black text-indigo-950">
                    {session.overallScore} / 10
                  </span>
                </div>
                <Badge
                  variant={
                    session.overallScore >= 8.0
                      ? 'success'
                      : session.overallScore >= 6.0
                      ? 'primary'
                      : 'warning'
                  }
                  size="md"
                >
                  {session.overallScore >= 8.0
                    ? 'Excellent'
                    : session.overallScore >= 6.0
                    ? 'Good'
                    : 'Needs Revision'}
                </Badge>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                leftIcon={Sparkles}
                isLoading={isEvaluating}
                onClick={handleEvaluateAI}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200"
              >
                {isEvaluating ? 'Evaluating with AI...' : 'Evaluate with AI Rubric'}
              </Button>
            )}
          </div>

          {/* Quick Stat Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Questions</span>
              <p className="text-xl font-black text-slate-900">{session.questions.length}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Answered</span>
              <p className="text-xl font-black text-emerald-600">{answeredCount}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Skipped</span>
              <p className="text-xl font-black text-amber-600">
                {session.questions.length - answeredCount}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Time Used</span>
              <p className="text-xl font-black text-indigo-600">
                {Math.max(1, Math.round(session.durationSeconds / 60))}m
              </p>
            </div>
          </div>

          {/* Detailed Question Review & AI Evaluation Scorecards */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              {hasEvaluated ? 'Question-by-Question AI Rubric Breakdown:' : 'Candidate Responses:'}
            </h3>

            {session.questions.map((q, idx) => {
              const evalData = q.evaluation;
              const isExpanded = !!expandedCards[idx];

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm transition-all"
                >
                  {/* Card Header / Summary Row */}
                  <div
                    onClick={() => toggleCard(idx)}
                    className="p-4 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">
                          {q.questionText}
                        </p>
                        <span className="text-[11px] text-slate-500">{q.topic}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {evalData ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">
                            {evalData.score} / 10
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({evalData.technicalCorrectness}% accuracy)
                          </span>
                        </div>
                      ) : (
                        <Badge variant={q.isAnswered ? 'success' : 'warning'} size="sm">
                          {q.isAnswered ? 'Answered' : 'Skipped'}
                        </Badge>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Card Expanded Detail Body */}
                  {isExpanded && (
                    <div className="p-5 space-y-4 border-t border-slate-200 text-xs">
                      {/* Candidate Submitted Answer */}
                      <div className="space-y-1">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                          Your Submitted Answer:
                        </span>
                        <div className="p-3 bg-slate-50 rounded-lg text-slate-800 font-mono leading-relaxed border border-slate-200">
                          {q.userAnswer && q.userAnswer.trim().length > 0 ? (
                            q.userAnswer
                          ) : (
                            <span className="text-slate-400 italic">
                              No answer submitted for this question.
                            </span>
                          )}
                        </div>
                      </div>

                      {/* AI Evaluation Rubric Breakdown (If evaluated) */}
                      {evalData && (
                        <div className="space-y-3 pt-2">
                          {/* AI Feedback Paragraph */}
                          <div className="p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-200 space-y-1.5">
                            <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                              AI Interviewer Evaluation:
                            </span>
                            <p className="text-slate-700 leading-relaxed font-sans">
                              {evalData.feedback}
                            </p>
                          </div>

                          {/* Missing Concepts Alert */}
                          {evalData.missingConcepts && evalData.missingConcepts.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="font-bold text-amber-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Missing Concepts to Revise:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {evalData.missingConcepts.map((mc, mIdx) => (
                                  <span
                                    key={mIdx}
                                    className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium"
                                  >
                                    ⚠️ {mc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Strengths */}
                          {evalData.strengths && evalData.strengths.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Positives in Answer:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {evalData.strengths.map((st, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                                  >
                                    ✓ {st}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Recommended Placement Model Answer */}
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Technical Model Answer:
                        </span>
                        <div className="p-3 bg-emerald-50/40 rounded-lg text-slate-800 leading-relaxed border border-emerald-100">
                          {evalData?.modelAnswer || q.hints?.join(', ') || 'Refer to Question Bank for full solution.'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setStage('config');
                setSession(null);
                setHasEvaluated(false);
              }}
              leftIcon={RotateCcw}
            >
              Start Another Session
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
