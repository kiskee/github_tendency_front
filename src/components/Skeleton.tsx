export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-900/30 rounded-xl p-5 border border-gray-800/30 animate-pulse ${className}`}>
      <div className="h-3 bg-gray-800/50 rounded w-1/3 mb-3" />
      <div className="h-7 bg-gray-800/50 rounded w-1/2" />
    </div>
  )
}

export function RepoSkeleton() {
  return (
    <div className="bg-gray-900/30 rounded-xl p-4 sm:p-5 border border-gray-800/30 animate-pulse">
      <div className="h-5 bg-gray-800/50 rounded w-2/3 mb-3" />
      <div className="h-3 bg-gray-800/50 rounded w-full mb-2" />
      <div className="h-3 bg-gray-800/50 rounded w-3/4" />
      <div className="flex gap-4 mt-3">
        <div className="h-4 bg-gray-800/50 rounded w-16" />
        <div className="h-4 bg-gray-800/50 rounded w-12" />
        <div className="h-4 bg-gray-800/50 rounded w-20" />
      </div>
    </div>
  )
}

export function TrendSkeleton() {
  return (
    <div className="bg-gray-900/30 rounded-xl p-4 sm:p-5 border border-gray-800/30 animate-pulse">
      <div className="flex justify-between mb-4">
        <div>
          <div className="h-5 bg-gray-800/50 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-800/50 rounded w-24" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 bg-gray-800/50 rounded-full w-20" />
          <div className="h-5 bg-gray-800/50 rounded-full w-16" />
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-9 bg-black/20 rounded-lg mb-2 border border-gray-800/20" />
      ))}
    </div>
  )
}
