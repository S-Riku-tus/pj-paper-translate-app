from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む
load_dotenv()

# データベースURL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# エンジンの作成
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# セッションの作成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデルのベースクラス
Base = declarative_base()

# データベースセッションの依存関係
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
