import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { NetworkNode, NetworkLink, PacketData, Theme } from '../types/network';

interface NetworkVisualizationProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  packets: PacketData[];
  theme: Theme;
  onNodeClick?: (node: NetworkNode) => void;
  className?: string;
}

interface D3Node extends NetworkNode {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface D3Link extends Omit<NetworkLink, 'source' | 'target'> {
  source: D3Node;
  target: D3Node;
}

const PROTOCOL_COLORS = {
  TCP: '#00ff41',
  UDP: '#0080ff',
  ICMP: '#ff6b35',
  HTTP: '#ffff00',
  HTTPS: '#ff00ff',
  DNS: '#00ffff',
  SSH: '#ff8c00'
};

const THEME_COLORS = {
  matrix: {
    background: '#000000',
    node: '#00ff41',
    link: '#003300',
    text: '#00ff41',
    glow: '#00ff41'
  },
  tron: {
    background: '#000814',
    node: '#00d9ff',
    link: '#001220',
    text: '#00d9ff',
    glow: '#00d9ff'
  },
  'cyber-sentinel': {
    background: '#0a0a0a',
    node: '#ff006e',
    link: '#330011',
    text: '#ff006e',
    glow: '#ff006e'
  }
};

export const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({
  nodes,
  links,
  packets,
  theme,
  onNodeClick,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<D3Node, D3Link> | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const themeColors = THEME_COLORS[theme];
    
    // Clear previous content
    svg.selectAll('*').remove();

    // Create defs for filters and gradients
    const defs = svg.append('defs');
    
    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Packet trail gradient
    const gradient = defs.append('linearGradient')
      .attr('id', 'packetTrail')
      .attr('gradientUnits', 'userSpaceOnUse');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', themeColors.glow)
      .attr('stop-opacity', 0);
    
    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', themeColors.glow)
      .attr('stop-opacity', 0.8);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', themeColors.glow)
      .attr('stop-opacity', 0);

    // Create simulation
    const simulation = d3.forceSimulation<D3Node>(nodes as D3Node[])
      .force('link', d3.forceLink<D3Node, D3Link>(links as D3Link[])
        .id((d: any) => d.id)
        .distance(100)
        .strength(0.1))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(30))
      .alpha(0.3)
      .alphaDecay(0.01);

    simulationRef.current = simulation;

    // Create link elements
    const linkElements = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (d: NetworkLink) => PROTOCOL_COLORS[d.protocol] || themeColors.link)
      .attr('stroke-width', (d: NetworkLink) => Math.max(1, d.packetCount / 10))
      .attr('stroke-opacity', (d: NetworkLink) => d.isActive ? 0.8 : 0.3)
      .attr('filter', 'url(#glow)');

    // Create node elements
    const nodeElements = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, D3Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add circles to nodes
    nodeElements.append('circle')
      .attr('r', (d: NetworkNode) => Math.max(8, Math.min(20, d.packetCount / 5 + 8)))
      .attr('fill', themeColors.node)
      .attr('stroke', themeColors.glow)
      .attr('stroke-width', 2)
      .attr('filter', 'url(#glow)')
      .on('click', (event, d) => {
        onNodeClick?.(d);
      });

    // Add labels to nodes
    nodeElements.append('text')
      .text((d: NetworkNode) => d.ip)
      .attr('dx', 25)
      .attr('dy', 5)
      .attr('fill', themeColors.text)
      .attr('font-size', '12px')
      .attr('font-family', 'Source Code Pro, monospace')
      .attr('opacity', 0.8);

    // Add packet count badges
    nodeElements.append('circle')
      .attr('r', 8)
      .attr('cx', 15)
      .attr('cy', -15)
      .attr('fill', themeColors.glow)
      .attr('opacity', 0.8);

    nodeElements.append('text')
      .text((d: NetworkNode) => d.packetCount.toString())
      .attr('dx', 15)
      .attr('dy', -11)
      .attr('fill', themeColors.background)
      .attr('font-size', '10px')
      .attr('font-family', 'Source Code Pro, monospace')
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold');

    // Update positions on tick
    simulation.on('tick', () => {
      linkElements
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeElements
        .attr('transform', (d: D3Node) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, dimensions, theme, onNodeClick]);

  // Animate packet flows
  useEffect(() => {
    if (!svgRef.current || packets.length === 0) return;

    const svg = d3.select(svgRef.current);
    const recentPackets = packets.slice(0, 5); // Only animate recent packets

    recentPackets.forEach((packet, index) => {
      const sourceNode = nodes.find(n => n.id === packet.source);
      const targetNode = nodes.find(n => n.id === packet.destination);

      if (!sourceNode || !targetNode || !sourceNode.x || !sourceNode.y || !targetNode.x || !targetNode.y) return;

      const packetColor = PROTOCOL_COLORS[packet.protocol] || THEME_COLORS[theme].glow;

      // Create packet animation
      const packetElement = svg.append('circle')
        .attr('r', 3)
        .attr('fill', packetColor)
        .attr('filter', 'url(#glow)')
        .attr('cx', sourceNode.x)
        .attr('cy', sourceNode.y)
        .style('opacity', 1);

      // Animate packet movement
      packetElement
        .transition()
        .duration(1000)
        .delay(index * 100)
        .attr('cx', targetNode.x)
        .attr('cy', targetNode.y)
        .style('opacity', 0)
        .on('end', () => {
          packetElement.remove();
        });
    });
  }, [packets, nodes, theme]);

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ backgroundColor: THEME_COLORS[theme].background }}
      >
      </svg>
    </div>
  );
};