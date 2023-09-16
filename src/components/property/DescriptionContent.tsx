import { PortableText } from "@portabletext/react";
import { RichText } from "types";

export default function DescriptionContent({
  name,
  text,
}: {
  name: string;
  text: RichText[];
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <p className="text-base font-semibold leading-7 text-sky-600">
          Villa Description
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {name}
        </h1>
        <div className="mt-10 flex max-w-xl flex-col gap-5 text-base leading-7 text-gray-700 lg:max-w-none ">
          <PortableText value={text} />
        </div>
      </div>
    </div>
  );
}
