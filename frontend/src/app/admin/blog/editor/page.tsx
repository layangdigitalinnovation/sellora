'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon, Send, Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered, Quote, Code, Heading1, Heading2, Eye, PenTool } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminBlogEditor() {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [excerpt, setExcerpt] = useState('');

  const insertText = (before: string, after: string = '') => {
    setContent(prev => prev + before + (after ? 'text' + after : ''));
  };

  const handleInsertImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      setContent(prev => prev + `\n![image description](${url})\n`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/blog" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-bold text-sm">Back to Blog List</span>
        </Link>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl text-slate-600 font-bold text-sm bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button className="px-4 py-2 rounded-xl text-white font-bold text-sm bg-[#4361EE] hover:bg-[#3651d4] transition-colors flex items-center gap-2 shadow-sm shadow-[#4361EE]/20">
            <Send className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[calc(100vh-200px)]">
        {/* Editor Toolbar */}
        <div className="border-b border-slate-200 p-3 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
           <div className="flex items-center gap-2">
             <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 py-1.5 px-3 rounded-lg font-bold text-sm focus:outline-none focus:border-[#4361EE]"
             >
                <option value="">Select Category...</option>
                <option value="success">Sellora Success</option>
                <option value="tips">Platform Tips</option>
                <option value="news">News</option>
             </select>
             <div className="w-px h-6 bg-slate-200 mx-1"></div>
             
             {!isPreview && (
               <div className="flex items-center gap-1">
                 <button onClick={() => insertText('**', '**')} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-[#4361EE] transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
                 <button onClick={() => insertText('*', '*')} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-[#4361EE] transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
                 <button onClick={() => insertText('<u>', '</u>')} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-[#4361EE] transition-colors" title="Underline"><Underline className="w-4 h-4" /></button>
                 <div className="w-px h-4 bg-slate-200 mx-1"></div>
                 <button onClick={() => insertText('## ')} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-[#4361EE] transition-colors" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
                 <button onClick={() => insertText('> ')} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-[#4361EE] transition-colors" title="Quote"><Quote className="w-4 h-4" /></button>
                 <button onClick={() => insertText('`', '`')} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-[#4361EE] transition-colors" title="Code"><Code className="w-4 h-4" /></button>
                 <div className="w-px h-4 bg-slate-200 mx-1"></div>
                 <button onClick={() => insertText('[title](url)')} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-[#4361EE] transition-colors" title="Link"><LinkIcon className="w-4 h-4" /></button>
                 <button onClick={() => insertText('- ')} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-[#4361EE] transition-colors" title="Bullet List"><List className="w-4 h-4" /></button>
                 <button onClick={() => insertText('1. ')} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-[#4361EE] transition-colors" title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
                 <button onClick={handleInsertImage} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-[#4361EE] transition-colors" title="Insert Image URL"><ImageIcon className="w-4 h-4" /></button>
               </div>
             )}
           </div>

           <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
             <button 
                onClick={() => setIsPreview(false)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${!isPreview ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <PenTool className="w-3.5 h-3.5" /> Write
             </button>
             <button 
                onClick={() => setIsPreview(true)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${isPreview ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <Eye className="w-3.5 h-3.5" /> Preview
             </button>
           </div>
        </div>

        <div className="p-8 flex-1 flex flex-col gap-6 overflow-y-auto">
          {!isPreview ? (
            <>
              <input 
                type="text"
                placeholder="Article Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-4xl font-black font-serif text-slate-900 placeholder:text-slate-300 focus:outline-none mb-4"
              />
              
              <div className="space-y-2 mb-4">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Article Summary (Excerpt)</label>
                <textarea
                  placeholder="Write a short summary. This will appear on the blog cards in the homepage..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full h-20 resize-none text-base text-slate-600 placeholder:text-slate-300 focus:outline-none p-4 bg-slate-50 rounded-xl border border-slate-100"
                ></textarea>
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Main Content</label>
                <textarea
                  placeholder="Write your amazing story here (Supports Markdown / HTML)..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full flex-1 resize-none text-lg text-slate-700 placeholder:text-slate-300 focus:outline-none leading-relaxed min-h-[300px]"
                ></textarea>
              </div>
            </>
          ) : (
            <div className="max-w-none">
              <h1 className="text-4xl font-black font-serif text-slate-900 mb-4">{title || 'Untitled Article'}</h1>
              {excerpt && <p className="text-lg text-slate-500 font-medium mb-8 border-l-4 border-[#4361EE] pl-4">{excerpt}</p>}
              <div 
                className="prose prose-lg prose-slate prose-headings:font-black prose-headings:font-serif prose-a:text-[#5C4CFC] prose-blockquote:border-l-[#5C4CFC] prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic"
                dangerouslySetInnerHTML={{ __html: content || '<p className="text-slate-400 italic">Nothing to preview yet...</p>' }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
