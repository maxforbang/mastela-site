import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import ShareButton from "./shared/ShareButton";

export default function PageOverlay({
  children,
  open,
  setOpen,
  triggerNotification,
  slug,
}: {
  children?: ReactNode;
  open: boolean;
  setOpen: (state: boolean) => void;
  triggerNotification: () => void;
  slug?: string;
}) {
  return (
    <Transition.Root show={open} as={"div"}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in duration-300"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen">
                  {/* <div className="bg-white mt-20"></div> */}
                  <div className="bg-white px-4 py-6 sm:px-8">
                    <div className="flex items-start justify-between">
                      <div className=" flex h-7 items-center">
                        <div className="w-32" onClick={() => setOpen(false)}>
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                          >
                            <span className="sr-only">Close panel</span>
                            <ArrowLeftIcon
                              className="h-6 w-6 text-black"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      <ShareButton
                      triggerNotification={triggerNotification}
                        link={`https://www.mastelavacations.com/property/${slug ?? ''}`}
                      />
                    </div>
                  </div>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6">
                    <div className="relative w-full px-4 pb-16 sm:px-6">
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
