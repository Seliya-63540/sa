import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  Boxes, 
  PlusCircle, 
  Search, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Minus, 
  Check, 
  X 
} from 'lucide-react';

export const AdminInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // New Part Form
  const [newItem, setNewItem] = useState({
    name: '',
    name_gu: '',
    category: 'Brakes',
    quantity: 10,
    unit: 'pcs',
    purchaseCost: 50,
    sellingPrice: 100,
    reorderLevel: 5
  });

  const loadData = async () => {
    try {
      const data = await adminService.getInventory();
      setInventory(data);
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjustStock = async (id, delta) => {
    try {
      await adminService.adjustInventory(id, delta, 'Manual stock adjustment');
      await loadData();
    } catch (err) {
      alert('Failed to adjust stock');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    try {
      await adminService.addInventoryItem(newItem);
      setModalOpen(false);
      setNewItem({
        name: '',
        name_gu: '',
        category: 'Brakes',
        quantity: 10,
        unit: 'pcs',
        purchaseCost: 50,
        sellingPrice: 100,
        reorderLevel: 5
      });
      await loadData();
    } catch (err) {
      alert('Failed to add part');
    }
  };

  const filteredInventory = inventory.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return item.name?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q);
  });

  const lowStockCount = inventory.filter((i) => i.quantity <= i.reorderLevel).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Workshop Spare Parts & Consumables
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage tyres, tubes, chains, brake pads, cables, and bearings used in repairs
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Spare Part</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-400 block mb-1">Total SKUs in Workshop</span>
          <span className="text-2xl font-black text-stone-900 font-sans">{inventory.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-amber-700 font-bold block mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock Items Alert</span>
          </span>
          <span className="text-2xl font-black text-amber-800 font-sans">{lowStockCount} items</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-400 block mb-1">Stock Standard</span>
          <span className="text-xs font-bold text-stone-800 mt-1 block">Live counter & repair usage tracking</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search spare parts or category..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Part Name & Specs</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Cost Price</th>
                <th className="px-4 py-3.5">Shop Rate</th>
                <th className="px-4 py-3.5">Current Stock</th>
                <th className="px-4 py-3.5">Reorder Level</th>
                <th className="px-5 py-3.5 text-right">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredInventory.map((item) => {
                const isLow = item.quantity <= item.reorderLevel;
                return (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-stone-900">
                      <p>{item.name}</p>
                      {item.name_gu && <p className="text-[11px] text-stone-500 font-normal">{item.name_gu}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-stone-600 font-medium">
                      {item.category}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-stone-500">
                      ₹{item.purchaseCost}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-stone-900">
                      ₹{item.sellingPrice}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-black text-sm ${isLow ? 'text-amber-700' : 'text-stone-900'}`}>
                          {item.quantity} {item.unit}
                        </span>
                        {isLow && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 uppercase">
                            Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-stone-500">
                      {item.reorderLevel} {item.unit}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(item.id, -1)}
                          disabled={item.quantity <= 0}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold shadow-2xs disabled:opacity-40"
                          title="Decrease 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold shadow-2xs"
                          title="Increase 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Part Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">Add Workshop Spare Part</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Part Name (English) *</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. 26' Kenda Inner Tube"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">પાર્ટનું નામ (ગુજરાતી)</label>
                <input
                  type="text"
                  value={newItem.name_gu}
                  onChange={(e) => setNewItem({ ...newItem, name_gu: e.target.value })}
                  placeholder="જેમ કે: ૨૬ ઇંચ ટ્યુબ"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-medium"
                  >
                    <option value="Tyres & Tubes">Tyres & Tubes</option>
                    <option value="Brakes">Brakes</option>
                    <option value="Drivetrain">Drivetrain</option>
                    <option value="Cables">Cables</option>
                    <option value="Bearings">Bearings</option>
                    <option value="Consumables">Consumables</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Initial Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newItem.purchaseCost}
                    onChange={(e) => setNewItem({ ...newItem, purchaseCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Shop Selling Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newItem.sellingPrice}
                    onChange={(e) => setNewItem({ ...newItem, sellingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold shadow-xs hover:bg-emerald-900"
                >
                  Save Spare Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
