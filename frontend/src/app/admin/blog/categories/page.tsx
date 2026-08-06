'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function AdminBlogCategories() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
      const res = await fetch(`${apiUrl}/blogs/categories/all`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  };

  const getHeaders = () => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('sellora_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleSaveNew = async () => {
    if (!formData.name) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
      const res = await fetch(`${apiUrl}/blogs/categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsAdding(false);
        setFormData({ name: '', slug: '' });
        fetchCategories();
      } else {
        alert('Failed to add category');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving category');
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!formData.name) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
      const res = await fetch(`${apiUrl}/blogs/categories/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setEditingId(null);
        setFormData({ name: '', slug: '' });
        fetchCategories();
      } else {
        alert('Failed to update category');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Make sure no posts are attached to it.')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
      const res = await fetch(`${apiUrl}/blogs/categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        fetchCategories();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to delete category');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting category');
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, slug: cat.slug });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Manage Categories</h1>
            <p className="text-slate-500 font-medium">Create and organize categories for your blog posts.</p>
          </div>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', slug: '' }); }}
          className="bg-[#4361EE] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#3651d4] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500 bg-slate-50">
              <th className="p-4 font-bold w-1/3">Name</th>
              <th className="p-4 font-bold w-1/3">Slug</th>
              <th className="p-4 font-bold text-center w-1/3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr className="border-b border-slate-100 bg-blue-50/50">
                <td className="p-4">
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="Category Name" 
                    className="w-full bg-white border border-slate-200 text-slate-700 py-1.5 px-3 rounded-lg text-sm focus:outline-none focus:border-[#4361EE]"
                    autoFocus
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="text" 
                    value={formData.slug} 
                    onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                    placeholder="Auto-generated if empty" 
                    className="w-full bg-white border border-slate-200 text-slate-700 py-1.5 px-3 rounded-lg text-sm focus:outline-none focus:border-[#4361EE]"
                  />
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={handleSaveNew} className="p-1.5 text-green-600 bg-green-100 hover:bg-green-200 rounded-lg transition-colors" title="Save">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsAdding(false)} className="p-1.5 text-slate-500 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors" title="Cancel">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                {editingId === cat.id ? (
                  <>
                    <td className="p-4">
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        className="w-full bg-white border border-[#4361EE] text-slate-700 py-1.5 px-3 rounded-lg text-sm focus:outline-none"
                      />
                    </td>
                    <td className="p-4">
                      <input 
                        type="text" 
                        value={formData.slug} 
                        onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                        className="w-full bg-white border border-[#4361EE] text-slate-700 py-1.5 px-3 rounded-lg text-sm focus:outline-none"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleSaveEdit(cat.id)} className="p-1.5 text-green-600 bg-green-100 hover:bg-green-200 rounded-lg transition-colors" title="Save">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelEdit} className="p-1.5 text-slate-500 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors" title="Cancel">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-bold text-slate-800">{cat.name}</td>
                    <td className="p-4 text-sm text-slate-500 font-medium font-mono bg-slate-100/50 rounded inline-block mt-3">{cat.slug}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => startEdit(cat)} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {categories.length === 0 && !isAdding && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500 font-medium">
                  No categories found. Click "Add Category" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
