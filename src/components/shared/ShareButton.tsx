import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";

export default function ShareButton({
  link,
  triggerNotification,
}: {
  link: string;
  triggerNotification: () => void;
}) {
  return (
    <div
      onClick={() => {
        void navigator.clipboard.writeText(link);
        triggerNotification()
      }}
      className="flex cursor-pointer items-end gap-1 text-sm"
    >
      Share
      <ArrowUpOnSquareIcon className="h-6 w-6 text-black" aria-hidden="true" />
    </div>
  );
}
