import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';
import request from '../../request';
import { message } from 'antd';
import { useNavigate } from "react-router-dom";
import { RES_STATUS } from '../../config';
import qs from 'qs';
import './style.css';

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	// 提交表单且数据验证成功后回调事件
	const onFinish = (values: any) => {
		request.post('/api/login',
			qs.stringify({
				password: values.password
			}))
			.then(res => {
				const status = res?.status;
				if (status === RES_STATUS.SUCCESS || status === RES_STATUS.HAD_LOGIN) {
					message.success('登录成功');
					navigate('/');
				} else {
					message.error(res.data?.errMeg || '登录失败，请重试');
				}
			})
			.catch(function (error) {
				message.error('登录异常，请重试');
			});
	};

	//提交表单且数据验证失败后回调事件
	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<div className='login'>
			<Form
				name="basic"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item
					label="Password"
					name="password"
					rules={[{ required: true, message: '请输入密码' }]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
					<Checkbox>Remember me</Checkbox>
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default LoginPage;
