import Head from 'next/head';
import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import PaperList from '../components/PaperList';
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
}

interface SearchParams {
  keyword?: string;
  genre?: string;
  year_from?: string;
  year_to?: string;
}

export default function Home() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');
  const [usedGemini, setUsedGemini] = useState<boolean>(false);
  
  const handleSearch = async (searchParams: SearchParams, useGemini: boolean = false) => {
    setIsLoading(true);
    setError(null);
    setLastSearchQuery(searchParams.keyword || '');
    setUsedGemini(useGemini);
    
    try {
      // 開発段階では、モックデータを使用します
      // 本番環境では、APIを呼び出します
      console.log('Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        USE_REAL_API: process.env.NEXT_PUBLIC_USE_REAL_API,
        useGemini
      });
      
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_REAL_API !== 'True') {
        // モックデータ使用のための遅延（1秒）
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockPapers = [
          {
            id: '1',
            title: 'Attention Is All You Need',
            authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit',
            abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism.',
            year: '2017',
            genre: 'cs.CL',
            translated_title: 'アテンションこそすべて',
            translated_abstract: 'アテンションメカニズムのみに基づく新しいシンプルなネットワークアーキテクチャである「Transformer」を提案します。機械翻訳タスクでのRNNやCNNを用いた従来モデルよりも優れた性能を示します。',
            summary: 'この論文はTransformerアーキテクチャを提案し、エンコーダ-デコーダ構造にセルフアテンションを導入することで、並列処理が可能になり、長距離依存関係の学習が容易になることを示しました。現代の多くのNLPモデルの基礎となる革新的な研究です。',
            url: 'https://arxiv.org/abs/1706.03762'
          },
          {
            id: '2',
            title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
            authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
            abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers.',
            year: '2018',
            genre: 'cs.CL',
            translated_title: 'BERT: 言語理解のための深層双方向Transformerの事前学習',
            translated_abstract: '双方向Transformerエンコーダー表現（BERT）と呼ばれる新しい言語表現モデルを導入します。',
            summary: 'BERTはTransformerエンコーダをベースに双方向の文脈を考慮した事前学習モデルを提案。マスク言語モデリングと次文予測の2つのタスクで事前学習することで、fine-tuningするだけで多様なNLPタスクで高い性能を達成しました。',
            url: 'https://arxiv.org/abs/1810.04805'
          },
          {
            id: '3',
            title: 'GPT-3: Language Models are Few-Shot Learners',
            authors: 'Tom B. Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah',
            abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task.',
            year: '2020',
            genre: 'cs.CL',
            translated_title: 'GPT-3: 言語モデルは少数ショット学習が可能',
            translated_abstract: '大規模なテキストコーパスで事前学習し、特定のタスクでファインチューニングすることで、多くのNLPタスクとベンチマークで大幅な改善が示されています。',
            summary: '1750億パラメータの大規模言語モデルを提案し、タスク特化の細調整なしに少数の例だけで様々なNLPタスクを実行できることを示しました。モデルサイズと性能の関係性を分析し、大規模化が少数ショット学習能力を向上させることを実証した画期的研究です。',
            url: 'https://arxiv.org/abs/2005.14165'
          },
          {
            id: '4',
            title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale',
            authors: 'Alexey Dosovitskiy, Lucas Beyer, Alexander Kolesnikov, Dirk Weissenborn, Xiaohua Zhai',
            abstract: 'While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. In vision, attention is either applied in conjunction with convolutional networks, or used to replace certain components of convolutional networks while keeping their overall structure in place.',
            year: '2021',
            genre: 'cs.CV',
            translated_title: '画像は16x16の単語に値する: 大規模画像認識のためのTransformer',
            translated_abstract: 'Transformerアーキテクチャは自然言語処理タスクの事実上の標準となっていますが、コンピュータビジョンへの応用は限られています。ビジョンでは、注意は畳み込みネットワークと組み合わせて適用されるか、畳み込みネットワークの特定のコンポーネントを置き換えるために使用されます。',
            summary: 'Vision Transformer (ViT) モデルを提案し、画像をパッチに分割して系列として扱うことで、CNNを使わずにTransformerアーキテクチャを直接画像認識に適用できることを示しました。十分な量のデータで事前学習すると、最先端のCNNを上回る性能を達成しました。',
            url: 'https://arxiv.org/abs/2010.11929'
          }
        ];
        
        // キーワード検索のフィルタリング（シンプルな例）
        let filteredPapers = [...mockPapers];
        if (searchParams.keyword) {
          const keyword = searchParams.keyword.toLowerCase();
          filteredPapers = filteredPapers.filter(paper =>
            paper.title.toLowerCase().includes(keyword) ||
            paper.abstract.toLowerCase().includes(keyword) ||
            paper.translated_title?.toLowerCase().includes(keyword) ||
            paper.translated_abstract?.toLowerCase().includes(keyword) ||
            paper.authors.toLowerCase().includes(keyword)
          );
        }
        
        // ジャンルフィルタリング
        if (searchParams.genre) {
          filteredPapers = filteredPapers.filter(paper =>
            paper.genre === searchParams.genre
          );
        }
        
        // 年数フィルタリング
        if (searchParams.year_from) {
          filteredPapers = filteredPapers.filter(paper =>
            parseInt(paper.year) >= parseInt(searchParams.year_from || '0')
          );
        }
        if (searchParams.year_to) {
          filteredPapers = filteredPapers.filter(paper =>
            parseInt(paper.year) <= parseInt(searchParams.year_to || '9999')
          );
        }
        
        setPapers(filteredPapers);
      } else {
        // 本番環境では、実際のAPIから論文を取得
        // Gemini APIを使用するかどうかで呼び出すAPIを切り替え
        let data;
        if (useGemini) {
          data = await searchPapersWithGemini(searchParams);
        } else {
          data = await searchPapers(searchParams);
        }
        setPapers(data);
      }
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching papers:', error);
      setError('論文の検索中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>論文検索・翻訳アプリ | 学術論文を検索して翻訳・要約</title>
        <meta name="description" content="キーワードやジャンルから学術論文を簡単に検索して、日本語に翻訳・要約できる論文検索アプリ" />
        <meta name="keywords" content="論文検索,論文翻訳,論文要約,AI,自動翻訳,研究" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="論文検索・翻訳アプリ" />
        <meta property="og:description" content="キーワードやジャンルから学術論文を簡単に検索して、日本語に翻訳・要約できる論文検索アプリ" />
        <meta property="og:type" content="website" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">論文検索・翻訳アプリ</h1>
            <p className="text-sm text-gray-500">最新の研究論文を簡単に検索・翻訳</p>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://github.com/username/paper-translate-app" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} />
        </div>
        
        <div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin h-12 w-12 border-4 border-gray-200 rounded-full border-t-blue-600"></div>
                <p className="mt-4 text-gray-700 text-lg">論文を検索中...</p>
                <p className="mt-2 text-gray-500 text-sm">
                  {usedGemini ? 'Gemini AIがあなたのクエリを解析しています...' : '少々お待ちください'}
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : papers.length > 0 || hasSearched ? (
            <>
              {usedGemini && lastSearchQuery && (
                <div className="mb-6 bg-purple-50 border border-purple-100 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <svg className="h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-purple-700">
                        <span className="font-medium">検索クエリ: </span>
                        {lastSearchQuery}
                      </p>
                      <p className="mt-1 text-xs text-purple-600">
                        Gemini AIを使用して最適な検索結果を提供しています
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <PaperList papers={papers} />
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg className="h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">論文を検索してみましょう</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                キーワードを入力して検索ボタンをクリックすると、関連する学術論文が表示されます。論文は自動的に翻訳・要約されます。
              </p>
              <div className="mt-6 inline-flex flex-wrap justify-center gap-2">
                <button 
                  onClick={() => handleSearch({ keyword: 'Transformer' })} 
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Transformer
                </button>
                <button 
                  onClick={() => handleSearch({ keyword: 'GPT' })} 
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  GPT
                </button>
                <button 
                  onClick={() => handleSearch({ keyword: 'Computer Vision' })} 
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Computer Vision
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center text-gray-500 text-sm">© {new Date().getFullYear()} 論文検索・翻訳アプリ - 学術研究をより簡単に</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="/about" className="text-gray-400 hover:text-gray-500">
                このアプリについて
              </a>
              <a href="/terms" className="text-gray-400 hover:text-gray-500">
                利用規約
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-gray-500">
                プライバシー
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
