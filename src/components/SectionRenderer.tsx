import React from 'react';
import ChartRenderer from './ChartRenderer';
import '../styles/SectionRenderer.css';

interface ImageItem {
  data: string;
  name: string;
  width?: number; // 新增宽度属性，用于拖拽调整大小
  height?: number; // 新增高度属性，用于拖拽调整大小
}

interface Section {
  id: string;
  title: string;
  type: 'text' | 'chart' | 'cards' | 'image';
  content: any;
  order: number;
}

interface SectionRendererProps {
  section: Section;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  // 根据图片数量确定grid布局类名
  const getImageGridClass = (images: ImageItem[]) => {
    if (images.length === 0) return '';
    if (images.length === 1) return 'grid-1';
    if (images.length === 2) return 'grid-2';
    return 'grid-3';
  };

  const renderContent = () => {
    switch (section.type) {
      case 'text':
        return (
          <div className="text-content">
            {section.content.split('\n').map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        );
        
      case 'image':
        // 处理多图片展示
        const images = Array.isArray(section.content) ? section.content : 
                      (section.content && section.content.data ? [section.content] : []);
        
        return (
          <div className="image-content">
            <div className={`image-grid ${getImageGridClass(images)}`}>
              {images.map((image: ImageItem, i: number) => (
                <div 
                  key={i} 
                  className="image-item"
                  style={{
                    width: image.width ? `${image.width}px` : undefined,
                    height: image.height ? `${image.height}px` : undefined
                  }}
                >
                  <img 
                    src={image.data} 
                    alt={image.name || `图片 ${i+1}`} 
                    className="section-image"
                  />
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'cards':
        return (
          <div className="cards-content">
            {Array.isArray(section.content) && section.content.map((card, i) => (
              <div key={i} className="card">
                <h3 className="card-title">{card.title}</h3>
                <div className="card-body">
                  {card.content.split('\n').map((paragraph: string, j: number) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'chart':
        return (
          <div className="chart-content">
            {section.content && section.content.type ? (
              <ChartRenderer 
                type={section.content.type} 
                data={section.content.data} 
              />
            ) : (
              <div className="chart-placeholder">
                <h4>图表: {section.content?.type || '未指定类型'}</h4>
                <p>未提供有效的图表数据</p>
              </div>
            )}
          </div>
        );
        
      default:
        return <div>未知的章节类型</div>;
    }
  };

  return (
    <section id={section.id} className={`content-section ${section.type}-section`}>
      <div className="section-title">
        <h2>{section.title}</h2>
      </div>
      <div className="section-content">
        {renderContent()}
      </div>
    </section>
  );
};

export default SectionRenderer;
