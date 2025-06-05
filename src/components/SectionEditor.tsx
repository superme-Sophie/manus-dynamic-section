import React, { useState, useEffect, useCallback, memo } from 'react';
import MultiImageUploader from './MultiImageUploader';
import ChartDataEditor from './ChartDataEditor';
import '../styles/SectionEditor.css';

interface ImageItem {
  data: string;
  name: string;
  width?: number;
  height?: number;
}

interface Section {
  id: string;
  title: string;
  type: 'text' | 'chart' | 'cards' | 'image';
  content: any;
  order: number;
}

interface SectionEditorProps {
  section: Section | null;
  onSave: (section: Section) => void;
  onCancel: () => void;
}

// 使用memo包装ChartTypeSelector组件，避免不必要的重渲染
const ChartTypeSelector = memo(({ 
  chartType, 
  onChartTypeChange 
}: { 
  chartType: string, 
  onChartTypeChange: (type: string) => void 
}) => {
  return (
    <div className="form-group">
      <label htmlFor="chart-type">图表类型</label>
      <select
        id="chart-type"
        value={chartType}
        onChange={(e) => onChartTypeChange(e.target.value)}
      >
        <option value="bar">柱状图</option>
        <option value="line">折线图</option>
        <option value="pie">饼图</option>
      </select>
    </div>
  );
});

// 使用memo包装ChartSection组件，隔离图表相关的渲染
const ChartSection = memo(({ 
  chartType, 
  chartData, 
  onChartTypeChange, 
  onChartDataChange 
}: { 
  chartType: string, 
  chartData: any, 
  onChartTypeChange: (type: string) => void, 
  onChartDataChange: (data: any) => void 
}) => {
  return (
    <>
      <ChartTypeSelector chartType={chartType} onChartTypeChange={onChartTypeChange} />
      <div className="form-group">
        <label>图表数据</label>
        <ChartDataEditor 
          initialData={chartData}
          onChange={onChartDataChange}
          chartType={chartType}
        />
      </div>
    </>
  );
});

const SectionEditor: React.FC<SectionEditorProps> = ({ 
  section, 
  onSave, 
  onCancel 
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'text' | 'chart' | 'cards' | 'image'>('text');
  const [content, setContent] = useState<any>('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [cardsCount, setCardsCount] = useState(3);
  const [cards, setCards] = useState<Array<{title: string, content: string}>>([]);
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState<any>({
    labels: ['项目1', '项目2', '项目3'],
    values: [10, 20, 30],
    title: '数据集',
    mainColor: '#3a6ea5'
  });

  useEffect(() => {
    if (section) {
      setTitle(section.title);
      setType(section.type);
      
      // 处理图片内容
      if (section.type === 'image') {
        if (Array.isArray(section.content)) {
          setImages(section.content);
        } else if (typeof section.content === 'object' && section.content?.data) {
          // 转换旧格式
          setImages([{ data: section.content.data, name: section.content.name || 'image' }]);
        } else {
          setImages([]);
        }
      } 
      // 处理卡片内容
      else if (section.type === 'cards' && Array.isArray(section.content)) {
        setCards(section.content);
        setCardsCount(section.content.length);
      } 
      // 处理图表内容
      else if (section.type === 'chart' && typeof section.content === 'object') {
        setChartType(section.content.type || 'bar');
        
        // 处理图表数据
        if (section.content.data) {
          try {
            // 如果是字符串，尝试解析为JSON
            const data = typeof section.content.data === 'string' 
              ? JSON.parse(section.content.data) 
              : section.content.data;
              
            setChartData(data);
          } catch (e) {
            console.error('解析图表数据失败:', e);
            setChartData({
              labels: ['项目1', '项目2', '项目3'],
              values: [10, 20, 30],
              title: '数据集',
              mainColor: '#3a6ea5'
            });
          }
        }
      } 
      // 处理文本内容
      else {
        setContent(section.content || '');
      }
    }
  }, [section]);

  useEffect(() => {
    // 初始化卡片
    if (type === 'cards') {
      const newCards = [...cards];
      
      while (newCards.length < cardsCount) {
        newCards.push({ title: `卡片 ${newCards.length + 1}`, content: '' });
      }
      
      while (newCards.length > cardsCount) {
        newCards.pop();
      }
      
      setCards(newCards);
    }
  }, [cardsCount, type]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'text' | 'chart' | 'cards' | 'image';
    setType(newType);
    
    // 重置内容
    if (newType === 'cards') {
      const initialCards = Array(cardsCount).fill(0).map((_, i) => ({
        title: `卡片 ${i + 1}`,
        content: ''
      }));
      setCards(initialCards);
    } else if (newType === 'chart') {
      // 保持当前图表类型和数据，避免重置导致的闪动
      if (chartType === '') {
        setChartType('bar');
      }
      if (!chartData || !chartData.labels) {
        setChartData({
          labels: ['项目1', '项目2', '项目3'],
          values: [10, 20, 30],
          title: '数据集',
          mainColor: '#3a6ea5'
        });
      }
    } else if (newType === 'image') {
      setImages([]);
    } else {
      setContent('');
    }
  };

  const handleCardChange = useCallback((index: number, field: 'title' | 'content', value: string) => {
    setCards(prevCards => {
      const updatedCards = [...prevCards];
      updatedCards[index] = {
        ...updatedCards[index],
        [field]: value
      };
      return updatedCards;
    });
  }, []);

  const handleImagesChange = useCallback((newImages: ImageItem[]) => {
    setImages(newImages);
  }, []);
  
  const handleChartDataChange = useCallback((data: any) => {
    setChartData(data);
  }, []);

  const handleChartTypeChange = useCallback((newType: string) => {
    setChartType(newType);
    // 不重置图表数据，避免闪动
  }, []);

  const handleSave = () => {
    if (!section) return;
    
    let sectionContent;
    
    switch (type) {
      case 'image':
        sectionContent = images;
        break;
      case 'cards':
        sectionContent = cards;
        break;
      case 'chart':
        sectionContent = { 
          type: chartType, 
          data: chartData 
        };
        break;
      default:
        sectionContent = content;
    }
    
    onSave({
      ...section,
      title,
      type,
      content: sectionContent
    });
  };

  if (!section) return null;

  return (
    <div className="section-editor-overlay">
      <div className="section-editor">
        <div className="section-editor-header">
          <h2>{section.id ? '编辑章节' : '新建章节'}</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        
        <div className="section-editor-body">
          <div className="form-group">
            <label htmlFor="section-title">章节标题</label>
            <input
              id="section-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入章节标题"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="section-type">章节类型</label>
            <select
              id="section-type"
              value={type}
              onChange={handleTypeChange}
            >
              <option value="text">文本</option>
              <option value="image">图片</option>
              <option value="chart">图表</option>
              <option value="cards">卡片组</option>
            </select>
          </div>
          
          {type === 'text' && (
            <div className="form-group">
              <label htmlFor="section-content">章节内容</label>
              <textarea
                id="section-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入章节内容"
                rows={10}
              />
            </div>
          )}
          
          {type === 'image' && (
            <div className="form-group">
              <label>上传图片</label>
              <MultiImageUploader 
                onImagesChange={handleImagesChange}
                initialImages={images}
              />
            </div>
          )}
          
          {type === 'chart' && (
            <ChartSection 
              chartType={chartType}
              chartData={chartData}
              onChartTypeChange={handleChartTypeChange}
              onChartDataChange={handleChartDataChange}
            />
          )}
          
          {type === 'cards' && (
            <>
              <div className="form-group">
                <label htmlFor="cards-count">卡片数量</label>
                <input
                  id="cards-count"
                  type="number"
                  min="1"
                  max="10"
                  value={cardsCount}
                  onChange={(e) => setCardsCount(parseInt(e.target.value) || 3)}
                />
              </div>
              
              {cards.map((card, index) => (
                <div key={index} className="card-editor">
                  <h4>卡片 {index + 1}</h4>
                  <div className="form-group">
                    <label htmlFor={`card-title-${index}`}>卡片标题</label>
                    <input
                      id={`card-title-${index}`}
                      type="text"
                      value={card.title}
                      onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                      placeholder="输入卡片标题"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`card-content-${index}`}>卡片内容</label>
                    <textarea
                      id={`card-content-${index}`}
                      value={card.content}
                      onChange={(e) => handleCardChange(index, 'content', e.target.value)}
                      placeholder="输入卡片内容"
                      rows={4}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        
        <div className="section-editor-footer">
          <button className="cancel-button" onClick={onCancel}>取消</button>
          <button className="save-button" onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );
};

export default SectionEditor;
