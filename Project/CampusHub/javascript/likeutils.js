import { supabase } from './supabaseClient.js';

export async function getLikeCount(contentId, contentType) {
    const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('content_id', contentId)
        .eq('content_type', contentType);

    if (error) {
        console.error("Error fetching like count: ", error)
        return 0;
    }

    return count ?? 0;
}

export async function hasUserLiked(userId, contentId, contentType) {
    const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .maybeSingle();

    if (error) {
        console.error("Error retrieving data: ", error)
        return false;
    }

    return !!data;
}

export async function addLike(userId, contentId, contentType) {
    const { error } = await supabase
        .from('likes')
        .insert({ 'user_id': userId, 'content_id': contentId, 'content_type': contentType });

    if (error) {
        console.error("Error adding like: ", error)
        return false;
    }

    return true;
}

export async function removeLike(userId, contentId, contentType) {
    const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .eq('content_type', contentType);

    if (error) {
        console.error("Error removing like: ", error)
        return false;
    }

    return true;
}