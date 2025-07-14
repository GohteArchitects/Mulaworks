// @/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials not configured');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  }
});

// ... (tipe dan fungsi lainnya tetap sama)

interface Work {
  id: string;
  name: string;
  type: 'Residential' | 'Commercial';
  location: string;
  completion_year: number;
  architects: string;
  other_participants: string;
  photography: string;
  area: string;
  principal: string;
  interior_designer: string;
  content: string;
  main_image?: string;
  created_at: string;
  updated_at: string;
}

interface Page {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Uploads an image to Supabase storage and returns the public URL
 * @param file - The image file to upload
 * @returns Promise<string> - Public URL of the uploaded image
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // File validation
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Only JPG, PNG, GIF, or WEBP images are allowed');
    }

    if (file.size > MAX_SIZE) {
      throw new Error(`File must be smaller than ${MAX_SIZE/1024/1024}MB`);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public_uploads/${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(uploadError.message || 'Failed to upload image');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    if (!publicUrl) {
      throw new Error('Failed to generate public URL');
    }

    return publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

/**
 * Gets content for a specific page
 * @param pageId - ID of the page to fetch
 * @returns Promise<Page> - Page content data
 */
export const getPageContent = async (pageId: string): Promise<Page> => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching page content:', error);
    throw error;
  }
};

/**
 * Updates content for a specific page
 * @param pageId - ID of the page to update
 * @param content - New content to save
 * @returns Promise<Page> - Updated page data
 */
export const updatePageContent = async (pageId: string, content: string): Promise<Page> => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .upsert({ 
        id: pageId,
        content, 
        updated_at: new Date().toISOString() 
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating page content:', error);
    throw error;
  }
};

/**
 * Gets all works from the database, ordered by most recently updated
 * @returns Promise<Work[]> - Array of work objects
 */
export const getWorks = async (): Promise<Work[]> => {
  try {
    const { data, error } = await supabase
      .from('work')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching works:', error);
    throw error;
  }
};

/**
 * Gets works by type, excluding a specific ID if provided
 * @param type - Type of work ('Residential' or 'Commercial')
 * @param limit - Maximum number of works to return
 * @param excludeId - Optional ID to exclude from results
 * @returns Promise<Work[]> - Array of work objects
 */
export const getWorksByType = async (
  type: 'Residential' | 'Commercial', 
  limit: number,
  excludeId?: string
): Promise<Work[]> => {
  try {
    let query = supabase
      .from('work')
      .select('*')
      .eq('type', type)
      .order('completion_year', { ascending: false })
      .limit(limit);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching works by type:', error);
    throw error;
  }
};

/**
 * Creates a new work in the database
 * @param workData - Object containing work properties
 * @returns Promise<Work> - The created work object
 */
export const createWork = async (workData: Omit<Work, 'id' | 'created_at' | 'updated_at'>): Promise<Work> => {
  try {
    const { data, error } = await supabase
      .from('work')
      .insert({
        ...workData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating work:', error);
    throw error;
  }
};

/**
 * Updates an existing work in the database
 * @param id - ID of the work to update
 * @param workData - Object containing updated work properties
 * @returns Promise<Work> - The updated work object
 */
export const updateWork = async (id: string, workData: Partial<Work>): Promise<Work> => {
  try {
    const { data, error } = await supabase
      .from('work')
      .update({
        ...workData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating work:', error);
    throw error;
  }
};

/**
 * Gets a single work by ID
 * @param id - ID of the work to fetch
 * @returns Promise<Work> - The work object
 */
export const getWorkById = async (id: string): Promise<Work> => {
  try {
    const { data, error } = await supabase
      .from('work')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching work:', error);
    throw error;
  }
};

/**
 * Deletes a work from the database
 * @param id - ID of the work to delete
 * @returns Promise<void>
 */
export const deleteWork = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('work')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting work:', error);
    throw error;
  }
};