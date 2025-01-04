"use client";

import { FC } from "react";

interface ChapterType {
  chapter: {
    id: number;
    title: string;
    isCompleted: boolean;
  };
  setActiveLanguage: (language: LanguagesType | null) => void;
  activeLanguage: LanguagesType | null;
  sectionId: number;
}

const Chapter: FC<ChapterType> = ({
  chapter,
  setActiveLanguage,
  activeLanguage,
  sectionId,
}) => {
  return (
    <div
      className="bg-neutral-700 my-2 p-2 flex justify-between items-center"
      key={chapter.id}
    >
      <label htmlFor={chapter.title}>{chapter.title}</label>
    </div>
  );
};

export default Chapter;
