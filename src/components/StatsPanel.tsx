import React from 'react';
import { NetworkStats, Theme } from '../types/network';
import { Activity, Users, Zap, TrendingUp } from 'lucide-react';

interface StatsPanelProps {
  stats: NetworkStats;
  theme: Theme;
  isRunning: boolean;
  packetRate: number;
  onPacketRateChange: (rate: number) => void;
  onToggleCapture: () => void;
}

const THEME_CLASSES = {
  matrix: {
    bg: 'bg-black/80 border-green-500',
    text: 'text-green-400',
    accent: 'text-green-300',
    button: 'bg-green-500/20 border-green-500 hover:bg-green-500/30'
  },
  tron: {
    bg: 'bg-slate-900/80 border-cyan-400',
    text: 'text-cyan-300',
    accent: 'text-cyan-100',
    button: 'bg-cyan-500/20 border-cyan-400 hover:bg-cyan-500/30'
  },
  'cyber-sentinel': {
    bg: 'bg-gray-900/80 border-pink-500',
    text: 'text-pink-300',
    accent: 'text-pink-100',
    button: 'bg-pink-500/20 border-pink-500 hover:bg-pink-500/30'
  }
};

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  theme,
  isRunning,
  packetRate,
  onPacketRateChange,
  onToggleCapture
}) => {
  const themeClasses = THEME_CLASSES[theme];

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className={`w-72 border-2 rounded-lg backdrop-blur-sm shadow-xl ${themeClasses.bg}`}>
      {/* Header */}
      <div className={`p-3 border-b border-current`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <h3 className={`font-semibold text-lg ${themeClasses.text}`}>
              Network Stats
            </h3>
          </div>
          <div className={`flex items-center gap-1 ${isRunning ? 'text-green-400' : 'text-red-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
            <span className="text-xs font-mono">
              {isRunning ? 'LIVE' : 'PAUSED'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-3 space-y-3">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-2 rounded border ${themeClasses.button}`}>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <div>
                <div className={`text-xs opacity-70 ${themeClasses.text}`}>Total Packets</div>
                <div className={`font-semibold font-mono ${themeClasses.accent}`}>
                  {formatNumber(stats.totalPackets || 0)}
                </div>
              </div>
            </div>
          </div>

          <div className={`p-2 rounded border ${themeClasses.button}`}>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <div>
                <div className={`text-xs opacity-70 ${themeClasses.text}`}>Per Second</div>
                <div className={`font-semibold font-mono ${themeClasses.accent}`}>
                  {formatNumber(stats.packetsPerSecond || 0)}
                </div>
              </div>
            </div>
          </div>

          <div className={`p-2 rounded border ${themeClasses.button}`}>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <div>
                <div className={`text-xs opacity-70 ${themeClasses.text}`}>Connections</div>
                <div className={`font-semibold font-mono ${themeClasses.accent}`}>
                  {formatNumber(stats.activeConnections || 0)}
                </div>
              </div>
            </div>
          </div>

          <div className={`p-2 rounded border ${themeClasses.button}`}>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <div>
                <div className={`text-xs opacity-70 ${themeClasses.text}`}>Protocols</div>
                <div className={`font-semibold font-mono ${themeClasses.accent}`}>
                  {Object.keys(stats.protocols || {}).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Protocol Breakdown */}
        {stats.protocols && Object.keys(stats.protocols).length > 0 && (
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${themeClasses.accent}`}>Protocol Distribution</h4>
            <div className="space-y-1">
              {Object.entries(stats.protocols)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([protocol, count]) => {
                  const percentage = stats.totalPackets ? (count / stats.totalPackets * 100) : 0;
                  return (
                    <div key={protocol} className="flex items-center justify-between text-xs">
                      <span className={`font-mono ${themeClasses.text}`}>{protocol}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-gray-600 rounded">
                          <div 
                            className={`h-full rounded transition-all duration-300`}
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: 'currentColor'
                            }}
                          ></div>
                        </div>
                        <span className={`font-mono ${themeClasses.accent} w-8 text-right`}>
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Top Talkers */}
        {stats.topTalkers && stats.topTalkers.length > 0 && (
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${themeClasses.accent}`}>Top Talkers</h4>
            <div className="space-y-1">
              {stats.topTalkers.slice(0, 3).map(({ ip, packets }) => (
                <div key={ip} className="flex items-center justify-between text-xs">
                  <span className={`font-mono ${themeClasses.text} truncate flex-1`}>{ip}</span>
                  <span className={`font-mono ${themeClasses.accent} ml-2`}>
                    {formatNumber(packets)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-2 pt-2 border-t border-current">
          <div className="space-y-1">
            <label className={`text-xs font-medium ${themeClasses.accent}`}>
              Packet Rate: {packetRate}/sec
            </label>
            <input
              type="range" 
              min="0.5"
              max="10"
              step="0.5"
              value={packetRate}
              onChange={(e) => onPacketRateChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <button
            onClick={onToggleCapture}
            className={`w-full p-2 rounded border font-medium text-sm transition-colors ${themeClasses.button} ${themeClasses.text}`}
          >
            {isRunning ? 'Pause Capture' : 'Resume Capture'}
          </button>
        </div>
      </div>
    </div>
  );
};