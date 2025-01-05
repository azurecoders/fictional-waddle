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
import Image from "next/image";

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
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleSectionDragEnd}
      sensors={sensors}
    >
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="flex flex-col gap-3">
            <SheetTitle className="flex items-center gap-2">
              <Image
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
  );
};

export default Slider;
