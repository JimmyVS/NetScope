export interface NetworkNode {
  id: string;
  ip: string;
  country?: string;
  organization?: string;
  packetCount: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface NetworkLink {
  id: string;
  source: string;
  target: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'SSH';
  port: number;
  packetCount: number;
  isActive: boolean;
}

export interface PacketData {
  id: string;
  timestamp: Date;
  source: string;
  destination: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'SSH';
  port: number;
  size: number;
  flags?: string[];
  payload?: string;
  details: Record<string, any>;
}

export interface NetworkStats {
  totalPackets: number;
  packetsPerSecond: number;
  activeConnections: number;
  protocols: Record<string, number>;
  topTalkers: Array<{ ip: string; packets: number }>;
}

export type Theme = 'matrix' | 'tron' | 'cyber-sentinel';

export interface FilterState {
  protocol: string;
  sourceIP: string;
  destinationIP: string;
  port: string;
  keyword: string;
}