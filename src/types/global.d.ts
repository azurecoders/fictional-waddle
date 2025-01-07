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
