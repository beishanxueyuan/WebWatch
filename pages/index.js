import React from 'react';
import Link from 'next/link';
import { getUser } from '../lib/auth';
import styles from '../styles/HomePage.module.css';

const HomePage = () => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getUser();
                setUser(currentUser);
            } catch (error) {
                console.error('获取用户信息出错:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className={styles.loading}>加载中，请稍候...</div>
        );
    }

    if (!user) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>WebWatcher</h1>
                <p className={styles.subtitle}>
                    WebWatcher Web js 监控系统，致力于为网络安全领域提供高效、精准的监控服务。<br />
                    Watcher Web js monitoring system is committed to providing efficient and accurate monitoring services for the field of network security.
                </p>
                <Link href="/login" className={styles.link}>
                    登录 Login
                </Link>
                <Link href="/register" className={styles.link}>
                    注册 Register
                </Link>
                <p className={styles.copyright}>
                    &copy; {new Date().getFullYear()} 北山学院 Beishan College. 保留所有权利 All rights reserved.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>WebWatcher</h1>
            <h2 style={{ fontSize: '2rem', color: '#343a40' }}>欢迎，{user.email}</h2>
            <Link href="/monitoring" className={styles.link}>
                管理监控列表 Manage Monitoring List
            </Link>
            <Link href="/logout" className={styles.link}>
                退出登录 Logout
            </Link>
            <p className={styles.copyright}>
                &copy; {new Date().getFullYear()} 北山学院 Beishan College. 保留所有权利 All rights reserved.
            </p>
        </div>
    );
};

export default HomePage;