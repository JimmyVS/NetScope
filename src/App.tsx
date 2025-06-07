import React, { useState } from 'react';
import { NetworkVisualization } from './components/NetworkVisualization';
import { PacketInspector } from './components/PacketInspector';
import { TerminalCLI } from './components/TerminalCLI';
import { FilterPanel } from './components/FilterPanel';
import { StatsPanel } from './components/StatsPanel';
import { PacketList } from './components/PacketList';
import { useNetworkSimulation } from './hooks/useNetworkSimulation';
import { NetworkNode, PacketData, Theme } from './types/network';
import { Wifi, Shield, Palette } from 'lucide-react';

const THEMES: { value: Theme; label: string; color: string }[] = [
  { value: 'matrix', label: 'Matrix', color: '#00ff41' },
  { value: 'tron', label: 'Tron', color: '#00d9ff' },
  { value: 'cyber-sentinel', label: 'Cyber Sentinel', color: '#ff006e' }
];

function App() {
  const {
    nodes,
    links,
    packets,
    stats,
    isRunning,
    packetRate,
    filters,
    setIsRunning,
    setPacketRate,
    setFilters
  } = useNetworkSimulation();

  const [selectedPacket, setSelectedPacket] = useState<PacketData | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [theme, setTheme] = useState<Theme>('tron');
  const [showTerminal, setShowTerminal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showPacketList, setShowPacketList] = useState(false);

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node);
    // Find a recent packet involving this node
    const nodePacket = packets.find(p => p.source === node.ip || p.destination === node.ip);
    if (nodePacket) {
      setSelectedPacket(nodePacket);
    }
  };

  const themeStyle = {
    matrix: 'bg-black text-green-400',
    tron: 'bg-slate-900 text-cyan-300',
    'cyber-sentinel': 'bg-gray-900 text-pink-300'
  };

  return (
    <div className={`min-h-screen font-sans ${themeStyle[theme]}`}>
      {/* Header */}
      <header className="relative z-10 p-4 border-b border-current/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-current rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider">
                NET<span className="text-current/70">SCOPE</span>
              </h1>
              <p className="text-xs opacity-70 font-mono">
                Real-Time Network Packet Visualizer v2.1.0
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}
                className="bg-transparent border border-current/30 rounded px-2 py-1 text-sm font-mono"
              >
                {THEMES.map(({ value, label }) => (
                  <option key={value} value={value} className="bg-gray-900 text-white">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 border border-current/30 rounded">
              <Wifi className="w-4 h-4" />
              <span className="text-sm font-mono">
                {isRunning ? 'MONITORING' : 'PAUSED'}
              </span>
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            </div>

            {/* Toggle Packet List */}
            <button
              onClick={() => setShowPacketList(!showPacketList)}
              className="px-3 py-1 border border-current/30 rounded hover:bg-current/10 transition-colors text-sm font-mono"
            >
              Packets
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 h-[calc(100vh-80px)]">
        {/* Network Visualization */}
        <div className="flex-1 relative">
          <NetworkVisualization
            nodes={nodes}
            links={links}
            packets={packets}
            theme={theme}
            onNodeClick={handleNodeClick}
            className="w-full h-full"
          />

          {/* Floating UI Elements */}
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            theme={theme}
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          />

          <div className="fixed top-20 right-4">
            <StatsPanel
              stats={stats}
              theme={theme}
              isRunning={isRunning}
              packetRate={packetRate}
              onPacketRateChange={setPacketRate}
              onToggleCapture={() => setIsRunning(!isRunning)}
            />
          </div>

          <PacketInspector
            packet={selectedPacket}
            theme={theme}
            onClose={() => setSelectedPacket(null)}
            isOpen={!!selectedPacket}
          />

          <TerminalCLI
            theme={theme}
            isOpen={showTerminal}
            onToggle={() => setShowTerminal(!showTerminal)}
          />
        </div>

        {/* Packet List Sidebar */}
        {showPacketList && (
          <div className="w-96 border-l border-current/30 backdrop-blur-sm">
            <PacketList
              packets={packets}
              theme={theme}
              onPacketClick={(packet) => setSelectedPacket(packet)}
              maxHeight="calc(100vh - 80px)"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;