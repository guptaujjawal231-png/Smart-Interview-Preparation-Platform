import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Sparkles,
  BookOpen,
  Award,
  X,
  Play,
  AlertTriangle,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import interviewService from '../services/interviewService';

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Modal State
  const [selectedSession, setSelectedSession] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Deletion Modal State
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await interviewService.getHistory();
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (err) {
      setError('Failed to load past interview history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenReview = async (sessionId) => {
    setLoadingDetails(true);
    try {
      const data = await interviewService.getSession(sessionId);
      if (data.success && data.session) {
        setSelectedSession(data.session);
      }
    } catch (err) {
      alert('Failed to load session details.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return;
    setDeleting(true);
    try {
      await interviewService.deleteSession(sessionToDelete);
      setSessions((prev) => prev.filter((s) => s._id !== sessionToDelete));
      setSessionToDelete(null);
      if (selectedSession && selectedSession._id === sessionToDelete) {
        setSelectedSession(null);
      }
    } catch (err) {
      alert('Failed to delete interview session.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" /> Chronological Practice Records
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Interview History & AI Rubrics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review past mock interview responses, track score progression, and revisit missing concepts.
          </p>
        </div>

        <Link to="/interview">
          <Button variant="primary" size="md" leftIcon={Play} className="shadow-md shadow-indigo-100">
            Start New Mock Session
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" message="Loading interview session history..." />
        </div>
      ) : error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Could not load history"
          description={error}
          actionLabel="Retry"
          onAction={fetchHistory}
        />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No interview sessions recorded yet"
          description="Complete your first mock interview simulation to view rubric scores and AI feedback here."
          actionLabel="Start First Mock Session"
          onAction={() => (window.location.href = '/interview')}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing {sessions.length} recorded practice sessions</span>
            <span>Click any session to inspect AI rubric feedback</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sessions.map((s) => (
              <Card
                key={s._id}
                hoverEffect
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        s.role === 'Software Developer'
                          ? 'sde'
                          : s.role === 'Data Analyst'
                          ? 'data'
                          : 'ece'
                      }
                      size="sm"
                    >
                      {s.role}
                    </Badge>
                    <Badge variant={s.difficulty?.toLowerCase() || 'intermediate'} size="sm">
                      {s.difficulty}
                    </Badge>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(s.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>{s.totalQuestions} Questions</span>
                    <span>•</span>
                    <span>
                      Duration: {Math.max(1, Math.round(s.durationSeconds / 60))} mins
                    </span>
                    <span>•</span>
                    <span className="capitalize font-semibold text-slate-800">
                      Status: {s.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">
                      {s.overallScore} / 10
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      AI Score
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReview(s._id)}
                      rightIcon={ChevronRight}
                    >
                      Review Rubric
                    </Button>
                    <button
                      onClick={() => setSessionToDelete(s._id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Review Rubric Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8 p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {selectedSession.role} ({selectedSession.difficulty})
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Session Rubric & Answer Review
                </h2>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Score Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-4 rounded-xl text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-300 uppercase font-semibold">
                  Overall Performance
                </span>
                <p className="text-2xl font-black">{selectedSession.overallScore} / 10</p>
              </div>
              <Badge variant="primary" size="md">
                {selectedSession.questions.length} Questions Evaluated
              </Badge>
            </div>

            {/* Questions Detailed Breakdown */}
            <div className="space-y-4">
              {selectedSession.questions.map((q, idx) => {
                const evalData = q.evaluation;
                return (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase">
                        Question #{idx + 1} • {q.topic}
                      </span>
                      {evalData && (
                        <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                          {evalData.score} / 10 ({evalData.technicalCorrectness}% accuracy)
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{q.questionText}</h4>

                    {/* Candidate Answer */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Candidate Answer:
                      </span>
                      <p className="p-3 bg-white rounded-lg text-xs text-slate-800 font-mono border border-slate-200 leading-relaxed">
                        {q.userAnswer || <span className="italic text-slate-400">Question was skipped</span>}
                      </p>
                    </div>

                    {/* Feedback & Missing Concepts */}
                    {evalData && (
                      <div className="space-y-2 pt-1 text-xs">
                        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-slate-800 leading-relaxed">
                          <strong className="text-indigo-900 block mb-1">AI Evaluator Feedback:</strong>
                          {evalData.feedback}
                        </div>

                        {evalData.missingConcepts && evalData.missingConcepts.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] font-bold text-amber-800 uppercase">Missing:</span>
                            {evalData.missingConcepts.map((mc, mIdx) => (
                              <span key={mIdx} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium">
                                ⚠️ {mc}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-200 text-xs">
                          <strong className="text-emerald-800 block mb-1">Recommended Model Answer:</strong>
                          <p className="p-3 bg-emerald-50/40 rounded-lg text-slate-700 leading-relaxed border border-emerald-100">
                            {evalData.modelAnswer || 'Refer to Question Bank'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button variant="primary" size="md" onClick={() => setSelectedSession(null)}>
                Close Review
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Delete Practice Session?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this mock interview record? This action will permanently remove its scores from your analytics.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSessionToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={deleting}
                onClick={handleDeleteConfirm}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
