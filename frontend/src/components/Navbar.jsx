import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Truck, 
  Menu, 
  X, 
  Bell, 
  Search, 
  Layers, 
  Navigation, 
  Users, 
  Wrench, 
  BarChart3, 
  User 
} from 'lucide-react';
import { useHealth } from '../hooks/useHealth.js';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data, error } = useHealth();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: Layers, active: location.pathname === '/' },
    { label: 'Vehicles', path: '/vehicles', icon: Truck, active: location.pathname.startsWith('/vehicles') },
    { label: 'Dispatches', path: '/trips', icon: Navigation, active: location.pathname.startsWith('/trips') },
    { label: 'Drivers', path: '/drivers', icon: Users, active: location.pathname.startsWith('/drivers') },
    { label: 'Maintenance', path: '/maintenance', icon: Wrench, active: location.pathname.startsWith('/maintenance') },
    { label: 'Analytics', path: '/analytics', icon: BarChart3, active: location.pathname.startsWith('/analytics') }
  ];

  // Subtle system status dot (green when operational, amber when offline)
  const isOperational = !error && data?.database?.connected;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* 1. Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:bg-sky-500 transition-colors">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base text-white tracking-tight">TransitOps</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title={isOperational ? 'Services Online' : 'Connecting'} />
                </div>
                <span className="text-[11px] text-slate-400 font-medium tracking-tight">Fleet Operations</span>
              </div>
            </Link>
          </div>

          {/* 2. Capsule-Style Navigation Items (Desktop) */}
          <nav className="hidden lg:flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-full shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                    item.active
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 3. Utility Actions & Profile */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Quick Search */}
            <button
              type="button"
              className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 hover:bg-slate-850 hover:text-slate-200 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search fleet, trips...</span>
              <kbd className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">⌘K</kbd>
            </button>

            {/* Notifications */}
            <button
              type="button"
              aria-label="View notifications"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-sky-400 rounded-full" />
            </button>

            <div className="h-4 w-px bg-slate-800" />

            {/* Operations User Pill */}
            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-medium">
                <User className="w-4 h-4 text-slate-300" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 leading-none">Dispatcher</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Central Hub</span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Capsule Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  item.active
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
