import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Code2,
  Database,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export default function RoleSelectPage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(
    user?.targetRole || 'Software Developer'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    user?.preferredDifficulty || 'Intermediate'
  );
  const [saving, setSaving] = useState(false);

  const roleTracks = [
    {
      id: 'Software Developer',
      name: 'Software Developer',
      badgeVariant: 'sde',
      badgeText: 'Highest Placement Demand',
      icon: Code2,
      description:
        'Focus on Core Computer Science engineering concepts demanded by IT product, software, and tech consulting companies.',
      topics: [
        'Data Structures & Algorithms',
        'Object-Oriented Programming (C++/Java)',
        'DBMS & Relational Schema Design',
        'Operating Systems & Concurrency',
        'Computer Networks (TCP/IP, OSI)',
        'JavaScript & Modern Web Principles',
      ],
      idealFor: 'CSE, IT, and software-focused engineering candidates.',
    },
    {
      id: 'Data Analyst',
      name: 'Data Analyst',
      badgeVariant: 'data',
      badgeText: 'High Growth Track',
      icon: Database,
      description:
        'Target business analytics, data engineering, and business intelligence consulting interviews.',
      topics: [
        'Advanced SQL (Window Functions & Joins)',
        'Python for Data Science & Pandas',
        'Descriptive & Inferential Statistics',
        'Data Cleaning & Imputation Techniques',
        'Business Metrics (LTV, CAC, Retention)',
        'A/B Testing Interpretation',
      ],
      idealFor: 'Students interested in data-driven problem solving and analytics.',
    },
    {
      id: 'ECE / Core Electronics',
      name: 'ECE / Core Electronics',
      badgeVariant: 'ece',
      badgeText: 'Semiconductors & Embedded',
      icon: Cpu,
      description:
        'Tailored for Tier-1 semiconductor, VLSI, automotive hardware, and embedded firmware placement drives.',
      topics: [
        'Digital Electronics & Timing (Setup/Hold)',
        'Embedded C & Hardware Registers',
        'Microcontrollers (ARM Cortex, 8051)',
        'Analog Circuits & Op-Amps',
        'Communication Protocols (UART, SPI, I2C)',
        'VLSI Fundamentals & CMOS Power',
      ],
      idealFor: 'ECE, EEE, and Instrumentation engineering students.',
    },
  ];

  const handleConfirmRole = async () => {
    setSaving(true);
    if (user) {
      await updateProfile({
        targetRole: selectedRole,
        preferredDifficulty: selectedDifficulty,
      });
    }
    setSaving(false);
    navigate('/questions');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="primary" size="lg" className="gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Placement Track Configuration
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Your Target Placement Role
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Choose the role that matches your upcoming campus recruitment drives. Your question bank, mock interviews, and analytics will adapt to this domain.
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {roleTracks.map((track) => {
          const Icon = track.icon;
          const isSelected = selectedRole === track.id;

          return (
            <div
              key={track.id}
              onClick={() => setSelectedRole(track.id)}
              className={`cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/20 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant={track.badgeVariant} size="sm">
                    {track.badgeText}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">{track.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {track.description}
                  </p>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Core Technical Coverage:
                  </p>
                  <ul className="space-y-1.5">
                    {track.topics.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isSelected ? 'text-indigo-600' : 'text-slate-400'
                          }`}
                        />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span>Target:</span>
                  <span className="font-semibold text-slate-700">{track.idealFor}</span>
                </div>
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isSelected ? '✓ Track Selected' : 'Choose This Track'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Difficulty Selection & Confirmation Bar */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900 text-white border-slate-800">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            Set Default Difficulty Tier
          </h3>
          <p className="text-xs text-slate-400">
            Start with Beginner for concept building, or Intermediate for campus technical rounds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}

          <Button
            variant="primary"
            size="md"
            onClick={handleConfirmRole}
            isLoading={saving}
            rightIcon={ArrowRight}
            className="ml-2 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-900/30"
          >
            Confirm & Browse Questions
          </Button>
        </div>
      </Card>
    </div>
  );
}
