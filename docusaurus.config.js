/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: 'UniDi',
    tagline: 'Dependency Injection Container for Unity',
    url: 'https://unidi.github.io',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'UniDi',
    projectName: 'UniDi',
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl:
                    'https://github.com/UniDi/unidi.github.io/edit/master/website/',
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    editUrl:
                    'https://github.com/UniDi/unidi.github.io/edit/master/website/blog/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
    // plugins: [
    // ],
    themeConfig: {
        prism: {
            defaultLanguage: 'csharp',
            theme: require('prism-react-renderer/themes/vsDark'),
            additionalLanguages: [
                'csharp',
            ],
        },
        colorMode: {
            defaultMode: 'dark',
            disableSwitch: false,
            respectPrefersColorScheme: true,
            switchConfig: {
                darkIcon: '☀️',
                darkIconStyle: {
                    marginLeft: '2px',
                },
                lightIcon: '🌙',
                lightIconStyle: {
                    marginLeft: '1px',
                },
            },
        },
        navbar: {
            title: 'UniDi',
            logo: {
                alt: 'UniDi Logo',
                src: 'img/unidi-logo.svg',
                srcDark: 'img/unidi-logo_dark.svg',
            },
            items: [
                {
                    type: 'doc',
                    docId: 'intro',
                    position: 'left',
                    label: 'Docs',
                },
                {
                    to: '/blog', 
                    label: 'Blog', 
                    position: 'left'},
                {
                    href: 'https://github.com/UniDi/UniDi',
                    position: 'right',
                    className: 'navbar-github-link',
                    'aria-label': 'GitHub repository',
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
                            label: 'Tutorial',
                            to: '/docs/intro',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Gitter',
                            href: 'https://gitter.im/Extenject/community',
                        },
                        {
                            label: 'Discord (Infallible Code #UniDi)',
                            href: 'https://discord.gg/uJZSDVVV',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'Blog',
                            to: '/blog',
                        },
                        {
                            label: 'GitHub',
                            href: 'https://github.com/UniDi/UniDi',
                        },
                    ],
                },
            ],
            copyright: `UniDi is Open Source - ${new Date().getFullYear()} Apache 2.0 License`,
        },
        googleAnalytics: {
            trackingID: 'G-8TFPD4PTWJ',
        },
    },
};
