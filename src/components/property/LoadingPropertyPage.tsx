const LoadingPropertyPage = () => {
  return (
    <>
      <div className="mx-auto max-w-7xl text-gray-800 sm:px-6 lg:px-8">
        <SkeletonPropertyImages />
        <div className="max-w-7xl sm:flex lg:gap-8">
          <div className="flex flex-col justify-center px-6 md:w-2/3">
            <SkeletonPropertyHeader />
            <SkeletonPropertyFeatures />
            <SkeletonPropertyDescription />
          </div>
          <SkeletonBookNowDesktop />
        </div>
      </div>
      <SkeletonBookNowMobile />
    </>
  );
};

export default LoadingPropertyPage;

export function SkeletonPropertyFeatures() {
  return (
    <div className="flex flex-col gap-8 border-b pb-8">
      {Array.from(Array(3)).map((item, index) => {
        return (
          <div
            key={`skeleton-property-features-${index}`}
            className="flex items-center gap-4 "
          >
            <div className="h-12 w-16 animate-pulse rounded-full bg-gray-300 " />
            <div className="flex w-full flex-col gap-1">
              <div className="h-6 w-2/5 animate-pulse rounded-md bg-gray-300 " />
              <div className="h-6 w-2/3 animate-pulse rounded-md bg-gray-300 " />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const SkeletonBookNowDesktop = () => {
  return (
    <div className="sticky top-32 mt-12 hidden h-max w-1/3 rounded-xl border p-8 shadow-xl md:block">
      <div className="flex flex-col gap-1">
        <div className="h-6 w-7/12 animate-pulse rounded-md bg-gray-300 " />
      </div>
      <div className="mt-5 h-16 rounded-lg border"></div>
      <div className="py-5">
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-300 px-6 py-3 shadow-sm " />
      </div>
      <div className="mt-4 flex flex-col gap-3 border-b pb-4">
        {Array.from(Array(3)).map((item, index) => {
          return (
            <div
              key={`skeleton-bn-desktop-price-${index}`}
              className="text flex justify-between gap-2"
            >
              <div className="h-6 w-1/3 animate-pulse rounded-md bg-gray-300 " />
              <div className="h-6 w-1/4 animate-pulse rounded-md bg-gray-300 " />
            </div>
          );
        })}
      </div>
      <div className="text flex justify-between pt-4">
        <div className="h-6 w-5/12 animate-pulse rounded-md bg-gray-300 " />
        <div className="h-6 w-4/12 animate-pulse rounded-md bg-gray-300 " />
      </div>
    </div>
  );
};

export function SkeletonBookNowMobile() {
  return (
    <div className="fixed bottom-0 flex w-full items-center justify-between border-t bg-white px-6 py-5 md:hidden">
      <div className="text-sm">
        <div className="h-6 w-1/12 animate-pulse rounded-md bg-gray-300 " />
        <div className="h-6 w-1/12 animate-pulse rounded-md bg-gray-300 " />
      </div>
      <div className="">
        <div className="animate-pulse rounded-lg px-6 py-3.5 shadow-sm " />
      </div>
    </div>
  );
}

export function SkeletonPropertyImages() {
  return (
    <div className="relative flex aspect-[3/2] w-full gap-2 sm:mt-6 sm:aspect-[2]">
      <div className="relative w-full sm:w-1/2">
        <div className="h-full w-full animate-pulse rounded-l-xl rounded-br-xl bg-gray-300 " />
      </div>
      <div className="relative hidden w-1/2 grid-cols-2 grid-rows-2 gap-2 sm:grid">
        <div className="relative">
          <div className="h-full w-full animate-pulse bg-gray-300 " />
        </div>
        <div className="relative">
          <div className="h-full w-full animate-pulse rounded-tr-xl bg-gray-300 " />
        </div>
        <div className="relative">
          <div className="h-full w-full animate-pulse bg-gray-300 " />
        </div>
        <div className="relative">
          <div className="h-full w-full animate-pulse rounded-br-xl bg-gray-300 " />
        </div>
      </div>
    </div>
  );
}

export function SkeletonPropertyHeader() {
  return (
    <div className="mt-4 flex flex-col justify-center py-8 text-4xl">
      <div className="mx-auto h-8 w-1/3 animate-pulse rounded-md bg-gray-300 " />
      <div className="border-b py-3 pb-8 text-lg">
        <div className="mx-auto h-6 w-1/2 animate-pulse rounded-md bg-gray-300 " />
      </div>
    </div>
  );
}

export function SkeletonPropertyDescription() {
  return (
    <div className="flex flex-col gap-2 border-b py-8">
      {Array.from(Array(3)).map((item, index) => {
        return (
          <div
            key={`skeleton-property-description-${index}`}
            className="text flex justify-between gap-2"
          >
            <div className="h-6 w-full animate-pulse rounded-md bg-gray-300 " />
          </div>
        );
      })}
      <div className="h-6 w-1/3 animate-pulse rounded-md bg-gray-300 " />
    </div>
  );
}
