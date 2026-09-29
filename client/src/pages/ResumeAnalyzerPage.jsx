import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Trash2,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Info,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import resumeService from '../services/resumeService';

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('Software Developer');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // Fetch student's latest saved analysis on mount
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await resumeService.getLatestAnalysis();
        if (data.success && data.analysis) {
          setAnalysis(data.analysis);
          setJobTitle(data.analysis.jobTitle || 'Software Developer');
        }
      } catch (err) {
        console.warn('No previous resume analysis found');
      }
    };

    fetchLatest();
  }, []);

  const handleFileChange = (e) => {
    setError(null);
    const selected = e.target.files[0];

    if (!selected) return;

    if (!selected.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file (.pdf extension).');
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit. Please upload a smaller PDF.');
      return;
    }

    setFile(selected);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Please choose or drag-and-drop your PDF resume first.');
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      setError('Please enter or paste a target Job Description (at least 20 characters).');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobTitle', jobTitle);
      formData.append('jobDescription', jobDescription);

      const data = await resumeService.analyzeResume(formData);

      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to analyze resume. Please verify the PDF is readable.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Sample JD templates for quick testing
  const sampleJDs = {
    sde: `Role: Software Engineer (Campus Graduate)
Requirements:
- Strong foundations in Data Structures and Algorithms (DSA) and Object-Oriented Programming (OOP).
- Proficiency in C++, Java, or Python.
- Hands-on experience with React, Node.js, Express, and REST APIs.
- Understanding of DBMS, SQL queries, and MongoDB.
- Knowledge of Operating Systems, Concurrency, and Computer Networks (TCP/IP).
- Version control with Git and GitHub.`,
    data: `Role: Associate Data Analyst
Requirements:
- Bachelor's degree in engineering or related quantitative discipline.
- Strong proficiency in SQL (Joins, Window Functions, Group By) and relational databases.
- Hands-on data manipulation with Python, Pandas, and NumPy.
- Familiarity with data visualization using Tableau or PowerBI.
- Sound understanding of descriptive statistics, hypothesis testing, and A/B testing metrics.`,
    ece: `Role: Embedded Systems & Firmware Engineer
Requirements:
- Strong command of Embedded C and pointer memory manipulation.
- Experience programming Microcontrollers (ARM Cortex-M, STM32, or 8051).
- Hands-on experience with hardware communication protocols: UART, SPI, and I2C.
- Understanding of Digital Electronics, timing parameters (Setup and Hold time), and Interrupt Service Routines (ISRs).
- Familiarity with RTOS concepts and circuit debugging.`,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Placement ATS Skill Gap Matcher
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Resume vs. Job Description Analyzer
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare your resume against target placement JDs, detect missing ATS keywords, and identify interview focus areas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            Safe & Private • In-Memory Processing
          </Badge>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Upload & Inputs (Left) vs. Analysis Scorecard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-5 border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              1. Upload Resume (PDF)
            </h2>

            {/* Drag & Drop Upload Zone */}
            <div className="relative border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-6 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                {file ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1">
                      <FileCheck className="w-4 h-4 text-emerald-600" /> {file.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB • Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse or drag & drop your resume
                    </p>
                    <p className="text-[11px] text-slate-400">PDF files up to 5MB supported</p>
                  </div>
                )}
              </div>
            </div>

            {/* Target Job Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Target Role / Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Embedded Firmware Engineer"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Job Description Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Paste Target Job Description (JD)
                </label>
                <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-semibold">
                  <span>Samples:</span>
                  <button
                    type="button"
                    onClick={() => setJobDescription(sampleJDs.sde)}
                    className="hover:underline ml-1"
                  >
                    SDE
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setJobDescription(sampleJDs.data)}
                    className="hover:underline"
                  >
                    Data
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setJobDescription(sampleJDs.ece)}
                    className="hover:underline"
                  >
                    ECE
                  </button>
                </div>
              </div>

              <textarea
                rows={7}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the recruiter's job description, technical requirements, or branch eligibility criteria here..."
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleAnalyze}
              isLoading={loading}
              leftIcon={Sparkles}
              className="w-full shadow-md shadow-indigo-100"
            >
              Analyze Match & Skill Gap
            </Button>
          </Card>
        </div>

        {/* Right Column: ATS Match Scorecard (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <Card className="py-24 text-center">
              <LoadingSpinner
                size="lg"
                message="Extracting PDF text and analyzing ATS keyword alignment..."
              />
            </Card>
          ) : !analysis ? (
            <Card className="py-16 text-center border-dashed border-2 border-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Resume Analyzed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Upload your college resume PDF on the left and paste a job description to discover missing ATS keywords.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setJobDescription(sampleJDs.sde)}
              >
                Load Sample Job Description
              </Button>
            </Card>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Scorecard Hero Tile */}
              <Card className="border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Analysis for: {analysis.fileName}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {analysis.jobTitle || 'Target Placement Role'}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-3xl font-black text-slate-900">
                        {analysis.matchScore}%
                      </span>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        ATS Match Score
                      </span>
                    </div>

                    <Badge
                      variant={
                        analysis.matchScore >= 75
                          ? 'success'
                          : analysis.matchScore >= 50
                          ? 'warning'
                          : 'danger'
                      }
                      size="md"
                    >
                      {analysis.matchScore >= 75
                        ? 'High Alignment'
                        : analysis.matchScore >= 50
                        ? 'Moderate Gap'
                        : 'Significant Gap'}
                    </Badge>
                  </div>
                </div>

                {/* Matched Skills Chips */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matched Skills Found in Resume ({analysis.matchedSkills?.length || 0}):
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matchedSkills && analysis.matchedSkills.length > 0 ? (
                      analysis.matchedSkills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                        >
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No direct keyword matches detected.
                      </span>
                    )}
                  </div>
                </div>

                {/* Missing Skills Gap Chips */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Missing / Underrepresented in Resume ({analysis.missingSkills?.length || 0}):
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingSkills && analysis.missingSkills.length > 0 ? (
                      analysis.missingSkills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                        >
                          ⚠️ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-600 font-semibold">
                        🎉 Zero missing skills! Your resume covers all key requirements.
                      </span>
                    )}
                  </div>
                </div>
              </Card>

              {/* Actionable Resume Bullet Improvement Tips */}
              <Card className="border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  Actionable Resume Bullet Point Tips
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {analysis.recommendations?.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Suggested Question Bank Topics to Revise */}
              {analysis.suggestedTopics && analysis.suggestedTopics.length > 0 && (
                <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        Targeted Interview Practice for this Job
                      </h3>
                      <p className="text-xs text-slate-600">
                        Based on the missing skills above, we recommend practicing these topics:
                      </p>
                    </div>
                    <Link to="/questions">
                      <Button variant="primary" size="sm" rightIcon={ArrowRight}>
                        Practice Topics
                      </Button>
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {analysis.suggestedTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-indigo-700 border border-indigo-200 shadow-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Responsible AI & Placement Guidance Notice */}
              <div className="p-3.5 bg-slate-100 rounded-xl text-slate-500 text-[11px] leading-relaxed flex items-start gap-2 border border-slate-200">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Ethical Placement Practice Notice:</strong> ATS match scores evaluate keyword frequency and alignment for practice guidance. Match scores do not predict recruitment outcomes or guarantee interview shortlisting. Never fabricate skills or experience you have not actually performed.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
