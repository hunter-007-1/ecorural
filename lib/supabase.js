import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://your-project.supabase.co',
  supabaseAnonKey || 'your-anon-key'
);

export default supabase;

export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchStories() {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function getUserInventory(userId) {
  try {
    const { data, error } = await supabase
      .from('user_inventory')
      .select(`
        *,
        products (
          name,
          image_url,
          price,
          category
        )
      `)
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
}

export async function buyProduct(userId, productId, quantity = 1) {
  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('price')
      .eq('id', productId)
      .single();
    
    if (productError) throw productError;
    if (!product) throw new Error('Product not found');
    
    const totalPrice = product.price * quantity;
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    if (!profile || profile.points < totalPrice) {
      throw new Error('Insufficient points');
    }
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        points: profile.points - totalPrice,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    const { data: inventoryItem, error: inventoryError } = await supabase
      .from('user_inventory')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity: quantity,
        purchased_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (inventoryError) throw inventoryError;
    
    return { success: true, data: inventoryItem };
  } catch (error) {
    console.error('Error buying product:', error);
    return { success: false, error: error.message };
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getUserActivities(userId) {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

export async function logActivity(userId, steps, carbonSaved, activityType = 'walking') {
  try {
    const { data: activity, error: activityError } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        steps: steps,
        carbon_saved: carbonSaved,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (activityError) throw activityError;
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_carbon_reduction, points')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    const newCarbonReduction = (profile?.total_carbon_reduction || 0) + carbonSaved;
    const newPoints = (profile?.points || 0) + Math.round(carbonSaved * 10);
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        total_carbon_reduction: newCarbonReduction,
        points: newPoints,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    return { 
      success: true, 
      data: activity,
      newCarbonReduction,
      newPoints
    };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { success: false, error: error.message };
  }
}
