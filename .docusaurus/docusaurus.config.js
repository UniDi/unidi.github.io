export default {
  "title": "UniDi",
  "tagline": "Dependency Injection Container for Unity",
  "url": "https://unidi.github.io",
  "baseUrl": "/",
  "onBrokenLinks": "throw",
  "onBrokenMarkdownLinks": "warn",
  "favicon": "img/favicon.ico",
  "organizationName": "UniDi",
  "projectName": "UniDi",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "sidebarPath": "/Users/MateoPanadero/Repositories/UniDi/Scratch/docusaurus/unidi/sidebars.js",
          "editUrl": "https://github.com/UniDi/unidi.github.io/edit/master/website/"
        },
        "blog": {
          "showReadingTime": true,
          "editUrl": "https://github.com/UniDi/unidi.github.io/edit/master/website/blog/"
        },
        "theme": {
          "customCss": "/Users/MateoPanadero/Repositories/UniDi/Scratch/docusaurus/unidi/src/css/custom.css"
        }
      }
    ]
  ],
  "themeConfig": {
    "prism": {
      "defaultLanguage": "csharp",
      "theme": {
        "plain": {
          "color": "#9CDCFE",
          "backgroundColor": "#1E1E1E"
        },
        "styles": [
          {
            "types": [
              "prolog"
            ],
            "style": {
              "color": "rgb(0, 0, 128)"
            }
          },
          {
            "types": [
              "comment"
            ],
            "style": {
              "color": "rgb(106, 153, 85)"
            }
          },
          {
            "types": [
              "builtin",
              "changed",
              "keyword"
            ],
            "style": {
              "color": "rgb(86, 156, 214)"
            }
          },
          {
            "types": [
              "number",
              "inserted"
            ],
            "style": {
              "color": "rgb(181, 206, 168)"
            }
          },
          {
            "types": [
              "constant"
            ],
            "style": {
              "color": "rgb(100, 102, 149)"
            }
          },
          {
            "types": [
              "attr-name",
              "variable"
            ],
            "style": {
              "color": "rgb(156, 220, 254)"
            }
          },
          {
            "types": [
              "deleted",
              "string",
              "attr-value"
            ],
            "style": {
              "color": "rgb(206, 145, 120)"
            }
          },
          {
            "types": [
              "selector"
            ],
            "style": {
              "color": "rgb(215, 186, 125)"
            }
          },
          {
            "types": [
              "tag"
            ],
            "style": {
              "color": "rgb(78, 201, 176)"
            }
          },
          {
            "types": [
              "tag"
            ],
            "languages": [
              "markup"
            ],
            "style": {
              "color": "rgb(86, 156, 214)"
            }
          },
          {
            "types": [
              "punctuation",
              "operator"
            ],
            "style": {
              "color": "rgb(212, 212, 212)"
            }
          },
          {
            "types": [
              "punctuation"
            ],
            "languages": [
              "markup"
            ],
            "style": {
              "color": "#808080"
            }
          },
          {
            "types": [
              "function"
            ],
            "style": {
              "color": "rgb(220, 220, 170)"
            }
          },
          {
            "types": [
              "class-name"
            ],
            "style": {
              "color": "rgb(78, 201, 176)"
            }
          },
          {
            "types": [
              "char"
            ],
            "style": {
              "color": "rgb(209, 105, 105)"
            }
          }
        ]
      },
      "additionalLanguages": [
        "csharp"
      ]
    },
    "colorMode": {
      "defaultMode": "dark",
      "disableSwitch": false,
      "respectPrefersColorScheme": true,
      "switchConfig": {
        "darkIcon": "☀️",
        "darkIconStyle": {
          "marginLeft": "2px"
        },
        "lightIcon": "🌙",
        "lightIconStyle": {
          "marginLeft": "1px"
        }
      }
    },
    "navbar": {
      "title": "UniDi",
      "logo": {
        "alt": "UniDi Logo",
        "src": "img/unidi-logo.svg",
        "srcDark": "img/unidi-logo_dark.svg"
      },
      "items": [
        {
          "type": "doc",
          "docId": "intro",
          "position": "left",
          "label": "Docs",
          "activeSidebarClassName": "navbar__link--active"
        },
        {
          "to": "/blog",
          "label": "Blog",
          "position": "left"
        },
        {
          "href": "https://github.com/UniDi/UniDi",
          "position": "right",
          "className": "navbar-github-link",
          "aria-label": "GitHub repository"
        }
      ],
      "hideOnScroll": false
    },
    "footer": {
      "style": "dark",
      "links": [
        {
          "title": "Docs",
          "items": [
            {
              "label": "Tutorial",
              "to": "/docs/intro"
            }
          ]
        },
        {
          "title": "Community",
          "items": [
            {
              "label": "Gitter",
              "href": "https://gitter.im/Extenject/community"
            },
            {
              "label": "Discord (Infallible Code #UniDi)",
              "href": "https://discord.gg/uJZSDVVV"
            }
          ]
        },
        {
          "title": "More",
          "items": [
            {
              "label": "Blog",
              "to": "/blog"
            },
            {
              "label": "GitHub",
              "href": "https://github.com/UniDi/UniDi"
            }
          ]
        }
      ],
      "copyright": "UniDi is Open Source - 2021 Apache 2.0 License"
    },
    "googleAnalytics": {
      "trackingID": "G-8TFPD4PTWJ"
    },
    "docs": {
      "versionPersistence": "localStorage"
    },
    "metadatas": [],
    "hideableSidebar": false
  },
  "baseUrlIssueBanner": true,
  "i18n": {
    "defaultLocale": "en",
    "locales": [
      "en"
    ],
    "localeConfigs": {}
  },
  "onDuplicateRoutes": "warn",
  "customFields": {},
  "plugins": [],
  "themes": [],
  "titleDelimiter": "|",
  "noIndex": false
};