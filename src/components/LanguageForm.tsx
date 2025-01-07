"use client";

import { validationSchema } from "@/schemas";
import { Field, FieldArray, Form, Formik } from "formik";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import React from "react";

type FormValues = Omit<LanguagesType, "id">;

const initialValues: FormValues = {
  name: "",
  image: "",
  sections: [
    {
      id: 1,
      chapters: [{ id: 1, title: "", isCompleted: false }],
    },
  ],
};

const LanguageForm: React.FC<LanguageFormProps> = ({
  setLanguages,
  setShowForm,
}) => {
  const handleSubmit = (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setLanguages((current) => [
      ...current,
      {
        id: Math.floor(Math.random() * 10000),
        ...values,
      },
    ]);
    setSubmitting(false);
    toast.success("Language created successfully!");
    setShowForm(false);
  };

  const renderChapterInputs = (
    sectionIndex: number,
    chapters: ChapterType[],
    pushChapter: (chapter: ChapterType) => void,
    removeChapter: (index: number) => void
  ) => (
    <div className="space-y-4">
      {chapters.map((chapter, chapterIndex) => (
        <div
          key={chapter.id}
          className="flex flex-col sm:flex-row gap-2 sm:gap-4"
        >
          <Field
            name={`sections.${sectionIndex}.chapters.${chapterIndex}.title`}
            className="flex-1 bg-neutral-800/50 text-white rounded-lg px-4 py-2.5 
                     border border-neutral-700 focus:border-blue-500 
                     focus:ring-1 focus:ring-blue-500 w-full"
            placeholder={`Chapter ${chapterIndex + 1} title`}
          />
          {chapters.length > 1 && (
            <button
              type="button"
              onClick={() => removeChapter(chapterIndex)}
              className="text-red-400 hover:text-red-300 transition-colors sm:self-center"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          pushChapter({
            id: chapters.length + 1,
            title: "",
            isCompleted: false,
          })
        }
        className="w-full bg-neutral-800/50 hover:bg-neutral-700 text-neutral-300 
                 rounded-lg py-2.5 flex items-center justify-center gap-2 
                 border border-neutral-700 transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        Add Chapter
      </button>
    </div>
  );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-neutral-950 p-4 sm:p-6 lg:p-8">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
              <div className="bg-neutral-900/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-neutral-800">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                  Create New Language Course
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-neutral-300 mb-2"
                      >
                        Language Name
                      </label>
                      <Field
                        id="name"
                        name="name"
                        className="w-full bg-neutral-800/50 text-white rounded-lg px-4 py-2.5 
                               border border-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., Python"
                      />
                      {touched.name && errors.name && (
                        <div className="text-red-400 text-sm mt-1">
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="image"
                        className="block text-sm font-medium text-neutral-300 mb-2"
                      >
                        Image URL
                      </label>
                      <div className="relative">
                        <Field
                          id="image"
                          name="image"
                          type="url"
                          className="w-full bg-neutral-800/50 text-white rounded-lg pl-10 pr-4 py-2.5 
                                 border border-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="https://example.com/image.png"
                        />
                        <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                      </div>
                      {touched.image && errors.image && (
                        <div className="text-red-400 text-sm mt-1">
                          {errors.image}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <FieldArray name="sections">
                {({ push: pushSection, remove: removeSection }) => (
                  <>
                    {values.sections.map((section, sectionIndex) => (
                      <div
                        key={section.id}
                        className="bg-neutral-900/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 lg:p-8 
                               shadow-lg border border-neutral-800 transition-all duration-300
                               hover:border-neutral-700"
                      >
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                          <h3 className="text-lg sm:text-xl font-semibold text-white">
                            Section {sectionIndex + 1}
                          </h3>
                          {values.sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSection(sectionIndex)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        <FieldArray name={`sections.${sectionIndex}.chapters`}>
                          {({ push: pushChapter, remove: removeChapter }) =>
                            renderChapterInputs(
                              sectionIndex,
                              section.chapters,
                              pushChapter,
                              removeChapter
                            )
                          }
                        </FieldArray>
                      </div>
                    ))}

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          pushSection({
                            id: values.sections.length + 1,
                            chapters: [
                              { id: 1, title: "", isCompleted: false },
                            ],
                          })
                        }
                        className="flex-1 bg-neutral-800/50 hover:bg-neutral-700 text-neutral-300 
                               rounded-lg py-3 flex items-center justify-center gap-2
                               transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                        Add Section
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium 
                               rounded-lg py-3 transition-colors duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Saving..." : "Save Language Course"}
                      </button>
                    </div>
                  </>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default LanguageForm;
