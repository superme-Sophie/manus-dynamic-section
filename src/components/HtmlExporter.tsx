import React from 'react';
import { FaFileCode } from 'react-icons/fa';
import '../styles/HtmlExporter.css';

interface Section {
  id: string;
  title: string;
  type: 'text' | 'chart' | 'cards' | 'image';
  content: any;
  order: number;
}

interface HtmlExporterProps {
  sections: Section[];
}

const HtmlExporter: React.FC<HtmlExporterProps> = ({ sections }) => {
  const title = "动态章节配置工具"; // 默认标题
  
  const generateHtml = () => {
    // 创建基础HTML结构
    let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
    <style>
        :root {
            --primary-color: #3a6ea5;
            --secondary-color: #ff6b6b;
            --accent-color: #f9c74f;
            --text-color: #333;
            --light-bg: #f8f9fa;
            --white: #ffffff;
            --section-padding: 60px 0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
            color: var(--text-color);
            line-height: 1.6;
        }
        
        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        header {
            background-color: var(--primary-color);
            color: var(--white);
            padding: 20px 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        nav ul {
            display: flex;
            list-style: none;
            flex-wrap: wrap;
        }
        
        nav ul li {
            margin-left: 20px;
            margin-bottom: 5px;
        }
        
        nav ul li a {
            color: var(--white);
            text-decoration: none;
            padding: 5px 10px;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        
        nav ul li a:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .hero {
            background: linear-gradient(rgba(58, 110, 165, 0.8), rgba(58, 110, 165, 0.9));
            background-size: cover;
            background-position: center;
            height: 50vh;
            display: flex;
            align-items: center;
            text-align: center;
            color: var(--white);
            padding-top: 80px;
        }
        
        .hero-content {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 30px;
        }
        
        .content-section {
            padding: var(--section-padding);
            margin-bottom: 30px;
        }
        
        .content-section:nth-child(odd) {
            background-color: var(--white);
        }
        
        .content-section:nth-child(even) {
            background-color: var(--light-bg);
        }
        
        .section-title {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .section-title h2 {
            font-size: 2.2rem;
            color: var(--primary-color);
            margin-bottom: 15px;
        }
        
        .section-content {
            max-width: 900px;
            margin: 0 auto;
        }
        
        /* 文本内容样式 */
        .text-content p {
            margin-bottom: 15px;
            line-height: 1.8;
        }
        
        /* 图片内容样式 */
        .image-content {
            text-align: center;
        }
        
        .image-grid {
            display: grid;
            gap: 15px;
            width: 100%;
        }
        
        .image-grid.grid-1 {
            grid-template-columns: 1fr;
        }
        
        .image-grid.grid-2 {
            grid-template-columns: 1fr 1fr;
        }
        
        .image-grid.grid-3 {
            grid-template-columns: 1fr 1fr 1fr;
        }
        
        @media (max-width: 768px) {
            .image-grid.grid-3 {
                grid-template-columns: 1fr 1fr;
            }
        }
        
        @media (max-width: 480px) {
            .image-grid.grid-2,
            .image-grid.grid-3 {
                grid-template-columns: 1fr;
            }
        }
        
        .image-item {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .section-image {
            max-width: 100%;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        
        /* 卡片内容样式 */
        .cards-content {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }
        
        .card {
            flex: 1;
            min-width: 250px;
            max-width: 350px;
            background-color: var(--white);
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            transition: transform 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card-title {
            color: var(--primary-color);
            margin-bottom: 15px;
        }
        
        .card-body p {
            margin-bottom: 10px;
        }
        
        /* 图表内容样式 */
        .chart-content {
            background-color: var(--white);
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        
        .chart-container {
            position: relative;
            height: 400px;
            width: 100%;
        }
        
        footer {
            background-color: var(--primary-color);
            color: var(--white);
            padding: 20px 0;
            text-align: center;
        }
        
        .footer-content {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .copyright {
            margin-top: 10px;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
            }
            
            nav ul {
                margin-top: 20px;
                justify-content: center;
            }
            
            nav ul li {
                margin: 0 10px 10px;
            }
            
            .hero h1 {
                font-size: 2.5rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container header-content">
            <div class="logo">${title}</div>
            <nav>
                <ul>
                    ${sections.map(section => `<li><a href="#${section.id}">${section.title}</a></li>`).join('\n                    ')}
                </ul>
            </nav>
        </div>
    </header>

    <div class="hero">
        <div class="container hero-content">
            <h1>${title}</h1>
            <p>动态配置生成的页面</p>
        </div>
    </div>`;

    // 添加每个section的内容
    sections.sort((a, b) => a.order - b.order).forEach(section => {
      html += `
    <section id="${section.id}" class="content-section ${section.type}-section">
        <div class="container">
            <div class="section-title">
                <h2>${section.title}</h2>
            </div>
            <div class="section-content">
                ${renderSectionContent(section)}
            </div>
        </div>
    </section>`;
    });

    // 添加页脚
    html += `
    <footer>
        <div class="container footer-content">
            <div class="copyright">© ${new Date().getFullYear()} ${title}</div>
        </div>
    </footer>
    
    <script>
    // 初始化所有图表
    document.addEventListener('DOMContentLoaded', function() {
        const chartCanvases = document.querySelectorAll('.chart-canvas');
        chartCanvases.forEach(function(canvas) {
            const ctx = canvas.getContext('2d');
            const chartType = canvas.getAttribute('data-type');
            const chartData = JSON.parse(canvas.getAttribute('data-chart'));
            
            // 生成颜色
            const mainColor = chartData.mainColor || '#3a6ea5';
            let backgroundColor, borderColor;
            
            if (chartType === 'pie') {
                // 为饼图生成多种颜色
                backgroundColor = [];
                borderColor = [];
                
                for (let i = 0; i < chartData.labels.length; i++) {
                    const hue = (i * 30) % 360;
                    backgroundColor.push('hsla(' + hue + ', 70%, 60%, 0.7)');
                    borderColor.push('hsl(' + hue + ', 70%, 50%)');
                }
            } else {
                // 为柱状图和折线图使用单一颜色
                backgroundColor = 'rgba(' + hexToRgb(mainColor).join(',') + ',0.6)';
                borderColor = mainColor;
            }
            
            // 创建图表
            new Chart(ctx, {
                type: chartType,
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: chartData.title || '数据集',
                        data: chartData.values,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: chartType === 'bar' ? '柱状图' : chartType === 'line' ? '折线图' : '饼图'
                        }
                    }
                }
            });
        });
    });
    
    // 辅助函数：将HEX颜色转换为RGB数组
    function hexToRgb(hex) {
        const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }
    </script>
</body>
</html>`;

    return html;
  };

  const renderSectionContent = (section: Section) => {
    switch (section.type) {
      case 'text':
        return `<div class="text-content">
            ${section.content.split('\n').map((paragraph: string) => `<p>${paragraph}</p>`).join('\n            ')}
        </div>`;
        
      case 'image':
        // 处理多图片展示
        const images = Array.isArray(section.content) ? section.content : 
                      (section.content && section.content.data ? [section.content] : []);
        
        // 根据图片数量确定grid布局类名
        let gridClass = '';
        if (images.length === 1) gridClass = 'grid-1';
        else if (images.length === 2) gridClass = 'grid-2';
        else if (images.length > 2) gridClass = 'grid-3';
        
        return `<div class="image-content">
            <div class="image-grid ${gridClass}">
                ${images.map((image: any, i: number) => `
                <div class="image-item" ${image.width ? `style="width: ${image.width}px; height: ${image.height}px;"` : ''}>
                    <img src="${image.data}" alt="${image.name || `图片 ${i+1}`}" class="section-image">
                </div>`).join('')}
            </div>
        </div>`;
        
      case 'cards':
        return `<div class="cards-content">
            ${Array.isArray(section.content) ? section.content.map((card: any) => `
            <div class="card">
                <h3 class="card-title">${card.title}</h3>
                <div class="card-body">
                    ${card.content.split('\n').map((paragraph: string) => `<p>${paragraph}</p>`).join('\n                    ')}
                </div>
            </div>`).join('') : ''}
        </div>`;
        
      case 'chart':
        // 使用Canvas和Chart.js渲染图表，而不是显示原始数据
        { const chartType = section.content.type || 'bar';
        const chartData = section.content.data || { labels: [], values: [] };
        
        return `<div class="chart-content">
            <div class="chart-container">
                <canvas class="chart-canvas" data-type="${chartType}" data-chart='${JSON.stringify(chartData)}'></canvas>
            </div>
        </div>`; }
        
      default:
        return `<div>未知的章节类型</div>`;
    }
  };

  const handleExportHtml = () => {
    const html = generateHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '-')}_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // 显示成功通知
    const successNotification = document.createElement('div');
    successNotification.className = 'export-notification success';
    successNotification.textContent = 'HTML导出成功！';
    document.body.appendChild(successNotification);
    
    // 3秒后移除成功通知
    setTimeout(() => {
      document.body.removeChild(successNotification);
    }, 3000);
  };

  return (
    <div className="html-exporter">
      <button 
        className="export-html-button"
        onClick={handleExportHtml}
        title="导出为HTML文档"
      >
        <FaFileCode className="export-icon" />
        <span>导出HTML</span>
      </button>
    </div>
  );
};

export default HtmlExporter;
