import os
import httpx
import xml.etree.ElementTree as ET
from dotenv import load_dotenv
from datetime import datetime
from typing import List, Dict, Any, Optional

# .envファイルから環境変数を読み込む
load_dotenv()

# APIのベースURL取得
ARXIV_API_BASE_URL = os.getenv("ARXIV_API_BASE_URL", "http://export.arxiv.org/api/query")

# arXiv APIを使用して論文を検索する関数
async def search_papers_from_arxiv(keyword: Optional[str] = None, 
                                   category: Optional[str] = None, 
                                   start_year: Optional[int] = None,
                                   end_year: Optional[int] = None,
                                   max_results: int = 10) -> List[Dict[str, Any]]:
    """
    arXiv APIを使用して論文を検索する
    """
    # 検索クエリの構築
    query_parts = []
    
    if keyword:
        query_parts.append(f"all:{keyword}")
    
    if category:
        query_parts.append(f"cat:{category}")
    
    # 年による絞り込み (arXivではsubmittedDate検索が複雑なので、結果をフィルタリング)
    date_filter = ""
    if start_year:
        date_filter += f"submittedDate:[{start_year} TO "
        date_filter += f"{end_year if end_year else datetime.now().year}]"
        query_parts.append(date_filter)
    
    query = " AND ".join(query_parts) if query_parts else "all:*"
    
    # APIリクエストのパラメータ
    params = {
        "search_query": query,
        "start": 0,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": "descending"
    }
    
    # API呼び出し
    async with httpx.AsyncClient() as client:
        response = await client.get(ARXIV_API_BASE_URL, params=params)
        
        if response.status_code != 200:
            return []
        
        # XMLレスポンスのパース
        root = ET.fromstring(response.text)
        
        # 名前空間
        ns = {"atom": "http://www.w3.org/2005/Atom",
              "arxiv": "http://arxiv.org/schemas/atom"}
        
        papers = []
        
        # 論文エントリの処理
        for entry in root.findall(".//atom:entry", ns):
            # 出版日/投稿日の取得
            published = entry.find("atom:published", ns)
            if published is not None:
                published_date = datetime.fromisoformat(published.text.replace("Z", "+00:00"))
                year = published_date.year
                
                # 年のフィルタリング
                if (start_year and year < start_year) or (end_year and year > end_year):
                    continue
            else:
                year = None
            
            # タイトルの取得（余分な空白を削除）
            title_elem = entry.find("atom:title", ns)
            title = title_elem.text.strip() if title_elem is not None else ""
            
            # 著者の取得
            authors_elem = entry.findall("atom:author/atom:name", ns)
            authors = ", ".join([author.text for author in authors_elem]) if authors_elem else ""
            
            # 要約の取得
            summary_elem = entry.find("atom:summary", ns)
            abstract = summary_elem.text.strip() if summary_elem is not None else ""
            
            # IDの取得と整形
            id_elem = entry.find("atom:id", ns)
            full_id = id_elem.text if id_elem is not None else ""
            # arXiv IDの抽出 (http://arxiv.org/abs/2108.09112 -> 2108.09112)
            arxiv_id = full_id.split("/")[-1] if full_id else ""
            
            # リンクの取得
            link_elem = entry.find("atom:link[@rel='alternate']", ns)
            url = link_elem.get("href") if link_elem is not None else ""
            
            # カテゴリー（ジャンル）の取得
            category_elem = entry.find("arxiv:primary_category", ns)
            genre = category_elem.get("term") if category_elem is not None else ""
            
            # 論文データの整形
            paper = {
                "id": arxiv_id,
                "title": title,
                "authors": authors,
                "abstract": abstract,
                "year": str(year) if year else "",
                "url": url,
                "genre": genre,
                # 翻訳フィールドは初期状態では空
                "translated_title": None,
                "translated_abstract": None,
                "summary": None
            }
            
            papers.append(paper)
        
        return papers