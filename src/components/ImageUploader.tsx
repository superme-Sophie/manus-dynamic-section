import React, { useState, useRef } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa';
import '../styles/ImageUploader.css';

interface ImageUploaderProps {
  onImageUpload: (imageData: string, name: string) => void;
  initialImage?: string;
  initialName?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  initialImage = '', 
  initialName = '' 
}) => {
  const [preview, setPreview] = useState<string>(initialImage);
  const [imageName, setImageName] = useState<string>(initialName);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Check file type
    if (!file.type.match('image.*')) {
      alert('请上传图片文件');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setImageName(file.name);
      onImageUpload(result, file.name);
    };
    reader.readAsDataURL(file);
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
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    setImageName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUpload('', '');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''} ${preview ? 'has-image' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!preview ? handleClick : undefined}
      >
        {!preview ? (
          <div className="upload-placeholder">
            <FaUpload className="upload-icon" />
            <p>点击或拖放图片到此处上传</p>
            <p className="upload-hint">支持 JPG, PNG, GIF 格式，最大5MB</p>
          </div>
        ) : (
          <div className="image-preview-container">
            <img src={preview} alt="预览" className="image-preview" />
            <div className="image-info">
              <span className="image-name">{imageName}</span>
              <button 
                className="remove-image-button"
                onClick={handleRemoveImage}
                title="删除图片"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="file-input"
      />
    </div>
  );
};

export default ImageUploader;
