import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { cycleService } from '../../services/cycleService';
import { CycleCard } from '../../components/cards/CycleCard';
import { CycleCardSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  Bike, 
  ArrowUpDown, 
  RotateCcw 
} from 'lucide-react';

export const CycleCataloguePage = () => {
  const { language, t } = useLanguage();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, priceAsc, priceDesc
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchCycles() {
      try {
        const data = await cycleService.getAllCycles();
        setCycles(data);
      } catch (err) {
        console.error('Failed to load cycles', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCycles();
  }, []);

  // Available brands derived from data
  const availableBrands = useMemo(() => {
    const brands = new Set(cycles.map((c) => c.brand).filter(Boolean));
    return ['all', ...Array.from(brands)];
  }, [cycles]);

  // Filtered and sorted cycles
  const filteredCycles = useMemo(() => {
    return cycles
      .filter((c) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.name?.toLowerCase().includes(q);
          const matchNameGu = c.name_gu?.toLowerCase().includes(q);
          const matchBrand = c.brand?.toLowerCase().includes(q);
          const matchModel = c.model?.toLowerCase().includes(q);
          if (!matchName && !matchNameGu && !matchBrand && !matchModel) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all' && c.category !== selectedCategory) {
          return false;
        }

        // Condition filter
        if (selectedCondition !== 'all' && c.condition !== selectedCondition) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'all' && c.brand !== selectedBrand) {
          return false;
        }

        // Availability filter
        if (availabilityOnly && c.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [cycles, searchQuery, selectedCategory, selectedCondition, selectedBrand, availabilityOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSelectedBrand('all');
    setAvailabilityOnly(false);
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedCondition !== 'all' ||
    selectedBrand !== 'all' ||
    availabilityOnly ||
    sortBy !== 'newest';

  const categories = [
    { id: 'all', label_en: 'All Categories', label_gu: 'બધી કેટેગરી' },
    { id: 'mountain', label_en: 'Mountain (MTB)', label_gu: 'માઉન્ટેન (MTB)' },
    { id: 'city', label_en: 'City / Commuter', label_gu: 'સિટી / સાદી' },
    { id: 'geared', label_en: 'Geared Hybrid', label_gu: 'ગિયરવાળી' },
    { id: 'kids', label_en: 'Kids', label_gu: 'બાળકો માટે' },
    { id: 'road', label_en: 'Road Racer', label_gu: 'રોડ રેસર' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 10.1 PAGE HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {language === 'gu' ? 'નવી અને ચકાસાયેલી સાઇકલ' : 'Cycle Showroom & Stock'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {t('cycles.title')}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              {t('cycles.subtitle')}
            </p>
          </div>

          {/* Search bar inside header */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('cycles.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-stone-100 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {language === 'gu' ? cat.label_gu : cat.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* 10.2 CONTROLS & PRODUCT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>{t('common.filter', 'Filters')}</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('common.clearFilters', 'Reset')}</span>
              </button>
            )}
          </div>

          {/* Condition Filter */}
          <div>
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
              {t('cycles.condition', 'Condition')}
            </label>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-stone-900">
                <input
                  type="radio"
                  name="condition"
                  checked={selectedCondition === 'all'}
                  onChange={() => setSelectedCondition('all')}
                  className="accent-emerald-700"
                />
                <span>{t('common.all', 'All')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-stone-900">
                <input
                  type="radio"
                  name="condition"
                  checked={selectedCondition === 'new'}
                  onChange={() => setSelectedCondition('new')}
                  className="accent-emerald-700"
                />
                <span>{t('cycles.new', 'Brand New')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-stone-900">
                <input
                  type="radio"
                  name="condition"
                  checked={selectedCondition === 'used'}
                  onChange={() => setSelectedCondition('used')}
                  className="accent-emerald-700"
                />
                <span>{t('cycles.used', 'Certified Used')}</span>
              </label>
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
              {t('cycles.brand', 'Brand')}
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">All Brands ({cycles.length})</option>
              {availableBrands.filter((b) => b !== 'all').map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* In-Stock Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 accent-emerald-700"
              />
              <span className="text-xs font-bold text-stone-800">
                {language === 'gu' ? 'માત્ર હાજરમાં ઉપલબ્ધ સાઇકલો' : 'Show In-Stock Only'}
              </span>
            </label>
          </div>

          {/* Sort By */}
          <div className="pt-2 border-t border-stone-100">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
              {t('cycles.sortBy', 'Sort By')}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="newest">{t('cycles.newest', 'Newest First')}</option>
              <option value="priceAsc">{t('cycles.priceLowHigh', 'Price: Low to High')}</option>
              <option value="priceDesc">{t('cycles.priceHighLow', 'Price: High to Low')}</option>
            </select>
          </div>
        </div>

        {/* Main Products Grid Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar on Mobile & Product Count */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="text-xs sm:text-sm font-semibold text-stone-600">
              {language === 'gu' ? (
                <span>કુલ <b>{filteredCycles.length}</b> સાઇકલ ઉપલબ્ધ છે</span>
              ) : (
                <span>Showing <b>{filteredCycles.length}</b> cycles</span>
              )}
            </div>

            {/* Mobile Filter Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 bg-stone-50 hover:bg-stone-100"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              {/* Sort Selector for Mobile/Desktop */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs p-1.5 rounded-xl border border-stone-200 bg-stone-50 lg:hidden"
              >
                <option value="newest">Newest</option>
                <option value="priceAsc">Price: Low-High</option>
                <option value="priceDesc">Price: High-Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CycleCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCycles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCycles.map((cycle) => (
                <CycleCard key={cycle.id} cycle={cycle} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bike}
              title={t('cycles.noCyclesFound')}
              description={t('cycles.noCyclesSub')}
              actionText={t('common.clearFilters', 'Reset Filters')}
              onAction={resetFilters}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm h-full bg-white p-5 shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-700" />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
                  Category
                </label>
                <div className="space-y-2 text-xs">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobileCat"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                        className="accent-emerald-700"
                      />
                      <span>{language === 'gu' ? cat.label_gu : cat.label_en}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
                  Condition
                </label>
                <div className="space-y-2 text-xs">
                  {['all', 'new', 'used'].map((cond) => (
                    <label key={cond} className="flex items-center gap-2 cursor-pointer capitalize">
                      <input
                        type="radio"
                        name="mobileCond"
                        checked={selectedCondition === cond}
                        onChange={() => setSelectedCondition(cond)}
                        className="accent-emerald-700"
                      />
                      <span>{cond}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In stock only */}
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold">
                <input
                  type="checkbox"
                  checked={availabilityOnly}
                  onChange={(e) => setAvailabilityOnly(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 accent-emerald-700 rounded"
                />
                <span>In-Stock Only</span>
              </label>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="w-1/2 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
