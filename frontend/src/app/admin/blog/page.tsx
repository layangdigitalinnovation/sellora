'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminBlogList() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
      const res = await fetch(`${apiUrl}/blogs?all=true`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error('Failed to fetch posts', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
      const res = await fetch(`${apiUrl}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchPosts(); // Refresh the list
      } else {
        alert('Failed to delete post');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred');
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">{t('admin.blog') || 'Blog CMS'}</h1>
          <p className="text-slate-500 font-medium">Manage your platform's blog posts.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/blog/categories" className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            Manage Categories
          </Link>
          <Link href="/admin/blog/editor" className="bg-[#4361EE] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#3651d4] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Post
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-700 py-2 pl-9 pr-4 rounded-lg font-medium text-sm focus:outline-none focus:border-[#4361EE]"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-white border border-slate-200 text-slate-700 py-2 px-3 rounded-lg font-bold text-sm focus:outline-none focus:border-[#4361EE]">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="p-4 font-bold">Title</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Date</th>
              <th className="p-4 font-bold text-right">Views</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                <td className="p-4 font-bold text-slate-800">{post.title}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    post.published ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500 font-medium">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td className="p-4 text-sm text-slate-500 font-bold text-right">0</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2 transition-opacity">

                    <Link href={`/admin/blog/editor?slug=${post.slug}`} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(post.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                  No posts found. Create your first post!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
