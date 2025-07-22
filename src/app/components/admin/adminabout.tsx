'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, X, Save, Pencil, ChevronUp, ChevronDown } from 'lucide-react';
import { getPublications, addPublication, updatePublication, deletePublication } from '@/lib/supabase';

interface Publication {
  id?: string;
  year: string;
  publication: string;
  article: string;
}

export default function AdminAbout() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPublication, setNewPublication] = useState<Publication>({
    year: '',
    publication: '',
    article: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadPublications = async () => {
      try {
        const data = await getPublications();
        setPublications(data);
      } catch (error) {
        console.error('Failed to load publications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPublications();
  }, []);

  const handleAddPublication = () => {
    setIsAdding(true);
    setEditingId(null);
    setNewPublication({
      year: '',
      publication: '',
      article: ''
    });
  };

  const handleEditPublication = (pub: Publication) => {
    setIsAdding(false);
    setEditingId(pub.id || null);
    setNewPublication({ ...pub });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setNewPublication({
      year: '',
      publication: '',
      article: ''
    });
  };

  const handleSavePublication = async () => {
    if (!newPublication.year || !newPublication.publication || !newPublication.article) {
      alert('Please fill all fields');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        // Update existing publication
        const updatedPub = await updatePublication(editingId, newPublication);
        setPublications(publications.map(p => p.id === editingId ? updatedPub : p));
      } else {
        // Add new publication
        const addedPub = await addPublication(newPublication);
        setPublications([...publications, addedPub]);
      }
      handleCancelEdit();
    } catch (error) {
      console.error('Failed to save publication:', error);
      alert('Failed to save publication');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    
    try {
      await deletePublication(id);
      setPublications(publications.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete publication:', error);
      alert('Failed to delete publication');
    }
  };

  const movePublication = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === publications.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newPublications = [...publications];
    const [movedPub] = newPublications.splice(index, 1);
    newPublications.splice(newIndex, 0, movedPub);

    // Update order in database if needed (you might need to add an 'order' field)
    // For now, we'll just update the local state
    setPublications(newPublications);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Publications</h1>
        <button
          onClick={handleAddPublication}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Add Publication
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Publication' : 'Add New Publication'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                value={newPublication.year}
                onChange={(e) => setNewPublication({...newPublication, year: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="2023"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publication</label>
              <input
                type="text"
                value={newPublication.publication}
                onChange={(e) => setNewPublication({...newPublication, publication: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Architectural Digest"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Article Title</label>
              <input
                type="text"
                value={newPublication.article}
                onChange={(e) => setNewPublication({...newPublication, article: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Modern Minimalism in Urban Spaces"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePublication}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${
                isSaving ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
              } transition-colors`}
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700">
          <div className="col-span-1">Order</div>
          <div className="col-span-2">Year</div>
          <div className="col-span-3">Publication</div>
          <div className="col-span-5">Article Title</div>
          <div className="col-span-1">Actions</div>
        </div>
        
        {publications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No publications found. Add your first publication.
          </div>
        ) : (
          publications.map((pub, index) => (
            <div 
              key={pub.id} 
              className="grid grid-cols-12 items-center p-4 border-b hover:bg-gray-50"
            >
              <div className="col-span-1 flex gap-1">
                <button 
                  onClick={() => movePublication(index, 'up')} 
                  disabled={index === 0}
                  className={`p-1 ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:text-blue-500'}`}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => movePublication(index, 'down')} 
                  disabled={index === publications.length - 1}
                  className={`p-1 ${index === publications.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:text-blue-500'}`}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="col-span-2">{pub.year}</div>
              <div className="col-span-3">{pub.publication}</div>
              <div className="col-span-5">{pub.article}</div>
              <div className="col-span-1 flex gap-2">
                <button
                  onClick={() => handleEditPublication(pub)}
                  className="p-1 text-blue-500 hover:text-blue-700"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => pub.id && handleDeletePublication(pub.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}