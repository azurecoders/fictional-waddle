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
      className="w-[400px] h-auto rounded-md bg-neutral-200 p-4 cursor-pointer"
    >
      <Image
        src={props.image || ""}
        alt={props.name || ""}
        height={100}
        width={100}
        className="h-[100px] mx-auto"
      />
      <div className="my-4 flex flex-col gap-3">
        <h3 className="font-normal text-xl">{props.name}</h3>
        <p>{props.description}</p>
      </div>
    </div>
  );
};

export default Language;
