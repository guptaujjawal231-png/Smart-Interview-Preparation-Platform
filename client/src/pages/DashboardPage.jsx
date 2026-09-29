import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Play,
  FileText,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Target,
  Sparkles,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardService.getStats();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.warn('Could not load dynamic dashboard stats', err);
        setError('Could not load real-time analytics. Showing baseline data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const studentName = user?.name || 'Placement Candidate';
  const targetRole = user?.targetRole || 'Software Developer';

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your real-time placement analytics..." />
      </div>
    );
  }

  const topicProficiencyData = stats?.topicProficiencyData || [];
  const recentSessions = stats?.recentSessions || [];
  const weakTopics = stats?.weakTopics || [];

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
              Candidate Analytics Hub
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Placement Data
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {studentName}! 👋
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            You're currently preparing for <strong>{targetRole}</strong> placements. Your analytics reflect real mock interviews and AI evaluations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/interview">
            <Button variant="primary" leftIcon={Play} className="shadow-lg shadow-indigo-600/30">
              Start Mock Interview
            </Button>
          </Link>
          <Link to="/resume">
            <Button variant="secondary" leftIcon={FileText} className="bg-white/10 hover:bg-white/20 border-white/10">
              ATS Resume Match
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Metric Cards (Computed from Real Saved Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card hoverEffect className="space-y-2 border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Sessions Completed</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.totalSessions || 0}</p>
          <p className="text-xs text-slate-500 font-medium">
            {stats?.totalSessions > 0 ? 'Recorded in database' : 'No sessions taken yet'}
          </p>
        </Card>

        <Card hoverEffect className="space-y-2 border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Questions Answered</span>
            <Target className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.questionsAttempted || 0}</p>
          <p className="text-xs text-slate-500">Across technical rounds</p>
        </Card>

        <Card hoverEffect className="space-y-2 border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Average AI Score</span>
            <BarChart2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-slate-900">{stats?.avgScore || 0}</p>
            <span className="text-xs font-semibold text-slate-400">/ 10.0</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium">Placement Benchmark: 7.0+</p>
        </Card>

        <Card hoverEffect className="space-y-2 border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Weak Areas Identified</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{weakTopics.length}</p>
          <p className="text-xs text-amber-600 font-medium">
            {weakTopics.length > 0 ? 'Recommended for revision' : 'No weak topics detected'}
          </p>
        </Card>
      </div>

      {/* Main Grid: Topic Proficiency Chart & Weak Topics Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Topic Proficiency Bar Graph (2 Columns) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Topic Proficiency Breakdown</h2>
              <p className="text-xs text-slate-500">Rubric scores calculated from your question evaluations</p>
            </div>
            <Badge variant="primary" size="sm">Realtime Analytics</Badge>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicProficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="topic" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value) => [`${value} / 10`, 'Average Score']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {topicProficiencyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.score >= 8.0 ? '#10b981' : entry.score >= 6.5 ? '#6366f1' : entry.score > 0 ? '#f59e0b' : '#cbd5e1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-end gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Strong (8+)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500"></span> Good (6.5 - 7.9)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Needs Revision (&lt; 6.5)</span>
          </div>
        </Card>

        {/* Priority Revision Topics (1 Column) */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Priority Revision</h2>
              <Badge variant="warning" size="sm">Action Items</Badge>
            </div>
            <p className="text-xs text-slate-500">Topics where your average evaluation score is below 6.5.</p>

            <div className="space-y-3 pt-2">
              {weakTopics.length > 0 ? (
                weakTopics.map((topic, i) => (
                  <div key={i} className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">{topic.priority} Priority</span>
                      <span className="text-xs font-semibold text-amber-700">{topic.score}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-snug">{topic.name}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-900">No Weak Topics!</p>
                  <p className="text-[11px] text-emerald-700">
                    Either you scored well on all attempted topics, or you haven't taken a mock interview yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link to="/questions" className="block">
              <Button variant="outline" size="sm" className="w-full" rightIcon={ArrowUpRight}>
                Practice Topic Questions
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Sessions Table */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Interview Sessions</h2>
            <p className="text-xs text-slate-500">Review your past answers and AI rubrics</p>
          </div>
          <Link to="/history">
            <Button variant="ghost" size="sm" rightIcon={ArrowUpRight}>
              View All History
            </Button>
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 space-y-3">
            <Clock className="w-8 h-8 mx-auto text-slate-300" />
            <p>You have not completed any mock interview sessions yet.</p>
            <Link to="/interview">
              <Button variant="primary" size="sm">
                Start First Mock Session
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Track</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Questions</th>
                  <th className="py-3 px-4">AI Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{session.role}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={session.difficulty?.toLowerCase() || 'intermediate'} size="sm">
                        {session.difficulty}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{session.date}</td>
                    <td className="py-3.5 px-4">{session.questions} Qs</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${session.score >= 8 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {session.score} / 10
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to="/history">
                        <button className="text-indigo-600 hover:text-indigo-800 font-semibold">
                          Review Rubric
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
