import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Lock, Bell, Moon, Shield, Save, Mail } from 'lucide-react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function Settings() {
  const { user, profile } = useAuth();
  
  const [name, setName] = useState(profile?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await updateProfile(user, { displayName: name });
      await updateDoc(doc(db, 'users', user.uid), { name });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Update failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPassword) return;
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await updatePassword(user, newPassword);
      setMessage({ text: 'Password changed successfully!', type: 'success' });
      setNewPassword('');
    } catch (err: any) {
      setMessage({ text: err.message || 'Password update failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-gray-900">Account Settings</h1>
        <p className="text-gray-500 font-medium">Manage your profile, security and preferences.</p>
      </div>

      {message.text && (
        <div className={cn(
          "p-4 rounded-2xl font-bold text-sm",
          message.type === 'success' ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
        )}>
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20">
              <User size={18} />
              Account Info
            </button>
          </nav>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Support</p>
            <p className="text-xs text-blue-700 font-medium leading-relaxed">
              Updating your profile name and password helps keep your account secure.
            </p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <GlassCard className="p-8 space-y-6" hover={false}>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <User size={20} />
              <h2 className="font-black uppercase tracking-widest text-sm">Personal Info</h2>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User size={18} />}
                required
              />
              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                icon={<Mail size={18} />}
                className="bg-gray-50 text-gray-400"
              />
              <Button type="submit" variant="primary" loading={loading} className="w-full sm:w-auto">
                <Save size={18} className="mr-2" />
                Update Profile
              </Button>
            </form>
          </GlassCard>

          <GlassCard className="p-8 space-y-6" hover={false}>
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Lock size={20} />
              <h2 className="font-black uppercase tracking-widest text-sm">Security</h2>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <Input
                label="New Password"
                type="password"
                placeholder="Enter at least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock size={18} />}
                minLength={6}
                required
              />
              <Button type="submit" variant="secondary" loading={loading} className="w-full sm:w-auto">
                Change Password
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
