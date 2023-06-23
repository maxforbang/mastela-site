import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";

export default function ShareButton({link}: {link: string}) {
  return (
    <div
      onClick={() => {
        navigator.clipboard.writeText(
          link
        );
      }}
      className="flex cursor-pointer items-end gap-1 text-sm"
    >
      Share
      <ArrowUpOnSquareIcon className="h-6 w-6 text-black" aria-hidden="true" />
    </div>
  );
}
