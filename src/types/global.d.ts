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
