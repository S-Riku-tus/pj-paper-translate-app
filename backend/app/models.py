from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, index=True)  # arXiv ID等
    title = Column(String, index=True)
    authors = Column(String)
    abstract = Column(Text)
    publication_date = Column(Date)
    url = Column(String)
    genre = Column(String, index=True)  # 論文のジャンル/カテゴリー

    # 翻訳および要約データとの関連
    translation = relationship("PaperTranslation", back_populates="paper", uselist=False)


class PaperTranslation(Base):
    __tablename__ = "paper_translations"

    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("papers.id"))
    translated_title = Column(String)
    translated_abstract = Column(Text)
    summary = Column(Text)  # 要約テキスト

    # 論文との関連
    paper = relationship("Paper", back_populates="translation")
