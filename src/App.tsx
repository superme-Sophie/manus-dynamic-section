import { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import SectionManager from './components/SectionManager';
import SectionRenderer from './components/SectionRenderer';
import SectionEditor from './components/SectionEditor';
import ExportPanel from './components/ExportPanel';
import HtmlExporter from './components/HtmlExporter';
import './styles/App.css';

// 定义Section接口
interface Section {
  id: string;
  title: string;
  type: 'text' | 'chart' | 'cards' | 'image';
  content: any;
  order: number;
}

// 生成唯一ID
const generateId = () => {
  return 'section_' + Math.random().toString(36).substr(2, 9);
};

function App() {
  const [sections, setSections] = useState<Section[]>([]);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 初始化示例数据
  useEffect(() => {
    const initialSections = [
      {
        id: generateId(),
        title: '欢迎使用动态配置页面',
        type: 'text' as const,
        content: '这是一个支持动态配置section和上传图片的HTML界面。\n\n您可以通过右侧的章节管理面板添加、编辑、删除和重新排序章节。\n\n完成编辑后，您可以使用顶部的导出按钮将整个页面导出为图片或HTML文档。',
        order: 0
      }
    ];
    setSections(initialSections);
  }, []);

  // 编辑章节
  const handleEditSection = (section: Section) => {
    setEditingSection({ ...section });
  };

  // 保存章节
  const handleSaveSection = (updatedSection: Section) => {
    const updatedSections = sections.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    );
    setSections(updatedSections);
    setEditingSection(null);
  };

  // 处理拖拽排序
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // 更新排序
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setSections(updatedItems);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingSection(null);
  };

  // 更新所有章节
  const handleSectionsChange = (updatedSections: Section[]) => {
    setSections(updatedSections);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container header-content">
          <div className="logo">动态配置页面</div>
          <nav className="section-nav">
            <ul>
              {sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </header>
      
      <div className="hero">
        <div className="container hero-content">
          <h1>动态配置页面生成器</h1>
          <p>轻松创建、编辑和导出精美的页面</p>
        </div>
      </div>
      
      <div className="main-content">
        <div className="content-area" ref={contentRef}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="sections-container"
                >
                  {sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <SectionRenderer section={section} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        
        <div className="sidebar">
          <SectionManager 
            sections={sections}
            onSectionsChange={handleSectionsChange}
            onEditSection={handleEditSection}
          />
        </div>
      </div>
      
      {editingSection && (
        <SectionEditor 
          section={editingSection} 
          onSave={handleSaveSection} 
          onCancel={handleCancelEdit} 
        />
      )}
      
      <ExportPanel contentRef={contentRef} />
      <HtmlExporter sections={sections} />
      
      <footer>
        <div className="container footer-content">
          <div className="copyright">© 2025 动态配置页面生成器</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
