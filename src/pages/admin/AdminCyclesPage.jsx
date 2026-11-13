import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { 
  Bike, 
  PlusCircle, 
  Search, 
  Edit, 
  Archive, 
  CheckCircle2, 
  XCircle, 
  ExternalLink 
} from 'lucide-react';

export const AdminCyclesPage = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStock, setFilterStock] = useState('ALL'); // ALL, IN_STOCK, OUT_OF_STOCK
  const [archiveTargetId, setArchiveTargetId] = useState(null);

  const loadCycles = async () => {
    try {
      const data = await adminService.getAllCycles();
      setCycles(data);
    } catch (err) {
      console.error('Failed to load admin cycles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCycles();
  }, []);

  const handleArchiveConfirm = async () => {
    if (!archiveTargetId) return;
    try {
      await adminService.archiveCycle(archiveTargetId);
      setArchiveTargetId(null);
      await loadCycles();
    } catch (err) {
      alert('Failed to archive cycle');
    }
  };

  const filteredCycles = useMemo(() => {
    return cycles.filter((c) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const mName = c.name?.toLowerCase().includes(q);
        const mBrand = c.brand?.toLowerCase().includes(q);
        const mSku = c.sku?.toLowerCase().includes(q);
        if (!mName && !mBrand && !mSku) return false;
      }

      if (filterStock === 'IN_STOCK' && c.stock <= 0) return false;
      if (filterStock === 'OUT_OF_STOCK' && c.stock > 0) return false;

      return true;
    });
  }, [cycles, search, filterStock]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Cycle Inventory & Showcase Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage models for sale in shop, pricing, stock count, and specifications
          </p>
        </div>

        <Link
          to="/admin/cycles/add"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Cycle</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, or brand..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none"
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="IN_STOCK">In Stock Only</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Cycles List / Table */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-40 bg-stone-200 rounded-2xl animate-pulse" />
        </div>
      ) : filteredCycles.length > 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Cycle & Brand</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Condition</th>
                  <th className="px-4 py-3.5">Selling Price</th>
                  <th className="px-4 py-3.5">Stock</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredCycles.map((cycle) => (
                  <tr key={cycle.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={cycle.images?.[0] || '/images/cycles/cycle_safari_mtb.jpg'}
                          alt=""
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/cycles/cycle_safari_mtb.jpg';
                          }}
                          className="w-12 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{cycle.name}</p>
                          <p className="text-[11px] text-stone-500">{cycle.brand} {cycle.sku && `• SKU: ${cycle.sku}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium uppercase text-[11px] text-stone-600">
                      {cycle.category}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cycle.condition === 'used' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {cycle.condition}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-black text-stone-900 font-sans text-sm">
                      ₹{cycle.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 font-bold font-mono">
                      {cycle.stock} pcs
                    </td>
                    <td className="px-4 py-3.5">
                      {cycle.stock > 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Out of Stock</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/cycles/${cycle.id}`}
                          target="_blank"
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg"
                          title="Preview public view"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/cycles/${cycle.id}/edit`}
                          className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded-lg font-bold"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setArchiveTargetId(cycle.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Rows */}
          <div className="md:hidden divide-y divide-stone-100">
            {filteredCycles.map((cycle) => (
              <div key={cycle.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={cycle.images?.[0] || '/images/cycles/cycle_safari_mtb.jpg'}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/cycles/cycle_safari_mtb.jpg';
                    }}
                    className="w-16 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-900 text-sm truncate">{cycle.name}</p>
                    <p className="text-xs text-stone-500">{cycle.brand} • {cycle.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-emerald-900 font-sans">₹{cycle.price.toLocaleString('en-IN')}</span>
                      <span className="text-[11px] text-stone-500 font-mono">Stock: {cycle.stock}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <Link
                    to={`/admin/cycles/${cycle.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setArchiveTargetId(cycle.id)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Bike}
          title="No cycles match your filter"
          description="Adjust your search keyword or add a new cycle listing."
          actionText="Add Cycle"
          onAction={() => window.location.assign('/admin/cycles/add')}
        />
      )}

      {/* Archive Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!archiveTargetId}
        title="Archive Cycle Listing?"
        message="This cycle will be un-published from the public catalogue. Historical sales and repair references will remain safely intact."
        confirmText="Archive Cycle"
        variant="danger"
        onConfirm={handleArchiveConfirm}
        onCancel={() => setArchiveTargetId(null)}
      />
    </div>
  );
};
