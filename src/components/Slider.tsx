import {
  Sheet,
  SheetContent,
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
import Image from "next/image";
import { FC } from "react";
import Section from "./Section";

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

    const updatedActiveLanguage = {
      ...activeLanguage,
      sections: updatedSections,
    };

    const updatedLanguages = languages.map((language) => {
      if (language.id === activeLanguage.id) {
        return updatedActiveLanguage;
      }
      return language;
    });

    setLanguages(updatedLanguages);
    setActiveLanguage(updatedActiveLanguage);
  };

  const handleUpdateChapter = (
    sectionId: string,
    chapterId: string,
    newTitle: string
  ) => {
    if (!activeLanguage) return;

    const updatedSections = activeLanguage.sections.map((section) => {
      if (section.id.toString() === sectionId) {
        return {
          ...section,
          chapters: section.chapters.map((chapter) => {
            if (chapter.id.toString() === chapterId) {
              return { ...chapter, title: newTitle };
            }
            return chapter;
          }),
        };
      }
      return section;
    });

    const updatedActiveLanguage = {
      ...activeLanguage,
      sections: updatedSections,
    };

    const updatedLanguages = languages.map((language) => {
      if (language.id === activeLanguage.id) {
        return updatedActiveLanguage;
      }
      return language;
    });

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
    <div className="bg-black dark">
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleSectionDragEnd}
        sensors={sensors}
      >
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent
            className="w-full p-3 md:p-4 md:w-9/12 bg-slate-950 border-none shadow-white shadow-md text-white overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          >
            <SheetHeader className="flex flex-col gap-3 p-4">
              <SheetTitle className="flex gap-4">
                <Image
                  src={activeLanguage?.image || ""}
                  alt={activeLanguage?.name || ""}
                  width={40}
                  height={40}
                  className="hidden md:block h-8  w-8 rounded-full object-cover object-center"
                />
                <div>
                  <span className="text-2xl text-white">
                    {activeLanguage?.name}
                  </span>
                  <p className="text-white/60 text-sm font-light">
                    {activeLanguage?.description}
                  </p>
                </div>
              </SheetTitle>
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
                    onUpdateChapter={handleUpdateChapter}
                  />
                ))}
              </SortableContext>
            ) : (
              <p>No sections available.</p>
            )}
          </SheetContent>
        </Sheet>
      </DndContext>
    </div>
  );
};

export default Slider;
