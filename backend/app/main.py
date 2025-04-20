from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
import asyncio
from dotenv import load_dotenv
import google.generativeai as genai
from app.schemas import PaperSearchRequest, PaperResponse
from app.services.paper_search import search_papers_from_arxiv
from app.services.translation import translate_and_summarize_paper

# 環境変数の読み込み
load_dotenv()

# GeminiのAPI設定
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    genai_model = genai.GenerativeModel('gemini-1.5-pro')
else:
    print("Warning: GEMINI_API_KEY is not set. Gemini API features will not be available.")
    genai_model = None

app = FastAPI(title="論文検索・翻訳API", description="論文を検索し、翻訳・要約するAPIです")

# CORSミドルウェアの追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では特定のオリジンに制限することをお勧めします
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "論文検索・翻訳APIへようこそ"}


@app.get("/api/papers", response_model=List[PaperResponse])
async def search_papers(
    keyword: Optional[str] = Query(None, description="検索キーワード"),
    genre: Optional[str] = Query(None, description="論文のジャンル/カテゴリー"),
    year_from: Optional[int] = Query(None, description="検索対象の開始年"),
    year_to: Optional[int] = Query(None, description="検索対象の終了年"),
    translate: bool = Query(True, description="翻訳を行うかどうか")
):
    """
    論文を検索し、必要に応じて翻訳・要約を行うAPIエンドポイント
    """
    try:
        # arXiv APIを使って論文を検索
        papers = await search_papers_from_arxiv(
            keyword=keyword,
            category=genre,
            start_year=year_from,
            end_year=year_to,
            max_results=10
        )

        # 翻訳が必要な場合は翻訳・要約を実行
        if translate and papers:
            # 同時に複数の論文を処理するために非同期処理を利用
            tasks = [translate_and_summarize_paper(paper) for paper in papers]
            papers = await asyncio.gather(*tasks)

        return papers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"論文検索中にエラーが発生しました: {str(e)}")


@app.post("/api/papers/search-with-gemini", response_model=List[PaperResponse])
async def search_papers_with_gemini(
    request: PaperSearchRequest
):
    """
    Gemini APIを使用して、自然言語の問い合わせから論文を検索するエンドポイント。
    検索と同時に翻訳と要約も行う。
    """
    if not genai_model:
        raise HTTPException(status_code=500, detail="Gemini APIが設定されていません")

    try:
        # Geminiを使用してキーワードを抽出・拡張する
        prompt = f"""
        以下の検索クエリから、学術論文を検索するための適切なキーワードと条件を抽出してください。
        複数の関連キーワードも提案してください。

        検索クエリ: {request.keyword}

        回答形式:
        {{
          "main_keywords": "メインの検索キーワード",
          "additional_keywords": ["関連キーワード1", "関連キーワード2", ...],
          "category": "適切なarXivカテゴリ（分かる場合のみ、例: cs.AI, cs.CL）",
          "year_range": [開始年, 終了年]（分かる場合のみ）
        }}

        JSONフォーマットで回答してください。
        """

        response = genai_model.generate_content(prompt)
        processed_response = response.text.strip()

        # 文字列からJSONを抽出（余分なテキストがある場合に対応）
        import json
        import re

        json_match = re.search(r'\{.*\}', processed_response, re.DOTALL)
        if json_match:
            search_params = json.loads(json_match.group(0))
        else:
            # JSONが見つからない場合は元のキーワードを使用
            search_params = {
                "main_keywords": request.keyword,
                "additional_keywords": [],
                "category": request.genre,
                "year_range": [request.year_from, request.year_to] if request.year_from and request.year_to else None
            }

        # 検索キーワードを組み立て
        main_keyword = search_params.get("main_keywords", request.keyword)
        additional_keywords = search_params.get("additional_keywords", [])

        # 最大2つの追加キーワードを使用
        combined_keyword = main_keyword
        if additional_keywords and len(additional_keywords) > 0:
            extra_keywords = additional_keywords[:2]  # 最大2つまで
            combined_keyword = f"{main_keyword} {' '.join(extra_keywords)}"

        # カテゴリと年の範囲を取得
        category = search_params.get("category", request.genre)
        year_range = search_params.get("year_range", [])

        start_year = year_range[0] if year_range and len(year_range) > 0 else request.year_from
        end_year = year_range[1] if year_range and len(year_range) > 1 else request.year_to

        # arXiv APIを使って論文を検索
        papers = await search_papers_from_arxiv(
            keyword=combined_keyword,
            category=category,
            start_year=start_year,
            end_year=end_year,
            max_results=10
        )

        # 翻訳と要約を実行
        if papers:
            tasks = [translate_and_summarize_paper(paper) for paper in papers]
            papers = await asyncio.gather(*tasks)

        return papers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini APIを使用した検索中にエラーが発生しました: {str(e)}")


@app.post("/api/papers/translate")
async def translate_paper_text(
    paper_id: str = Query(..., description="翻訳対象の論文ID"),
    text: str = Query(..., description="翻訳対象のテキスト")
):
    """
    指定されたテキストを翻訳するAPIエンドポイント
    """
    try:
        # カスタム翻訳実装を使用
        from app.services.translation import translate_text_with_deepl

        translated_text = await translate_text_with_deepl(text)
        return {
            "translated_text": translated_text,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"翻訳中にエラーが発生しました: {str(e)}")


@app.post("/api/papers/summarize")
async def summarize_paper(
    paper_id: str = Query(..., description="要約対象の論文ID"),
    text: str = Query(..., description="要約対象のテキスト")
):
    """
    指定されたテキストを要約するAPIエンドポイント
    """
    if not genai_model:
        raise HTTPException(status_code=500, detail="Gemini APIが設定されていません")

    try:
        # Gemini APIを使用して要約を生成
        prompt = f"""
        以下の論文テキストを日本語で200文字程度に要約してください。
        簡潔で分かりやすい文章にし、論文の主要な貢献や結論を含めてください。

        論文テキスト:
        {text}
        """

        response = genai_model.generate_content(prompt)
        summary = response.text.strip()

        return {
            "summary": summary,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"要約中にエラーが発生しました: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
