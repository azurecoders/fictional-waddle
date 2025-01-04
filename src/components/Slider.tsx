"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { FC } from "react";
import Section from "./Section";

interface SliderProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;
  activeLanguage: LanguagesType | null;
  setActiveLanguage: (language: LanguagesType | null) => void; // Added this prop
  setLanguages: (value: LanguagesType[]) => void;
  languages: LanguagesType[];
}

const Slider: FC<SliderProps> = ({
  isSheetOpen,
  setIsSheetOpen,
  activeLanguage,
  setActiveLanguage, // Added this prop
  languages,
  setLanguages,
}) => {
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !activeLanguage) return;
    if (active.id === over.id) return;

    const oldIndex = activeLanguage.sections.findIndex(
      (section) => section.id === active.id
    );
    const newIndex = activeLanguage.sections.findIndex(
      (section) => section.id === over.id
    );

    const updatedSections = arrayMove(
      activeLanguage.sections,
      oldIndex,
      newIndex
    );

    // Create updated language with new sections order
    const updatedActiveLanguage = {
      ...activeLanguage,
      sections: updatedSections,
    };

    // Update the languages array with the new sections order
    const updatedLanguages = languages.map((language) => {
      if (language.id === activeLanguage.id) {
        return updatedActiveLanguage;
      }
      return language;
    });

    // Update both states
    setLanguages(updatedLanguages);
    setActiveLanguage(updatedActiveLanguage);
  };

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

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleSectionDragEnd}
      sensors={sensors}
    >
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="flex flex-col gap-3">
            <SheetTitle className="flex items-center gap-2">
              <img
                src={activeLanguage?.image || ""}
                alt={activeLanguage?.name || ""}
                width={32}
                height={32}
                className="h-8"
              />

              <span>{activeLanguage?.name}</span>
            </SheetTitle>
            <SheetDescription>{activeLanguage?.description}</SheetDescription>
          </SheetHeader>
          {activeLanguage?.sections && activeLanguage.sections.length > 0 ? (
            <SortableContext
              items={activeLanguage.sections}
              strategy={verticalListSortingStrategy}
            >
              {activeLanguage.sections.map((section: SectionType) => (
                <Section
                  key={section.id}
                  section={section}
                  setActiveLanguage={setActiveLanguage}
                  activeLanguage={activeLanguage}
                />
              ))}
            </SortableContext>
          ) : (
            <p>No sections available.</p>
          )}
        </SheetContent>
      </Sheet>
    </DndContext>
  );
};

export default Slider;
