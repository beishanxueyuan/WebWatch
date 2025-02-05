import React, { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

const LogoutPage = () => {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            try {
                await supabase.auth.signOut();
                router.push('/');
            } catch (error) {
                console.error('退出登录出错:', error);
            }
        };

        logout();
    }, [router]);

    return (
        <div>
            <p>正在退出登录，请稍候...</p>
        </div>
    );
};

// 确保是默认导出组件
export default LogoutPage;