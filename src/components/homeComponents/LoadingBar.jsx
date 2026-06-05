export default function LoadingBar() {
  return (
    <div className="animate-in fade-in zoom-in duration-500">
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 mb-4 overflow-hidden shadow-inner">
        <div className="bg-indigo-500 h-4 rounded-full w-2/3 animate-pulse"></div>
      </div>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
        Extracting and optimizing data...
      </p>
    </div>
  )
}