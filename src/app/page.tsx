"use client";

import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

import LanguageForm from "@/components/LanguageForm";
import Slider from "@/components/Slider";
import { languagesConstant } from "@/constants";

const VerticalTimeline = dynamic(
  () => import("@/components/VerticalTimeline"),
  {
    ssr: false,
  }
);

const LOCAL_STORAGE_KEY = "languageCourses";

export default function Home() {
  const [languages, setLanguages] = useState<LanguagesType[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [activeLanguage, setActiveLanguage] = useState<LanguagesType | null>(
    null
  );
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    const storedLanguages = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedLanguages) {
      setLanguages(JSON.parse(storedLanguages));
    } else {
      setLanguages(languagesConstant as LanguagesType[]);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(languagesConstant)
      );
    }
  }, []);

  useEffect(() => {
    if (languages.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(languages));
    }
  }, [languages]);

  const handleCardClick = (language: LanguagesType) => {
    setIsSheetOpen(true);
    setActiveLanguage(language);
  };

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="container mx-auto pt-8 px-4">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-5">
          <Link href="/">
            <h1 className="text-3xl font-bold text-white">Language Courses</h1>
          </Link>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500
                      text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {showForm ? (
              "View Courses"
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Add Language</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showForm ? (
        <LanguageForm setLanguages={setLanguages} setShowForm={setShowForm} />
      ) : (
        <VerticalTimeline
          languages={languages}
          handleCardClick={handleCardClick}
        />
      )}

      <Slider
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage}
        setLanguages={setLanguages}
        languages={languages}
      />
    </div>
  );
}
