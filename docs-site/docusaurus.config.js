/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "InstaSkul Documentation",
  tagline: "Empowering underpaid intellectuals to share knowledge globally",
  url: "https://docs.instaskul.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "your-org",
  projectName: "instaskul",
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "InstaSkul Docs",
        logo: {
          alt: "InstaSkul Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "overview",
            position: "left",
            label: "Documentation",
          },
          {
            href: "https://github.com/your-org/instaskul",
            label: "GitHub",
            position: "right",
          },
          {
            href: "https://x.com/instaskul",
            label: "X",
            position: "right",
          },
          {
            href: "https://linkedin.com/company/instaskul",
            label: "LinkedIn",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "X (#InstaSkulStories)",
                href: "https://x.com/instaskul",
              },
              {
                label: "LinkedIn",
                href: "https://linkedin.com/company/instaskul",
              },
              {
                label: "Discord",
                href: "https://discord.gg/instaskul",
              },
              {
                label: "WhatsApp",
                href: "https://whatsapp.com/channel/instaskul",
              },
              {
                label: "Facebook",
                href: "https://facebook.com/instaskul",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/your-org/instaskul",
              },
              {
                label: "Support",
                href: "mailto:support@instaskul.com",
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} InstaSkul. All rights reserved.`,
      },
      prism: {
        theme: require("prism-react-renderer/themes/github"),
        darkTheme: require("prism-react-renderer/themes/dracula"),
      },
    }),
  plugins: [
    "docusaurus-plugin-sass",
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 1030,
        min: 630,
        steps: 2,
      },
    ],
  ],
};

module.exports = config;
