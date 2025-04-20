// utils/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function searchPapers(searchParams) {
  // 環境変数をログに出力して確認
  console.log('API Call - Environment:', {
    API_BASE_URL,
    USE_REAL_API: process.env.NEXT_PUBLIC_USE_REAL_API
  });

  // モックデータを使用する場合は早期リターン
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_REAL_API !== 'true') {
    console.log('Using mock data instead of API call');
    return [];
  }

  const queryParams = new URLSearchParams();
  
  if (searchParams.keyword) queryParams.append('keyword', searchParams.keyword);
  if (searchParams.genre) queryParams.append('genre', searchParams.genre);
  if (searchParams.year_from) queryParams.append('year_from', searchParams.year_from);
  if (searchParams.year_to) queryParams.append('year_to', searchParams.year_to);
  
  const url = `${API_BASE_URL}/api/papers?${queryParams.toString()}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

export async function searchPapersWithGemini(searchParams) {
  // 環境変数をログに出力して確認
  console.log('Gemini API Call - Environment:', {
    API_BASE_URL,
    USE_REAL_API: process.env.NEXT_PUBLIC_USE_REAL_API
  });

  // モックデータを使用する場合は早期リターン
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_REAL_API !== 'true') {
    console.log('Using mock data instead of Gemini API call');
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/papers/search-with-gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Gemini API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Gemini API request error:', error);
    throw error;
  }
}

export async function translatePaper(paperId, text) {
  // 環境変数をログに出力して確認
  console.log('Translation API Call - Environment:', {
    API_BASE_URL,
    USE_REAL_API: process.env.NEXT_PUBLIC_USE_REAL_API
  });

  // モックデータを使用する場合
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_REAL_API !== 'true') {
    console.log('Using mock translation instead of API call');
    // 1秒の遅延を追加して非同期処理をシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // モック翻訳を返す
    return {
      translated_text: `これは「${text.substring(0, 30)}...」のモック翻訳です。実際のAPIが利用可能になると、本物の翻訳が提供されます。`,
      success: true
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/papers/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paper_id: paperId, text }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Translation request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Translation API request error:', error);
    throw error;
  }
}

export async function summarizePaper(paperId, text) {
  // 環境変数をログに出力して確認
  console.log('Summarization API Call - Environment:', {
    API_BASE_URL,
    USE_REAL_API: process.env.NEXT_PUBLIC_USE_REAL_API
  });

  // モックデータを使用する場合
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_REAL_API !== 'true') {
    console.log('Using mock summarization instead of API call');
    // 1秒の遅延を追加して非同期処理をシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // モック要約を返す
    return {
      summary: `これは「${text.substring(0, 30)}...」のモック要約です。実際のAPIが利用可能になると、Gemini APIを使用した本物の要約が提供されます。`,
      success: true
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/papers/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paper_id: paperId, text }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Summarization request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Summarization API request error:', error);
    throw error;
  }
}
