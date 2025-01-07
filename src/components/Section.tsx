// Section.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FC, useState, ChangeEvent } from "react";
import { GripVertical, Check, X, Edit2 } from "lucide-react";

const Section: FC<SectionProps> = ({ section, onUpdateChapter }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
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
    if (e.key === "Enter") handleSaveEdit(chapterId);
    else if (e.key === "Escape") {
      setEditingChapterId(null);
      setEditValue("");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-neutral-800/20 rounded-xl border border-neutral-800/50
                 hover:border-neutral-700/50 transition-all duration-300"
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 
                       text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <GripVertical className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-medium text-white">
            Section {section.id}
          </h3>
        </div>

        <div className="space-y-2">
          {section.chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="group/chapter bg-neutral-800/30 rounded-lg border border-transparent
                         hover:border-neutral-700/50 transition-all duration-300"
            >
              {editingChapterId === chapter.id.toString() ? (
                <div className="flex items-center p-3 relative">
                  <input
                    value={editValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEditValue(e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, chapter.id.toString())}
                    className="flex-1 bg-neutral-700 text-white rounded-md px-3 py-1.5
                             border border-neutral-600 focus:border-blue-500
                             focus:ring-1 focus:ring-blue-500 outline-none
                             pr-20"
                    autoFocus
                  />
                  <div className="absolute right-4 flex items-center gap-2">
                    <button
                      onClick={() => handleSaveEdit(chapter.id.toString())}
                      className="p-1 text-green-500 hover:text-green-400
                               transition-colors rounded-md bg-neutral-800"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingChapterId(null);
                        setEditValue("");
                      }}
                      className="p-1 text-red-500 hover:text-red-400
                               transition-colors rounded-md bg-neutral-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3">
                  <span className="text-neutral-200">{chapter.title}</span>
                  <button
                    onClick={() =>
                      handleStartEdit(chapter.id.toString(), chapter.title)
                    }
                    className="opacity-0 group-hover/chapter:opacity-100
                             text-neutral-400 hover:text-white
                             transition-all duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Section;
