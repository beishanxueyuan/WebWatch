import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getUserId } from '../lib/auth';
import styles from '../styles/MonitoringPage.module.css';
import schedule from 'node-schedule';

export async function getServerSideProps() {
    schedule.scheduleJob('* * * * *', async () => {
        try {
            const { data: allMonitoringItems, error } = await supabase
               .from('monitoring_items')
               .select('*');

            if (error) {
                console.error('获取监控项出错:', error);
                return;
            }

            for (const item of allMonitoringItems) {
                try {
                    const response = await fetch(item.url);
                    const content = await response.text();
                    const newLength = content.length;

                    if (item.length!== null && newLength != item.length) {
                        await supabase
                           .from('monitoring_items')
                           .update({ length: newLength, status: 'Changed!!!' })
                           .eq('id', item.id);
                    } else {
                        await supabase
                           .from('monitoring_items')
                           .update({ length: newLength, status: 'No change' })
                           .eq('id', item.id);
                    }
                } catch (fetchError) {
                    console.error(`监控 ${item.name} 时出错:`, fetchError);
                }
            }
        } catch (jobError) {
            console.error('定时任务执行出错:', jobError);
        }
    });

    return {
        props: {}
    };
}

const MonitoringPage = () => {
    const [monitoringItems, setMonitoringItems] = useState([]);
    const [newItem, setNewItem] = useState({ type: 'js', url: '', name: '' });
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await getUserId();
                setUserId(id);
                if (id) {
                    fetchMonitoringItems(id);
                }
            } catch (error) {
                console.error('获取用户 ID 出错:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserId();
    }, []);

    const fetchMonitoringItems = async (userId) => {
        const { data, error } = await supabase
           .from('monitoring_items')
           .select('*')
           .eq('user_id', userId);

        if (error) {
            console.error('获取监控项出错:', error);
        } else {
            setMonitoringItems(data);
        }
    };

    const addMonitoringItem = async () => {
        if (!userId) return;
        const { type, url, name } = newItem;
        const { error } = await supabase
           .from('monitoring_items')
           .insert([{ user_id: userId, type, url, name, length: null, status: 'No change' }]);

        if (error) {
            console.error('添加监控项出错:', error);
        } else {
            setNewItem({ type: 'js', url: '', name: '' });
            fetchMonitoringItems(userId);
        }
    };

    const deleteMonitoringItem = async (itemId) => {
        if (!userId) return;
        const { error } = await supabase
           .from('monitoring_items')
           .delete()
           .eq('id', itemId);

        if (error) {
            console.error('删除监控项出错:', error);
        } else {
            fetchMonitoringItems(userId);
        }
    };

    if (loading) {
        return <div className={styles.container}>加载中...</div>;
    }

    if (!userId) {
        return <div className={styles.container}>请先登录</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>监控列表</h1>
            <div className={styles.inputGroup}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="监控项名称"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="监控 URL"
                    value={newItem.url}
                    onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                />
                <select
                    className={styles.select}
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                >
                    <option value="js">JS</option>
                    <option value="page">页面</option>
                </select>
                <button className={styles.button} onClick={addMonitoringItem}>添加监控项</button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>类型</th>
                        <th>URL</th>
                        <th>长度</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {monitoringItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.type}</td>
                            <td>
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                    {item.url}
                                </a>
                            </td>
                            <td>{item.length!== null ? item.length : '未获取'}</td>
                            <td className={item.status === 'Changed!!!' ? styles.changed : ''}>
                                {item.status || 'No change'}
                            </td>
                            <td>
                                <button className={styles.deleteButton} onClick={() => deleteMonitoringItem(item.id)}>删除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MonitoringPage;