/** @type {import('@docusaurus/types').SidebarsConfig} */
const sidebars = {
  docs: [
    "overview",
    {
      type: "category",
      label: "Getting Started",
      items: [
        "getting-started/installation",
        "getting-started/developer-setup",
        "getting-started/educator-guide",
        "getting-started/learner-guide",
      ],
    },
    {
      type: "category",
      label: "API Reference",
      items: ["api/course-creation", "api/checkout", "api/enrollment"],
    },
    {
      type: "category",
      label: "Contributing",
      items: ["contributing/guidelines", "contributing/code-of-conduct"],
    },
  ],
};

module.exports = sidebars;
