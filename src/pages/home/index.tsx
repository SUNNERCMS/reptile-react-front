import {message, Button} from 'antd';
import React from 'react';
import {useLoaderData, useNavigate} from "react-router-dom";
import axios from 'axios';
import './style.css';

const HomePage: React.FC = () => {
    const isLoginObj = useLoaderData();
    const navigate = useNavigate();
    console.log('kkkk--isLoginObj-:', isLoginObj)

    const onLogoutHandle = () => {
        axios.get('/api/logout')
            .then(res => {
                console.log('reddd--', res);
                const isLogout = res?.data?.data;
                if(isLogout) {
                    message.success('退出成功');
                    navigate('/login');
                } else {
                    message.error('退出失败');
                }
            })
            .catch((err) => {
                // 处理错误情况
                message.error('退出失败异常，请重试');
            })
    }
    return (
        <div className='home-page'>
            <Button type="primary">爬取数据</Button>
            <Button type="primary">展示数据</Button>
            <Button type="primary" onClick={onLogoutHandle}>退出</Button>
        </div>
    );
};

export default HomePage;
