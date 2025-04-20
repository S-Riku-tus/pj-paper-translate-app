import os
import deepl
import openai
from dotenv import load_dotenv
from typing import Dict, Any, Optional

# .envファイルから環境変数を読み込む
load_dotenv()

# APIキーの設定
DEEPL_API_KEY = os.getenv("DEEPL_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# DeepLクライアントの設定
translator = None
if DEEPL_API_KEY:
    translator = deepl.Translator(DEEPL_API_KEY)

# OpenAIクライアントの設定
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

async def translate_text_with_deepl(text: str, target_lang: str = "JA") -> str:
    """
    DeepL APIを使用してテキストを翻訳する
    """
    if not translator or not text:
        return text
    
    try:
        result = translator.translate_text(text, target_lang=target_lang)
        return result.text
    except Exception as e:
        print(f"DeepL translation error: {str(e)}")
        return text

async def summarize_text_with_gpt(text: str) -> str:
    """
    GPT-3を使用してテキストを要約する
    """
    if not OPENAI_API_KEY or not text:
        return ""
    
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"以下の論文の要約を100-200字程度で簡潔に日本語で作成してください:\n\n{text}",
            max_tokens=200,
            n=1,
            stop=None,
            temperature=0.5,
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"GPT summarization error: {str(e)}")
        return ""

async def translate_and_summarize_paper(paper: Dict[str, Any]) -> Dict[str, Any]:
    """
    論文のタイトルとアブストラクトを翻訳し、
    翻訳後のアブストラクトを GPT で要約する。
    """
    result = paper.copy()

    # タイトルの翻訳
    if paper.get("title"):
        result["translated_title"] = await translate_text_with_deepl(paper["title"], "JA")

    # アブストラクトの翻訳
    translated_abstract = None
    if paper.get("abstract"):
        translated_abstract = await translate_text_with_deepl(paper["abstract"], "JA")
        result["translated_abstract"] = translated_abstract

    # GPTを使った要約（翻訳後のアブストラクトをベースにする例）
    if translated_abstract:
        result["summary"] = await summarize_text_with_gpt(translated_abstract)

    return result
