import {message, Button} from 'antd';
import React, {useEffect, useState}from 'react';
import {useLoaderData, useNavigate} from "react-router-dom";
import request from '../../request';
import ReactECharts from 'echarts-for-react';
import {isEmpty} from 'lodash';
import {getEchartOptionHandle} from './util';
import {RES_STATUS} from '../../config'
import './style.css';

const HomePage: React.FC = () => {
    const isLoginObj = useLoaderData();
    console.log('isLoginObj:', isLoginObj)
    const navigate = useNavigate();
    const [showDatas, setShowDatas] = useState({})

    // 获取爬到的数据，并生成echart展示数据
    const getShowDatas = () => {
        request.get('/api/showData')
            .then(res => {
                const courseData = res?.data;
                if(!isEmpty(courseData)) {
                    setShowDatas(getEchartOptionHandle(courseData));
                }
            })
            .catch((err) => {
                // 处理错误情况
                message.error('退出失败异常，请重试');
            })
    }

    useEffect(() => {
        getShowDatas();
    }, [])

    // 退出登录
    const onLogoutHandle = () => {
        request.get('/api/logout')
            .then(res => {
                const isLogout = res?.data;
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

    // 主动触发爬取一次数据
    const onCrowllerHandle = () => {
        request.get('/api/getData')
            .then(res => {
                const status = res?.status;
                if(status === RES_STATUS.SUCCESS) {
                    message.success('爬取成功');
                    getShowDatas();
                } else {
                    message.error('爬取数据异常，请重试');
                }
            })
            .catch((err) => {
                // 处理错误情况
                message.error('爬取数据异常，请重试');
            })
    }

    return (
        <>
            <div className='home-page'>
                <Button
                    type="primary"
                    onClick={onCrowllerHandle}
                >爬取数据</Button>
                <Button type="primary" onClick={onLogoutHandle}>退出</Button>
            </div>
            <ReactECharts option={showDatas} />
        </>
    );
};

export default HomePage;
