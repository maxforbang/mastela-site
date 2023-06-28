import {
  BarsArrowUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { classNames } from "~/utils/functions/functions";

export function BlogSearchBar({ sort = false }) {
  const router = useRouter();
  const { search: initialSearchValue = "" } = router.query;

  const [searchValue, setSearchValue] = useState(initialSearchValue as string);

  useEffect(() => {
    if (initialSearchValue === "" && searchValue !== "") {
      setSearchValue("");
    }
  }, [initialSearchValue]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue?.trim() !== initialSearchValue) {
        void router.push(
          `/cape-coral-guides${
            searchValue ? "?search=" + encodeURIComponent(searchValue) : ""
          }`
        );
      }
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [searchValue, router]);

  return (
    <div className="items-center sm:flex sm:justify-between">
      <h3 className="text-base font-semibold leading-6 text-gray-900"></h3>
      <div className="mt-12 sm:ml-3 sm:mt-0">
        <label htmlFor="mobile-search-candidate" className="sr-only">
          Search
        </label>
        <label htmlFor="desktop-search-candidate" className="sr-only">
          Search
        </label>
        <div className="flex rounded-md shadow-sm">
          <div className="relative flex-grow focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              name="mobile-search-candidate"
              id="mobile-search-candidate"
              className={classNames(
                !sort ? "rounded-md" : "",
                "block w-full rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:hidden"
              )}
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <input
              type="text"
              name="desktop-search-candidate"
              id="desktop-search-candidate"
              className={classNames(
                !sort ? "rounded-md" : "",
                "hidden w-full rounded-l-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:block"
              )}
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <button
            type="button"
            className={classNames(
              !sort ? "hidden" : "",
              "relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            )}
          >
            <BarsArrowUpIcon
              className="-ml-0.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Sort
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
