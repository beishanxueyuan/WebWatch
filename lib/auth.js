// lib/auth.js
import { supabase } from './supabaseClient';

export const getSession = async () => {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    return session;
};

export const getUser = async () => {
    const session = await getSession();
    return session?.user;
};

export const getUserId = async () => {
    const user = await getUser();
    return user?.id;
};