'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { ImageLayoutExtension } from '../../../lib/extensions';
import { getPageContent, updatePageContent, uploadImage, getWorks, createWork, updateWork, deleteWork } from '@/lib/supabase';
import { PlusCircle, ArrowUp, ArrowDown, Trash2, X, Type, Image as ImageIcon, Search, Video, FileText, Layout, Save, ChevronLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ContentBlock = {
  id: string;
  type: 'text' | 'image' | 'video';
  content: string;
  layout?: string;
};

type ImageLayout = {
  id: string;
  name: string;
  description: string;
  columns: number;
  containerClass: string;
  imageClass: string;
  mediaType?: 'image' | 'video';
  columnClasses?: string[]; // For multi-column layouts
};

const IMAGE_LAYOUTS: ImageLayout[] = [
  {
    id: 'layout1',
    name: 'Full Height',
    description: 'Single image with 100vh height',
    columns: 1,
    containerClass: 'w-full h-screen min-h-[500px] max-h-[800px] overflow-hidden',
    imageClass: 'w-full h-full object-cover',
    mediaType: 'image'
  },
  {
    id: 'layout2',
    name: 'Auto Height',
    description: 'Single image with auto height',
    columns: 1,
    containerClass: 'w-full aspect-[16/9] max-h-[70vh] overflow-hidden',
    imageClass: 'w-full h-full object-cover',
    mediaType: 'image'
  },
  {
    id: 'layout3',
    name: '2 Columns (60/40) Full Height',
    description: '60/40 split with 100vh height',
    columns: 2,
    containerClass: 'w-full h-screen min-h-[500px] max-h-screen flex gap-4',
    imageClass: 'w-full h-full object-cover',
    mediaType: 'image',
    columnClasses: [
      'w-[60%] h-full',
      'w-[40%] h-[80%]'
    ]
  },
  {
    id: 'layout4',
    name: '2 Columns (40/60) Medium Height',
    description: '40/60 split with 70% height',
    columns: 2,
    containerClass: 'w-full h-screen min-h-[600px] flex gap-4',
    imageClass: 'w-full h-full object-cover',
    mediaType: 'image',
    columnClasses: [
      'w-[40%] h-full',
      'w-[60%] h-full mt-[10vh]'
    ]
  },
  {
    id: 'layout5',
    name: '2 Columns (60/40) Medium Height',
    description: '60/40 split with 70% height',
    columns: 2,
    containerClass: 'w-full h-screen min-h-[600px] flex gap-4',
    imageClass: 'w-full h-full object-cover',
    mediaType: 'image',
    columnClasses: [
      'w-[60%] h-full mt-[10vh]',
      'w-[40%] h-full'
    ]
  },
  {
    id: 'layout6',
    name: 'Video Block',
    description: 'Embed a video',
    columns: 1,
    containerClass: 'w-full aspect-video max-h-[70vh] bg-black overflow-hidden',
    imageClass: 'w-full h-full object-contain',
    mediaType: 'video'
  }
];

const cleanHtmlContent = (html: string) => {
  return html
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const toolbarItems = [
    {
      icon: <Type className="w-4 h-4" strokeWidth={editor.isActive('bold') ? 3 : 2} />,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive('bold'),
      title: "Bold"
    },
    {
      icon: <i className="text-sm italic">I</i>,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive('italic'),
      title: "Italic"
    },
    {
      icon: <u className="text-sm">U</u>,
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive('underline'),
      title: "Underline"
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
      action: () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL', previousUrl);

        if (url === null) return;
        if (url === '') {
          editor.chain().focus().extendMarkRange('link').unsetLink().run();
          return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      },
      active: editor.isActive('link'),
      title: "Link"
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="15" y2="6" />
          <line x1="3" y1="18" x2="15" y2="18" />
        </svg>
      ),
      action: () => editor.chain().focus().setTextAlign('left').run(),
      active: editor.isActive({ textAlign: 'left' }),
      title: "Align Left"
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="12" x2="6" y2="12" />
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="18" x2="3" y2="18" />
        </svg>
      ),
      action: () => editor.chain().focus().setTextAlign('center').run(),
      active: editor.isActive({ textAlign: 'center' }),
      title: "Align Center"
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="21" y1="12" x2="3" y2="12" />
          <line x1="21" y1="6" x2="9" y2="6" />
          <line x1="21" y1="18" x2="9" y2="18" />
        </svg>
      ),
      action: () => editor.chain().focus().setTextAlign('right').run(),
      active: editor.isActive({ textAlign: 'right' }),
      title: "Align Right"
    }
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 sticky top-0 z-10">
      {toolbarItems.map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            item.active ? 'bg-gray-200 text-gray-800' : 'text-gray-700'
          }`}
          title={item.title}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getVimeoId = (url: string) => {
  const regExp = /^.*(vimeo.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
  const match = url.match(regExp);
  return match ? match[5] : null;
};

const MediaBlock = ({ 
  src, 
  layout = 'layout1',
  onChangeLayout,
  onAddMedia,
  mediaType = 'image'
}: { 
  src: string; 
  layout?: string;
  onChangeLayout?: (layout: string) => void;
  onAddMedia?: (index?: number, currentMediaType?: 'image' | 'video') => void;
  mediaType?: 'image' | 'video';
}) => {
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const currentLayout = IMAGE_LAYOUTS.find(l => l.id === layout) || IMAGE_LAYOUTS[0];
  const mediaSources = src ? src.split(',') : [];
  const emptySlots = currentLayout.columns - mediaSources.length;

  const renderMediaItem = (mediaSrc: string | undefined, index: number) => {
    if (currentLayout.mediaType === 'video') {
      return (
        <div className="relative w-full h-full group">
          {mediaSrc ? (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                {mediaSrc.includes('youtube') || mediaSrc.includes('youtu.be') ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(mediaSrc)}`}
                    className="w-full h-full"
                    allowFullScreen
                    title={`YouTube video ${index + 1}`}
                  />
                ) : mediaSrc.includes('vimeo') ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${getVimeoId(mediaSrc)}`}
                    className="w-full h-full"
                    allowFullScreen
                    title={`Vimeo video ${index + 1}`}
                  />
                ) : (
                  <video src={mediaSrc} controls className="w-full h-full" />
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddMedia?.(index, 'video');
                }}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity"
              >
                <PlusCircle className="w-8 h-8 text-white" />
              </button>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddMedia?.(index, 'video');
              }}
              className="w-full h-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 transition-colors"
            >
              <Video className="w-8 h-8 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="relative w-full h-full group">
        {mediaSrc ? (
          <>
            <img 
              src={mediaSrc} 
              className={`${currentLayout.imageClass} transition-transform duration-300 group-hover:scale-105`}
              alt={`Image ${index + 1}`}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddMedia?.(index, 'image');
              }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity"
            >
              <PlusCircle className="w-8 h-8 text-white" />
            </button>
          </>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddMedia?.(index, 'image');
            }}
            className="w-full h-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 transition-colors"
          >
            <ImageIcon className="w-8 h-8 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    );
  };

  const renderLayout = () => {
    switch(currentLayout.id) {
      case 'layout1':
        return (
          <div className={`${currentLayout.containerClass} p-4`}>
            {renderMediaItem(mediaSources[0], 0)}
          </div>
        );
      case 'layout2':
        return (
          <div className={`${currentLayout.containerClass} p-4`}>
            {renderMediaItem(mediaSources[0], 0)}
          </div>
        );
      case 'layout3':
        return (
          <div className={`${currentLayout.containerClass} p-4`}>
            <div className={currentLayout.columnClasses?.[0] || 'w-full'}>
              {renderMediaItem(mediaSources[0], 0)}
            </div>
            <div className={currentLayout.columnClasses?.[1] || 'w-full'}>
              {renderMediaItem(mediaSources[1], 1)}
            </div>
          </div>
        );
      case 'layout4':
        return (
          <div className={`${currentLayout.containerClass} p-4`}>
            <div className={currentLayout.columnClasses?.[0] || 'w-full'}>
              {renderMediaItem(mediaSources[0], 0)}
            </div>
            <div className={currentLayout.columnClasses?.[1] || 'w-full'}>
              {renderMediaItem(mediaSources[1], 1)}
            </div>
          </div>
        );
      case 'layout5':
        return (
          <div className={`${currentLayout.containerClass} p-4`}>
            <div className={currentLayout.columnClasses?.[0] || 'w-full'}>
              {renderMediaItem(mediaSources[0], 0)}
            </div>
            <div className={currentLayout.columnClasses?.[1] || 'w-full'}>
              {renderMediaItem(mediaSources[1], 1)}
            </div>
          </div>
        );
      case 'layout6':
        return (
          <div className={`${currentLayout.containerClass} p-4`}>
            {renderMediaItem(mediaSources[0], 0)}
          </div>
        );
      default:
        return (
          <div className={`${currentLayout.containerClass} p-4`}>
            {renderMediaItem(mediaSources[0], 0)}
          </div>
        );
    }
  };

  return (
    <div className="relative group my-8">
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        {renderLayout()}
      </div>
      
      {showLayoutMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowLayoutMenu(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Select Layout</h3>
              <button 
                onClick={() => setShowLayoutMenu(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {IMAGE_LAYOUTS.filter(l => l.mediaType === currentLayout.mediaType).map((layoutOption) => (
                <button
                  key={layoutOption.id}
                  onClick={() => {
                    onChangeLayout?.(layoutOption.id);
                    setShowLayoutMenu(false);
                  }}
                  className={`flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                    layout === layoutOption.id ? 'border-gray-500 bg-gray-100' : ''
                  }`}
                >
                  <div className="bg-gray-100 p-2 rounded-full">
                    {layoutOption.mediaType === 'video' ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium">{layoutOption.name}</span>
                    <p className="text-xs text-gray-500">{layoutOption.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {IMAGE_LAYOUTS.filter(l => l.mediaType === currentLayout.mediaType).map((layoutOption) => (
          <button
            key={layoutOption.id}
            onClick={() => setShowLayoutMenu(true)}
            className={`px-3 py-1 text-xs rounded-full shadow ${
              layout === layoutOption.id 
                ? 'bg-black text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-colors`}
            title={layoutOption.description}
          >
            {layoutOption.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const BlockControls = ({ 
  blockId, 
  index, 
  totalBlocks,
  onMoveUp, 
  onMoveDown, 
  onAdd, 
  onDelete 
}: {
  blockId: string;
  index: number;
  totalBlocks: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAdd: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex justify-between items-center mt-2 px-2 bg-gray-50 p-2 rounded-lg">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <span>Block {index + 1} of {totalBlocks}</span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className={`p-2 rounded-full ${
            index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'
          } transition-colors`}
          title="Move up"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === totalBlocks - 1}
          className={`p-2 rounded-full ${
            index === totalBlocks - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'
          } transition-colors`}
          title="Move down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <button 
          onClick={onAdd}
          className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
          title="Add block below"
        >
          <PlusCircle className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
          title="Delete block"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function AdminPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState<{show: boolean, blockId?: string}>({show: false});
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [works, setWorks] = useState<any[]>([]);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [workTypeFilter, setWorkTypeFilter] = useState<'All' | 'Residential' | 'Commercial'>('All');
  const [isNewWork, setIsNewWork] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'content'>('form');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'whitespace-normal',
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-gray-600 hover:underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      ImageLayoutExtension,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      if (!activeBlockId) return;
      
      const updatedBlocks = blocks.map(block => {
        if (block.id === activeBlockId && block.type === 'text') {
          return { ...block, content: editor.getHTML() };
        }
        return block;
      });
      setBlocks(updatedBlocks);
      setHasChanges(true);
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 focus:outline-none min-h-[200px]',
      },
    },
  });

  const loadWorks = useCallback(async () => {
    try {
      setIsLoading(true);
      const worksData = await getWorks();
      setWorks(worksData);
      
      // Do not select a work on initial load
      // setSelectedWork(worksData.length > 0 ? worksData[0] : null);
      // setBlocks(worksData.length > 0 ? JSON.parse(worksData[0].content) : []);
      setSelectedWork(null);
      setBlocks([]);

    } catch (error) {
      console.error('Failed to load works:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorks();
  }, [loadWorks]);

  const filteredWorks = works.filter(work => {
    const matchesSearch = work.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = workTypeFilter === 'All' || work.type === workTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleSelectWork = (work: any) => {
    setSelectedWork(work);
    setIsNewWork(false);
    try {
      const content = JSON.parse(work.content);
      setBlocks(content);
    } catch {
      setBlocks([{ id: '1', type: 'text', content: work.content || '<p></p>' }]);
    }
    setHasChanges(false);
    setActiveTab('form');
  };

  const handleCreateWork = async () => {
    const newWork = {
      name: 'New Project',
      type: 'Residential' as const,
      description: '',
      content: JSON.stringify([{ id: '1', type: 'text', content: '<p></p>' }]),
      location: '',
      completion_year: new Date().getFullYear(),
      architects: '',
      other_participants: '',
      photography: '',
      area: '',
      principal: '',
      interior_designer: '',
      main_image: ''
    };

    try {
      setIsSaving(true);
      const createdWork = await createWork(newWork);
      setWorks([...works, createdWork]);
      setSelectedWork(createdWork);
      setBlocks([{ id: '1', type: 'text', content: '<p></p>' }]);
      setIsNewWork(true);
      setHasChanges(true);
      setActiveTab('form');
      toast.success("New work created successfully!");
    } catch (error) {
      console.error('Failed to create work:', error);
      toast.error("Failed to create new work. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteWork = async () => {
    if (!selectedWork) return;

    if (!window.confirm(`Are you sure you want to delete the project "${selectedWork.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsSaving(true);
      await deleteWork(selectedWork.id);
      
      const updatedWorks = works.filter(w => w.id !== selectedWork.id);
      setWorks(updatedWorks);
      setSelectedWork(null); // Unselect the work after deletion
      setBlocks([]);
      setHasChanges(false);
      setIsNewWork(false);
      toast.success(`Project "${selectedWork.name}" deleted successfully.`);
    } catch (error) {
      console.error('Failed to delete work:', error);
      toast.error("Failed to delete work. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWork = async () => {
    if (!selectedWork) return;

    try {
      setIsSaving(true);
      const updatedWork = {
        ...selectedWork,
        content: JSON.stringify(blocks),
        updated_at: new Date().toISOString()
      };

      const savedWork = await updateWork(selectedWork.id, updatedWork);
      setWorks(works.map(w => w.id === selectedWork.id ? savedWork : w));
      setSelectedWork(savedWork);
      setHasChanges(false);
      setIsNewWork(false);
      setLastSaved(new Date().toISOString());
      toast.success("Work saved successfully!");
    } catch (error) {
      console.error('Failed to save work:', error);
      toast.error("Failed to save work. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file (JPEG, PNG, GIF, etc.)');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be smaller than 5MB');
      }

      setIsSaving(true);
      setUploadError(null);

      const url = await uploadImage(file);
      
      if (!url) {
        throw new Error('Received empty URL from upload');
      }

      return url;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMediaToBlock = async (blockId: string, slotIndex?: number, mediaType: 'image' | 'video' = 'image') => {
    if (mediaType === 'video') {
      const videoUrl = window.prompt('Enter video URL (e.g., YouTube/Vimeo video page URL or direct video link)');
      if (!videoUrl) return;

      setBlocks(prevBlocks => prevBlocks.map(block => {
        if (block.id === blockId) {
          return { ...block, content: videoUrl };
        }
        return block;
      }));
      setHasChanges(true);
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const url = await handleImageUpload(file);
        
        setBlocks(prevBlocks => prevBlocks.map(block => {
          if (block.id === blockId) {
            const currentUrls = block.content ? block.content.split(',') : [];
            
            if (slotIndex !== undefined && slotIndex < currentUrls.length) {
              currentUrls[slotIndex] = url;
            } else {
              currentUrls.push(url);
            }
            
            return {
              ...block,
              content: currentUrls.join(',')
            };
          }
          return block;
        }));
        
        setHasChanges(true);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadError(
          error instanceof Error 
            ? error.message 
            : 'Failed to upload image. Please try again.'
        );
        toast.error("Failed to upload image. Please try again.");
      }
    };

    input.click();
  };

  const addMediaBlock = async (insertAfterId?: string, layoutId: string = 'layout1') => {
    const layout = IMAGE_LAYOUTS.find(l => l.id === layoutId);
    if (!layout) return;

    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: layout.mediaType === 'video' ? 'video' : 'image',
      content: '',
      layout: layoutId
    };

    setBlocks(prevBlocks => {
      if (insertAfterId) {
        const index = prevBlocks.findIndex(b => b.id === insertAfterId);
        const newBlocks = [...prevBlocks];
        newBlocks.splice(index + 1, 0, newBlock);
        return newBlocks;
      }
      return [...prevBlocks, newBlock];
    });

    setHasChanges(true);
  };

  const addTextBlock = (insertAfterId?: string) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: 'text',
      content: '<p></p>'
    };

    if (insertAfterId) {
      const index = blocks.findIndex(b => b.id === insertAfterId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
      setActiveBlockId(newBlock.id);
    } else {
      setBlocks([...blocks, newBlock]);
      setActiveBlockId(newBlock.id);
    }
    setHasChanges(true);
  };

  const removeBlock = (id: string) => {
    if (blocks.length <= 1 && blocks.some(b => b.type === 'text' && cleanHtmlContent(b.content) !== '')) {
      toast.warning("You must keep at least one block, or clear existing content before removing the last block.");
      return;
    }
    
    setBlocks(blocks.filter(b => b.id !== id));
    setHasChanges(true);
    if (activeBlockId === id) {
      setActiveBlockId(blocks[0]?.id || null);
    }
    toast.success("Block removed successfully!");
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= blocks.length) return;
    
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, removed);
    
    setBlocks(newBlocks);
    setHasChanges(true);
  };

  const updateBlockLayout = (blockId: string, newLayoutId: string) => {
    const newLayout = IMAGE_LAYOUTS.find(l => l.id === newLayoutId);
    if (!newLayout) return;

    setBlocks(blocks.map(block => 
      block.id === blockId ? {
        ...block,
        layout: newLayoutId,
        type: newLayout.mediaType === 'video' ? 'video' : 'image'
      } : block
    ));
    setHasChanges(true);
  };

  const renderAddMenu = () => {
    if (!showAddMenu.show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-800">Add New Content Block</h3>
            
          </div>

          {/* Content */}
          <div className="p-4">
            {uploadError && (
              <div className="mb-4 p-3 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {uploadError}
                </div>
              </div>
            )}

            {/* Text Block Option */}
            <div className="mb-4">
              <button
                onClick={() => {
                  showAddMenu.blockId ? addTextBlock(showAddMenu.blockId) : addTextBlock();
                  setShowAddMenu({show: false});
                }}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-100 transition-all duration-200"
              >
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Type className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Text Block</p>
                  <p className="text-sm text-gray-600">Add a rich text editor for content</p>
                </div>
              </button>
            </div>

            {/* Media Layouts */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Media Layouts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {IMAGE_LAYOUTS.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => {
                      showAddMenu.blockId 
                        ? addMediaBlock(showAddMenu.blockId, layout.id)
                        : addMediaBlock(undefined, layout.id);
                      setShowAddMenu({show: false});
                    }}
                    className="flex flex-col items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {layout.mediaType === 'video' ? (
                        <Video className="w-6 h-6 text-gray-600" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-semibold text-gray-800 block">{layout.name}</span>
                      <p className="text-xs text-gray-600 mt-1">{layout.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 rounded-b-lg">
            <button
              onClick={() => setShowAddMenu({show: false})}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  useEffect(() => {
    if (activeBlockId && editor) {
      const block = blocks.find(b => b.id === activeBlockId);
      if (block && block.type === 'text' && editor.getHTML() !== block.content) {
        editor.commands.setContent(block.content);
      }
    }
  }, [activeBlockId, blocks, editor]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      {/* Sidebar for all devices, full width on mobile unless a work is selected */}
      <div className={`w-full md:w-[35%] border-r bg-white flex-col ${isMobile && selectedWork ? 'hidden' : 'flex'}`}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-4">Works</h2>
          
          <div className="flex flex-col space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search works..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {['All', 'Residential', 'Commercial'].map((type) => (
                <button
                  key={type}
                  onClick={() => setWorkTypeFilter(type as any)}
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
                    workTypeFilter === type 
                      ? 'bg-black text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleCreateWork}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white py-3 px-4 rounded-lg transition-colors font-medium"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Work
          </button>
          
          {selectedWork && (
            <button
              onClick={handleDeleteWork}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg transition-colors font-medium mt-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Project
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredWorks.map(work => (
            <div
              key={work.id}
              onClick={() => handleSelectWork(work)}
              className={`p-4 border-b cursor-pointer transition-colors flex justify-between items-center ${
                selectedWork?.id === work.id 
                  ? 'bg-gray-100 border-l-4 border-l-black' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div>
                <h3 className="font-medium">{work.name}</h3>
                <p className="text-sm text-gray-500">
                  {work.type} • {work.location || 'No location'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(work.updated_at).toLocaleDateString()}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right content area - 65% width, only shown when a work is selected */}
      {selectedWork && (
        <div className="w-full md:w-[65%] flex flex-col">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center gap-2 md:hidden">
              <button 
                onClick={() => setSelectedWork(null)}
                className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold truncate flex-1">
                {isNewWork ? 'New Work' : selectedWork.name}
              </h2>
            </div>
            
            <div className="hidden md:flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
              <h2 className="text-xl font-bold truncate">
                {isNewWork ? 'New Work' : selectedWork.name}
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {isSaving ? (
                    <span className="flex items-center gap-1">
                      <span className="animate-pulse">Saving...</span>
                    </span>
                  ) : hasChanges ? (
                    <span className="text-gray-600">Unsaved changes</span>
                  ) : lastSaved ? (
                    <span>Saved {new Date(lastSaved).toLocaleTimeString()}</span>
                  ) : null}
                </div>
                <button
                  onClick={handleSaveWork}
                  disabled={isSaving || !hasChanges}
                  className={`px-4 py-2 rounded transition-colors ${
                    isSaving 
                      ? 'bg-gray-400 text-white' 
                      : hasChanges 
                        ? 'bg-gray-800 hover:bg-black text-white' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('form')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'form' 
                    ? 'border-b-2 border-black text-black' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FileText className="w-4 h-4" /> 
                <span className="hidden sm:inline">Project Details</span>
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'content' 
                    ? 'border-b-2 border-black text-black' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Layout className="w-4 h-4" /> 
                <span className="hidden sm:inline">Content Layout</span>
              </button>
            </div>
          </div>
          
          {/* Conditional Rendering of Pages */}
          {activeTab === 'form' && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white rounded-lg shadow">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={selectedWork.name}
                    onChange={(e) => {
                      setSelectedWork({...selectedWork, name: e.target.value});
                      setHasChanges(true);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                  <select
                    value={selectedWork.type}
                    onChange={(e) => {
                      setSelectedWork({...selectedWork, type: e.target.value});
                      setHasChanges(true);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={selectedWork.description || ''}
                    onChange={(e) => {
                      setSelectedWork({...selectedWork, description: e.target.value});
                      setHasChanges(true);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    rows={4}
                  />
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mt-6 mb-4 text-gray-800">Project Specifics</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={selectedWork.location || ''}
                    onChange={(e) => {
                      setSelectedWork({...selectedWork, location: e.target.value});
                      setHasChanges(true);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Completion Year</label>
                  <input
                    type="number"
                    value={selectedWork.completion_year || ''}
                    onChange={(e) => {
                      setSelectedWork({...selectedWork, completion_year: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Architects</label>
                  <input
                    type="text"
                    value={selectedWork.architects || ''}
                    onChange={(e) => {
                      setSelectedWork({...selectedWork, architects: e.target.value});
                      setHasChanges(true);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Participants</label>
                  <input
                    type="text"
                    value={selectedWork.other_participants || ''}
                    onChange={(e) => {
                      setSelectedWork({...selectedWork, other_participants: e.target.value});
                      setHasChanges(true);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photography By</label>
                  <input
                    type="text"
                    value={selectedWork.photography || ''}
                    onChange={(e) => {
                      setSelectedWork({...selectedWork, photography: e.target.value});
                      setHasChanges(true);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                  <input
                    type="text"
                    value={selectedWork.area || ''}
                    onChange={(e) => {
                      setSelectedWork({...selectedWork, area: e.target.value});
                      setHasChanges(true);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Principal</label>
                  <input
                    type="text"
                    value={selectedWork.principal || ''}
                    onChange={(e) => {
                      setSelectedWork({...selectedWork, principal: e.target.value});
                      setHasChanges(true);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interior Designer</label>
                  <input
                    type="text"
                    value={selectedWork.interior_designer || ''}
                    onChange={(e) => {
                      setSelectedWork({...selectedWork, interior_designer: e.target.value});
                      setHasChanges(true);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedWork.main_image || ''}
                      onChange={(e) => {
                        setSelectedWork({...selectedWork, main_image: e.target.value});
                        setHasChanges(true);
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                      placeholder="https://yourdomain.com/image.jpg"
                    />
                    <button
                      onClick={async () => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            try {
                              const url = await handleImageUpload(file);
                              setSelectedWork({...selectedWork, main_image: url});
                              setHasChanges(true);
                              toast.success("Main image uploaded successfully!");
                            } catch (error) {
                              toast.error(`Error uploading main image: ${error instanceof Error ? error.message : 'Unknown error'}`);
                            }
                          }
                        };
                        input.click();
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Upload
                    </button>
                  </div>
                  {selectedWork.main_image && (
                    <img src={selectedWork.main_image} alt="Main Project" className="mt-4 max-w-xs h-auto rounded-md shadow-sm" />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="flex-1 overflow-y-auto p-4">
              {isMobile ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-center p-8">
                  <div>
                    <p className="text-lg font-medium mb-2">Desktop Experience Required</p>
                    <p className="text-sm">Please use a desktop or laptop computer to edit content.</p>
                    <p className="text-sm">The mobile interface doesn't support content editing.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {blocks.map((block, index) => (
                    <div key={block.id} className="relative group w-full">
                      {/* Block Content */}
                      {block.type === 'text' ? (
                        <div 
                          className={`border rounded-lg bg-white w-full ${
                            activeBlockId === block.id ? 'ring-2 ring-gray-300' : ''
                          }`}
                          onClick={() => setActiveBlockId(block.id)}
                        >
                          {activeBlockId === block.id ? (
                            <>
                              <EditorToolbar editor={editor} />
                              <EditorContent 
                                editor={editor} 
                                className="min-h-[200px] p-4 w-full whitespace-normal" 
                              />
                            </>
                          ) : (
                            <div 
                              className="prose max-w-none p-4" 
                              dangerouslySetInnerHTML={{ __html: block.content }} 
                            />
                          )}
                        </div>
                      ) : (
                        <MediaBlock
                          src={block.content}
                          layout={block.layout}
                          onChangeLayout={(newLayout) => updateBlockLayout(block.id, newLayout)}
                          onAddMedia={(slotIndex, mediaType) => handleAddMediaToBlock(block.id, slotIndex, mediaType)}
                          mediaType={block.type === 'video' ? 'video' : 'image'}
                        />
                      )}
                      
                      <BlockControls
                        blockId={block.id}
                        index={index}
                        totalBlocks={blocks.length}
                        onMoveUp={() => moveBlock(block.id, 'up')}
                        onMoveDown={() => moveBlock(block.id, 'down')}
                        onAdd={() => setShowAddMenu({show: true, blockId: block.id})}
                        onDelete={() => removeBlock(block.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {renderAddMenu()}
    </div>
  );
}