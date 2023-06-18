export function SkeletonInfoCard() {
  return (
    <div className="flex transform cursor-pointer flex-col border-b px-2 py-7 pr-4 transition duration-200 ease-out first:border-t hover:scale-105 hover:opacity-80 hover:shadow-lg sm:flex-row">
      <div className="relative aspect-[5/3] w-full flex-shrink-0 sm:h-48 sm:w-80">
        <div className="h-full w-full animate-pulse rounded-2xl bg-gray-300 " />
      </div>
      <div className="flex flex-grow flex-col justify-between pt-6 sm:pl-5 sm:pt-0">
        <div className="flex flex-col gap-4">
          <div className="h-6 w-1/6 animate-pulse rounded-md bg-gray-300 " />
          <div className="h-6 w-1/3 animate-pulse rounded-md bg-gray-300 " />
          <div className="h-6 w-2/5 animate-pulse rounded-md bg-gray-300 " />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-6 w-1/6 animate-pulse self-end rounded-md bg-gray-300 " />
          <div className="h-6 w-1/12 animate-pulse self-end rounded-md bg-gray-300 " />
        </div>
      </div>
    </div>
  );
}

export default SkeletonInfoCard;
