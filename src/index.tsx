import React from 'react';
import ReactDOM from 'react-dom/client';
import {message } from 'antd';
import axios from 'axios';
import {
  redirect,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from './pages/home';
import LoginPage from './pages/login';
import reportWebVitals from './reportWebVitals';
import './index.css';

const homePageLoader = () => {
    return axios.get('/api/isLogin')
      .then(res => {
        const isLogin = res?.data?.data;
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

const asyncHomePageLoader = async () => {
  try {
    const {
      data: {
        data: isLogin
      }
    } = await axios.get('/api/isLogin');
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
    loader: homePageLoader
  },
  {
    path: "/login",
    element: <LoginPage />
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
