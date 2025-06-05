import { useState, useEffect, useRef, memo } from 'react';
import { SketchPicker } from 'react-color';
import '../styles/ChartDataEditor.css';

interface ChartDataEditorProps {
  initialData: any;
  onChange: (data: any) => void;
  chartType?: string; // 添加可选的chartType属性
}

// 使用memo包装整个组件，避免父组件重渲染时导致不必要的重渲染
const ChartDataEditor = memo(({ initialData, onChange, chartType = 'bar' }: ChartDataEditorProps) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [mainColor, setMainColor] = useState('#3a6ea5');
  
  // 使用ref跟踪是否已初始化
  const isInitialized = useRef(false);
  // 使用ref存储最新的数据，避免不必要的重渲染
  const dataRef = useRef({ labels, values, title, mainColor });
  
  // 只在组件首次渲染时初始化数据，避免每次prop变化都重置状态
  useEffect(() => {
    // 如果已经初始化过，则不再重新初始化
    if (isInitialized.current) {
      return;
    }
    
    try {
      const data = typeof initialData === 'string' ? JSON.parse(initialData) : initialData;
      
      if (data && data.labels && Array.isArray(data.labels)) {
        setLabels(data.labels);
      } else {
        setLabels(['项目1', '项目2', '项目3']);
      }
      
      if (data && data.values && Array.isArray(data.values)) {
        setValues(data.values);
      } else {
        setValues([10, 20, 30]);
      }
      
      if (data && data.title) {
        setTitle(data.title);
      } else {
        setTitle('数据集');
      }
      
      if (data && data.mainColor) {
        setMainColor(data.mainColor);
      }
      
      // 标记为已初始化
      isInitialized.current = true;
    } catch (e) {
      // 如果解析失败，设置默认值
      setLabels(['项目1', '项目2', '项目3']);
      setValues([10, 20, 30]);
      setTitle('数据集');
      
      // 即使失败也标记为已初始化，避免重复尝试
      isInitialized.current = true;
    }
  }, []);
  
  // 使用useEffect更新ref中的数据，但不触发重渲染
  useEffect(() => {
    dataRef.current = { labels, values, title, mainColor };
  }, [labels, values, title, mainColor]);
  
  // 使用防抖通知父组件数据变化，避免频繁更新
  useEffect(() => {
    const timer = setTimeout(() => {
      const chartData = {
        labels,
        values,
        title,
        mainColor
      };
      onChange(chartData);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [labels, values, title, mainColor, onChange]);
  
  // 添加新行
  const handleAddRow = () => {
    setLabels(prev => [...prev, `项目${prev.length + 1}`]);
    setValues(prev => [...prev, 0]);
  };
  
  // 删除行
  const handleRemoveRow = (index: number) => {
    setLabels(prev => {
      const newLabels = [...prev];
      newLabels.splice(index, 1);
      return newLabels;
    });
    
    setValues(prev => {
      const newValues = [...prev];
      newValues.splice(index, 1);
      return newValues;
    });
  };
  
  // 更新标签
  const handleLabelChange = (index: number, value: string) => {
    setLabels(prev => {
      const newLabels = [...prev];
      newLabels[index] = value;
      return newLabels;
    });
  };
  
  // 更新数值
  const handleValueChange = (index: number, value: string) => {
    setValues(prev => {
      const newValues = [...prev];
      newValues[index] = parseFloat(value) || 0;
      return newValues;
    });
  };
  
  // 处理颜色变化
  const handleColorChange = (color: any) => {
    setMainColor(color.hex);
  };
  
  // 使用React.memo包装表格行组件，避免整个表格重渲染
  const TableRow = memo(({ label, value, index }: { label: string, value: number, index: number }) => (
    <tr>
      <td>
        <input
          type="text"
          value={label}
          onChange={(e) => handleLabelChange(index, e.target.value)}
          placeholder={`项目${index + 1}`}
        />
      </td>
      <td>
        <input
          type="number"
          value={value}
          onChange={(e) => handleValueChange(index, e.target.value)}
          placeholder="0"
        />
      </td>
      <td>
        <button 
          className="remove-row-button"
          onClick={() => handleRemoveRow(index)}
          disabled={labels.length <= 1}
        >
          删除
        </button>
      </td>
    </tr>
  ));
  
  return (
    <div className="chart-data-editor">
      <div className="form-group">
        <label htmlFor="chart-title">图表标题</label>
        <input
          id="chart-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入图表标题"
        />
      </div>
      
      <div className="form-group">
        <label>主题颜色</label>
        <div className="color-picker-container">
          <div 
            className="color-preview"
            style={{ backgroundColor: mainColor }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          ></div>
          {showColorPicker && (
            <div className="color-picker-popover">
              <div 
                className="color-picker-cover" 
                onClick={() => setShowColorPicker(false)}
              />
              <SketchPicker 
                color={mainColor}
                onChange={handleColorChange}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="form-group">
        <label>数据表格 ({chartType === 'pie' ? '饼图' : chartType === 'line' ? '折线图' : '柱状图'})</label>
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>标签</th>
                <th>数值</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label, index) => (
                <TableRow 
                  key={index} 
                  label={label} 
                  value={values[index]} 
                  index={index} 
                />
              ))}
            </tbody>
          </table>
          
          <button 
            className="add-row-button"
            onClick={handleAddRow}
          >
            添加数据行
          </button>
        </div>
      </div>
    </div>
  );
});

export default ChartDataEditor;
