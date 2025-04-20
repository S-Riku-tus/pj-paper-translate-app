import { useState } from 'react';
import PaperDetail from './PaperDetail';
import { ViewListIcon, ViewGridIcon, ChevronDownIcon, SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/outline';

export default function PaperList({ papers }) {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (papers.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12" 
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">検索結果が見つかりませんでした</h3>
        <p className="mt-1 text-sm text-gray-500">別のキーワードやジャンルで検索してみてください。</p>
      </div>
    );
  }

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
    setDetailOpen(true);
  };

  const sortedPapers = [...papers].sort((a, b) => {
    if (sortBy === 'year') {
      const yearA = parseInt(a.year || '0');
      const yearB = parseInt(b.year || '0');
      return sortOrder === 'asc' ? yearA - yearB : yearB - yearA;
    } else if (sortBy === 'title') {
      const titleA = a.translated_title || a.title || '';
      const titleB = b.translated_title || b.title || '';
      return sortOrder === 'asc' 
        ? titleA.localeCompare(titleB) 
        : titleB.localeCompare(titleA);
    }
    return 0;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setDropdownOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">検索結果 <span className="text-blue-600">({papers.length}件)</span></h2>
        
        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="mr-1">
                {sortOrder === 'asc' ? (
                  <SortAscendingIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <SortDescendingIcon className="h-4 w-4 text-gray-500" />
                )}
              </span>
              {sortBy === 'year' ? '出版年' : 'タイトル'}
              <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'year' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => handleSortChange('year')}
                  >
                    出版年
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'title' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => handleSortChange('title')}
                  >
                    タイトル
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={toggleSortOrder}
                  >
                    {sortOrder === 'asc' ? '降順にする' : '昇順にする'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="bg-gray-100 p-1 rounded-md flex items-center">
            <button
              type="button"
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setViewMode('grid')}
              title="グリッド表示"
            >
              <ViewGridIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setViewMode('list')}
              title="リスト表示"
            >
              <ViewListIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPapers.map((paper) => (
            <div 
              key={paper.id} 
              className="bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden transition-all duration-300 flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2 flex-grow">
                    {paper.translated_title || paper.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2 whitespace-nowrap">
                    {paper.year}年
                  </span>
                </div>
                
                <p className="mt-1 text-sm text-gray-500 line-clamp-1">{paper.authors}</p>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {paper.summary || paper.translated_abstract || paper.abstract}
                  </p>
                </div>
              </div>
              
              <div className="px-6 pt-2 pb-6 bg-gray-50 border-t border-gray-100 mt-auto">
                <div className="flex justify-between">
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
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {sortedPapers.map((paper) => (
            <div 
              key={paper.id} 
              className="bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-all duration-300"
            >
              <div className="px-6 py-5">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {paper.translated_title || paper.title}
                    </h3>
                    <p className="text-sm text-gray-500">{paper.authors}</p>
                  </div>
                  <div className="flex flex-col items-end ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap mb-2">
                      {paper.year}年
                    </span>
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2.5 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      原文
                    </a>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {paper.summary || paper.translated_abstract || paper.abstract}
                  </p>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={() => handlePaperClick(paper)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    詳細を見る
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <PaperDetail 
        paper={selectedPaper} 
        open={detailOpen} 
        setOpen={setDetailOpen}
      />
    </div>
  );
}