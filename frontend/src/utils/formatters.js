// Utility formatters for Indian Standard Time, Currency (INR ₹), and Date format DD-MM-YYYY

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr;
  }
};

export const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const getStatusBadgeClass = (status) => {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'active':
    case 'approved':
    case 'completed':
    case 'paid':
    case 'working':
    case 'passed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20';
    case 'in progress':
    case 'assigned':
    case 'partially paid':
    case 'under review':
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20';
    case 'draft':
    case 'idle':
    case 'pending':
      return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-600/20';
    case 'rework':
    case 'under repair':
      return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20';
    case 'rejected':
    case 'suspended':
    case 'cancelled':
    case 'overdue':
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
