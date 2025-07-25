'use client';

import Admin from '../../components/admin/admin';
import AdminAbout from '../../components/admin/adminabout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useState } from 'react';
import { LayoutDashboard, Newspaper, Settings } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'about'>('dashboard');

  return (
    <ProtectedRoute>
      <div style={{ marginTop: '6rem' }} /> {/* Top spacer */}
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <nav className="bg-white shadow-sm top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <h1 className="text-xl font-bold text-gray-900 my-auto">Admin Dashboard</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Works</span>
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'about'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Newspaper className="w-5 h-5" />
                  <span>About</span>
                </button>
                
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <main className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Admin />
              </div>
            )}
            
            {activeTab === 'about' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <AdminAbout />
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}