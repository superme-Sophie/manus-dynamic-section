import React, { useState, useRef, useEffect } from 'react';
import { FaUpload, FaTrash, FaPlus, FaArrowsAlt } from 'react-icons/fa';
import '../styles/MultiImageUploader.css';

interface ImageItem {
  data: string;
  name: string;
  width?: number;
  height?: number;
}

interface MultiImageUploaderProps {
  onImagesChange: (images: ImageItem[]) => void;
  initialImages?: ImageItem[];
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ 
  onImagesChange, 
  initialImages = [] 
}) => {
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [resizingIndex, setResizingIndex] = useState<number | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // 处理全局鼠标事件，用于拖拽调整大小
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingIndex === null) return;
      
      const deltaX = e.clientX - resizeStartPos.x;
      const deltaY = e.clientY - resizeStartPos.y;
      
      // 计算新的宽度和高度
      const newWidth = Math.max(20, originalSize.width + deltaX * 0.5);
      const newHeight = Math.max(20, originalSize.height + deltaY * 0.5);
      
      // 更新图片大小
      const updatedImages = [...images];
      updatedImages[resizingIndex] = {
        ...updatedImages[resizingIndex],
        width: newWidth,
        height: newHeight
      };
      
      setImages(updatedImages);
      onImagesChange(updatedImages);
    };
    
    const handleMouseUp = () => {
      if (resizingIndex !== null) {
        setResizingIndex(null);
      }
    };
    
    if (resizingIndex !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingIndex, resizeStartPos, originalSize, images, onImagesChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  const processFiles = (files: File[]) => {
    // 处理多个文件
    files.forEach(file => {
      // 检查文件类型
      if (!file.type.match('image.*')) {
        alert('请上传图片文件');
        return;
      }

      // 检查文件大小 (最大5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`图片 ${file.name} 大小超过5MB，请压缩后上传`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newImage: ImageItem = {
          data: result,
          name: file.name
        };
        
        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        onImagesChange(updatedImages);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleResizeStart = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const imageElement = imageRefs.current[index];
    if (!imageElement) return;
    
    setResizingIndex(index);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setOriginalSize({ 
      width: imageElement.offsetWidth, 
      height: imageElement.offsetHeight 
    });
  };

  // 根据图片数量确定每行显示的图片数
  const getGridClass = () => {
    if (images.length === 0) return '';
    if (images.length === 1) return 'grid-1';
    if (images.length === 2) return 'grid-2';
    return 'grid-3';
  };

  return (
    <div className="multi-image-uploader">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`image-grid ${getGridClass()}`}>
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`image-item ${resizingIndex === index ? 'resizing' : ''}`}
              ref={el => imageRefs.current[index] = el}
              style={{
                width: image.width ? `${image.width}px` : undefined,
                height: image.height ? `${image.height}px` : undefined
              }}
            >
              <img src={image.data} alt={image.name} className="image-preview" />
              <div className="image-overlay">
                <span className="image-name">{image.name}</span>
                <div className="image-actions">
                  <button 
                    className="resize-image-button"
                    onMouseDown={(e) => handleResizeStart(e, index)}
                    title="调整大小"
                  >
                    <FaArrowsAlt />
                  </button>
                  <button 
                    className="remove-image-button"
                    onClick={() => handleRemoveImage(index)}
                    title="删除图片"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="add-image-button" onClick={handleAddClick}>
            <FaPlus />
            <span>添加图片</span>
          </div>
        </div>
        
        {images.length === 0 && (
          <div className="upload-placeholder">
            <FaUpload className="upload-icon" />
            <p>点击或拖放图片到此处上传</p>
            <p className="upload-hint">支持 JPG, PNG, GIF 格式，最大5MB</p>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="file-input"
        multiple
      />
    </div>
  );
};

export default MultiImageUploader;
