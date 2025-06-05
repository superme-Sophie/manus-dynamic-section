import React, { useState, createContext, useContext, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { FaPalette } from 'react-icons/fa';
import '../styles/ThemeColorPicker.css';

// 创建主题色上下文
interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const defaultTheme = {
  primaryColor: '#3a6ea5',
  setPrimaryColor: () => {},
  secondaryColor: '#ff6b6b',
  setSecondaryColor: () => {},
  accentColor: '#f9c74f',
  setAccentColor: () => {}
};

export const ThemeContext = createContext<ThemeContextType>(defaultTheme);

// 主题色提供者组件
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState('#3a6ea5');
  const [secondaryColor, setSecondaryColor] = useState('#ff6b6b');
  const [accentColor, setAccentColor] = useState('#f9c74f');

  // 使用useEffect将CSS变量应用到:root元素，确保全局生效
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--secondary-color', secondaryColor);
    root.style.setProperty('--accent-color', accentColor);
    
    // 添加过渡效果，使颜色变化更平滑
    root.style.setProperty('transition', 'background-color 0.3s, color 0.3s, border-color 0.3s');
  }, [primaryColor, secondaryColor, accentColor]);

  return (
    <ThemeContext.Provider value={{
      primaryColor,
      setPrimaryColor,
      secondaryColor,
      setSecondaryColor,
      accentColor,
      setAccentColor
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 使用主题色的钩子
export const useTheme = () => useContext(ThemeContext);

// 主题色选择器组件
const ThemeColorPicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeColor, setActiveColor] = useState<'primary' | 'secondary' | 'accent'>('primary');
  const { 
    primaryColor, setPrimaryColor,
    secondaryColor, setSecondaryColor,
    accentColor, setAccentColor
  } = useTheme();

  const handleColorChange = (color: any) => {
    switch (activeColor) {
      case 'primary':
        setPrimaryColor(color.hex);
        break;
      case 'secondary':
        setSecondaryColor(color.hex);
        break;
      case 'accent':
        setAccentColor(color.hex);
        break;
    }
  };

  const toggleColorPicker = () => {
    setIsOpen(!isOpen);
  };

  const selectColorType = (type: 'primary' | 'secondary' | 'accent') => {
    setActiveColor(type);
  };

  const getCurrentColor = () => {
    switch (activeColor) {
      case 'primary':
        return primaryColor;
      case 'secondary':
        return secondaryColor;
      case 'accent':
        return accentColor;
    }
  };

  return (
    <div className="theme-color-picker">
      <button 
        className="theme-color-button"
        onClick={toggleColorPicker}
        title="调整主题色彩"
      >
        <FaPalette />
        <span>主题色彩</span>
      </button>
      
      {isOpen && (
        <div className="color-picker-panel">
          <div className="color-picker-header">
            <h3>主题色彩设置</h3>
            <button 
              className="close-button"
              onClick={toggleColorPicker}
            >
              ×
            </button>
          </div>
          
          <div className="color-type-selector">
            <div 
              className={`color-type ${activeColor === 'primary' ? 'active' : ''}`}
              onClick={() => selectColorType('primary')}
            >
              <div 
                className="color-preview" 
                style={{ backgroundColor: primaryColor }}
              ></div>
              <span>主要色</span>
            </div>
            
            <div 
              className={`color-type ${activeColor === 'secondary' ? 'active' : ''}`}
              onClick={() => selectColorType('secondary')}
            >
              <div 
                className="color-preview" 
                style={{ backgroundColor: secondaryColor }}
              ></div>
              <span>次要色</span>
            </div>
            
            <div 
              className={`color-type ${activeColor === 'accent' ? 'active' : ''}`}
              onClick={() => selectColorType('accent')}
            >
              <div 
                className="color-preview" 
                style={{ backgroundColor: accentColor }}
              ></div>
              <span>强调色</span>
            </div>
          </div>
          
          <div className="color-picker-content">
            <SketchPicker 
              color={getCurrentColor()}
              onChange={handleColorChange}
              disableAlpha={true}
            />
          </div>
          
          <div className="color-picker-footer">
            <p>调整颜色将实时更新整个页面的主题</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeColorPicker;
