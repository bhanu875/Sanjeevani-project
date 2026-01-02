export const plants = [
  {
    id: 1,
    name: "Tulsi",
    botanical: "Ocimum sanctum",
    system: "Ayurveda",
    uses: ["Cold", "Cough", "Immunity"],
    parts: ["Leaves"],
    description:
      "Tulsi is widely used in Ayurveda for respiratory health and immunity boosting.",

    // MAIN IMAGE (ANNOTATED)
    image: "/images/tulsi-main.jpg",

    // 2D ANNOTATIONS (PERCENTAGE BASED)
    annotations: [
      {
        id: "leaf",
        label: "Leaves",
        x: "55%",
        y: "25%",
        description:
          "Tulsi leaves are used to prepare herbal tea that improves immunity and relieves cough."
      },
      {
        id: "stem",
        label: "Stem",
        x: "53%",
        y: "45%",
        description:
          "The stem is used in certain traditional Ayurvedic formulations."
      },
      {
        id: "root",
        label: "Root",
        x: "50%",
        y: "75%",
        description:
          "Tulsi roots are used in detoxifying and rejuvenating medicines."
      }
    ]
  }
];
