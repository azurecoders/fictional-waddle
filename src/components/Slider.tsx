// Slider.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import Image from "next/image";
import { FC } from "react";
import Section from "./Section";
import { X } from "lucide-react";

interface SliderProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;
  activeLanguage: LanguagesType | null;
  setActiveLanguage: (language: LanguagesType | null) => void;
  setLanguages: (value: LanguagesType[]) => void;
  languages: LanguagesType[];
}

const Slider: FC<SliderProps> = ({
  isSheetOpen,
  setIsSheetOpen,
  activeLanguage,
  setActiveLanguage,
  languages,
  setLanguages,
}) => {
  const sensors = [
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 2, // Reduced for more responsive drag
        tolerance: 2,
        delay: 0,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 2,
        tolerance: 2,
        delay: 0,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
        tolerance: 2,
        delay: 0,
      },
    }),
  ];

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !activeLanguage || active.id === over.id) return;

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

    const updatedLanguages = languages.map((language) =>
      language.id === activeLanguage.id
        ? { ...activeLanguage, sections: updatedSections }
        : language
    );

    setLanguages(updatedLanguages);
    setActiveLanguage(
      updatedLanguages.find((lang) => lang.id === activeLanguage.id) || null
    );
  };

  const handleUpdateChapter = (
    sectionId: string,
    chapterId: string,
    newTitle: string
  ) => {
    if (!activeLanguage) return;

    const updatedLanguages = languages.map((language) =>
      language.id === activeLanguage.id
        ? {
            ...language,
            sections: language.sections.map((section) =>
              section.id.toString() === sectionId
                ? {
                    ...section,
                    chapters: section.chapters.map((chapter) =>
                      chapter.id.toString() === chapterId
                        ? { ...chapter, title: newTitle }
                        : chapter
                    ),
                  }
                : section
            ),
          }
        : language
    );

    setLanguages(updatedLanguages);
    setActiveLanguage(
      updatedLanguages.find((lang) => lang.id === activeLanguage.id) || null
    );
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetHeader>
        <SheetTitle className="sr-only">
          {activeLanguage?.name || "Language Details"}
        </SheetTitle>
      </SheetHeader>
      <SheetContent
        className="w-full md:w-9/12 p-0 bg-neutral-900 border-l border-neutral-800
                 backdrop-blur-xl shadow-2xl"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleSectionDragEnd}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl bg-neutral-800/50 p-2">
                    <Image
                      src={activeLanguage?.image || ""}
                      alt={activeLanguage?.name || ""}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {activeLanguage?.name}
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      {activeLanguage?.sections.reduce(
                        (acc, section) => acc + section.chapters.length,
                        0
                      )}{" "}
                      chapters
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSheetOpen(false)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-neutral-300 text-sm">
                {activeLanguage?.description}
              </p>
            </div>

            <div
              className="flex-1 overflow-y-auto p-6 space-y-4
                        scrollbar-thin scrollbar-thumb-neutral-700 
                        scrollbar-track-neutral-800"
            >
              {activeLanguage?.sections &&
              activeLanguage.sections.length > 0 ? (
                <SortableContext
                  items={activeLanguage.sections}
                  strategy={verticalListSortingStrategy}
                >
                  {activeLanguage.sections.map((section: SectionType) => (
                    <Section
                      key={section.id}
                      section={section}
                      onUpdateChapter={handleUpdateChapter}
                    />
                  ))}
                </SortableContext>
              ) : (
                <div className="text-center text-neutral-400 py-8">
                  No sections available
                </div>
              )}
            </div>
          </div>
        </DndContext>
      </SheetContent>
    </Sheet>
  );
};

export default Slider;
