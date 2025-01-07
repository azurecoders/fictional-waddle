interface ChapterType {
  id: number;
  title: string;
  isCompleted: boolean;
}

interface SectionType {
  id: number;
  chapters: ChapterType[];
}

interface LanguagesType {
  id: number;
  name: string;
  image: string;
  sections: SectionType[];
}

interface TimelineLanguageProps extends LanguagesType {
  handleCardClick: (props: LanguagesType) => void;
  index: number;
  totalItems: number;
}

interface VerticalTimelineProps {
  languages: LanguagesType[];
  handleCardClick: (props: LanguagesType) => void;
}

interface LanguageProps {
  id: number;
  name: string;
  image: string;
  sections: SectionType[];
  handleCardClick: ({ ...props }) => void;
}

interface LanguageFormProps {
  setLanguages: React.Dispatch<React.SetStateAction<LanguagesType[]>>;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SectionProps {
  section: SectionType;
  onUpdateChapter?: (
    sectionId: string,
    chapterId: string,
    newTitle: string
  ) => void;
}

interface SliderProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;
  activeLanguage: LanguagesType | null;
  setActiveLanguage: (language: LanguagesType | null) => void;
  setLanguages: (value: LanguagesType[]) => void;
  languages: LanguagesType[];
}

interface TimelineItemProps extends LanguagesType {
  handleCardClick: (props: LanguagesType) => void;
  index: number;
  totalItems: number;
}

interface VerticalTimelineProps {
  languages: LanguagesType[];
  handleCardClick: (props: LanguagesType) => void;
}
