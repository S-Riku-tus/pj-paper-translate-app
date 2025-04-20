import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, ClipboardCopyIcon, CheckIcon } from '@heroicons/react/outline';

export default function PaperDetail({ paper, open, setOpen }) {
  const [copiedText, setCopiedText] = useState(null);

  if (!paper) return null;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden z-10" onClose={setOpen}>
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

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w-3xl">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900 flex items-center">
                        <div className="bg-blue-600 rounded-md p-1.5 mr-2">
                          <svg
                            className="h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        論文詳細
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-transparent rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">閉じる</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 px-4 sm:px-6 py-6 overflow-auto">
                    <div className="mb-8">
                      <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold text-gray-900 break-words pr-4">
                          {paper.translated_title || paper.title}
                        </h2>
                        <div className="flex flex-col items-end">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                            {paper.year}年
                          </span>
                          {paper.genre && (
                            <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                              {paper.genre}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {paper.title !== paper.translated_title && paper.translated_title && (
                        <div className="mt-2 flex items-center group">
                          <p className="text-sm text-gray-500 italic flex-grow">
                            <span className="font-medium">原題: </span> 
                            {paper.title}
                          </p>
                          <button
                            onClick={() => handleCopy(paper.title, 'title')}
                            className="ml-2 text-gray-400 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition duration-150 ease-in-out focus:outline-none"
                            title="タイトルをコピー"
                          >
                            {copiedText === 'title' ? (
                              <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                            ) : (
                              <ClipboardCopyIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center group">
                        <p className="text-sm text-gray-600 flex-grow">
                          <span className="font-medium">著者:</span> {paper.authors}
                        </p>
                        <button
                          onClick={() => handleCopy(paper.authors, 'authors')}
                          className="ml-2 text-gray-400 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition duration-150 ease-in-out focus:outline-none"
                          title="著者名をコピー"
                        >
                          {copiedText === 'authors' ? (
                            <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                          ) : (
                            <ClipboardCopyIcon className="h-5 w-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {paper.summary && (
                      <div className="mb-8">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">要約</h3>
                          <div className="ml-2 px-2 py-0.5 text-xs rounded-md bg-blue-50 text-blue-700">AI生成</div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md border border-blue-100 relative group">
                          <p className="text-sm text-gray-800">{paper.summary}</p>
                          <button
                            onClick={() => handleCopy(paper.summary, 'summary')}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition duration-150 ease-in-out focus:outline-none"
                            title="要約をコピー"
                          >
                            {copiedText === 'summary' ? (
                              <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                            ) : (
                              <ClipboardCopyIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {paper.translated_abstract && (
                      <div className="mb-8">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">翻訳された概要</h3>
                          <div className="ml-2 px-2 py-0.5 text-xs rounded-md bg-green-50 text-green-700">DeepL翻訳</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-md border border-green-100 relative group">
                          <p className="text-sm text-gray-800">{paper.translated_abstract}</p>
                          <button
                            onClick={() => handleCopy(paper.translated_abstract, 'translated_abstract')}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition duration-150 ease-in-out focus:outline-none"
                            title="翻訳をコピー"
                          >
                            {copiedText === 'translated_abstract' ? (
                              <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                            ) : (
                              <ClipboardCopyIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">原文概要</h3>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 relative group">
                        <p className="text-sm text-gray-800">{paper.abstract}</p>
                        <button
                          onClick={() => handleCopy(paper.abstract, 'abstract')}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition duration-150 ease-in-out focus:outline-none"
                          title="原文をコピー"
                        >
                          {copiedText === 'abstract' ? (
                            <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                          ) : (
                            <ClipboardCopyIcon className="h-5 w-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4 flex flex-wrap gap-2">
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        論文を開く
                      </a>
                      <button
                        onClick={() => handleCopy(paper.url, 'url')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {copiedText === 'url' ? (
                          <>
                            <CheckIcon className="h-4 w-4 mr-1.5 text-green-500" aria-hidden="true" />
                            コピーしました
                          </>
                        ) : (
                          <>
                            <ClipboardCopyIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
                            URLをコピー
                          </>
                        )}
                      </button>
                    </div>
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