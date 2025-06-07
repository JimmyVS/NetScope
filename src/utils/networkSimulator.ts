import { NetworkNode, NetworkLink, PacketData, NetworkStats } from '../types/network';

const SAMPLE_IPS = [
  { ip: '192.168.1.1', country: 'Local', organization: 'Router' },
  { ip: '8.8.8.8', country: 'US', organization: 'Google DNS' },
  { ip: '1.1.1.1', country: 'US', organization: 'Cloudflare' },
  { ip: '192.168.1.100', country: 'Local', organization: 'Workstation' },
  { ip: '157.240.22.35', country: 'US', organization: 'Facebook' },
  { ip: '172.217.12.46', country: 'US', organization: 'Google' },
  { ip: '52.84.108.107', country: 'US', organization: 'Amazon AWS' },
  { ip: '13.107.42.14', country: 'US', organization: 'Microsoft' },
  { ip: '192.168.1.50', country: 'Local', organization: 'IoT Device' },
  { ip: '45.33.32.156', country: 'US', organization: 'Linode' },
];

const PROTOCOLS = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH'] as const;
const COMMON_PORTS = [80, 443, 22, 53, 21, 25, 993, 995, 3389, 5432];

export class NetworkSimulator {
  private nodes: Map<string, NetworkNode> = new Map();
  private links: Map<string, NetworkLink> = new Map();
  private packets: PacketData[] = [];
  private stats: NetworkStats = {
    totalPackets: 0,
    packetsPerSecond: 0,
    activeConnections: 0,
    protocols: {},
    topTalkers: []
  };

  constructor() {
    this.initializeNetwork();
  }

  private initializeNetwork() {
    // Create initial nodes
    SAMPLE_IPS.forEach(({ ip, country, organization }) => {
      this.nodes.set(ip, {
        id: ip,
        ip,
        country,
        organization,
        packetCount: 0,
        x: Math.random() * 800,
        y: Math.random() * 600
      });
    });

    // Create initial connections
    this.generateInitialConnections();
  }

  private generateInitialConnections() {
    const nodeArray = Array.from(this.nodes.keys());
    
    for (let i = 0; i < 15; i++) {
      const source = nodeArray[Math.floor(Math.random() * nodeArray.length)];
      const target = nodeArray[Math.floor(Math.random() * nodeArray.length)];
      
      if (source !== target) {
        const linkId = `${source}-${target}`;
        if (!this.links.has(linkId)) {
          this.links.set(linkId, {
            id: linkId,
            source,
            target,
            protocol: PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)],
            port: COMMON_PORTS[Math.floor(Math.random() * COMMON_PORTS.length)],
            packetCount: Math.floor(Math.random() * 50),
            isActive: Math.random() > 0.3
          });
        }
      }
    }
  }

  generatePacket(): PacketData {
    const links = Array.from(this.links.values()).filter(l => l.isActive);
    const link = links[Math.floor(Math.random() * links.length)];
    
    if (!link) {
      // Generate a new random connection
      const nodeArray = Array.from(this.nodes.keys());
      const source = nodeArray[Math.floor(Math.random() * nodeArray.length)];
      const target = nodeArray[Math.floor(Math.random() * nodeArray.length)];
      
      return this.createPacket(source, target);
    }

    return this.createPacket(link.source, link.target, link.protocol, link.port);
  }

  private createPacket(
    source: string, 
    target: string, 
    protocol?: any, 
    port?: number
  ): PacketData {
    const selectedProtocol = protocol || PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
    const selectedPort = port || COMMON_PORTS[Math.floor(Math.random() * COMMON_PORTS.length)];
    
    const packet: PacketData = {
      id: `packet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      source,
      destination: target,
      protocol: selectedProtocol,
      port: selectedPort,
      size: Math.floor(Math.random() * 1500) + 64,
      flags: this.generateFlags(selectedProtocol),
      payload: this.generatePayload(selectedProtocol, selectedPort),
      details: this.generateDetails(selectedProtocol, source, target, selectedPort)
    };

    this.updateStats(packet);
    this.packets.unshift(packet);
    
    // Keep only last 1000 packets
    if (this.packets.length > 1000) {
      this.packets = this.packets.slice(0, 1000);
    }

    return packet;
  }

  private generateFlags(protocol: string): string[] {
    const flags: string[] = [];
    
    if (protocol === 'TCP') {
      const tcpFlags = ['SYN', 'ACK', 'FIN', 'RST', 'PSH', 'URG'];
      const numFlags = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numFlags; i++) {
        const flag = tcpFlags[Math.floor(Math.random() * tcpFlags.length)];
        if (!flags.includes(flag)) {
          flags.push(flag);
        }
      }
    }
    
    return flags;
  }

  private generatePayload(protocol: string, port: number): string {
    const payloads = {
      HTTP: ['GET /index.html HTTP/1.1', 'POST /api/login HTTP/1.1', 'GET /favicon.ico HTTP/1.1'],
      HTTPS: ['TLS Handshake', 'Application Data', 'Certificate Exchange'],
      DNS: ['Query: google.com', 'Response: 142.250.191.78', 'Query: facebook.com'],
      SSH: ['SSH-2.0-OpenSSH_8.9', 'Key Exchange Init', 'Authentication Request'],
      TCP: ['Connection Established', 'Data Transfer', 'Connection Teardown'],
      UDP: ['Data Packet', 'Broadcast', 'Multicast'],
      ICMP: ['Echo Request', 'Echo Reply', 'Destination Unreachable']
    };

    const protocolPayloads = payloads[protocol as keyof typeof payloads] || ['Data'];
    return protocolPayloads[Math.floor(Math.random() * protocolPayloads.length)];
  }

  private generateDetails(protocol: string, source: string, target: string, port: number): Record<string, any> {
    return {
      sourcePort: Math.floor(Math.random() * 65536),
      destinationPort: port,
      ttl: Math.floor(Math.random() * 64) + 64,
      windowSize: Math.floor(Math.random() * 65536),
      checksum: '0x' + Math.random().toString(16).substr(2, 4).toUpperCase(),
      sequence: Math.floor(Math.random() * 4294967296),
      acknowledgment: Math.floor(Math.random() * 4294967296),
    };
  }

  private updateStats(packet: PacketData) {
    this.stats.totalPackets++;
    
    // Update protocol stats
    if (!this.stats.protocols[packet.protocol]) {
      this.stats.protocols[packet.protocol] = 0;
    }
    this.stats.protocols[packet.protocol]++;

    // Update node packet counts
    const sourceNode = this.nodes.get(packet.source);
    const targetNode = this.nodes.get(packet.destination);
    
    if (sourceNode) sourceNode.packetCount++;
    if (targetNode) targetNode.packetCount++;

    // Update link
    const linkId = `${packet.source}-${packet.destination}`;
    const link = this.links.get(linkId);
    if (link) {
      link.packetCount++;
      link.isActive = true;
    } else {
      // Create new link
      this.links.set(linkId, {
        id: linkId,
        source: packet.source,
        target: packet.destination,
        protocol: packet.protocol,
        port: packet.port,
        packetCount: 1,
        isActive: true
      });
    }

    this.updateTopTalkers();
  }

  private updateTopTalkers() {
    const talkers = Array.from(this.nodes.values())
      .map(node => ({ ip: node.ip, packets: node.packetCount }))
      .sort((a, b) => b.packets - a.packets)
      .slice(0, 5);
    
    this.stats.topTalkers = talkers;
    this.stats.activeConnections = Array.from(this.links.values()).filter(l => l.isActive).length;
  }

  getNodes(): NetworkNode[] {
    return Array.from(this.nodes.values());
  }

  getLinks(): NetworkLink[] {
    return Array.from(this.links.values());
  }

  getPackets(): PacketData[] {
    return this.packets;
  }

  getStats(): NetworkStats {
    return { ...this.stats };
  }

  updatePacketsPerSecond(pps: number) {
    this.stats.packetsPerSecond = pps;
  }

  // Simulate network activity changes
  simulateActivity() {
    // Randomly activate/deactivate links
    this.links.forEach(link => {
      if (Math.random() < 0.1) {
        link.isActive = !link.isActive;
      }
    });

    // Occasionally add new nodes
    if (Math.random() < 0.05 && this.nodes.size < 20) {
      const newIP = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
      if (!this.nodes.has(newIP)) {
        this.nodes.set(newIP, {
          id: newIP,
          ip: newIP,
          country: 'Local',
          organization: 'New Device',
          packetCount: 0,
          x: Math.random() * 800,
          y: Math.random() * 600
        });
      }
    }
  }
}