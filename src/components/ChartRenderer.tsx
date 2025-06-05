import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import '../styles/ChartRenderer.css';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartRendererProps {
  type: string;
  data: any;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ type, data }) => {
  // 使用useMemo缓存处理后的数据，避免不必要的重新计算
  const chartData = useMemo(() => {
    try {
      // 如果data是字符串，尝试解析为JSON
      const chartData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // 确保有labels和values
      if (!chartData.labels || !chartData.values) {
        throw new Error('图表数据必须包含labels和values字段');
      }
      
      // 获取主色彩，如果没有则使用默认色彩
      const mainColor = chartData.mainColor || '#3a6ea5';
      
      // 根据主色彩生成渐变色系
      const generateColors = (baseColor: string, count: number) => {
        // 简单的色彩变化算法，实际项目中可以使用更复杂的算法
        const opacity = 0.6;
        
        // 将HEX转换为RGB
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 0, g: 0, b: 0 };
        };
        
        const rgb = hexToRgb(baseColor);
        
        // 为柱状图和折线图生成单一颜色
        if (type === 'bar' || type === 'line') {
          return {
            backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`,
            borderColor: baseColor
          };
        }
        
        // 为饼图生成多种颜色
        const backgroundColors = [];
        const borderColors = [];
        
        for (let i = 0; i < count; i++) {
          // 调整色相以创建不同颜色
          const hueShift = (i * 30) % 360;
          const shiftedRgb = shiftHue(rgb, hueShift);
          
          backgroundColors.push(`rgba(${shiftedRgb.r}, ${shiftedRgb.g}, ${shiftedRgb.b}, ${opacity})`);
          borderColors.push(`rgb(${shiftedRgb.r}, ${shiftedRgb.g}, ${shiftedRgb.b})`);
        }
        
        return {
          backgroundColor: backgroundColors,
          borderColor: borderColors
        };
      };
      
      // 简单的色相偏移函数
      const shiftHue = (rgb: {r: number, g: number, b: number}, degrees: number) => {
        // 将RGB转换为HSL，调整H，然后转回RGB
        // 这是一个简化版本，实际项目中可以使用更准确的算法
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;
        
        if (max === min) {
          h = s = 0; // 灰色
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          
          h = h * 60;
        }
        
        // 调整色相
        h = (h + degrees) % 360;
        
        // 转回RGB (简化版本)
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r1, g1, b1;
        
        if (h >= 0 && h < 60) {
          [r1, g1, b1] = [c, x, 0];
        } else if (h >= 60 && h < 120) {
          [r1, g1, b1] = [x, c, 0];
        } else if (h >= 120 && h < 180) {
          [r1, g1, b1] = [0, c, x];
        } else if (h >= 180 && h < 240) {
          [r1, g1, b1] = [0, x, c];
        } else if (h >= 240 && h < 300) {
          [r1, g1, b1] = [x, 0, c];
        } else {
          [r1, g1, b1] = [c, 0, x];
        }
        
        return {
          r: Math.round((r1 + m) * 255),
          g: Math.round((g1 + m) * 255),
          b: Math.round((b1 + m) * 255)
        };
      };
      
      const colors = generateColors(mainColor, chartData.labels.length);
      
      // 构建Chart.js数据格式
      return {
        labels: chartData.labels,
        datasets: [
          {
            label: chartData.title || '数据集',
            data: chartData.values,
            backgroundColor: colors.backgroundColor,
            borderColor: colors.borderColor,
            borderWidth: 1,
          },
        ],
      };
    } catch (error) {
      console.error('图表数据处理错误:', error);
      return null;
    }
  }, [type, data]); // 只有当type或data变化时才重新计算

  // 图表选项
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300 // 减少动画时间，减轻闪烁感
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: type === 'bar' ? '柱状图' : type === 'line' ? '折线图' : '饼图',
      },
    },
  }), [type]); // 只有当type变化时才重新创建options

  // 如果数据处理失败，显示错误信息
  if (!chartData) {
    return (
      <div className="chart-error">
        <h4>图表数据格式错误</h4>
        <p>请确保数据包含labels和values字段</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  // 使用key属性确保图表类型变化时完全重新渲染，而不是更新
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar key="bar-chart" data={chartData} options={options} />;
      case 'line':
        return <Line key="line-chart" data={chartData} options={options} />;
      case 'pie':
        return <Pie key="pie-chart" data={chartData} options={options} />;
      default:
        return <Bar key="default-chart" data={chartData} options={options} />;
    }
  };

  return (
    <div className="chart-container">
      {renderChart()}
    </div>
  );
};

// 使用React.memo包装组件，避免不必要的重新渲染
export default React.memo(ChartRenderer);
