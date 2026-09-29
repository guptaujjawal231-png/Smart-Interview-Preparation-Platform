import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Database,
  Cpu,
  CheckCircle2,
  FileText,
  BarChart3,
  Bot,
  Zap,
  ShieldCheck,
  Award,
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export default function LandingPage() {
  const tracks = [
    {
      id: 'sde',
      name: 'Software Developer',
      icon: Code2,
      badgeVariant: 'sde',
      badgeText: 'Highest Placement Demand',
      description:
        'Master core computer science fundamentals asked in product and services campus placement drives.',
      topics: ['Data Structures & Algorithms', 'Object-Oriented Programming (OOP)', 'DBMS & SQL Queries', 'Operating Systems & Concurrency', 'Computer Networks (TCP/IP)', 'JavaScript & React'],
      ctaText: 'Practice SDE Questions',
    },
    {
      id: 'data',
      name: 'Data Analyst',
      icon: Database,
      badgeVariant: 'data',
      badgeText: 'High Growth Track',
      description:
        'Prepare for technical rounds requiring SQL problem solving, Python data wrangling, and statistical intuition.',
      topics: ['Advanced SQL Joins & Window Functions', 'Python & Pandas Data Manipulation', 'Descriptive & Inferential Statistics', 'Data Visualization (PowerBI / Tableau basics)', 'Business Case Studies & Metrics'],
      ctaText: 'Practice Data Questions',
    },
    {
      id: 'ece',
      name: 'ECE / Core Electronics',
      icon: Cpu,
      badgeVariant: 'ece',
      badgeText: 'Hardware & Embedded',
      description:
        'Dedicated interview preparation for semiconductor, core electronics, and embedded systems firms.',
      topics: ['Digital Electronics & Verilog / VHDL', 'Analog Circuits & Op-Amps', 'Microcontrollers (8051, ARM, STM32)', 'Embedded C, Timers & ISRs', 'Communication Systems & Protocols', 'VLSI Fundamentals'],
      ctaText: 'Practice ECE Core Questions',
    },
  ];

  const features = [
    {
      icon: Bot,
      title: 'AI Rubric-Based Evaluation',
      description:
        'Every answer is evaluated across 4 technical parameters: Correctness, Concept Coverage, Clarity, and Relevance. Get a 0-10 score with exact missing keywords.',
    },
    {
      icon: FileText,
      title: 'Resume vs. JD Keyword Analyzer',
      description:
        'Upload your PDF resume and paste target Job Descriptions. Uncover critical missing skills and get tailored interview questions.',
    },
    {
      icon: Zap,
      title: 'Realistic Mock Simulator',
      description:
        'Experience real placement pressure with timed question flows, step-by-step navigation, and immediate post-session analytical breakdowns.',
    },
    {
      icon: BarChart3,
      title: 'Data-Backed Analytics',
      description:
        'Interactive performance charts highlight your strongest topics and pinpoint weak areas that need revision before campus day.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Target Track',
      description: 'Select Software Developer, Data Analyst, or ECE Core Electronics based on your target company.',
    },
    {
      number: '02',
      title: 'Start Timed Mock Session',
      description: 'Receive role-specific technical and HR questions tailored to your chosen difficulty level.',
    },
    {
      number: '03',
      title: 'Receive Instant AI Feedback',
      description: 'Get an objective rubric score, identified missing concepts, and ideal model answers.',
    },
    {
      number: '04',
      title: 'Revise & Crack Placements',
      description: 'Follow personalized recommendations on weak topics and track your readiness trendline.',
    },
  ];

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-5xl mx-auto px-4 space-y-8 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Engineered for B.Tech Final-Year Placement Success</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Crack Your Campus Placements with{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-800 bg-clip-text text-transparent">
            Smart AI Mentorship
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          The all-in-one interview preparation platform for final-year students. Practice technical and HR questions in <strong>Software Development</strong>, <strong>Data Analytics</strong>, and <strong>ECE / Core Electronics</strong> with rubric-based AI scoring.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link to="/register">
            <Button variant="primary" size="lg" rightIcon={ArrowRight} className="w-full sm:w-auto shadow-indigo-200 shadow-lg">
              Start Free Practice
            </Button>
          </Link>
          <Link to="/questions">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Question Bank
            </Button>
          </Link>
        </div>

        {/* Quick Social Proof / Guarantees */}
        <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free for Students
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-500" /> Rubric-Based Objective Scoring
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" /> SDE, Data & ECE Tracks Included
          </span>
        </div>
      </section>

      {/* Target Tracks Section */}
      <section id="tracks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="primary">Targeted Placement Tracks</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Preparation Built Specifically for Your Domain
          </h2>
          <p className="text-slate-600 text-sm">
            No more generic questions. Practice the precise technical topics top recruiters ask in your target branch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <Card key={track.id} hoverEffect className="flex flex-col justify-between border-slate-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={track.badgeVariant} size="sm">
                      {track.badgeText}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{track.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{track.description}</p>

                  <div className="pt-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Key Interview Topics:
                    </p>
                    <ul className="space-y-1.5">
                      {track.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link to="/questions" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      {track.ctaText}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-slate-900 text-white py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              Step-by-Step Methodology
            </span>
            <h2 className="text-3xl font-extrabold text-white">How AI Interview Prep Works</h2>
            <p className="text-slate-400 text-sm">
              From day one of preparation to final placement offer letter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative space-y-3 p-5 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-3xl font-black text-indigo-400 font-mono">{step.number}</span>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="primary">Core Capabilities</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Everything You Need to Ace Placement Rounds
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} hoverEffect className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{feature.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl shadow-indigo-100">
          <h2 className="text-3xl sm:text-4xl font-black">
            Ready to Stand Out in Campus Placement Drives?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-2xl mx-auto">
            Join final-year engineering candidates who practice daily, evaluate answers with real AI feedback, and improve their technical communication.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button variant="secondary" size="lg" className="bg-white text-indigo-900 hover:bg-slate-100 font-bold shadow-md">
                Create Free Student Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
