import {includes} from 'lodash';
import moment from 'moment';

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

// 获取echart的数据配置
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