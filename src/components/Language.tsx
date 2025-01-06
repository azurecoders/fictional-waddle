"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { FC } from "react";

interface LanguageProps {
  id: number;
  name: string;
  description: string;
  image: string;
  sections: SectionType[];
  handleCardClick: ({ ...props }) => void;
}
const Language: FC<LanguageProps> = ({ handleCardClick, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: active ? "grabbing" : "pointer",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() =>
        handleCardClick({
          id: props.id,
          name: props.name,
          description: props.description,
          image: props.image,
          sections: props.sections,
        })
      }
      className="w-full md:w-[400px] h-[380px] rounded-md bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white p-6 cursor-pointer border border-neutral-50/15"
    >
      <Image
        src={props.image || ""}
        alt={props.name || ""}
        width={110}
        height={240}
        className="h-[100px] mx-auto"
      />
      <div className="my-6 flex flex-col gap-3">
        <h3 className="font-bold text-2xl">{props.name}</h3>
        <p className="font-medium text-[17px] text-white/60">
          {props.description}
        </p>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-2 rounded-md my-4 cursor-pointer">
          See More
        </button>
      </div>
    </div>
  );
};

export default Language;
