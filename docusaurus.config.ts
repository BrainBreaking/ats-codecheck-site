import { Config } from '@docusaurus/types';

const config: Config = {
  title: 'ATS CodeCheck',
  tagline: 'Secure Code Validation via Embedded Shared Libraries',
  url: 'https://atscodecheck.dev', // ✅ Custom domain
  baseUrl: '/', // ✅ Root for custom domain
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  organizationName: 'BrainBreaking', // GitHub org/user
  projectName: 'ats-codecheck-site', // GitHub repo
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/', // ✅ Serve docs from root
          sidebarPath: require.resolve('./sidebars.ts'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'ATS CodeCheck',
      logo: {
        alt: 'ATS Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/BrainBreaking/ats-codecheck-lib',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/BrainBreaking/ats-codecheck-lib/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Releases',
              href: 'https://github.com/BrainBreaking/ats-codecheck-lib/releases',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} BrainBreaking. Built with Docusaurus.`,
    },
  },
};

export default config;