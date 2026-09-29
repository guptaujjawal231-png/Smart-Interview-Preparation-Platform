import React, { useState } from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { User, Mail, Shield, Save } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Ujjawal Kumar',
    email: 'ujjawal.ece@college.edu',
    targetRole: 'Software Developer',
    preferredDifficulty: 'Intermediate',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Student Profile & Settings</h1>
          <p className="text-sm text-slate-500">Manage your placement track preferences and account information.</p>
        </div>
        <Badge variant="primary" size="md">B.Tech ECE Final Year</Badge>
      </div>

      <Card className="space-y-6">
        {saved && (
          <div className="p-3 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
            Profile settings updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Student Name"
            icon={User}
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />

          <Input
            label="College Email"
            icon={Mail}
            type="email"
            value={profile.email}
            disabled
            helperText="Registered email address cannot be changed."
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Primary Placement Focus
            </label>
            <select
              value={profile.targetRole}
              onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Software Developer">Software Developer (DSA, OOP, OS, DBMS)</option>
              <option value="Data Analyst">Data Analyst (SQL, Python, Stats, PowerBI)</option>
              <option value="ECE / Core Electronics">ECE Core (Embedded C, Microcontrollers, VLSI)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Default Question Difficulty
            </label>
            <select
              value={profile.preferredDifficulty}
              onChange={(e) => setProfile({ ...profile, preferredDifficulty: e.target.value })}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Beginner">Beginner (Core concepts, definitions, direct syntax)</option>
              <option value="Intermediate">Intermediate (Real campus technical rounds)</option>
              <option value="Advanced">Advanced (Complex architecture, edge cases, algorithms)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" leftIcon={Save}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
