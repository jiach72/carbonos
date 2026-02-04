"use client";

import { useEffect, useRef, useState } from "react";

const LOG_LINES = [
    "[SYSTEM] CarbonOS Kernel v2.0.4 initializing...",
    "[INFO] Loading module: Energy_Monitor_Pro [OK]",
    "[INFO] Loading module: Carbon_Tracer_X [OK]",
    "[NET] Connecting to Edge Gateway 192.168.1.100...",
    "[NET] Uplink established. Latency: 12ms",
    "[DATA] Sensor_412 (PV_Array_A): Output 450.2 kW",
    "[DATA] Sensor_413 (PV_Array_B): Output 448.5 kW",
    "[DATA] Sensor_801 (Main_Grid): Frequency 50.02 Hz",
    "[WARN] Energy storage unit B-2 temp variance: +0.4°C",
    "[AUTO] Optimizing load balance strategy...",
    "[INFO] AI Model 'Emission_Pred_v3' loaded.",
    "[CALC] Real-time carbon intensity: 142g CO2/kWh",
    "[DB] Syncing blockchain ledger... Block #892104 confirmed.",
    "[AUTH] Tenant verification passed.",
    "[SYS] Service uptime: 99.998%",
    "[DATA] Building_C HVAC power consumption: 12.5 kW",
    "[INFO] Scope 1 emission tracking active.",
    "[INFO] Scope 2 emission tracking active.",
    "[NET] Heartbeat signal sent.",
    "[SEC] Encrypting data stream (AES-256)...",
    "[DATA] Environmental sensors: Temp 24°C, Humidity 45%",
    "[AUTO] Smart lighting reduced by 15% (Ambient light efficient)",
    "[LOG] Audit trail archived to /var/log/carbonos/audit.log"
];

export function TerminalWindow() {
    const [logs, setLogs] = useState<string[]>([LOG_LINES[0]]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let lineIndex = 1;

        const interval = setInterval(() => {
            const newLine = LOG_LINES[Math.floor(Math.random() * LOG_LINES.length)];
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

            setLogs(prev => {
                const newLogs = [...prev, `[${timestamp}] ${newLine}`];
                if (newLogs.length > 20) newLogs.shift(); // Keep visual buffer clean
                return newLogs;
            });

            // Randomize delay slightly next time? (simulated within set interval for simplicity now)
        }, 800); // Add line every 800ms

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="relative w-full rounded-lg bg-slate-950/90 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs backdrop-blur-sm">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="ml-2 text-slate-500">root@carbonos-edge:~</div>
            </div>

            {/* Terminal Body */}
            <div
                ref={scrollRef}
                className="p-4 h-[320px] overflow-y-auto space-y-1 scrollbar-hide"
            >
                {logs.map((log, i) => (
                    <div key={i} className="text-emerald-500/90 break-words">
                        <span className="text-emerald-700 mr-2">$</span>
                        {log}
                    </div>
                ))}
                <div className="animate-pulse text-emerald-500">_</div>
            </div>

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        </div>
    );
}
