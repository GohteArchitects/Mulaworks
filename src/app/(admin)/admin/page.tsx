'use client';

import Admin from '../../components/admin/admin';
import AdminAbout from '../../components/admin/adminabout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useState } from 'react';
import { LayoutDashboard, Newspaper, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'about'>('dashboard');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success('Signed out successfully!');
      // Optional: Redirect to login page after sign out
      // window.location.href = '/login'; 
    } catch (error) {
      toast.error('Failed to sign out.');
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header and Navigation */}
        <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden md:inline">Works</span>
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'about'
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Newspaper className="w-5 h-5" />
                <span className="hidden md:inline">About</span>
              </button>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isSigningOut
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 mt-16 p-4 sm:p-6 lg:p-8">
          <div className="container mx-auto">
            {activeTab === 'dashboard' && <Admin />}
            {activeTab === 'about' && <AdminAbout />}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}