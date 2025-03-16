import Head from 'next/head';
import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import PaperList from '../components/PaperList';

export default function Home() {
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSearch = async (searchParams) => {
    setIsLoading(true);
    try {
      // バックエンドAPIが実装されるまでのモックデータ
      setTimeout(() => {
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
          }
        ];
        setPapers(mockPapers);
        setIsLoading(false);
      }, 1000);
      
      // 実際のAPIが実装されたら以下のコードを使用
      // const response = await axios.get('/api/papers', { params: searchParams });
      // setPapers(response.data);
      // setIsLoading(false);
    } catch (error) {
      console.error('Error fetching papers:', error);
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