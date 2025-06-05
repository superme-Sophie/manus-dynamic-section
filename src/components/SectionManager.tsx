import { useState } from 'react';
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaPlus } from 'react-icons/fa';
import '../styles/SectionManager.css';

interface Section {
  id: string;
  title: string;
  type: 'text' | 'chart' | 'cards' | 'image';
  content: any;
  order: number;
}

interface SectionManagerProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  onEditSection: (section: Section) => void;
}

const SectionManager: React.FC<SectionManagerProps> = ({ 
  sections, 
  onSectionsChange, 
  onEditSection 
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleAddSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: '新章节',
      type: 'text',
      content: '',
      order: sections.length
    };
    onSectionsChange([...sections, newSection]);
    onEditSection(newSection);
  };

  const handleDeleteSection = (id: string) => {
    const updatedSections = sections.filter(section => section.id !== id)
      .map((section, index) => ({
        ...section,
        order: index
      }));
    onSectionsChange(updatedSections);
  };

  const handleMoveSection = (id: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(section => section.id === id);
    if (
      (direction === 'up' && sectionIndex === 0) || 
      (direction === 'down' && sectionIndex === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    
    // Swap sections
    [newSections[sectionIndex], newSections[targetIndex]] = 
    [newSections[targetIndex], newSections[sectionIndex]];
    
    // Update order
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));
    
    onSectionsChange(updatedSections);
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'text': return '文本';
      case 'chart': return '图表';
      case 'cards': return '卡片组';
      case 'image': return '图片';
      default: return type;
    }
  };

  return (
    <div className={`section-manager ${collapsed ? 'collapsed' : ''}`}>
      <div className="section-manager-header">
        <h3>章节管理</h3>
        <button 
          className="collapse-button"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '展开' : '收起'}
        </button>
      </div>
      
      {!collapsed && (
        <>
          <div className="section-list">
            <ul className="section-items">
              {sections.sort((a, b) => a.order - b.order).map((section, index) => (
                <li
                  key={section.id}
                  className="section-item"
                >
                  <div className="section-info">
                    <span className="section-title">{section.title}</span>
                    <span className="section-type">{getTypeLabel(section.type)}</span>
                  </div>
                  <div className="section-actions">
                    <button 
                      className="action-button"
                      onClick={() => handleMoveSection(section.id, 'up')}
                      disabled={index === 0}
                    >
                      <FaArrowUp />
                    </button>
                    <button 
                      className="action-button"
                      onClick={() => handleMoveSection(section.id, 'down')}
                      disabled={index === sections.length - 1}
                    >
                      <FaArrowDown />
                    </button>
                    <button 
                      className="action-button edit"
                      onClick={() => onEditSection(section)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDeleteSection(section.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="section-manager-footer">
            <button 
              className="add-section-button"
              onClick={handleAddSection}
            >
              <FaPlus /> 添加章节
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SectionManager;
