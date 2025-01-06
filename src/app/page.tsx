"use client";

import Slider from "@/components/Slider";
import { languagesConstant } from "@/constants";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import dynamic from "next/dynamic";
import { useState } from "react";

const Language = dynamic(() => import("@/components/Language"), { ssr: false });

export default function Home() {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });

  const sensors = [mouseSensor, touchSensor, pointerSensor];
  const [languages, setLanguages] = useState(languagesConstant);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [activeLanguage, setActiveLanguage] = useState<LanguagesType | null>(
    null
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    const activeIndex = languages.findIndex(
      (language) => language.id === active?.id
    );

    const overIndex = languages.findIndex(
      (language) => language.id === over?.id
    );

    setLanguages((language) => arrayMove(language, activeIndex, overIndex));
  };

  const handleCardClick = ({ ...props }) => {
    setIsSheetOpen(true);
    setActiveLanguage({
      id: props.id,
      name: props.name,
      description: props.description,
      image: props.image,
      sections: props.sections,
    });
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="container mx-auto p-4 flex justify-center items-center flex-col min-h-screen">
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-4">
              <div className="circle rounded-full h-6 w-6" />
              <div className="w-[150px] h-1 bg-white" />
            </div>
            <h1 className="text-2xl md:text-2xl lg:text-4xl xl:text-6xl uppercase font-semibold text-center my-6 text-white [text-shadow:_3_2px_0_rgb(255_255_255_/_40%)]">
              Welcome to MyPath
            </h1>
            <div className="hidden lg:flex items-center gap-4">
              <div className="w-[150px] h-1 bg-white" />
              <div className="circle rounded-full h-6 w-6" />
            </div>
          </div>
          <SortableContext items={languages} strategy={rectSortingStrategy}>
            <div className="flex gap-6 flex-wrap items-center justify-center">
              {languages &&
                languages.map((language) => (
                  <Language
                    key={language.id}
                    {...language}
                    handleCardClick={handleCardClick}
                  />
                ))}
            </div>
          </SortableContext>
        </div>
      </DndContext>
      <Slider
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage} // Added this prop
        setLanguages={setLanguages}
        languages={languages}
      />
    </>
  );
}
