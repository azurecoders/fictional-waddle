"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Plus } from "lucide-react";
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

import LanguageForm from "@/components/LanguageForm";
import Slider from "@/components/Slider";
import { languagesConstant } from "@/constants";

// Import VerticalTimeline with SSR disabled
const VerticalTimeline = dynamic(
  () => import("@/components/VerticalTimeline"),
  {
    ssr: false,
  }
);

const LOCAL_STORAGE_KEY = "languageCourses";

export default function Home() {
  // Initialize sensors for drag and drop
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

  // State management with correct types
  const [languages, setLanguages] = useState<LanguagesType[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [activeLanguage, setActiveLanguage] = useState<LanguagesType | null>(
    null
  );
  const [showForm, setShowForm] = useState<boolean>(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedLanguages = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedLanguages) {
      setLanguages(JSON.parse(storedLanguages));
    } else {
      // Ensure languagesConstant matches LanguagesType[]
      setLanguages(languagesConstant as LanguagesType[]);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(languagesConstant)
      );
    }
  }, []);

  // Update localStorage whenever languages state changes
  useEffect(() => {
    if (languages.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(languages));
    }
  }, [languages]);

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLanguages((items) => {
      const activeIndex = items.findIndex(
        (item) => item.id === Number(active.id)
      );
      const overIndex = items.findIndex((item) => item.id === Number(over.id));
      return arrayMove(items, activeIndex, overIndex);
    });
  };

  // Handle card click with correct type
  const handleCardClick = (language: LanguagesType) => {
    setIsSheetOpen(true);
    setActiveLanguage(language);
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
            items={languages.map((lang) => ({ id: String(lang.id) }))}
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
