import React, { useState, useEffect } from 'react';
import {
  Search,
  Bookmark,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  CheckCircle,
  Lightbulb,
  BookOpen,
  Filter,
  Sparkles,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import questionService from '../services/questionService';
import { useAuth } from '../context/AuthContext';

export default function QuestionBankPage() {
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [selectedRole, setSelectedRole] = useState(user?.targetRole || 'All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableTopics, setAvailableTopics] = useState([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Expanded items state
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [expandedHints, setExpandedHints] = useState({});
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  // Fetch topics whenever selected role changes
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await questionService.getTopics(selectedRole);
        if (data.success) {
          setAvailableTopics(data.topics);
          setSelectedTopic('All'); // Reset topic when role switches
        }
      } catch (err) {
        console.warn('Failed to fetch topics', err);
      }
    };

    fetchTopics();
  }, [selectedRole]);

  // Fetch bookmarks if logged in
  useEffect(() => {
    if (user && user.bookmarkedQuestions) {
      setBookmarkedIds(new Set(user.bookmarkedQuestions.map((q) => (typeof q === 'string' ? q : q._id))));
    }
  }, [user]);

  // Fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        role: selectedRole,
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        search: searchQuery,
        page,
        limit: 6,
      };

      const data = await questionService.getQuestions(params);
      if (data.success) {
        setQuestions(data.questions);
        setTotalPages(data.pages);
        setTotalCount(data.total);
      }
    } catch (err) {
      setError('Could not load questions. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedRole, selectedTopic, selectedDifficulty, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  const toggleAnswer = (id) => {
    setExpandedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHint = (id) => {
    setExpandedHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBookmarkToggle = async (questionId) => {
    if (!user) {
      alert('Please log in to bookmark questions.');
      return;
    }

    try {
      const data = await questionService.toggleBookmark(questionId);
      if (data.success) {
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          if (data.bookmarked) {
            next.add(questionId);
          } else {
            next.delete(questionId);
          }
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  const rolesList = [
    { label: 'All Tracks', value: 'All' },
    { label: 'Software Developer', value: 'Software Developer' },
    { label: 'Data Analyst', value: 'Data Analyst' },
    { label: 'ECE / Core Electronics', value: 'ECE / Core Electronics' },
  ];

  const difficultiesList = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Curated Question Repository
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Interview Question Bank
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Master campus interview questions with rubric key concepts, hints, and verified model answers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md">
            {totalCount} Questions Available
          </Badge>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex overflow-x-auto pb-2 scrollbar-none gap-2 border-b border-slate-200">
        {rolesList.map((r) => (
          <button
            key={r.value}
            onClick={() => {
              setSelectedRole(r.value);
              setPage(1);
            }}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              selectedRole === r.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Filter and Search Controls */}
      <Card className="p-4 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by topic, concept, or keyword (e.g. TCP, Mutex, Volatile, SQL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <Button type="submit" variant="primary" size="md" leftIcon={Search}>
            Search
          </Button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          {/* Topic Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">Filter Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Topics ({availableTopics.length})</option>
              {availableTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Chips */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700 mr-1">Difficulty:</span>
            {difficultiesList.map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Questions Listing */}
      {loading ? (
        <div className="py-16">
          <LoadingSpinner size="lg" message="Loading categorized questions..." />
        </div>
      ) : error ? (
        <EmptyState
          icon={HelpCircle}
          title="Unable to load questions"
          description={error}
          actionLabel="Try Again"
          onAction={fetchQuestions}
        />
      ) : questions.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No questions match your criteria"
          description="Try selecting 'All Tracks' or clearing your search keywords to view other questions."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedRole('All');
            setSelectedTopic('All');
            setSelectedDifficulty('All');
            setSearchQuery('');
            setPage(1);
          }}
        />
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const isBookmarked = bookmarkedIds.has(q._id);
            const isAnswerOpen = !!expandedAnswers[q._id];
            const isHintOpen = !!expandedHints[q._id];

            return (
              <Card key={q._id} hoverEffect className="space-y-4 transition-all">
                {/* Question Header & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        q.role === 'Software Developer'
                          ? 'sde'
                          : q.role === 'Data Analyst'
                          ? 'data'
                          : 'ece'
                      }
                      size="sm"
                    >
                      {q.role}
                    </Badge>
                    <Badge variant={q.difficulty.toLowerCase()} size="sm">
                      {q.difficulty}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {q.topic}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookmarkToggle(q._id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isBookmarked
                        ? 'bg-amber-50 text-amber-600 border-amber-200'
                        : 'text-slate-400 hover:text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Question Prompt */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {q.questionText}
                </h3>

                {/* Key Concepts Tags */}
                {q.keyConcepts && q.keyConcepts.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Key Concepts Evaluated:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {q.keyConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-xs bg-indigo-50/70 text-indigo-700 border border-indigo-100 font-medium"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expandable Hint Section */}
                {q.hints && q.hints.length > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={() => toggleHint(q._id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{isHintOpen ? 'Hide Hints' : 'View Interview Hint'}</span>
                    </button>

                    {isHintOpen && (
                      <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
                        {q.hints.map((hint, hIdx) => (
                          <p key={hIdx} className="flex items-start gap-1.5">
                            <span className="font-bold">•</span>
                            <span>{hint}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Expandable Model Answer & Technical Explanation */}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleAnswer(q._id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      {isAnswerOpen ? (
                        <>
                          <ChevronUp className="w-4 h-4" /> Hide Model Answer & Explanation
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" /> Reveal Model Answer & Rubric
                        </>
                      )}
                    </button>

                    <span className="text-[11px] text-slate-400">
                      Standard Placement Response
                    </span>
                  </div>

                  {isAnswerOpen && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs animate-in fade-in duration-200">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle className="w-3.5 h-3.5" /> Recommended Technical Answer:
                        </h4>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200">
                          {q.sampleAnswer}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-indigo-700">
                          <Sparkles className="w-3.5 h-3.5" /> Deep Technical Explanation:
                        </h4>
                        <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>

          <span className="text-slate-600 font-medium">
            Page <strong className="text-slate-900">{page}</strong> of{' '}
            <strong className="text-slate-900">{totalPages}</strong>
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
