import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { 
  ArrowLeft, 
  Bike, 
  Plus, 
  Trash2, 
  Upload, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';

export const AdminAddCyclePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    name_gu: '',
    brand: '',
    model: '',
    sku: '',
    category: 'mountain',
    condition: 'new',
    price: '',
    originalPrice: '',
    stock: 1,
    wheelSize: '27.5"',
    frameSize: '18" Steel Alloy',
    gears: '21-Speed Shimano',
    brakes: 'Dual Disc Brakes',
    colorsStr: 'Matte Black / Green',
    description: '',
    description_gu: '',
    isPublished: true,
    isFeatured: false
  });

  const [images, setImages] = useState([
    '/images/cycles/cycle_safari_mtb.jpg'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
    setError('');

    if (!formData.name.trim() || !formData.brand.trim()) {
      setError('Please provide Cycle Name and Brand');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Please enter a valid selling price');
      return;
    }

    setSubmitting(true);
    try {
      await adminService.addCycle({
        ...formData,
        colors: formData.colorsStr.split(',').map((c) => c.trim()).filter(Boolean),
        images: images.length > 0 ? images : ['/images/cycles/cycle_safari_mtb.jpg']
      });
      navigate('/admin/cycles');
    } catch (err) {
      setError(err.message || 'Failed to save cycle');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-2">
        <Link
          to="/admin/cycles"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-emerald-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Cycles</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Showroom Inventory Entry
          </span>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-0.5">
            Add New Cycle to Catalogue
          </h1>
          <p className="text-xs text-stone-500">
            Add bicycle details, specifications, photography, and inventory count
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 pb-2 border-b border-stone-100">
              1. Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Cycle Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Safari Trail MTB 27.5T"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  સાઇકલનું નામ (ગુજરાતી)
                </label>
                <input
                  type="text"
                  value={formData.name_gu}
                  onChange={(e) => setFormData({ ...formData, name_gu: e.target.value })}
                  placeholder="જેમ કે: સફારી ટ્રેઇલ એમટીબી ૨૭.૫T"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Hero, Hercules, SAFAR Series"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Model & SKU / Code
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Model (TR-275)"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                  />
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SKU (CYC-001)"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                >
                  <option value="mountain">Mountain (MTB)</option>
                  <option value="city">City / Commuter</option>
                  <option value="geared">Geared Hybrid</option>
                  <option value="kids">Kids</option>
                  <option value="road">Road</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Product Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                >
                  <option value="new">Brand New</option>
                  <option value="used">Workshop Certified Used</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Stock */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 pb-2 border-b border-stone-100">
              2. Price and Inventory
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Selling Price (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 11499"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Original / MRP Price (₹ opt)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="e.g. 13999"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Available Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="1"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Specifications */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 pb-2 border-b border-stone-100">
              3. Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Wheel Size</label>
                <input
                  type="text"
                  value={formData.wheelSize}
                  onChange={(e) => setFormData({ ...formData, wheelSize: e.target.value })}
                  placeholder='26", 27.5", 29", 700C'
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Frame Size</label>
                <input
                  type="text"
                  value={formData.frameSize}
                  onChange={(e) => setFormData({ ...formData, frameSize: e.target.value })}
                  placeholder='18" Alloy, Rigid Steel'
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Gear System</label>
                <input
                  type="text"
                  value={formData.gears}
                  onChange={(e) => setFormData({ ...formData, gears: e.target.value })}
                  placeholder="21-Speed Shimano, Single Speed"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Brake Type</label>
                <input
                  type="text"
                  value={formData.brakes}
                  onChange={(e) => setFormData({ ...formData, brakes: e.target.value })}
                  placeholder="Dual Disc Brakes, V-Brakes"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-stone-700 block mb-1">Available Colors (Comma separated)</label>
                <input
                  type="text"
                  value={formData.colorsStr}
                  onChange={(e) => setFormData({ ...formData, colorsStr: e.target.value })}
                  placeholder="Matte Black / Green, Charcoal Grey"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Descriptions */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 pb-2 border-b border-stone-100">
              4. Descriptions
            </h2>

            <div>
              <label className="font-bold text-stone-700 block mb-1">English Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Key features, rider comfort, and riding suitability..."
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">ગુજરાતી વિવરણ (Gujarati)</label>
              <textarea
                rows={2}
                value={formData.description_gu}
                onChange={(e) => setFormData({ ...formData, description_gu: e.target.value })}
                placeholder="સાઇકલની મુખ્ય વિશેષતાઓ અને ઉપયોગિતા..."
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
              />
            </div>
          </div>

          {/* Section 5: Photographs */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 pb-2 border-b border-stone-100">
              5. Photographs & Gallery
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL (e.g. Unsplash or shop hosting)..."
                className="flex-1 px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold"
              >
                Add Image
              </button>
            </div>

            {/* Previews */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-stone-200 aspect-4/3 bg-stone-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600 text-white opacity-90 hover:opacity-100 shadow-xs"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
                      Main Photo
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Publishing toggle */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 text-emerald-700 accent-emerald-700 rounded"
              />
              <span className="font-bold text-stone-800 text-sm">
                Publish immediately on public catalogue
              </span>
            </label>

            <div className="flex items-center gap-2">
              <Link
                to="/admin/cycles"
                className="px-4 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md transition-colors flex items-center gap-2"
              >
                {submitting && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                <Check className="w-4 h-4" />
                <span>Save & Publish Cycle</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
