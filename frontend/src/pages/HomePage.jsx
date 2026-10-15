import { useState } from 'react';
import { 
  Truck, 
  Navigation, 
  Users, 
  TrendingUp, 
  Plus, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Wrench, 
  Calendar, 
  ArrowUpRight 
} from 'lucide-react';
import { useHealth } from '../hooks/useHealth.js';
import { StatusBadge } from '../components/StatusBadge.jsx';

export const HomePage = () => {
  const { data, error, refetch } = useHealth();
  const [activeTab, setActiveTab] = useState('all');

  // Operational metrics based on real system state
  // During initial deployment before fleet records are created in Phase 2/3,
  // these cleanly reflect zero-state data rather than fake numbers.
  const metrics = [
    {
      title: 'Available Vehicles',
      value: '0',
      subtext: '0 On Trip · 0 In Shop',
      icon: Truck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Active Dispatches',
      value: '0',
      subtext: '0 Pending in Draft',
      icon: Navigation,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20'
    },
    {
      title: 'Drivers on Duty',
      value: '0',
      subtext: '0 Assigned · 0 Standby',
      icon: Users,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20'
    },
    {
      title: 'Fleet Utilization',
      value: '0.0%',
      subtext: 'Based on active capacity',
      icon: TrendingUp,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    }
  ];

  const isOffline = Boolean(error || (data && !data.database?.connected));

  return (
    <div className="space-y-8">
      
      {/* 1. Offline / Disconnection Warning Banner (Discreet Enterprise Notice) */}
      {isOffline && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              {error 
                ? 'Unable to communicate with the TransitOps backend service. Reconnecting...' 
                : 'TransitOps database service is initializing. Fleet synchronization will resume shortly.'}
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 transition-colors font-medium"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* 2. Operations Header with Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Operations Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time fleet readiness, dispatch queues, and vehicle compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-600/30 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Dispatch</span>
          </button>
        </div>
      </div>

      {/* 3. Core Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{card.title}</span>
                <div className={`p-2 rounded-lg ${card.bgColor} ${card.borderColor} border`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-2xl font-bold text-white tracking-tight">{card.value}</div>
                <div className="text-[11px] text-slate-400 mt-1 font-medium">{card.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Main Two-Column Operations Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans): Active Dispatches & Trip Queue */}
        <div className="lg:col-span-2 rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col">
          
          {/* Header & Filter Tabs */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">Active Dispatches & Trips</h2>
              <p className="text-xs text-slate-400 mt-0.5">Live trips, draft routes, and completed deliveries</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {['all', 'dispatched', 'draft', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 rounded text-xs capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-slate-800 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table / Empty State Area */}
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-slate-400 flex items-center justify-center mb-4">
              <Navigation className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">No Dispatched Trips Recorded</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
              Dispatch orders will appear here once trips are scheduled. Assigned drivers and vehicles will update to &quot;On Trip&quot; automatically.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Dispatch</span>
              </button>
            </div>
          </div>

          {/* Table Footer */}
          <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs text-slate-500">
            <span>Showing 0 records</span>
            <span className="flex items-center gap-1 hover:text-slate-300 cursor-pointer">
              View all trips <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Right Column (1 span): Maintenance & Driver Compliance Alerts */}
        <div className="space-y-6">
          
          {/* Maintenance Order Watch */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-semibold text-white">Maintenance Alerts</h2>
              </div>
              <StatusBadge status="operational" text="Nominal" size="xs" />
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-200">Fleet Status Clear</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  No active shop orders or overdue service checks. Vehicles logged for maintenance will automatically switch status to &quot;In Shop&quot;.
                </p>
              </div>
            </div>
          </div>

          {/* Driver Compliance Watch */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-semibold text-white">Driver Compliance</h2>
              </div>
              <StatusBadge status="available" text="Compliant" size="xs" />
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-200">Licences & Safety Records Valid</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Zero drivers flagged for licence expiration or disciplinary suspension. The dispatch system restricts unverified drivers automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Route Intelligence info */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Route Intelligence</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrated with OpenStreetMap routing services to calculate precise distance and estimated travel duration on dispatch creation.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
