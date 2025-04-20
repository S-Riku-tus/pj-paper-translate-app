import { useState } from 'react';
import { SearchIcon, FilterIcon, XIcon, LightningBoltIcon } from '@heroicons/react/outline';

export default function SearchForm({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [genre, setGenre] = useState('');
  const [yearFrom, setYearFrom] = useState('2018');
  const [yearTo, setYearTo] = useState('2025');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useGemini, setUseGemini] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const searchParams = {
      keyword,
      genre,
      year_from: yearFrom,
      year_to: yearTo
    };
    
    try {
      await onSearch(searchParams, useGemini);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setKeyword('');
    setGenre('');
    setYearFrom('2018');
    setYearTo('2025');
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="block w-full pl-10 pr-12 py-4 sm:text-lg border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              placeholder={useGemini ? "「AIによる画像認識の進展について最近の論文」のように自然に質問してください" : "論文タイトル、キーワード、著者名など"}
            />
            {keyword && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-2 flex items-center">
            <div
              onClick={() => setUseGemini(!useGemini)}
              className={`flex items-center cursor-pointer rounded-full pl-2 pr-3 py-1 ${
                useGemini ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
              } transition-all duration-200`}
            >
              <LightningBoltIcon className={`h-4 w-4 ${useGemini ? 'text-purple-500' : 'text-gray-500'} mr-1`} />
              <span className="text-sm font-medium">
                {useGemini ? 'Gemini AIを使用中' : 'Gemini AIを使用する'}
              </span>
              <div className={`ml-2 w-4 h-4 rounded-full flex items-center justify-center ${useGemini ? 'bg-purple-500' : 'bg-gray-300'}`}>
                <span className="sr-only">{useGemini ? 'Gemini AI有効' : 'Gemini AI無効'}</span>
                {useGemini && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </div>
            
            {useGemini && (
              <p className="ml-3 text-xs text-gray-500">
                自然言語での検索が可能です。Gemini AIが最適なキーワードを見つけます。
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            <FilterIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            詳細検索オプション
          </button>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={clearForm}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              クリア
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex justify-center items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                isLoading ? 'bg-blue-400' : useGemini ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  検索中...
                </>
              ) : (
                <>{useGemini ? 'AIで検索' : '論文を検索'}</>
              )}
            </button>
          </div>
        </div>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4 transition-all duration-300 animate-fadeIn">
            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                  ジャンル / カテゴリー
                </label>
                <div className="mt-1">
                  <select
                    id="genre"
                    name="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 border"
                  >
                    <option value="">すべて</option>
                    <option value="cs.AI">人工知能 (cs.AI)</option>
                    <option value="cs.CL">計算言語学 (cs.CL)</option>
                    <option value="cs.CV">コンピュータビジョン (cs.CV)</option>
                    <option value="cs.LG">機械学習 (cs.LG)</option>
                    <option value="cs.NE">ニューラルネットワーク (cs.NE)</option>
                    <option value="cs.IR">情報検索 (cs.IR)</option>
                    <option value="cs.SE">ソフトウェア工学 (cs.SE)</option>
                    <option value="cs.HC">ヒューマンコンピュータインタラクション (cs.HC)</option>
                    <option value="cs.DB">データベース (cs.DB)</option>
                    <option value="cs.RO">ロボティクス (cs.RO)</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  出版年
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="yearFrom"
                    id="yearFrom"
                    min="1990"
                    max="2025"
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 p-2.5 border"
                    placeholder="From"
                  />
                  <span className="inline-flex items-center px-3 border border-l-0 border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    〜
                  </span>
                  <input
                    type="number"
                    name="yearTo"
                    id="yearTo"
                    min="1990"
                    max="2025"
                    value={yearTo}
                    onChange={(e) => setYearTo(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 p-2.5 border"
                    placeholder="To"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}