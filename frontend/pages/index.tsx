import Head from 'next/head';
import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import PaperList from '../components/PaperList';
import { searchPapers } from '../utils/api';

export default function Home() {
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSearch = async (searchParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 実際のAPIから論文を取得
      const data = await searchPapers(searchParams);
      setPapers(data);
    } catch (error) {
      console.error('Error fetching papers:', error);
      setError('論文の検索中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>論文検索・翻訳アプリ</title>
        <meta name="description" content="論文を簡単に検索して翻訳・要約できるアプリ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">論文検索・翻訳アプリ</h1>
          <p className="text-lg text-gray-600">キーワードやジャンルから論文を検索して、自動翻訳・要約を確認できます</p>
        </div>
        
        <SearchForm onSearch={handleSearch} />
        
        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-200 rounded-full border-t-blue-600"></div>
                <p className="mt-2 text-gray-700">論文を検索中...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <PaperList papers={papers} />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">© {new Date().getFullYear()} 論文検索・翻訳アプリ</p>
        </div>
      </footer>
    </div>
  );
}