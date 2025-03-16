import { useState } from 'react';

export default function SearchForm({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [genre, setGenre] = useState('');
  const [yearFrom, setYearFrom] = useState('2018');
  const [yearTo, setYearTo] = useState('2025');

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = {
      keyword,
      genre,
      year_from: yearFrom,
      year_to: yearTo
    };
    onSearch(searchParams);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
              キーワード
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="keyword"
                name="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="例: machine learning, neural networks"
              />
            </div>
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
              ジャンル
            </label>
            <div className="mt-1">
              <select
                id="genre"
                name="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              >
                <option value="">すべて</option>
                <option value="cs.AI">人工知能</option>
                <option value="cs.CL">計算言語学</option>
                <option value="cs.CV">コンピュータビジョン</option>
                <option value="cs.LG">機械学習</option>
                <option value="cs.NE">ニューラルネットワーク</option>
                <option value="cs.IR">情報検索</option>
                <option value="cs.SE">ソフトウェア工学</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
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
                className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 p-2 border"
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
                className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 p-2 border"
                placeholder="To"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            論文を検索
          </button>
        </div>
      </form>
    </div>
  );
}