import { Transition } from "@headlessui/react";

export function Toast({ show, message }: { show: boolean, message: string }) {
  return (
    <Transition
      show={show}
      enter="transition-opacity ease-out duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-in-out duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div id="toast" className="fixed h-max w-max top-8 z-50 left-1/2 transform -translate-x-1/2 bg-sky-600 shadow-lg text-white px-4 py-2 rounded-md">
        {message}
      </div>
    </Transition>
  );
}