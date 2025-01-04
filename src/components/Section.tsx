"use client";

import React from "react";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Section = ({ section }: { section: SectionType }) => {
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: active ? "grabbing" : "pointer",
  };
  return (
    <SheetHeader
      className="flex flex-col gap-3"
      style={style}
      {...attributes}
      {...listeners}
    >
      <div ref={setNodeRef}>
        <SheetTitle className="flex items-center gap-2">
          <div className="border my-2 font-extralight text-lg p-4 bg-neutral-800 text-neutral-50 w-full">
            <h3>Chapter {section.id}</h3>
            {section.chapters.map((chapter) => (
              <div className="bg-neutral-700 my-2 p-2" key={chapter.id}>
                {chapter.title}
              </div>
            ))}
          </div>
        </SheetTitle>
      </div>
    </SheetHeader>
  );
};

export default Section;
