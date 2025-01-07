import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Language name is required")
    .min(2, "Name must be at least 2 characters"),
  image: Yup.string()
    .required("Image URL is required")
    .url("Must be a valid URL"),
  sections: Yup.array()
    .of(
      Yup.object().shape({
        chapters: Yup.array()
          .of(
            Yup.object().shape({
              title: Yup.string().required("Chapter title is required"),
            })
          )
          .min(1, "At least one chapter is required"),
      })
    )
    .min(1, "At least one section is required"),
});
