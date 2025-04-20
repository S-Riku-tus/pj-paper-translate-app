import Head from 'next/head';
import { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import { searchPapers, searchPapersWithGemini } from '../utils/api';

interface Paper {
  id: string;
  title: string;
  authors: string;
  abstract: string;
  year: string;
  translated_title?: string;
  translated_abstract?: string;
  summary?: string;
  url: string;
  genre?: string;
  /** サムネイル画像 URL */
  image?: string;
}

interface SearchParams {
  keyword?: string;
  genre?: string;
  year_from?: string;
  year_to?: string;
}

interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  useGemini: boolean;
}

export default function Home() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');
  const [usedGemini, setUsedGemini] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  
  // 検索履歴をローカルストレージから取得
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('検索履歴の読み込みに失敗しました', e);
      }
    }
  }, []);
  
  // 検索履歴を保存
  const saveToHistory = (query: string, useGemini: boolean) => {
    const newHistoryItem: SearchHistory = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      useGemini
    };
    
    const updatedHistory = [newHistoryItem, ...searchHistory.slice(0, 9)]; // 最新10件のみ保持
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };
  
  const handleSearch = async (searchParams: SearchParams, useGemini: boolean = false) => {
    setIsLoading(true);
    setError(null);
    setLastSearchQuery(searchParams.keyword || '');
    setUsedGemini(useGemini);
    
    try {
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_REAL_API !== 'True') {
        // モック遅延
        await new Promise(res => setTimeout(res, 1000));

        const mockPapers: Paper[] = [
          {
            id: '1',
            title: 'Attention Is All You Need',
            authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit',
            abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
            year: '2017',
            genre: 'cs.CL',
            translated_title: 'アテンションこそすべて',
            translated_abstract: 'アテンションメカニズムのみに基づく新しいシンプルなネットワークアーキテクチャを提案します。',
            summary: 'Transformer アーキテクチャを提案し、長距離依存関係の学習が容易になることを示しました。',
            url: 'https://arxiv.org/abs/1706.03762',
            image: '/placeholder.png',  // ←追加
          },
          // ... 他のモックも同様に image プロパティを追加
        ];
        // （フィルター処理は省略）

        setPapers(mockPapers);
        if (mockPapers.length > 0) {
          setSelectedPaper(mockPapers[0]); // 最初の論文を選択
        }
        
        // 検索履歴に追加
        if (searchParams.keyword) {
          saveToHistory(searchParams.keyword, useGemini);
        }
      } else {
        let data;
        if (useGemini) {
          data = await searchPapersWithGemini(searchParams);
        } else {
          data = await searchPapers(searchParams);
        }
        setPapers(data);
        if (data.length > 0) {
          setSelectedPaper(data[0]); // 最初の論文を選択
        }
        
        // 検索履歴に追加
        if (searchParams.keyword) {
          saveToHistory(searchParams.keyword, useGemini);
        }
      }
    } catch (err) {
      console.error(err);
      setError('論文の検索中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleHistoryItemClick = (item: SearchHistory) => {
    handleSearch({ keyword: item.query }, item.useGemini);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Head>
        <title>論文検索・翻訳アプリ | 学術論文を検索して翻訳・要約</title>
        {/* ...meta tags省略 */}
      </Head>

      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <h1 className="text-xl font-bold">論文検索・翻訳アプリ</h1>
                <p className="text-xs text-blue-100">最新の研究論文を簡単に検索・翻訳</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-sm font-medium text-white hover:text-blue-100 transition">ホーム</a>
                <a href="/about" className="text-sm font-medium text-blue-100 hover:text-white transition">このアプリについて</a>
                <a href="/usage" className="text-sm font-medium text-blue-100 hover:text-white transition">使い方</a>
              </nav>
              
              <a 
                href="https://github.com/username/paper-translate-app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-sm text-white hover:text-blue-100 transition"
              >
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ - 左右レイアウト */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左サイドバー（検索＆履歴） - 20% */}
        <div className="w-1/5 flex flex-col bg-white shadow-md border-r border-gray-200">
          {/* 検索フォーム */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-3">論文検索</h2>
            <SearchForm onSearch={handleSearch} isCompact={true} />
          </div>
          
          {/* 検索履歴 */}
          <div className="flex-1 overflow-auto p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center justify-between">
              <span>検索履歴</span>
              {searchHistory.length > 0 && (
                <button 
                  onClick={() => {
                    setSearchHistory([]);
                    localStorage.removeItem('searchHistory');
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  クリア
                </button>
              )}
            </h3>
            
            {searchHistory.length > 0 ? (
              <ul className="space-y-2">
                {searchHistory.map((item) => (
                  <li key={item.id} className="text-sm">
                    <button
                      onClick={() => handleHistoryItemClick(item)}
                      className="w-full text-left p-2 rounded hover:bg-gray-100 transition flex items-center"
                    >
                      <span className="truncate flex-1">{item.query}</span>
                      {item.useGemini && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs rounded bg-purple-100 text-purple-800">AI</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">履歴はありません</p>
            )}
          </div>
        </div>
        
        {/* メインコンテンツ - 80% */}
        <div className="w-4/5 bg-gray-50 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin h-12 w-12 border-4 border-gray-200 rounded-full border-t-blue-600"></div>
                <p className="mt-4 text-gray-700 text-lg">論文を検索中...</p>
                <p className="mt-2 text-gray-500 text-sm">
                  {usedGemini ? 'Gemini AIがクエリを解析しています...' : '少々お待ちください'}
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="m-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          ) : selectedPaper ? (
            <div className="flex-1 flex overflow-hidden">
              {/* 原文セクション - 左半分 */}
              <div className="w-1/2 p-6 overflow-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{selectedPaper.title}</h2>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {selectedPaper.year}年
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">{selectedPaper.authors}</p>
                    {selectedPaper.genre && (
                      <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {selectedPaper.genre}
                      </span>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-md font-medium text-gray-800 mb-2">Abstract</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {selectedPaper.abstract}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a 
                      href={selectedPaper.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-600 hover:underline"
                    >
                      原文を見る
                    </a>
                  </div>
                </div>
                
                {/* 他の論文リスト */}
                {papers.length > 1 && (
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">その他の検索結果</h3>
                    <div className="space-y-2">
                      {papers.filter(p => p.id !== selectedPaper.id).map(paper => (
                        <button
                          key={paper.id}
                          onClick={() => setSelectedPaper(paper)}
                          className="w-full text-left p-2 rounded hover:bg-gray-100 transition"
                        >
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">{paper.translated_title || paper.title}</p>
                          <p className="text-xs text-gray-500">{paper.authors}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 翻訳セクション - 右半分 */}
              <div className="w-1/2 p-6 bg-gray-50 overflow-auto border-l border-gray-200">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-blue-600">{selectedPaper.translated_title || selectedPaper.title}</h2>
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition">
                      再翻訳
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span>日本語訳</span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">DeepL翻訳</span>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {selectedPaper.translated_abstract || '翻訳は現在利用できません。'}
                      </p>
                    </div>
                  </div>
                  
                  {selectedPaper.summary && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>AI要約</span>
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">Gemini AI</span>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                          {selectedPaper.summary}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-100">
                    <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      コピー
                    </button>
                    
                    <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      共有
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg className="h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">論文を検索してみましょう</h2>
                <p className="text-gray-500 mb-6">
                  左側の検索欄からキーワードを入力すると、関連する学術論文が表示されます。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
