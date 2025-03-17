// utils/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function searchPapers(searchParams) {
  const queryParams = new URLSearchParams();
  
  if (searchParams.keyword) queryParams.append('keyword', searchParams.keyword);
  if (searchParams.genre) queryParams.append('genre', searchParams.genre);
  if (searchParams.year_from) queryParams.append('year_from', searchParams.year_from);
  if (searchParams.year_to) queryParams.append('year_to', searchParams.year_to);
  
  const url = `${API_BASE_URL}/api/papers?${queryParams.toString()}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }
  
  return await response.json();
}

export async function translatePaper(paperId, text) {
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
}