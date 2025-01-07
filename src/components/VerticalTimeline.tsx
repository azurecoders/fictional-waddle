import React, { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface TimelineItemProps extends LanguagesType {
  handleCardClick: (props: LanguagesType) => void;
  index: number;
  totalItems: number;
}

interface VerticalTimelineProps {
  languages: LanguagesType[];
  handleCardClick: (props: LanguagesType) => void;
}

const TimelineItem: FC<TimelineItemProps> = ({
  handleCardClick,
  index,
  totalItems,
  ...props
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: active ? "grabbing" : "pointer",
  };

  const totalChapters = props.sections.reduce(
    (total, section) => total + section.chapters.length,
    0
  );

  const completedChapters = props.sections.reduce(
    (total, section) =>
      total + section.chapters.filter((ch) => ch.isCompleted).length,
    0
  );

  const progress =
    totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  return (
    <div className="flex flex-col items-center">
      {/* Progress Circle */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => handleCardClick(props)}
        className="group relative w-[100px] h-[100px] mb-4 
                   hover:scale-110 transition-all duration-300"
      >
        <svg
          className="absolute w-full h-full -rotate-90"
          viewBox="0 0 120 120"
        >
          <circle
            className="text-neutral-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="54"
            cx="60"
            cy="60"
          />
          <circle
            className="text-blue-500 transition-all duration-500"
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="54"
            cx="60"
            cy="60"
            strokeDasharray={`${(progress * 339.292) / 100} 339.292`}
          />
        </svg>
        <div
          className="absolute inset-2 rounded-full bg-neutral-800/50 overflow-hidden 
                     transition-all duration-500 group-hover:bg-neutral-800"
        >
          <div className="relative w-full h-full">
            <Image
              src={props.image}
              alt={props.name}
              fill
              sizes="(max-width: 100px) 100vw, 100px"
              className="object-contain p-4"
            />
          </div>
        </div>
      </div>

      {/* Arrow Connector */}
      {index !== totalItems - 1 && (
        <div className="flex flex-col items-center mb-4">
          <div className="h-8 w-0.5 bg-blue-500/20 group-hover:bg-blue-500/50 transition-colors duration-300" />
          <ChevronDown
            className="w-6 h-6 text-blue-500/50 -mt-1 animate-bounce
                     group-hover:text-blue-500 transition-colors duration-300"
          />
          <div className="h-8 w-0.5 bg-blue-500/20 -mt-1 group-hover:bg-blue-500/50 transition-colors duration-300" />
        </div>
      )}
    </div>
  );
};

const VerticalTimeline: FC<VerticalTimelineProps> = ({
  languages,
  handleCardClick,
}) => {
  return (
    <div className="container mx-auto p-6 flex justify-center items-center flex-col min-h-screen">
      <div className="relative flex flex-col items-center">
        {languages.map((language, index) => (
          <TimelineItem
            key={language.id}
            {...language}
            handleCardClick={handleCardClick}
            index={index}
            totalItems={languages.length}
          />
        ))}
      </div>
    </div>
  );
};

export default VerticalTimeline;
