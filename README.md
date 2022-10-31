# reptile-typeScript-react-front
基于typeScript+react+roucterV6的爬虫前端工程

## v1: 前后端接口打通+登录功能+路由
##### v1-1 前后端接口联调
前端接口请求利用axios，请求的接口路径，由后端生成的路由决定，进行接口匹配之后处理相关逻辑，然后将处理结果返回给前端。  


登录页面输入密码后的提交请求接口处理：
```js
	// 提交表单且数据验证成功后回调事件
	const onFinish = (values: any) => {
		axios.post('/api/login',
            // 参数进行序列化
			qs.stringify({
				password: values.password
			}))
			.then(res => {
				const status = res.data.status;
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
```
后端LoginController对应的接口逻辑处理, 将数据通过res.json进行返回:
```js
    @post('/api/login')
    login(req: RequestWithBody, res: Response):void {
        // body需要用body-parse中间件进行解析，保证始终有body字段
        const {password} = req.body;
        if(isLogin(req)) {
            res.json(formatResponse({}, RES_STATUS.HAD_LOGIN));
        } else {
            if(password === '123' && req.session) {
                req.session.loginStatus = true;
                res.json(formatResponse({}, RES_STATUS.SUCCESS));
            } else {
                res.json(formatResponse({}, RES_STATUS.FAIL, '密码不正确'));
            }
        }
    };
```

##### v1-2 react-router V6 实现路由管理
使用了react-router V6来实现路由的管理 
```js

const router = createBrowserRouter([
  {
    path: "/", // 路径
    element: <HomePage />, //路径元素组件
    loader: isLoginCheckLoader // 前置数据获取
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
```
##### 1、使用了loader在路由组件渲染之前，通过接口请求获取登录状态
> Each route can define a "loader" function to provide data to the route element before it renders.  

##### 2、loader的实现：
- 通过promise.then的形式处理逻辑  
```js
export const isLoginCheckLoader = () => {
    return axios.get('/api/isLogin')
      .then(res => {
        const isLogin = res?.data?.data;
          if(isLogin) {
            message.success('登录成功');
            return {isLogin}  // 数据抛出
          } else {
            message.error('未登录，请先登录');
            return redirect('/login');  // 重定向抛出，否者不生效
          }
      })
      .catch((err) => {
          // 处理错误情况
          message.error('登录异常，请重试');
          return redirect('/login');
      })
}
```
- 异步anync+try catch使用,注意异常捕获的处理
```js
export const asyncIsLoginCheckLoader = async () => {
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
```

##### 3、loader的特点：  
（1）需要的数据可以通过return抛出，供该路由组件通过useLoaderData获取使用。  
```js
// 路由组件内使用loader数据
import {useLoaderData} from "react-router-dom";
const HomePage: React.FC = () => { 
    const isLoginObj = useLoaderData(); // hook函数

}
```
（2）redirect重定向需要return方生效。
- redirect使用的场景是loader和action  
- 组件内或者方法事件函数中实现重定向使用hook函数useNavigate  

```js
import { useNavigate } from "react-router-dom";
const LoginPage: React.FC = () => {
	const navigate = useNavigate();
    ...
    navigate('/');
    ...
}
```
## v2: 爬虫接口联调+Echart展示爬取数据
echart的的使用：  
- 安装 echarts-for-react，  一个简单的 Apache echarts 的 React 封装。  
- 引入使用：`import ReactECharts from 'echarts-for-react';`  

```js
    // 获取爬到的数据，并生成echart展示数据
    const getShowDatas = () => {
        axios.get('/api/showData')
            .then(res => {
                const courseData = res?.data?.data;
                if(!isEmpty(courseData)) {
                    setShowDatas(getEchartOptionHandle(courseData));
                }
            })
            .catch((err) => {
                // 处理错误情况
                message.error('退出失败异常，请重试');
            })
    }
```

通过封装的getEchartOptionHandle方法，生成Echart的数据，涉及到的类型注解如下：
```js
interface CourseItem {
    title: string;
    count: number;
}

interface SeriesItem {
    name: string;
    type: string;
    data: number[];
}

interface ResData {
    [key: string]: CourseItem[]
}
```
 获取echart的数据配置, 类型注解的使用如下：
```JS
export const getEchartOptionHandle = (resData: ResData) => {
    let legendCourseName: string[] = [];
    let xAxisTime: string[] = [];
    let tempData: {
        [key: string]: number[];
    } = {};
    let seriesData: SeriesItem[] = []

    for(let [key, valueItem] of Object.entries(resData)) {
        xAxisTime.push(moment(Number(key)).format('MM-DD HH:mm:ss'));
        valueItem.forEach(courseItem => {
            const {title, count} = courseItem;
            if(!includes(legendCourseName, title)) {
                legendCourseName.push(title);
            }
            tempData[title] ? tempData[title].push(count) : (tempData[title] = [count])
        });
    }

    for(let[key, value] of Object.entries(tempData)) {
        seriesData.push({
            name: key,
            type: 'line',
            data: value
        });
    }

    return {
        title: {
            text: 'Learn-num'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: legendCourseName
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisTime
          },
          yAxis: {
            type: 'value'
          },
          series: seriesData
    }
}
```
## v3: 增加axios实例响应拦截器
自定义axios实例，并添加拦截器，在响应被 then 或 catch 处理前拦截处理返回的数据结构。  
相关文档：  
- https://www.axios-http.cn/docs/instance
-  https://www.axios-http.cn/docs/interceptors

```js
import axios from "axios";

// 自定义配置新建一个实例。
const instance = axios.create({
    baseURL: '/',
    timeout: 1000,
});

// 响应拦截器-中间件进行拦截逻辑处理: 减少相应数据的data层级
instance.interceptors.response.use(response => {
    return response.data
});

// 将封装的axios实例导出，作为request封装提供给外部使用。
export default instance;

```
