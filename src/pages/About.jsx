export default function About() {
  return (
    <div className="text-center py-12 md:py-20 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-4 transition-colors">
        About Us
      </h1>
      <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        Learn more about why we built this tool and how it helps you manage resumes.
      </p>
    </div>
  )
}