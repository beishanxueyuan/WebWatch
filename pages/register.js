import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/RegisterPage.module.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [invitationCode, setInvitationCode] = useState('');
    const [error, setError] = useState(null);

    const handleRegister = async () => {
        const validInvitationCode = 'beishanxueyuan666';
        if (invitationCode!== validInvitationCode) {
            setError('邀请码无效，请输入正确的邀请码。');
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password
            });
            if (error) {
                setError(error.message);
            } else {
                alert('注册成功，请登录');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>注册</h1>
            {error && <p className={styles.error}>{error}</p>}
            <input
                className={styles.input}
                type="email"
                placeholder="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className={styles.input}
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className={styles.input}
                type="text"
                placeholder="邀请码"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
            />
            <button className={styles.button} onClick={handleRegister}>注册</button>
        </div>
    );
};

export default RegisterPage;