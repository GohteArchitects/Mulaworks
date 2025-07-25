'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusCircle, Trash2, Save, X } from 'lucide-react';

interface Publication {
  id?: number;
  year: string;
  publication: string;
  article: string;
}

export default function AdminAbout() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Publication>({
    year: '',
    publication: '',
    article: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch publications
  const fetchPublications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error) {
      setError('Failed to fetch publications');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      if (editingId) {
        // Update existing publication
        const { error } = await supabase
          .from('publications')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        setSuccess('Publication updated successfully');
        toast.success("Publication updated successfully!");
      } else {
        // Create new publication
        const { error } = await supabase
          .from('publications')
          .insert([formData]);

        if (error) throw error;
        setSuccess('Publication added successfully');
        toast.success("Publication added successfully!");
      }

      // Reset form and refresh data
      setFormData({ year: '', publication: '', article: '' });
      setEditingId(null);
      setHasChanges(false);
      setLastSaved(new Date().toISOString());
      await fetchPublications();
    } catch (error) {
      setError('Operation failed. Please try again.');
      toast.error("Operation failed. Please try again.");
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Edit publication
  const handleEdit = (publication: Publication) => {
    setFormData(publication);
    setEditingId(publication.id || null);
    setHasChanges(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete publication
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Publication deleted successfully');
      toast.success("Publication deleted successfully!");
      await fetchPublications();
    } catch (error) {
      setError('Failed to delete publication');
      toast.error("Failed to delete publication");
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form
  const handleCancel = () => {
    setFormData({ year: '', publication: '', article: '' });
    setEditingId(null);
    setHasChanges(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">About Section Admin</h1>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500">
              {isSaving ? (
                <span className="flex items-center gap-1">
                  <span className="animate-pulse">Saving...</span>
                </span>
              ) : hasChanges ? (
                <span className="text-yellow-600">Unsaved changes</span>
              ) : lastSaved ? (
                <span>Saved {new Date(lastSaved).toLocaleTimeString()}</span>
              ) : null}
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSaving || !hasChanges}
              className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
                isSaving 
                  ? 'bg-gray-400 text-white' 
                  : hasChanges 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Publication Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Publication' : 'Add New Publication'}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  maxLength={4}
                  placeholder="2023"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publication</label>
                <input
                  type="text"
                  name="publication"
                  value={formData.publication}
                  onChange={handleInputChange}
                  required
                  placeholder="Architectural Digest"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Article</label>
                <input
                  type="text"
                  name="article"
                  value={formData.article}
                  onChange={handleInputChange}
                  required
                  placeholder="Article title or description"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Add'} Publication
              </button>
            </div>
          </form>
        </div>

        {/* Publications List */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Current Publications</h2>
            <div className="text-sm text-gray-500">
              {publications.length} {publications.length === 1 ? 'entry' : 'entries'}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : publications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No publications found. Add one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Publication
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {publications.map((pub) => (
                    <tr key={pub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pub.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pub.publication}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {pub.article}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(pub)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(pub.id!)}
                            className="text-red-600 hover:text-red-900 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}