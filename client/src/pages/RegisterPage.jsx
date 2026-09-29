import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: 'Software Developer',
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setFormError(result.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-indigo-600 items-center justify-center text-white shadow-md shadow-indigo-100 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Create Student Account
          </h1>
          <p className="text-sm text-slate-500">
            Join thousands of final-year engineering students preparing for placements.
          </p>
        </div>

        <Card className="shadow-lg border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
                {formError}
              </div>
            )}

            <Input
              label="Full Name"
              name="name"
              type="text"
              icon={User}
              placeholder="e.g. Ujjawal Kumar"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="College Email Address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="e.g. ujjawal.ece@college.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Create Password"
              name="password"
              type="password"
              icon={Lock}
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Primary Target Placement Role
              </label>
              <select
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="Software Developer">Software Developer (DSA, OOP, OS, DBMS)</option>
                <option value="Data Analyst">Data Analyst (SQL, Python, Stats, PowerBI)</option>
                <option value="ECE / Core Electronics">ECE Core (Embedded C, Microcontrollers, VLSI)</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-3"
              isLoading={loading}
              rightIcon={ArrowRight}
            >
              Register & Start Practicing
            </Button>
          </form>

          <div className="pt-6 mt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800">
              Sign in
            </Link>
          </div>
        </Card>

        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Your practice history and answers are private & secured</span>
        </div>
      </div>
    </div>
  );
}
