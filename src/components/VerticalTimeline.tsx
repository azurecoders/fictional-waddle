import React, { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Book, ChevronRight, Clock, Check } from "lucide-react";
import Image from "next/image";

interface TimelineLanguageProps extends LanguagesType {
  handleCardClick: (props: LanguagesType) => void;
  index: number;
  totalItems: number;
}

interface VerticalTimelineProps {
  languages: LanguagesType[];
  handleCardClick: (props: LanguagesType) => void;
}

const TimelineLanguage: FC<TimelineLanguageProps> = ({
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex group items-start w-full py-8"
    >
      {/* Timeline Line and Dot */}
      <div className="relative flex flex-col items-center">
        <div
          className="w-1 bg-gradient-to-b from-blue-500/20 via-blue-600/20 to-blue-700/20 
                     transition-all duration-500 group-hover:from-blue-500 group-hover:via-blue-600 
                     group-hover:to-blue-700"
          style={{
            height:
              index === 0 ? "50%" : index === totalItems - 1 ? "50%" : "100%",
            marginTop: index === 0 ? "2rem" : "0",
            marginBottom: index === totalItems - 1 ? "2rem" : "0",
          }}
        />
        <div className="relative z-10">
          <div
            className="w-12 h-12 bg-neutral-900 border-4 border-blue-500/50 rounded-full 
                       transition-all duration-500 group-hover:border-blue-500 
                       group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-3 h-3 bg-blue-500/50 rounded-full group-hover:bg-blue-500
                       transition-all duration-500"
          />
        </div>
      </div>

      {/* Card Content */}
      <div
        onClick={() => handleCardClick(props)}
        className="relative ml-12 w-full md:w-[600px] bg-neutral-900/90 rounded-3xl p-8 
                   backdrop-blur-xl border border-neutral-800/50
                   transform transition-all duration-500 
                   hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]
                   hover:border-blue-500/40 hover:-translate-y-1
                   group-hover:bg-neutral-900/95"
      >
        {/* Background Gradient */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br 
                     from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 
                     group-hover:opacity-100 transition-opacity duration-500"
        />

        <div className="flex items-start gap-8 mb-8">
          {/* Progress Circle */}
          <div className="relative w-[140px] h-[140px] flex-shrink-0">
            <svg
              className="absolute w-[140px] h-[140px] -rotate-90"
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
              className="absolute inset-3 rounded-full bg-neutral-800/50 overflow-hidden 
                         transition-all duration-500 group-hover:bg-neutral-800"
            >
              <div className="relative w-full h-full">
                <Image
                  src={props.image}
                  alt={props.name}
                  fill
                  sizes="(max-width: 140px) 100vw, 140px"
                  className="object-contain p-5"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3
              className="font-bold text-4xl bg-gradient-to-r from-white to-white/90 
                         bg-clip-text text-transparent mb-4"
            >
              {props.name}
            </h3>
            <div className="flex items-center gap-6 text-sm text-neutral-400 mb-4">
              <div className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                <span>
                  {totalChapters} {totalChapters === 1 ? "Chapter" : "Chapters"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{completedChapters} Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{Math.round(progress)}% Progress</span>
              </div>
            </div>
            <p className="text-neutral-400 text-sm mb-6">
              Master {props.name} through our comprehensive curriculum designed
              for all skill levels.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center">
          <button
            className="group/btn flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                       text-white px-8 py-3 rounded-xl font-medium text-sm
                       transition-all duration-300 
                       shadow-[0_0_20px_rgba(59,130,246,0.3)] 
                       hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          >
            Continue Learning
            <ChevronRight
              className="w-4 h-4 transition-transform duration-300 
                         group-hover/btn:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

const VerticalTimeline: FC<VerticalTimelineProps> = ({
  languages,
  handleCardClick,
}) => {
  return (
    <div className="container mx-auto p-6 flex justify-center items-center flex-col min-h-screen">
      <div className="relative flex flex-col items-center w-full max-w-6xl">
        {languages.map((language, index) => (
          <TimelineLanguage
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
