import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Book, ChevronRight } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface TimelineLanguageProps extends LanguagesType {
  handleCardClick: (props: LanguagesType) => void;
  index: number;
  totalItems: number;
}

const ProgressRing: FC<{ progress: number }> = ({ progress }) => (
  <div className="relative w-12 h-12">
    <svg className="w-12 h-12 transform -rotate-90">
      <circle
        className="text-neutral-800"
        strokeWidth="4"
        stroke="currentColor"
        fill="transparent"
        r="20"
        cx="24"
        cy="24"
      />
      <circle
        className="text-blue-500"
        strokeWidth="4"
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r="20"
        cx="24"
        cy="24"
        strokeDasharray={`${progress * 125.6} 125.6`}
      />
    </svg>
    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium">
      {Math.round(progress * 100)}%
    </span>
  </div>
);

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

  let totalChapters = 0;
  props.sections.map((section) => {
    totalChapters = section.chapters.length;
  });

  const completedChapters = props.sections.reduce(
    (total, section) =>
      total + section.chapters.filter((ch) => ch.isCompleted).length,
    0
  );

  const progress = totalChapters! > 0 ? completedChapters / totalChapters! : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex group items-start w-full py-6"
    >
      {/* Timeline indicator */}
      <div className="relative flex flex-col items-center">
        <div
          className="w-[3px] bg-gradient-to-b from-blue-500/20 via-blue-600/20 to-blue-700/20 
                     transition-all duration-500 group-hover:from-blue-500 group-hover:via-blue-600 
                     group-hover:to-blue-700"
          style={{
            height:
              index === 0 ? "50%" : index === totalItems - 1 ? "50%" : "100%",
          }}
        />
        <div className="relative z-10">
          <div
            className="w-10 h-10 bg-neutral-900 border-4 border-blue-500/50 rounded-full 
                         transition-all duration-500 group-hover:border-blue-500 
                         group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         w-2 h-2 bg-blue-500/50 rounded-full group-hover:bg-blue-500"
          />
        </div>
      </div>

      {/* Content card */}
      <div
        onClick={() => handleCardClick(props)}
        className="relative ml-10 w-full md:w-[500px] bg-neutral-900/80 rounded-2xl p-8 
                   backdrop-blur-xl border border-neutral-800/50
                   transform transition-all duration-500 
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]
                   hover:border-blue-500/30 hover:-translate-y-1
                   group-hover:bg-neutral-900/90"
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br 
                       from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 
                       group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          <div
            className="relative w-[120px] h-[120px] flex-shrink-0 
                         bg-neutral-800/50 rounded-xl p-4
                         transition-all duration-500 group-hover:bg-neutral-800"
          >
            <Image
              src={props.image}
              alt={props.name}
              fill
              className="object-contain p-4"
            />
          </div>
          <div className="flex-1">
            <h3
              className="font-bold text-3xl bg-gradient-to-r from-white to-white/90 
                          bg-clip-text text-transparent mb-2"
            >
              {props.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                {totalChapters} {totalChapters === 1 ? "Chapter" : "Chapters"}
              </div>
            </div>
          </div>
          <ProgressRing progress={progress} />
        </div>

        {/* Description */}
        <p className="text-neutral-300 text-base leading-relaxed mb-6">
          {props.description}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <button
            className="group/btn flex items-center gap-2 bg-blue-600/90 hover:bg-blue-600 
                            text-white px-6 py-2.5 rounded-xl font-medium text-sm
                            transition-all duration-300 
                            shadow-[0_0_15px_rgba(59,130,246,0.3)] 
                            hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]"
          >
            Start Learning
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

interface VerticalTimelineProps {
  languages: LanguagesType[];
  handleCardClick: (props: LanguagesType) => void;
}

const VerticalTimeline: FC<VerticalTimelineProps> = ({
  languages,
  handleCardClick,
}) => {
  return (
    <div className="container mx-auto p-4 flex justify-center items-center flex-col min-h-screen">
      <div className="relative flex flex-col items-center w-full max-w-5xl">
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
