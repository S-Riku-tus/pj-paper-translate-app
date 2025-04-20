import React, { useState } from 'react';
import PaperDetail from './PaperDetail';
import {
  ViewListIcon,
  ViewGridIcon,
  ChevronDownIcon,
  SortAscendingIcon,
  SortDescendingIcon
} from '@heroicons/react/outline';

export interface Paper {
  id: string;
  title: string;
  translated_title?: string;
  authors: string;
  abstract: string;
  translated_abstract?: string;
  summary?: string;
  year: string;
  genre?: string;
  url: string;
  /** サムネイル画像 URL */
  image?: string;
}

export default function PaperList({ papers }: { papers: Paper[] }) {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'year' | 'title'>('year');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (papers.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
        {/* 検索結果なしアイコン */}
        <svg 
          className="mx-auto h-10 w-10 text-gray-400"
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
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          検索結果が見つかりませんでした
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          別のキーワードやジャンルで検索してみてください。
        </p>
      </div>
    );
  }

  const handlePaperClick = (paper: Paper) => {
    setSelectedPaper(paper);
    setDetailOpen(true);
  };

  const sortedPapers = [...papers].sort((a, b) => {
    if (sortBy === 'year') {
      const diff = parseInt(a.year) - parseInt(b.year);
      return sortOrder === 'asc' ? diff : -diff;
    } else {
      const textA = (a.translated_title || a.title).toLowerCase();
      const textB = (b.translated_title || b.title).toLowerCase();
      const cmp = textA.localeCompare(textB);
      return sortOrder === 'asc' ? cmp : -cmp;
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSortChange = (value: 'year' | 'title') => {
    setSortBy(value);
    setDropdownOpen(false);
  };

  /** ジャンルごとのカラー */
  const getCategoryColor = (genre?: string) => {
    const map: Record<string, string> = {
      'cs.AI': 'bg-red-100 text-red-800 border-red-200',
      'cs.CL': 'bg-blue-100 text-blue-800 border-blue-200',
      'cs.CV': 'bg-green-100 text-green-800 border-green-200',
      'cs.LG': 'bg-purple-100 text-purple-800 border-purple-200',
      'cs.NE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'cs.IR': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'cs.SE': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return map[genre || ''] ?? 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div>
      {/* ヘッダー：件数・ソート・表示切替 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          検索結果 <span className="text-blue-600 font-bold">({papers.length}件)</span>
        </h2>
        <div className="flex items-center space-x-3">
          {/* ソートドロップダウン */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {sortOrder === 'asc'
                ? <SortAscendingIcon className="h-4 w-4 text-gray-500 mr-1"/>
                : <SortDescendingIcon className="h-4 w-4 text-gray-500 mr-1"/>}
              {sortBy === 'year' ? '出版年' : 'タイトル'}
              <ChevronDownIcon className="h-4 w-4 text-gray-500 ml-1"/>
            </button>
            {dropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <button
                  onClick={() => handleSortChange('year')}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    sortBy === 'year' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  出版年
                </button>
                <button
                  onClick={() => handleSortChange('title')}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    sortBy === 'title' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  タイトル
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={toggleSortOrder}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? '降順にする' : '昇順にする'}
                </button>
              </div>
            )}
          </div>

          {/* ビューモード切替 */}
          <div className="bg-gray-100 p-1 rounded-md flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="グリッド表示"
            >
              <ViewGridIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="リスト表示"
            >
              <ViewListIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* グリッド表示 */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedPapers.map(paper => (
            <div
              key={paper.id}
              className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md overflow-hidden flex flex-col transition-all duration-200"
            >
              {/* サムネイル */}
              <img
                src={paper.image || '/placeholder.png'}
                alt={paper.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                  {paper.translated_title || paper.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium whitespace-nowrap rounded-full border ${getCategoryColor(paper.genre)}`}>
                    {paper.genre || 'その他'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium whitespace-nowrap rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {paper.year}年
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {paper.summary || paper.translated_abstract || paper.abstract}
                </p>

                <div className="mt-auto pt-2 border-t border-gray-100">
                  <div className="flex justify-between">
                    <button
                      onClick={() => handlePaperClick(paper)}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                    >
                      詳細を見る
                    </button>
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                      原文を開く
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* リスト表示 */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {sortedPapers.map(paper => (
            <div
              key={paper.id}
              className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-all duration-200"
            >
              <div className="flex items-start px-5 py-4">
                {/* サムネイル */}
                <img
                  src={paper.image || '/placeholder.png'}
                  alt={paper.title}
                  className="w-24 h-24 flex-shrink-0 object-cover rounded-md"
                />

                <div className="ml-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2">
                    {paper.translated_title || paper.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium whitespace-nowrap rounded-full border ${getCategoryColor(paper.genre)}`}>
                      {paper.genre || 'その他'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium whitespace-nowrap rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {paper.year}年
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {paper.summary || paper.translated_abstract || paper.abstract}
                  </p>

                  <div className="mt-auto flex space-x-2">
                    <button
                      onClick={() => handlePaperClick(paper)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                    >
                      詳細
                    </button>
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                      原文
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 詳細モーダル */}
      <PaperDetail
        paper={selectedPaper}
        open={detailOpen}
        setOpen={setDetailOpen}
      />
    </div>
  );
}
