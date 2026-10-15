export const StatusBadge = ({ status, text, size = 'sm' }) => {
  const normalized = status?.toLowerCase() || '';

  const getStyle = () => {
    switch (normalized) {
      case 'available':
      case 'operational':
      case 'completed':
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      
      case 'on trip':
      case 'dispatched':
      case 'in progress':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/25';

      case 'in shop':
      case 'scheduled':
      case 'draft':
      case 'degraded':
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25';

      case 'retired':
      case 'cancelled':
      case 'suspended':
      case 'overdue':
      case 'offline':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/25';

      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const sizeClasses = size === 'xs' 
    ? 'text-[11px] px-2 py-0.5' 
    : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {text || status}
    </span>
  );
};
