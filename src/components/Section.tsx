import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { ChangeEvent, FC, useState } from "react";

interface SectionProps {
  section: SectionType;
  onUpdateChapter?: (
    sectionId: string,
    chapterId: string,
    newTitle: string
  ) => void;
}

const Section: FC<SectionProps> = ({ section, onUpdateChapter }) => {
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id: section.id });

  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: active ? "grabbing" : "pointer",
  };

  const handleStartEdit = (chapterId: string, currentTitle: string) => {
    setEditingChapterId(chapterId);
    setEditValue(currentTitle);
  };

  const handleSaveEdit = (chapterId: string) => {
    if (editValue.trim() && onUpdateChapter) {
      onUpdateChapter(section.id.toString(), chapterId, editValue.trim());
    }
    setEditingChapterId(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, chapterId: string) => {
    if (e.key === "Enter") {
      handleSaveEdit(chapterId);
    } else if (e.key === "Escape") {
      setEditingChapterId(null);
      setEditValue("");
    }
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
          <div className="border border-white/20 rounded-sm my-2 font-extralight text-lg p-4 text-neutral-50 w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            <h3>Chapter {section.id}</h3>
            {section.chapters.map((chapter) => (
              <div
                className="bg-neutral-900/20 text-white/80 my-2 p-2 flex justify-between items-center"
                key={chapter.id}
              >
                {editingChapterId === chapter.id.toString() ? (
                  <input
                    value={editValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEditValue(e.target.value)
                    }
                    onBlur={() => handleSaveEdit(chapter.id.toString())}
                    onKeyDown={(e: React.KeyboardEvent) =>
                      handleKeyDown(e, chapter.id.toString())
                    }
                    className="bg-neutral-600 text-white border-neutral-500 w-full"
                    autoFocus
                  />
                ) : (
                  <label
                    onClick={() =>
                      handleStartEdit(chapter.id.toString(), chapter.title)
                    }
                    className="cursor-pointer hover:text-neutral-300 transition-colors"
                  >
                    {chapter.title}
                  </label>
                )}
              </div>
            ))}
          </div>
        </SheetTitle>
      </div>
    </SheetHeader>
  );
};

export default Section;
