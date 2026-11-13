import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { cycleService } from '../../services/cycleService';
import { ArrowLeft, Check, Trash2 } from 'lucide-react';

export const AdminEditCyclePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const cycle = await cycleService.getCycleById(id);
        setFormData({
          name: cycle.name,
          name_gu: cycle.name_gu || '',
          brand: cycle.brand,
          model: cycle.model || '',
          sku: cycle.sku || '',
          category: cycle.category || 'mountain',
          condition: cycle.condition || 'new',
          price: cycle.price,
          originalPrice: cycle.originalPrice || '',
          stock: cycle.stock,
          wheelSize: cycle.wheelSize || '',
          frameSize: cycle.frameSize || '',
          gears: cycle.gears || '',
          brakes: cycle.brakes || '',
          colorsStr: (cycle.colors || []).join(', '),
          description: cycle.description || '',
          description_gu: cycle.description_gu || '',
          isPublished: cycle.isPublished !== false
        });
        setImages(cycle.images || []);
      } catch (err) {
        setError('Cycle not found');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.updateCycle(id, {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || 0,
        stock: Number(formData.stock),
        colors: formData.colorsStr.split(',').map((c) => c.trim()).filter(Boolean),
        images
      });
      navigate('/admin/cycles');
    } catch (err) {
      alert(err.message || 'Failed to update cycle');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-xs text-stone-500">Loading cycle details...</div>;
  }

  if (!formData) {
    return <div className="py-16 text-center text-xs text-stone-500">Cycle not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-2">
        <Link
          to="/admin/cycles"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-emerald-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cycles</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Edit Showroom Record
          </span>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-0.5">
            Edit Cycle: {formData.name}
          </h1>
          <p className="text-xs text-stone-500">ID: {id}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Cycle Name (English) *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Cycle Name (Gujarati)</label>
              <input
                type="text"
                value={formData.name_gu}
                onChange={(e) => setFormData({ ...formData, name_gu: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Brand *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Model & SKU</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Model"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
                />
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="SKU"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
              >
                <option value="new">Brand New</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <Link
              to="/admin/cycles"
              className="px-4 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
