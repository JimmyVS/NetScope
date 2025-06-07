import { useState, useEffect, useCallback } from 'react';
import { NetworkSimulator } from '../utils/networkSimulator';
import { NetworkNode, NetworkLink, PacketData, NetworkStats, FilterState } from '../types/network';

export const useNetworkSimulation = () => {
  const [simulator] = useState(() => new NetworkSimulator());
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [links, setLinks] = useState<NetworkLink[]>([]);
  const [packets, setPackets] = useState<PacketData[]>([]);
  const [stats, setStats] = useState<NetworkStats>({} as NetworkStats);
  const [isRunning, setIsRunning] = useState(true);
  const [packetRate, setPacketRate] = useState(2); // packets per second
  const [filters, setFilters] = useState<FilterState>({
    protocol: '',
    sourceIP: '',
    destinationIP: '',
    port: '',
    keyword: ''
  });

  const updateData = useCallback(() => {
    setNodes(simulator.getNodes());
    setLinks(simulator.getLinks());
    setPackets(simulator.getPackets());
    setStats(simulator.getStats());
  }, [simulator]);

  const generatePacket = useCallback(() => {
    if (!isRunning) return;
    
    simulator.generatePacket();
    simulator.simulateActivity();
    updateData();
  }, [simulator, isRunning, updateData]);

  const filteredPackets = packets.filter(packet => {
    if (filters.protocol && packet.protocol !== filters.protocol) return false;
    if (filters.sourceIP && !packet.source.includes(filters.sourceIP)) return false;
    if (filters.destinationIP && !packet.destination.includes(filters.destinationIP)) return false;
    if (filters.port && packet.port.toString() !== filters.port) return false;
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      return (
        packet.source.toLowerCase().includes(keyword) ||
        packet.destination.toLowerCase().includes(keyword) ||
        packet.protocol.toLowerCase().includes(keyword) ||
        packet.payload?.toLowerCase().includes(keyword) ||
        JSON.stringify(packet.details).toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  useEffect(() => {
    updateData();
  }, [updateData]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      generatePacket();
    }, 1000 / packetRate);

    return () => clearInterval(interval);
  }, [generatePacket, packetRate, isRunning]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        simulator.updatePacketsPerSecond(packetRate);
        updateData();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [simulator, packetRate, isRunning, updateData]);

  return {
    nodes,
    links,
    packets: filteredPackets,
    allPackets: packets,
    stats,
    isRunning,
    packetRate,
    filters,
    setIsRunning,
    setPacketRate,
    setFilters,
    generatePacket
  };
};