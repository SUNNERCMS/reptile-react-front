import { message } from 'antd';
import { redirect } from "react-router-dom";
import request from './request';

export const isLoginCheckLoader = () => {
    return request.get('/api/isLogin')
      .then(res => {
        const isLogin: boolean = res?.data;
          if(isLogin) {
            message.success('登录成功');
            return {isLogin}
          } else {
            message.error('未登录，请先登录');
            return redirect('/login');
          }
      })
      .catch((err) => {
          // 处理错误情况
          message.error('登录异常，请重试');
          return redirect('/login');
      })
}

export const asyncIsLoginCheckLoader = async () => {
  try {
    const {
      data: isLogin
    } = await request.get('/api/isLogin');
    if(isLogin) {
      message.success('登录成功');
      return {isLogin}
    } else {
      message.error('未登录，请先登录');
      return redirect('/login');
    }
  } catch(err) {
    // Cannot GET /api/isLogin
    message.error('登录异常，请重试');
    return redirect('/login');
  }
}