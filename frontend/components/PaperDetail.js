import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, DownloadIcon, ExternalLinkIcon, ClipboardCopyIcon } from '@heroicons/react/outline';

export default function PaperDetail({ paper, open, setOpen }) {
  const [copiedField, setCopiedField] = useState(null);
  
  if (!paper) return null;
  
  const handleCopy = (text, field) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden z-50" onClose={setOpen}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w-2xl">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 py-6 sm:px-6 bg-gradient-to-r from-blue-500 to-indigo-600">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-white">論文詳細</Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">閉じる</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                    <div className="space-y-6">
                      {/* 論文タイトル */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">
                          {paper.translated_title || paper.title}
                        </h3>
                        {paper.translated_title && paper.title && paper.title !== paper.translated_title && (
                          <h4 className="text-sm mt-1 text-gray-500 font-medium italic">
                            {paper.title}
                          </h4>
                        )}
                      </div>

                      {/* メタデータ */}
                      <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">著者</p>
                          <p className="text-sm text-gray-900">{paper.authors || '不明'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">年</p>
                          <p className="text-sm text-gray-900">{paper.year || '不明'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">カテゴリ</p>
                          <p className="text-sm text-gray-900">{paper.genre || '不明'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">URL</p>
                          <a 
                            href={paper.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block"
                          >
                            {paper.url ? 'リンク' : '不明'}
                          </a>
                        </div>
                      </div>

                      {/* 要約 */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-medium text-gray-900 flex items-center">
                            要約
                            <button
                              onClick={() => handleCopy(paper.translated_abstract || paper.summary, 'summary')}
                              className="ml-2 text-gray-400 hover:text-gray-500 inline-flex items-center"
                              title="要約をコピー"
                            >
                              {copiedField === 'summary' ? (
                                <span className="text-xs text-green-500">コピーしました</span>
                              ) : (
                                <ClipboardCopyIcon className="h-4 w-4" />
                              )}
                            </button>
                          </h4>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            日本語
                          </span>
                        </div>
                        <div className="mt-2 p-4 bg-white border border-gray-200 rounded-md text-sm text-gray-800 leading-relaxed">
                          {paper.translated_abstract || paper.summary || (
                            <span className="text-gray-500 italic">要約は翻訳中か存在しません</span>
                          )}
                        </div>
                      </div>

                      {/* 原文 */}
                      {paper.abstract && (
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-medium text-gray-900 flex items-center">
                              原文
                              <button
                                onClick={() => handleCopy(paper.abstract, 'abstract')}
                                className="ml-2 text-gray-400 hover:text-gray-500 inline-flex items-center"
                                title="原文をコピー"
                              >
                                {copiedField === 'abstract' ? (
                                  <span className="text-xs text-green-500">コピーしました</span>
                                ) : (
                                  <ClipboardCopyIcon className="h-4 w-4" />
                                )}
                              </button>
                            </h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                              English
                            </span>
                          </div>
                          <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 leading-relaxed">
                            {paper.abstract}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* フッター */}
                  <div className="flex-shrink-0 px-4 py-4 flex justify-between items-center border-t border-gray-200 bg-gray-50">
                    <div className="flex">
                      <a
                        href={paper.pdf_url || paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <DownloadIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                        論文を開く
                      </a>
                    </div>
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ExternalLinkIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      原文サイト
                    </a>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}