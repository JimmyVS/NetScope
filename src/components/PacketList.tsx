import React from 'react';
import { PacketData, Theme } from '../types/network';
import { Clock, ArrowRight } from 'lucide-react';

interface PacketListProps {
  packets: PacketData[];
  theme: Theme;
  onPacketClick: (packet: PacketData) => void;
  maxHeight?: string;
}

const THEME_CLASSES = {
  matrix: {
    bg: 'bg-black/80 border-green-500',
    text: 'text-green-400',
    accent: 'text-green-300',
    row: 'hover:bg-green-500/10 border-green-500/20'
  },
  tron: {
    bg: 'bg-slate-900/80 border-cyan-400',
    text: 'text-cyan-300',
    accent: 'text-cyan-100',
    row: 'hover:bg-cyan-500/10 border-cyan-400/20'
  },
  'cyber-sentinel': {
    bg: 'bg-gray-900/80 border-pink-500',
    text: 'text-pink-300',
    accent: 'text-pink-100',
    row: 'hover:bg-pink-500/10 border-pink-500/20'
  }
};

const PROTOCOL_COLORS = {
  TCP: '#00ff41',
  UDP: '#0080ff',
  ICMP: '#ff6b35',
  HTTP: '#ffff00',
  HTTPS: '#ff00ff',
  DNS: '#00ffff',
  SSH: '#ff8c00'
};

export const PacketList: React.FC<PacketListProps> = ({
  packets,
  theme,
  onPacketClick,
  maxHeight = '400px'
}) => {
  const themeClasses = THEME_CLASSES[theme];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString() + '.' + date.getMilliseconds().toString().padStart(3, '0');
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`border-2 rounded-lg backdrop-blur-sm shadow-xl ${themeClasses.bg}`}>
      {/* Header */}
      <div className={`p-3 border-b border-current`}>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <h3 className={`font-semibold text-lg ${themeClasses.text}`}>
            Packet Stream
          </h3>
          <span className={`text-sm opacity-70 ${themeClasses.text}`}>
            ({packets.length} packets)
          </span>
        </div>
      </div>

      {/* Packet List */}
      <div 
        className="overflow-auto"
        style={{ maxHeight }}
      >
        {packets.length === 0 ? (
          <div className={`p-4 text-center ${themeClasses.text} opacity-50`}>
            No packets captured yet...
          </div>
        ) : (
          <div className="divide-y divide-current/20">
            {packets.slice(0, 100).map((packet) => (
              <div
                key={packet.id}
                onClick={() => onPacketClick(packet)}
                className={`p-3 cursor-pointer transition-colors border-l-4 ${themeClasses.row}`}
                style={{ borderLeftColor: PROTOCOL_COLORS[packet.protocol] || themeClasses.accent }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold font-mono"
                      style={{ 
                        backgroundColor: PROTOCOL_COLORS[packet.protocol] + '20',
                        color: PROTOCOL_COLORS[packet.protocol] || themeClasses.accent
                      }}
                    >
                      {packet.protocol}
                    </span>
                    <span className={`text-xs font-mono ${themeClasses.text} opacity-70`}>
                      {formatTime(packet.timestamp)}
                    </span>
                  </div>
                  <span className={`text-xs font-mono ${themeClasses.accent}`}>
                    {formatBytes(packet.size)}
                  </span>
                </div>

                <div className={`flex items-center gap-2 text-sm font-mono ${themeClasses.text}`}>
                  <span className="truncate max-w-[120px]">{packet.source}</span>
                  <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[120px]">{packet.destination}</span>
                  <span className={`text-xs ${themeClasses.accent} ml-auto`}>
                    :{packet.port}
                  </span>
                </div>

                {packet.payload && (
                  <div className={`mt-2 text-xs font-mono ${themeClasses.text} opacity-60 truncate`}>
                    {packet.payload}
                  </div>
                )}

                {packet.flags && packet.flags.length > 0 && (
                  <div className="mt-1 flex gap-1">
                    {packet.flags.map(flag => (
                      <span
                        key={flag}
                        className={`text-xs px-1 rounded ${themeClasses.accent}`}
                        style={{ backgroundColor: 'currentColor' + '20' }}
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};