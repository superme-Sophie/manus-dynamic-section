import { FaCamera } from 'react-icons/fa';
import '../styles/ExportPanel.css';

interface ExportPanelProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ contentRef }) => {
  const handleExportFullPage = async () => {
    if (!contentRef.current) return;
    
    try {
      // 显示导出中提示
      const notification = document.createElement('div');
      notification.className = 'export-notification';
      notification.textContent = '正在导出页面，请稍候...';
      document.body.appendChild(notification);
      
      // 动态导入html2canvas以避免类型错误
      const html2canvas = (await import('html2canvas')).default;
      
      // 使用html2canvas捕获页面
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // 提高导出质量
        useCORS: true, // 允许跨域图片
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // 转换为图片并下载
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `页面导出_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = image;
      link.click();
      
      // 移除通知
      document.body.removeChild(notification);
      
      // 显示成功通知
      const successNotification = document.createElement('div');
      successNotification.className = 'export-notification success';
      successNotification.textContent = '导出成功！';
      document.body.appendChild(successNotification);
      
      // 3秒后移除成功通知
      setTimeout(() => {
        document.body.removeChild(successNotification);
      }, 3000);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  };

  return (
    <div className="export-panel">
      <button 
        className="export-button"
        onClick={handleExportFullPage}
        title="导出页面为图片"
      >
        <FaCamera className="export-icon" />
        <span>导出页面</span>
      </button>
    </div>
  );
};

export default ExportPanel;
