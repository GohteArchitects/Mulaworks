'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { ImageLayoutExtension } from '../../../lib/extensions';
import { getPageContent, updatePageContent, uploadImage, getWorks, createWork, updateWork } from '@/lib/supabase';
import { PlusCircle, ArrowUp, ArrowDown, Trash2, X, Type, Image as ImageIcon, Search, Video, FileText, Layout } from 'lucide-react';

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
};

const IMAGE_LAYOUTS: ImageLayout[] = [
  {
    id: 'layout1',
    name: 'Normal',
    description: 'Single image with padding',
    columns: 1,
    containerClass: 'w-full grid grid-cols-10 gap-4 p-0',
    imageClass: 'w-full h-auto',
    mediaType: 'image'
  },
  {
    id: 'layout2',
    name: 'Full Bleed',
    description: 'Edge to edge image',
    columns: 1,
    containerClass: 'w-full',
    imageClass: 'w-full h-auto',
    mediaType: 'image'
  },
  {
    id: 'layout3',
    name: '2 Columns Equal',
    description: '50/50 split',
    columns: 2,
    containerClass: 'w-full grid-full grid-cols-2 gap-4 p-0',
    imageClass: 'w-full h-auto',
    mediaType: 'image'
  },
  {
    id: 'layout4',
    name: '2 Columns (70/30)',
    description: 'Wider left image',
    columns: 2,
    containerClass: 'w-full grid-full grid-cols-10 gap-4 p-0',
    imageClass: 'w-full h-auto',
    mediaType: 'image'
  },
  {
    id: 'layout5',
    name: '2 Columns (30/70)',
    description: 'Wider right image',
    columns: 2,
    containerClass: 'w-full grid-full grid-cols-10 gap-4 p-0',
    imageClass: 'w-full h-auto',
    mediaType: 'image'
  },
  {
    id: 'layout6',
    name: 'Video Block',
    description: 'Embed a video',
    columns: 1,
    containerClass: 'w-full my-4 aspect-video',
    imageClass: 'w-full h-full object-cover',
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

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bold') ? 'bg-gray-200' : ''
        }`}
        title="Bold"
      >
        <Type className="w-4 h-4" strokeWidth={editor.isActive('bold') ? 3 : 2} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('italic') ? 'bg-gray-200' : ''
        }`}
        title="Italic"
      >
        <i className="text-sm italic">I</i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('underline') ? 'bg-gray-200' : ''
        }`}
        title="Underline"
      >
        <u className="text-sm">U</u>
      </button>
      <button
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('Enter URL', previousUrl);

          if (url === null) return;
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }

          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('link') ? 'bg-gray-200' : ''
        }`}
        title="Link"
      >
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
      </button>
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
          }`}
          title="Align Left"
        >
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
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
          }`}
          title="Align Center"
        >
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
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
          }`}
          title="Align Right"
        >
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
        </button>
      </div>
    </div>
  );
};

function MediaBlock({ 
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
}) {
  const currentLayout = IMAGE_LAYOUTS.find(l => l.id === layout) || IMAGE_LAYOUTS[0];
  const mediaSources = src ? src.split(',') : [];
  const emptySlots = currentLayout.columns - mediaSources.length;

  const renderMediaSlot = (mediaSrc: string | undefined, index: number) => {
    const aspectRatioClass = "aspect-video";
    
    if (currentLayout.mediaType === 'video') {
      const isYouTube = mediaSrc?.includes('youtube.com') || mediaSrc?.includes('youtu.be');
      const isVimeo = mediaSrc?.includes('vimeo.com');

      let embedSrc = mediaSrc;
      if (isYouTube) {
        const videoId = mediaSrc?.split('v=')[1]?.split('&')[0] || mediaSrc?.split('/').pop();
        embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1`;
      } else if (isVimeo) {
        const videoId = mediaSrc?.split('/').pop();
        embedSrc = `https://player.vimeo.com/video/${videoId}?autoplay=0&controls=1`;
      }

      return mediaSrc ? (
        <div className={`relative group ${aspectRatioClass}`}>
          {isYouTube || isVimeo ? (
            <iframe
              src={embedSrc}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={`${currentLayout.imageClass} w-full h-full object-cover`}
              title={`Video ${index + 1}`}
            ></iframe>
          ) : (
            <video 
              src={mediaSrc} 
              controls
              className={`${currentLayout.imageClass} w-full h-full object-cover ${aspectRatioClass}`} 
              title={`Video ${index + 1}`} 
            />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddMedia?.(index, 'video');
            }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-30 transition-opacity"
          >
            <PlusCircle className="w-8 h-8 text-white" />
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddMedia?.(index, 'video');
          }}
          className={`w-full ${aspectRatioClass} flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors`}
        >
          <Video className="w-8 h-8 text-gray-400 hover:text-blue-500" />
        </button>
      );
    } else {
      return mediaSrc ? (
        <div className={`relative group ${aspectRatioClass}`}>
          <img 
            src={mediaSrc} 
            className={`${currentLayout.imageClass} w-full h-full object-cover ${aspectRatioClass}`} 
            alt={`Image ${index + 1}`} 
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddMedia?.(index, 'image');
            }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-30 transition-opacity"
          >
            <PlusCircle className="w-8 h-8 text-white" />
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddMedia?.(index, 'image');
          }}
          className={`w-full ${aspectRatioClass} flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors`}
        >
          <PlusCircle className="w-8 h-8 text-gray-400 hover:text-blue-500" />
        </button>
      );
    }
  };

  const renderLayout = () => {
    return (
      <div className={currentLayout.containerClass}>
        {currentLayout.columns > 1 ? (
          <div className={`grid ${currentLayout.containerClass.includes('grid-cols-10') ? 
            'grid-cols-10' : 'grid-cols-2'} gap-4`}>
            {[...mediaSources, ...Array(emptySlots).fill(undefined)].map((mediaSrc, index) => (
              <div key={index} className={
                layout === 'layout4' ? 
                  (index === 0 ? 'col-span-7' : 'col-span-3') :
                layout === 'layout5' ?
                  (index === 0 ? 'col-span-3' : 'col-span-7') :
                  ''
              }>
                {renderMediaSlot(mediaSrc, index)}
              </div>
            ))}
          </div>
        ) : (
          renderMediaSlot(mediaSources[0], 0)
        )}
      </div>
    );
  };

  return (
    <div className="relative group my-4">
      {renderLayout()}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-2 rounded shadow flex flex-wrap gap-1">
        {IMAGE_LAYOUTS.filter(l => l.mediaType === currentLayout.mediaType).map((layoutOption) => (
          <button
            key={layoutOption.id}
            onClick={(e) => {
              e.stopPropagation();
              onChangeLayout?.(layoutOption.id);
            }}
            className={`px-2 py-1 text-xs ${
              layout === layoutOption.id ? 'bg-blue-100' : 'bg-gray-100'
            } rounded hover:bg-gray-200 transition-colors`}
            title={layoutOption.description}
          >
            {layoutOption.name}
          </button>
        ))}
      </div>
    </div>
  );
}

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
        class: 'whitespace-normal prose max-w-none',
      },
    },
  });

  useEffect(() => {
    const loadWorks = async () => {
      try {
        const worksData = await getWorks();
        setWorks(worksData);
        if (worksData.length > 0) {
          setSelectedWork(worksData[0]);
          try {
            const content = JSON.parse(worksData[0].content);
            setBlocks(content);
          } catch {
            setBlocks([{ id: '1', type: 'text', content: worksData[0].content || '<p></p>' }]);
          }
        }
      } catch (error) {
        console.error('Failed to load works:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadWorks();
  }, []);

  const filteredWorks = works.filter(work => {
    const matchesSearch = work.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = workTypeFilter === 'All' || work.type === workTypeFilter;
    return matchesSearch && matchesType;
  });

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
    } catch (error) {
      console.error('Failed to create work:', error);
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
    } catch (error) {
      console.error('Failed to save work:', error);
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
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadError(
          error instanceof Error 
            ? error.message 
            : 'Failed to upload image. Please try again.'
        );
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
      alert('You must keep at least one block, or clear existing content before removing the last block.');
      return;
    }
    
    setBlocks(blocks.filter(b => b.id !== id));
    setHasChanges(true);
    if (activeBlockId === id) {
      setActiveBlockId(blocks[0]?.id || null);
    }
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
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Add New Content</h3>
            <button 
              onClick={() => setShowAddMenu({show: false})}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {uploadError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {uploadError}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => {
                showAddMenu.blockId ? addTextBlock(showAddMenu.blockId) : addTextBlock();
                setShowAddMenu({show: false});
              }}
              className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <Type className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">Text Block</p>
                <p className="text-sm text-gray-500">Add a text editor block</p>
              </div>
            </button>

            <div className="border-t pt-3">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Media Layouts</h4>
              <div className="grid grid-cols-2 gap-3">
                {IMAGE_LAYOUTS.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => {
                      showAddMenu.blockId 
                        ? addMediaBlock(showAddMenu.blockId, layout.id)
                        : addMediaBlock(undefined, layout.id);
                      setShowAddMenu({show: false});
                    }}
                    className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-gray-100 p-2 rounded-full">
                      {layout.mediaType === 'video' ? (
                        <Video className="w-5 h-5" />
                      ) : (
                        <ImageIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium">{layout.name}</span>
                      <p className="text-xs text-gray-500">{layout.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
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
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Works</h1>
        <button
          onClick={handleCreateWork}
          className="p-2 bg-blue-500 text-white rounded-full"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Left sidebar - 35% width */}
      <div className="w-full md:w-[35%] border-r bg-white flex flex-col">
        <div className="p-4 border-b hidden md:block">
          <h2 className="text-xl font-bold mb-4">Works</h2>
          
          <div className="flex flex-col space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search works..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {['All', 'Residential', 'Commercial'].map((type) => (
                <button
                  key={type}
                  onClick={() => setWorkTypeFilter(type as any)}
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                    workTypeFilter === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleCreateWork}
            className="w-full hidden md:flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Work
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredWorks.map(work => (
            <div
              key={work.id}
              onClick={() => {
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
              }}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 flex justify-between items-center ${
                selectedWork?.id === work.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div>
                <h3 className="font-medium">{work.name}</h3>
                <p className="text-sm text-gray-500">{work.type} • {work.location}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(work.updated_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right content area - 65% width */}
      <div className="w-full md:w-[65%] flex flex-col">
        {selectedWork ? (
          <>
            <div className="p-4 border-b bg-white">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                <h2 className="text-xl font-bold truncate">
                  {isNewWork ? 'New Work' : selectedWork.name}
                </h2>
                <div className="flex items-center gap-2">
                  {lastSaved && (
                    <span className="text-sm text-gray-500 hidden md:inline">
                      Last saved: {new Date(lastSaved).toLocaleString()}
                      {hasChanges && <span className="text-yellow-500 ml-2">*</span>}
                    </span>
                  )}
                  <button
                    onClick={handleSaveWork}
                    disabled={isSaving || !hasChanges}
                    className={`px-4 py-2 rounded transition-colors ${
                      isSaving 
                        ? 'bg-gray-400 text-white' 
                        : hasChanges 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
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
                      ? 'border-b-2 border-blue-500 text-blue-600' 
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
                      ? 'border-b-2 border-blue-500 text-blue-600' 
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Architects (comma-separated)</label>
                    <input
                      type="text"
                      value={selectedWork.architects || ''}
                      onChange={(e) => {
                        setSelectedWork({...selectedWork, architects: e.target.value});
                        setHasChanges(true);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., John Doe, Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Other Participants (comma-separated)</label>
                    <input
                      type="text"
                      value={selectedWork.other_participants || ''}
                      onChange={(e) => {
                        setSelectedWork({...selectedWork, other_participants: e.target.value});
                        setHasChanges(true);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Builder Co., Lighting Solutions"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photography By (comma-separated)</label>
                    <input
                      type="text"
                      value={selectedWork.photography || ''}
                      onChange={(e) => {
                        setSelectedWork({...selectedWork, photography: e.target.value});
                        setHasChanges(true);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Photo Studio A, B Photography"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 200 sq.m."
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., https://yourdomain.com/image.jpg"
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
                              } catch (error) {
                                alert(`Error uploading main image: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                              activeBlockId === block.id ? 'ring-2 ring-blue-300' : ''
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
                        
                        {/* Block Controls - Now below the block */}
                        <div className="flex justify-between items-center mt-2 px-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => moveBlock(block.id, 'up')}
                              disabled={index === 0}
                              className={`p-2 rounded ${
                                index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
                              } transition-colors`}
                              title="Move up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveBlock(block.id, 'down')}
                              disabled={index === blocks.length - 1}
                              className={`p-2 rounded ${
                                index === blocks.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
                              } transition-colors`}
                              title="Move down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => setShowAddMenu({show: true, blockId: block.id})}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                            title="Add content block"
                          >
                            <PlusCircle className="w-5 h-5 text-gray-600" />
                          </button>
                          
                          <button
                            onClick={() => removeBlock(block.id)}
                            className="p-2 text-red-600 rounded hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a work or create a new one to start editing.
          </div>
        )}
        {renderAddMenu()}
      </div>
    </div>
  );
}