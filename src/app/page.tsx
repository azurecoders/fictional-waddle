"use client";

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
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import dynamic from "next/dynamic";
import { useState } from "react";
import Slider from "@/components/Slider";

const VerticalTimeline = dynamic(
  () => import("@/components/VerticalTimeline"),
  {
    ssr: false,
  }
);

export default function Home() {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 1 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { distance: 1 },
  });

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 1 },
  });

  const sensors = [mouseSensor, touchSensor, pointerSensor];
  const [languages, setLanguages] =
    useState<LanguagesType[]>(languagesConstant);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [activeLanguage, setActiveLanguage] = useState<LanguagesType | null>(
    null
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLanguages((items) => {
      const activeIndex = items.findIndex((item) => item.id === active.id);
      const overIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, activeIndex, overIndex);
    });
  };

  const handleCardClick = (props: LanguagesType) => {
    setIsSheetOpen(true);
    setActiveLanguage(props);
  };

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={languages}
          strategy={verticalListSortingStrategy}
        >
          <VerticalTimeline
            languages={languages}
            handleCardClick={handleCardClick}
          />
        </SortableContext>
      </DndContext>
      <Slider
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage}
        setLanguages={setLanguages}
        languages={languages}
      />
    </div>
  );
}
