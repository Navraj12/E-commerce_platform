interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  accent: string;
}

const StatCard = ({ label, value, icon, accent }: StatCardProps) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`flex h-12 w-12 flex-none items-center justify-center rounded-lg ${accent}`}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="text-2xl font-semibold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
