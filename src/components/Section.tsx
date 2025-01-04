"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { FC } from "react";
import Chapter from "./Chapter";

interface SectionProps {
  section: SectionType;
  setActiveLanguage: (language: LanguagesType | null) => void; // Added this prop
  activeLanguage: LanguagesType | null;
}

const Section: FC<SectionProps> = ({
  section,
  setActiveLanguage,
  activeLanguage,
}) => {
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
              <Chapter
                key={chapter.id}
                chapter={chapter}
                setActiveLanguage={setActiveLanguage}
                activeLanguage={activeLanguage}
                sectionId={section.id}
              />
            ))}
          </div>
        </SheetTitle>
      </div>
    </SheetHeader>
  );
};

export default Section;
