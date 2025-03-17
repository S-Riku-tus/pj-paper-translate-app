import { useState } from 'react';
import PaperDetail from './PaperDetail';

export default function PaperList({ papers }) {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  if (papers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">検索結果がありません。キーワードやジャンルを変えて検索してみてください。</p>
      </div>
    );
  }

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
    setDetailOpen(true);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">検索結果 ({papers.length}件)</h2>
      
      <div className="space-y-6">
        {papers.map((paper) => (
          <div key={paper.id} className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-6 py-5">
              <div className="flex justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {paper.translated_title || paper.title}
                </h3>
                <p className="text-sm text-gray-500">{paper.year}年</p>
              </div>
              <p className="mt-1 text-sm text-gray-600">{paper.authors}</p>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-800">要約:</h4>
                <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                  {paper.summary || paper.translated_abstract || paper.abstract}
                </p>
              </div>
              
              <div className="mt-5 flex justify-between">
                <button
                  onClick={() => handlePaperClick(paper)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  詳細を見る
                </button>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  原文を開く
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <PaperDetail 
        paper={selectedPaper} 
        open={detailOpen} 
        setOpen={setDetailOpen}
      />
    </div>
  );
}