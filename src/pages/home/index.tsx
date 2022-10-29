import { Button} from 'antd';
import React from 'react';
import {useLoaderData, useNavigate} from "react-router-dom";
import './style.css';

const HomePage: React.FC = () => {
    const isLoginObj = useLoaderData();
    const navigate = useNavigate();
    console.log('kkkk---:', isLoginObj)
    const onClickHandle = () => {
        console.log('fff');
        navigate('/login');
    }
    return (
        <div className='home-page'>
            <Button type="primary" onClick={onClickHandle}>爬取数据</Button>
            <Button type="primary">展示数据</Button>
            <Button type="primary">退出</Button>
        </div>
    );
};

export default HomePage;
