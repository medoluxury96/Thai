import React from 'react';

interface GeneratedImageGridProps {
  images: string[];
  isLoading: boolean;
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ImageCard: React.FC<{ src: string, index: number }> = ({ src, index }) => {
    return (
        <div className="group relative aspect-square overflow-hidden rounded-lg shadow-lg bg-rose-100">
            <img 
                src={src} 
                alt={`Generated image ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <a
                    href={src}
                    download={`ai_merged_image.png`}
                    className="bg-white/20 hover:bg-white/30 text-white font-bold p-3 rounded-full transition-colors duration-300"
                    aria-label="Tải ảnh xuống"
                >
                    <DownloadIcon />
                </a>
            </div>
        </div>
    );
};

const SkeletonCard: React.FC = () => (
    <div className="aspect-square bg-rose-100 rounded-lg animate-pulse"></div>
);

const GeneratedImageGrid: React.FC<GeneratedImageGridProps> = ({ images, isLoading }) => {
  const resultImage = images.length > 0 ? images[0] : null;

  if (isLoading) {
    return (
      <div className="w-full">
        <SkeletonCard />
      </div>
    );
  }

  if (!resultImage) {
    return (
      <div className="aspect-square w-full border-2 border-dashed border-pink-200 rounded-lg flex items-center justify-center bg-white">
        <p className="text-slate-500">Ảnh đã ghép sẽ xuất hiện ở đây</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ImageCard src={resultImage} index={0} />
    </div>
  );
};

export default GeneratedImageGrid;