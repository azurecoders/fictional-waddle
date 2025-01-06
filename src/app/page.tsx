"use client";

import LanguageForm from "@/components/LanguageForm";
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
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

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
  const [showForm, setShowForm] = useState<boolean>(false);

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
      <div className="container mx-auto pt-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-white">Language Courses</h1>
          </Link>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 
                     text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {showForm ? (
              "View Courses"
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Add Language</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showForm ? (
        <LanguageForm setLanguages={setLanguages} setShowForm={setShowForm} />
      ) : (
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
      )}

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
