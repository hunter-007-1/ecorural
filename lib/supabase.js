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
      .eq('is_active', true)
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

export async function fetchRoutes() {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching routes:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching routes:', error);
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
      .from('user_items')
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
      .order('acquired_at', { ascending: false });
    
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

export async function getUserOrders(userId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        products (
          name,
          image_url,
          category
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function buyProduct(userId, productId, quantity = 1) {
  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, price, name')
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
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity: quantity,
        total_price: totalPrice,
        status: 'completed',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    const { data: item, error: itemError } = await supabase
      .from('user_items')
      .upsert({
        user_id: userId,
        product_id: productId,
        quantity: quantity,
        acquired_type: 'purchase',
        acquired_at: new Date().toISOString()
      }, { onConflict: 'user_id, product_id' })
      .select()
      .single();
    
    if (itemError) throw itemError;
    
    return { success: true, order, item };
  } catch (error) {
    console.error('Error buying product:', error);
    return { success: false, error: error.message };
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getUserActivities(userId, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
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

export async function logActivity(userId, steps, carbonSaved, activityType = 'walking', durationSeconds = 0) {
  try {
    const caloriesBurned = Math.round(carbonSaved * 100);
    const distanceKm = steps / 1000;
    const pointsEarned = Math.round(carbonSaved * 10);
    
    const { data: activity, error: activityError } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        steps: steps,
        distance_km: distanceKm,
        carbon_saved: carbonSaved,
        calories_burned: caloriesBurned,
        duration_seconds: durationSeconds,
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
    const newPoints = (profile?.points || 0) + pointsEarned;
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        carbon_saved: newCarbonReduction,
        points: newPoints,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    const today = new Date().toISOString().split('T')[0];
    const { error: dailyError } = await supabase
      .from('user_daily_stats')
      .upsert({
        user_id: userId,
        stats_date: today,
        total_steps: steps,
        total_carbon_saved: carbonSaved,
        total_calories_burned: caloriesBurned,
        total_coins_earned: pointsEarned
      }, { onConflict: 'user_id, stats_date' });
    
    if (dailyError) console.error('Error updating daily stats:', dailyError);
    
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

export async function getUserMedals(userId) {
  try {
    const { data, error } = await supabase
      .from('user_medals')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching medals:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching medals:', error);
    return [];
  }
}

export async function updateMedalProgress(userId, medalId, progress) {
  try {
    const { data, error } = await supabase
      .from('user_medals')
      .update({ current_progress: progress })
      .eq('user_id', userId)
      .eq('medal_id', medalId)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating medal progress:', error);
    return { success: false, error: error.message };
  }
}

export async function unlockMedal(userId, medalId) {
  try {
    const { data, error } = await supabase
      .from('user_medals')
      .update({ 
        is_unlocked: true, 
        unlocked_at: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .eq('medal_id', medalId)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error unlocking medal:', error);
    return { success: false, error: error.message };
  }
}

export async function completeRoute(userId, routeId, coinsEarned) {
  try {
    const { data, error } = await supabase
      .from('user_routes')
      .insert({
        user_id: userId,
        route_id: routeId,
        coins_earned: coinsEarned,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        points: (profile?.points || 0) + coinsEarned,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error completing route:', error);
    return { success: false, error: error.message };
  }
}

export async function getWeeklyStats(userId) {
  try {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { data, error } = await supabase
      .from('user_daily_stats')
      .select('*')
      .eq('user_id', userId)
      .gte('stats_date', oneWeekAgo.toISOString().split('T')[0])
      .order('stats_date', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    return [];
  }
}
