export function RoutineListSkeleton() {
  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="p-4">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
        
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border bg-white border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}