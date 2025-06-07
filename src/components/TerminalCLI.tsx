import React, { useState, useRef, useEffect } from 'react';
import { Theme } from '../types/network';
import { Terminal, Zap } from 'lucide-react';

interface TerminalCLIProps {
  theme: Theme;
  isOpen: boolean;
  onToggle: () => void;
}

interface CommandOutput {
  command: string;
  output: string[];
  timestamp: Date;
}

const THEME_CLASSES = {
  matrix: {
    bg: 'bg-black/95 border-green-500',
    text: 'text-green-400',
    accent: 'text-green-300',
    prompt: 'text-green-500'
  },
  tron: {
    bg: 'bg-slate-900/95 border-cyan-400',
    text: 'text-cyan-300',
    accent: 'text-cyan-100',
    prompt: 'text-cyan-400'
  },
  'cyber-sentinel': {
    bg: 'bg-gray-900/95 border-pink-500',
    text: 'text-pink-300',
    accent: 'text-pink-100',
    prompt: 'text-pink-400'
  }
};

const COMMANDS = {
  help: {
    description: 'Show available commands',
    output: [
      'Available commands:',
      '  help        - Show this help message',
      '  netstat     - Display network connections',
      '  ping <ip>   - Ping a remote host',
      '  whois <ip>  - Look up IP information',
      '  traceroute <ip> - Trace route to destination',
      '  portscan <ip>   - Scan common ports',
      '  clear       - Clear terminal',
      '  status      - Show system status'
    ]
  },
  netstat: {
    description: 'Display network connections',
    output: [
      'Active Internet connections:',
      'Proto  Local Address      Foreign Address    State',
      'TCP    192.168.1.100:22   203.0.113.45:3421 ESTABLISHED',
      'TCP    192.168.1.100:80   198.51.100.23:4521 TIME_WAIT',
      'UDP    192.168.1.100:53   8.8.8.8:53        ESTABLISHED',
      'TCP    192.168.1.100:443  151.101.1.140:443 ESTABLISHED'
    ]
  },
  status: {
    description: 'Show system status',
    output: [
      '╔══════════════════════════════════════╗',
      '║           NETSCOPE STATUS            ║',
      '╠══════════════════════════════════════╣',
      '║ Network Interface: eth0              ║',
      '║ Status: ACTIVE                       ║',
      '║ Packets Captured: 15,423             ║',
      '║ Connections Monitored: 47            ║',
      '║ Threats Detected: 0                  ║',
      '║ Uptime: 2h 34m 12s                  ║',
      '╚══════════════════════════════════════╝'
    ]
  },
  clear: {
    description: 'Clear terminal',
    output: []
  }
};

export const TerminalCLI: React.FC<TerminalCLIProps> = ({
  theme,
  isOpen,
  onToggle
}) => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'welcome',
      output: [
        '╔═══════════════════════════════════════════════════════════╗',
        '║                    NETSCOPE v2.1.0                       ║',
        '║              Network Security Terminal                    ║',
        '╠═══════════════════════════════════════════════════════════╣',
        '║ Real-time packet analysis and network monitoring         ║',
        '║ Type "help" for available commands                       ║',
        '╚═══════════════════════════════════════════════════════════╝',
        ''
      ],
      timestamp: new Date()
    }
  ]);
  const [commandIndex, setCommandIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const themeClasses = THEME_CLASSES[theme];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const [mainCmd, ...args] = trimmedCmd.split(' ');
    
    let output: string[] = [];

    if (COMMANDS[mainCmd as keyof typeof COMMANDS]) {
      if (mainCmd === 'clear') {
        setHistory([]);
        return;
      }
      output = COMMANDS[mainCmd as keyof typeof COMMANDS].output;
    } else if (mainCmd.startsWith('ping')) {
      const target = args[0] || '8.8.8.8';
      output = [
        `PING ${target} (${target}): 56 data bytes`,
        `64 bytes from ${target}: icmp_seq=0 ttl=54 time=12.345 ms`,
        `64 bytes from ${target}: icmp_seq=1 ttl=54 time=11.234 ms`,
        `64 bytes from ${target}: icmp_seq=2 ttl=54 time=13.456 ms`,
        ``,
        `--- ${target} ping statistics ---`,
        `3 packets transmitted, 3 received, 0% packet loss`,
        `round-trip min/avg/max/stddev = 11.234/12.345/13.456/0.911 ms`
      ];
    } else if (mainCmd.startsWith('whois')) {
      const target = args[0] || '8.8.8.8';
      output = [
        `WHOIS lookup for ${target}:`,
        ``,
        `NetRange:       8.8.8.0 - 8.8.8.255`,
        `CIDR:           8.8.8.0/24`,
        `NetName:        GOOGLE`,
        `NetHandle:      NET-8-8-8-0-1`,
        `Parent:         NET8 (NET-8-0-0-0-0)`,
        `NetType:        Direct Allocation`,
        `OriginAS:       AS15169`,
        `Organization:   Google LLC (GOGL)`,
        `RegDate:        2014-03-14`,
        `Updated:        2014-03-14`,
        `Country:        US`
      ];
    } else if (mainCmd.startsWith('traceroute')) {
      const target = args[0] || '8.8.8.8';
      output = [
        `traceroute to ${target} (${target}), 30 hops max, 60 byte packets`,
        ` 1  192.168.1.1 (192.168.1.1)  2.345 ms  1.234 ms  1.456 ms`,
        ` 2  10.0.0.1 (10.0.0.1)  12.345 ms  11.234 ms  13.456 ms`,
        ` 3  203.0.113.1 (203.0.113.1)  23.456 ms  22.345 ms  24.567 ms`,
        ` 4  ${target} (${target})  34.567 ms  33.456 ms  35.678 ms`
      ];
    } else if (mainCmd.startsWith('portscan')) {
      const target = args[0] || '192.168.1.1';
      output = [
        `Port scan results for ${target}:`,
        ``,
        `PORT     STATE    SERVICE`,
        `21/tcp   closed   ftp`,
        `22/tcp   open     ssh`,
        `23/tcp   closed   telnet`,
        `53/tcp   open     domain`,
        `80/tcp   open     http`,
        `443/tcp  open     https`,
        `993/tcp  closed   imaps`,
        `995/tcp  closed   pop3s`,
        ``,
        `Scan complete. 8 ports scanned, 4 open.`
      ];
    } else if (trimmedCmd === '') {
      return;
    } else {
      output = [`Command not found: ${trimmedCmd}`, `Type "help" for available commands.`];
    }

    const newEntry: CommandOutput = {
      command: cmd,
      output,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, newEntry]);
    setCommandHistory(prev => [...prev, cmd]);
    setCommandIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(command);
      setCommand('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && commandIndex < commandHistory.length - 1) {
        const newIndex = commandIndex + 1;
        setCommandIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandIndex > 0) {
        const newIndex = commandIndex - 1;
        setCommandIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (commandIndex === 0) {
        setCommandIndex(-1);
        setCommand('');
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className={`fixed bottom-4 right-4 p-3 rounded-full border-2 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform ${themeClasses.bg} ${themeClasses.text}`}
      >
        <Terminal className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 w-96 h-80 border-2 rounded-lg backdrop-blur-sm shadow-2xl ${themeClasses.bg}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-2 border-b border-current`}>
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span className={`font-medium text-sm ${themeClasses.text}`}>
            NetScope Terminal
          </span>
        </div>
        <button
          onClick={onToggle}
          className={`p-1 rounded hover:bg-white/10 transition-colors ${themeClasses.text}`}
        >
          <Zap className="w-4 h-4" />
        </button>
      </div>

      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="flex-1 p-2 overflow-auto h-60 font-mono text-xs"
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            {entry.command !== 'welcome' && (
              <div className={`flex items-center gap-2 ${themeClasses.prompt}`}>
                <span>netscope@system:~$</span>
                <span>{entry.command}</span>
              </div>
            )}
            {entry.output.map((line, lineIndex) => (
              <div key={lineIndex} className={`${themeClasses.text} leading-relaxed`}>
                {line}
              </div>
            ))}
          </div>
        ))}
        
        {/* Current Input */}
        <div className={`flex items-center gap-2 ${themeClasses.prompt}`}>
          <span>netscope@system:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 bg-transparent outline-none ${themeClasses.text}`}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};