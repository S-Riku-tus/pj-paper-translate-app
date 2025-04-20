import Head from 'next/head';
import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import PaperList from '../components/PaperList';
import { searchPapers } from '../utils/api';

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
  
  const handleSearch = async (searchParams: SearchParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 開発段階では、モックデータを使用します
      // 本番環境では、APIを呼び出します
      console.log('Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        USE_REAL_API: process.env.NEXT_PUBLIC_USE_REAL_API
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
            translated_title: 'GPT-3: 言語モデルは少数ショット学習が可能',
            translated_abstract: '大規模なテキストコーパスで事前学習し、特定のタスクでファインチューニングすることで、多くのNLPタスクとベンチマークで大幅な改善が示されています。',
            summary: '1750億パラメータの大規模言語モデルを提案し、タスク特化の細調整なしに少数の例だけで様々なNLPタスクを実行できることを示しました。モデルサイズと性能の関係性を分析し、大規模化が少数ショット学習能力を向上させることを実証した画期的研究です。',
            url: 'https://arxiv.org/abs/2005.14165'
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
            paper.translated_abstract?.toLowerCase().includes(keyword)
          );
        }
        
        // ジャンルフィルタリング（モックではシンプルに実装）
        if (searchParams.genre) {
          // 実際のAPIでは、ジャンルによる適切なフィルタリングを行います
          // ここではモックなのでシンプルに実装
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
        const data = await searchPapers(searchParams);
        setPapers(data);
      }
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
