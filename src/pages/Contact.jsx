export default function Contact() {
  return (
    <div className="text-center py-12 md:py-20 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4 transition-colors">
        Contact Us
      </h1>
      <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
        Have questions? Drop us a line at support@resumehelper.com.
      </p>
      <a 
        href="mailto:support@resumehelper.com" 
        className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg transition-all shadow-md hover:shadow-indigo-500/20 text-sm md:text-base w-full sm:w-auto"
      >
        Email Support
      </a>
    </div>
  )
}