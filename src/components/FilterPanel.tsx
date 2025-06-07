import React from 'react';
import { FilterState, Theme } from '../types/network';
import { Filter, Search, X } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  theme: Theme;
  isOpen: boolean;
  onToggle: () => void;
}

const THEME_CLASSES = {
  matrix: {
    bg: 'bg-black/95 border-green-500',
    text: 'text-green-400',
    accent: 'text-green-300',
    input: 'bg-green-900/20 border-green-500 text-green-300 placeholder-green-600'
  },
  tron: {
    bg: 'bg-slate-900/95 border-cyan-400',
    text: 'text-cyan-300',
    accent: 'text-cyan-100',
    input: 'bg-cyan-900/20 border-cyan-400 text-cyan-300 placeholder-cyan-600'
  },
  'cyber-sentinel': {
    bg: 'bg-gray-900/95 border-pink-500',
    text: 'text-pink-300',
    accent: 'text-pink-100',
    input: 'bg-pink-900/20 border-pink-500 text-pink-300 placeholder-pink-600'
  }
};

const PROTOCOLS = ['', 'TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  theme,
  isOpen,
  onToggle
}) => {
  const themeClasses = THEME_CLASSES[theme];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      protocol: '',
      sourceIP: '',
      destinationIP: '',
      port: '',
      keyword: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className={`fixed top-4 left-4 p-3 rounded-lg border-2 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform ${themeClasses.bg} ${themeClasses.text}`}
      >
        <Filter className="w-6 h-6" />
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed top-4 left-4 w-80 border-2 rounded-lg backdrop-blur-sm shadow-2xl ${themeClasses.bg}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b border-current`}>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h3 className={`font-semibold text-lg ${themeClasses.text}`}>
            Packet Filters
          </h3>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`p-1 rounded hover:bg-white/10 transition-colors ${themeClasses.text}`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-4">
        {/* Protocol Filter */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${themeClasses.accent}`}>
            Protocol
          </label>
          <select
            value={filters.protocol}
            onChange={(e) => handleFilterChange('protocol', e.target.value)}
            className={`w-full p-2 rounded border text-sm font-mono ${themeClasses.input}`}
          >
            <option value="">All Protocols</option>
            {PROTOCOLS.slice(1).map(protocol => (
              <option key={protocol} value={protocol}>
                {protocol}
              </option>
            ))}
          </select>
        </div>

        {/* Source IP Filter */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${themeClasses.accent}`}>
            Source IP
          </label>
          <input
            type="text"
            value={filters.sourceIP}
            onChange={(e) => handleFilterChange('sourceIP', e.target.value)}
            placeholder="e.g., 192.168.1.100"
            className={`w-full p-2 rounded border text-sm font-mono ${themeClasses.input}`}
          />
        </div>

        {/* Destination IP Filter */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${themeClasses.accent}`}>
            Destination IP
          </label>
          <input
            type="text"
            value={filters.destinationIP}
            onChange={(e) => handleFilterChange('destinationIP', e.target.value)}
            placeholder="e.g., 8.8.8.8"
            className={`w-full p-2 rounded border text-sm font-mono ${themeClasses.input}`}
          />
        </div>

        {/* Port Filter */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${themeClasses.accent}`}>
            Port
          </label>
          <input
            type="text"
            value={filters.port}
            onChange={(e) => handleFilterChange('port', e.target.value)}
            placeholder="e.g., 80, 443"
            className={`w-full p-2 rounded border text-sm font-mono ${themeClasses.input}`}
          />
        </div>

        {/* Keyword Filter */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${themeClasses.accent}`}>
            Keyword Search
          </label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 w-4 h-4 opacity-50" />
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              placeholder="Search packets..."
              className={`w-full pl-8 pr-3 py-2 rounded border text-sm font-mono ${themeClasses.input}`}
            />
          </div>
        </div>

        {/* Clear Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={`w-full p-2 rounded border border-red-500 text-red-400 hover:bg-red-500/10 transition-colors font-medium text-sm`}
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};