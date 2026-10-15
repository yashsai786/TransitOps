import { Truck, ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-sky-600 flex items-center justify-center text-white">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200 text-sm">TransitOps</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400">Smart Transport Operations Platform</span>
            </div>
          </div>

          {/* Quick SaaS Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <a 
              href="/api/health" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-slate-200 transition-colors inline-flex items-center gap-1"
            >
              System Health <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a 
              href="/static/index.html" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-slate-200 transition-colors inline-flex items-center gap-1"
            >
              Gateway Assets <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Role-Based Access
            </span>
            <span className="text-slate-500">v1.0.0</span>
          </div>

        </div>

        <div className="mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} TransitOps Platform. All rights reserved.</p>
          <p>Fleet Visibility &bull; Dispatch Intelligence &bull; Compliance Tracking</p>
        </div>
      </div>
    </footer>
  );
};
