"use client";

import { FC } from "react";

interface ChapterType {
  chapter: {
    id: number;
    title: string;
    isCompleted: boolean;
  };
}

const Chapter: FC<ChapterType> = ({ chapter }) => {
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
