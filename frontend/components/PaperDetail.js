import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

export default function PaperDetail({ paper, open, setOpen }) {
  if (!paper) return null;

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
                  <div className="px-4 sm:px-6 py-6 bg-blue-50 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        論文詳細
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-blue-50 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                      <div className="flex justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {paper.translated_title || paper.title}
                        </h2>
                        <p className="text-sm text-gray-500 whitespace-nowrap ml-4">{paper.year}年</p>
                      </div>
                      
                      {paper.title !== paper.translated_title && paper.translated_title && (
                        <p className="mt-1 text-sm text-gray-500 italic">
                          原題: {paper.title}
                        </p>
                      )}
                      
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">著者:</span> {paper.authors}
                      </p>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">要約</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-800">{paper.summary}</p>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">翻訳された概要</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-800">{paper.translated_abstract}</p>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">原文概要</h3>
                      <div className="bg-blue-50 p-4 rounded-md">
                        <p className="text-sm text-gray-800">{paper.abstract}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        論文を開く
                      </a>
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