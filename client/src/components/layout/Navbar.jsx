import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Compass, BookOpen, Layers, BarChart2, User, LogOut } from 'lucide-react';
import Button from '../common/Button';

export default function Navbar({ user = null, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isCurrent = (path) => location.pathname === path;

  const publicLinks = [
    { name: 'Tracks', path: '/#tracks', icon: Layers },
    { name: 'Features', path: '/#features', icon: Compass },
    { name: 'Questions', path: '/questions', icon: BookOpen },
  ];

  const authLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart2 },
    { name: 'Question Bank', path: '/questions', icon: BookOpen },
    { name: 'Mock Interview', path: '/interview', icon: Layers },
    { name: 'Resume Analyzer', path: '/resume', icon: Compass },
  ];

  const navLinks = user ? authLinks : publicLinks;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
                AI Interview Prep
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[10px] uppercase tracking-wider font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                Campus Ready
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isCurrent(item.path)
                    ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop User / Auth CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span>{user.name?.split(' ')[0] || 'Student'}</span>
                </Link>
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    title="Log out"
                    className="text-slate-500 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              <item.icon className="w-5 h-5 text-slate-400" />
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 font-medium"
                >
                  <User className="w-4 h-4" />
                  My Profile ({user.name})
                </Link>
                {onLogout && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Log Out
                  </Button>
                )}
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
