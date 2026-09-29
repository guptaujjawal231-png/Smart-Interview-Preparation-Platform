import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 col-span-1 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-base">AI Interview Prep</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart Interview Preparation Platform for campus placements. Tailored for SDE, Data Analyst, and ECE Core domains.
            </p>
          </div>

          {/* Placement tracks */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Preparation Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Software Developer (DSA, OOP, DBMS)
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Data Analyst (SQL, Python, Stats)
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  ECE / Core (Embedded, Microcontrollers, VLSI)
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Quick Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/questions" className="hover:text-white transition-colors">
                  Question Bank
                </Link>
              </li>
              <li>
                <Link to="/interview" className="hover:text-white transition-colors">
                  Mock Interview Simulator
                </Link>
              </li>
              <li>
                <Link to="/resume" className="hover:text-white transition-colors">
                  Resume vs. JD Analyzer
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Progress Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Placement Promise */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Campus Placement Ready
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built with industry-grade engineering standards: React 18, Tailwind CSS, Express REST API, MongoDB, and AI-powered evaluation.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-400">
              <span>Crafted for final-year engineering students</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI Interview Prep. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Engineered with passion</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for campus placement success</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
