export default function SkeletonBlogPostPreview() {
  return (
    <div
      className="flex flex-col items-start justify-between"
    >
      <div className="relative aspect-[16/9] w-full animate-pulse rounded-2xl bg-gray-300 lg:aspect-[3/2]"></div>
      <div className="w-full">
        <div className="mt-8 flex items-center gap-4 text-xs">
        <div className="h-3 w-1/4 animate-pulse rounded-md bg-gray-300 " />
        <div className="h-6 w-1/6 animate-pulse rounded-full bg-gray-200 " />

        </div>
        <div className="group mt-6 relative w-full">
          <div className="flex flex-col gap-2">

          <div className="h-4 w-full animate-pulse rounded-md bg-gray-300 " />
          <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-300 " />
          </div>

          <div className="mt-8 flex w-full flex-col gap-2">
            {Array.from(Array(3)).map((_, index) => (
              <div key={`skeleton-text-preview-${index}`} className="h-3 w-full animate-pulse rounded-md bg-gray-300 " />
            ))}
          </div>
        </div>
        <div className="relative mt-10 flex w-full items-center gap-x-4">
          <div className="h-12 w-12 animate-pulse rounded-full bg-gray-300" />

          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 animate-pulse rounded-md bg-gray-300 " />
            <div className="h-3 w-36 animate-pulse rounded-md bg-gray-300 " />
          </div>
        </div>
      </div>
    </div>
  );
}
