import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import GeneratedImageGrid from './components/GeneratedImageGrid';
import { mergeImages } from './services/geminiService';

const App: React.FC = () => {
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleImageUpload = (file: File, type: 'face' | 'style') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'face') {
        setFaceImage(result);
      } else {
        setStyleImage(result);
      }
      setResultImage([]);
      setError(null);
    };
    reader.onerror = () => {
        setError("Không thể đọc tệp hình ảnh. Vui lòng thử lại.");
    }
    reader.readAsDataURL(file);
  };

  const handleMergeClick = useCallback(async () => {
    if (!faceImage || !styleImage) {
      setError("Vui lòng tải lên cả hai hình ảnh.");
      return;
    }

    setIsLoading(true);
    setResultImage([]);
    setError(null);

    try {
      const result = await mergeImages(faceImage, styleImage, prompt);
      setResultImage([result]);
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi ghép ảnh. Vui lòng kiểm tra API key của bạn và thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [faceImage, styleImage, prompt]);

  return (
    <div className="min-h-screen bg-rose-50 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Control Panel */}
          <div className="flex flex-col gap-8 bg-white p-6 rounded-2xl shadow-lg border border-pink-200">
            <div>
              <h2 className="text-xl font-semibold text-pink-600 mb-4">1. Tải lên ảnh khuôn mặt (Nguồn)</h2>
              <ImageUploader onImageUpload={(file) => handleImageUpload(file, 'face')} inputImage={faceImage} />
            </div>
            <div>
                <h2 className="text-xl font-semibold text-pink-600 mb-4">2. Tải lên ảnh phong cách (Đích)</h2>
                <ImageUploader onImageUpload={(file) => handleImageUpload(file, 'style')} inputImage={styleImage} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-pink-600 mb-4">3. Ghi chú (Tùy chọn)</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ví dụ: thay đổi màu tóc thành màu xanh, thêm một chiếc mũ..."
                className="w-full bg-rose-50 border-2 border-pink-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200 text-slate-700 placeholder-slate-400"
                rows={3}
              />
            </div>
            <button
              onClick={handleMergeClick}
              disabled={!faceImage || !styleImage || isLoading}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-200 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg text-lg transition-all duration-300 ease-in-out shadow-pink-500/20 hover:shadow-pink-500/40 transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? 'Đang ghép...' : 'Ghép ảnh'}
            </button>
          </div>

          {/* Image Display */}
          <div className="flex flex-col gap-4">
             <h2 className="text-xl font-semibold text-pink-600 mb-0">Kết quả</h2>
             {error && <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">{error}</div>}
            <GeneratedImageGrid images={resultImage} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;