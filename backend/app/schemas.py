from pydantic import BaseModel
from typing import List, Optional


# 論文検索のリクエストモデル
class PaperSearchRequest(BaseModel):
    keyword: Optional[str] = None
    genre: Optional[str] = None
    year_from: Optional[int] = None
    year_to: Optional[int] = None


# 論文翻訳のリクエストモデル
class PaperTranslateRequest(BaseModel):
    paper_id: str
    text: Optional[str] = None


# 論文の翻訳・要約モデル
class PaperTranslationResponse(BaseModel):
    translated_title: Optional[str] = None
    translated_abstract: Optional[str] = None
    summary: Optional[str] = None

    class Config:
        orm_mode = True


# 論文のレスポンスモデル
class PaperResponse(BaseModel):
    id: str
    title: str
    authors: str
    abstract: str
    year: str
    url: str
    genre: Optional[str] = None
    translated_title: Optional[str] = None
    translated_abstract: Optional[str] = None
    summary: Optional[str] = None

    class Config:
        orm_mode = True


# 論文リストのレスポンスモデル
class PaperListResponse(BaseModel):
    papers: List[PaperResponse]
    total: int
