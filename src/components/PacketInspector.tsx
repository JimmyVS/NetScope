import React from 'react';
import { PacketData, Theme } from '../types/network';
import { X, Clock, MapPin, Shield, Database } from 'lucide-react';

interface PacketInspectorProps {
  packet: PacketData | null;
  theme: Theme;
  onClose: () => void;
  isOpen: boolean;
}

const THEME_CLASSES = {
  matrix: {
    bg: 'bg-black/95 border-green-500',
    text: 'text-green-400',
    accent: 'text-green-300',
    header: 'bg-green-500/20 border-green-500'
  },
  tron: {
    bg: 'bg-slate-900/95 border-cyan-400',
    text: 'text-cyan-300',
    accent: 'text-cyan-100',
    header: 'bg-cyan-500/20 border-cyan-400'
  },
  'cyber-sentinel': {
    bg: 'bg-gray-900/95 border-pink-500',
    text: 'text-pink-300',
    accent: 'text-pink-100',
    header: 'bg-pink-500/20 border-pink-500'
  }
};

export const PacketInspector: React.FC<PacketInspectorProps> = ({
  packet,
  theme,
  onClose,
  isOpen
}) => {
  const themeClasses = THEME_CLASSES[theme];

  if (!isOpen || !packet) return null;

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString() + '.' + date.getMilliseconds().toString().padStart(3, '0');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`fixed top-4 right-4 w-96 max-h-[80vh] overflow-auto border-2 rounded-lg backdrop-blur-sm shadow-2xl z-50 ${themeClasses.bg}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${themeClasses.header}`}>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h3 className={`font-semibold text-lg ${themeClasses.text}`}>
            Packet Inspector
          </h3>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded hover:bg-white/10 transition-colors ${themeClasses.text}`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 font-mono text-sm">
        {/* Basic Info */}
        <div className="space-y-2">
          <h4 className={`font-medium ${themeClasses.accent} flex items-center gap-2`}>
            <Clock className="w-4 h-4" />
            Basic Information
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={themeClasses.text}>
              <span className="opacity-70">ID:</span>
              <div className="break-all">{packet.id}</div>
            </div>
            <div className={themeClasses.text}>
              <span className="opacity-70">Timestamp:</span>
              <div>{formatTimestamp(packet.timestamp)}</div>
            </div>
            <div className={themeClasses.text}>
              <span className="opacity-70">Protocol:</span>
              <div className={`font-semibold ${themeClasses.accent}`}>{packet.protocol}</div>
            </div>
            <div className={themeClasses.text}>
              <span className="opacity-70">Size:</span>
              <div>{formatBytes(packet.size)}</div>
            </div>
          </div>
        </div>

        {/* Network Info */}
        <div className="space-y-2">
          <h4 className={`font-medium ${themeClasses.accent} flex items-center gap-2`}>
            <MapPin className="w-4 h-4" />
            Network Details
          </h4>
          <div className="space-y-2 text-xs">
            <div className={themeClasses.text}>
              <span className="opacity-70">Source:</span>
              <div className={`font-semibold ${themeClasses.accent}`}>{packet.source}</div>
            </div>
            <div className={themeClasses.text}>
              <span className="opacity-70">Destination:</span>
              <div className={`font-semibold ${themeClasses.accent}`}>{packet.destination}</div>
            </div>
            <div className={themeClasses.text}>
              <span className="opacity-70">Port:</span>
              <div className={`font-semibold ${themeClasses.accent}`}>{packet.port}</div>
            </div>
          </div>
        </div>

        {/* Protocol Flags */}
        {packet.flags && packet.flags.length > 0 && (
          <div className="space-y-2">
            <h4 className={`font-medium ${themeClasses.accent}`}>TCP Flags</h4>
            <div className="flex flex-wrap gap-1">
              {packet.flags.map(flag => (
                <span
                  key={flag}
                  className={`px-2 py-1 rounded text-xs font-semibold bg-opacity-20 ${themeClasses.accent}`}
                  style={{ backgroundColor: 'currentColor' }}
                >
                  {flag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Payload */}
        {packet.payload && (
          <div className="space-y-2">
            <h4 className={`font-medium ${themeClasses.accent}`}>Payload</h4>
            <div className={`p-2 rounded bg-black/30 text-xs ${themeClasses.text}`}>
              {packet.payload}
            </div>
          </div>
        )}

        {/* Technical Details */}
        <div className="space-y-2">
          <h4 className={`font-medium ${themeClasses.accent} flex items-center gap-2`}>
            <Database className="w-4 h-4" />
            Technical Details
          </h4>
          <div className="space-y-1 text-xs">
            {Object.entries(packet.details).map(([key, value]) => (
              <div key={key} className={`flex justify-between ${themeClasses.text}`}>
                <span className="opacity-70 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className={themeClasses.accent}>
                  {typeof value === 'number' ? value.toLocaleString() : value.toString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};