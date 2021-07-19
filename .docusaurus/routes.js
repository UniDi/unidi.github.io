
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';
export default [
{
  path: '/',
  component: ComponentCreator('/','deb'),
  exact: true,
},
{
  path: '/__docusaurus/debug',
  component: ComponentCreator('/__docusaurus/debug','3d6'),
  exact: true,
},
{
  path: '/__docusaurus/debug/config',
  component: ComponentCreator('/__docusaurus/debug/config','914'),
  exact: true,
},
{
  path: '/__docusaurus/debug/content',
  component: ComponentCreator('/__docusaurus/debug/content','c28'),
  exact: true,
},
{
  path: '/__docusaurus/debug/globalData',
  component: ComponentCreator('/__docusaurus/debug/globalData','3cf'),
  exact: true,
},
{
  path: '/__docusaurus/debug/metadata',
  component: ComponentCreator('/__docusaurus/debug/metadata','31b'),
  exact: true,
},
{
  path: '/__docusaurus/debug/registry',
  component: ComponentCreator('/__docusaurus/debug/registry','0da'),
  exact: true,
},
{
  path: '/__docusaurus/debug/routes',
  component: ComponentCreator('/__docusaurus/debug/routes','244'),
  exact: true,
},
{
  path: '/blog',
  component: ComponentCreator('/blog','f66'),
  exact: true,
},
{
  path: '/blog/hello-world',
  component: ComponentCreator('/blog/hello-world','31c'),
  exact: true,
},
{
  path: '/blog/hola',
  component: ComponentCreator('/blog/hola','8cb'),
  exact: true,
},
{
  path: '/blog/tags',
  component: ComponentCreator('/blog/tags','344'),
  exact: true,
},
{
  path: '/blog/tags/docusaurus',
  component: ComponentCreator('/blog/tags/docusaurus','493'),
  exact: true,
},
{
  path: '/blog/tags/facebook',
  component: ComponentCreator('/blog/tags/facebook','dbb'),
  exact: true,
},
{
  path: '/blog/tags/hello',
  component: ComponentCreator('/blog/tags/hello','7b1'),
  exact: true,
},
{
  path: '/blog/tags/hola',
  component: ComponentCreator('/blog/tags/hola','e12'),
  exact: true,
},
{
  path: '/blog/welcome',
  component: ComponentCreator('/blog/welcome','c35'),
  exact: true,
},
{
  path: '/markdown-page',
  component: ComponentCreator('/markdown-page','be1'),
  exact: true,
},
{
  path: '/docs',
  component: ComponentCreator('/docs','b03'),
  
  routes: [
{
  path: '/docs/Advanced/Bindings',
  component: ComponentCreator('/docs/Advanced/Bindings','9fd'),
  exact: true,
},
{
  path: '/docs/Advanced/Decorator-Bindings',
  component: ComponentCreator('/docs/Advanced/Decorator-Bindings','439'),
  exact: true,
},
{
  path: '/docs/Advanced/Injections',
  component: ComponentCreator('/docs/Advanced/Injections','586'),
  exact: true,
},
{
  path: '/docs/Advanced/Installers/Composite-Installer',
  component: ComponentCreator('/docs/Advanced/Installers/Composite-Installer','b28'),
  exact: true,
},
{
  path: '/docs/Advanced/Installers/Runtime-Parameters-For-Installers',
  component: ComponentCreator('/docs/Advanced/Installers/Runtime-Parameters-For-Installers','88d'),
  exact: true,
},
{
  path: '/docs/Advanced/Installers/ScriptableObject-Installers',
  component: ComponentCreator('/docs/Advanced/Installers/ScriptableObject-Installers','577'),
  exact: true,
},
{
  path: '/docs/Advanced/Memory-Pools',
  component: ComponentCreator('/docs/Advanced/Memory-Pools','962'),
  exact: true,
},
{
  path: '/docs/Advanced/Sub-Containers',
  component: ComponentCreator('/docs/Advanced/Sub-Containers','d10'),
  exact: true,
},
{
  path: '/docs/Advanced/UniDi-Factories',
  component: ComponentCreator('/docs/Advanced/UniDi-Factories','bca'),
  exact: true,
},
{
  path: '/docs/Advanced/UniDi-For-Non-Unity-projects',
  component: ComponentCreator('/docs/Advanced/UniDi-For-Non-Unity-projects','994'),
  exact: true,
},
{
  path: '/docs/Advanced/UniDi-Settings',
  component: ComponentCreator('/docs/Advanced/UniDi-Settings','0d6'),
  exact: true,
},
{
  path: '/docs/Advanced/UniDi-Test-Framework',
  component: ComponentCreator('/docs/Advanced/UniDi-Test-Framework','b06'),
  exact: true,
},
{
  path: '/docs/Basic Principles/Bind-MonoBehaviours-In-Scene',
  component: ComponentCreator('/docs/Basic Principles/Bind-MonoBehaviours-In-Scene','899'),
  exact: true,
},
{
  path: '/docs/Basic Principles/Binding',
  component: ComponentCreator('/docs/Basic Principles/Binding','95b'),
  exact: true,
},
{
  path: '/docs/Basic Principles/Construction Methods',
  component: ComponentCreator('/docs/Basic Principles/Construction Methods','5e7'),
  exact: true,
},
{
  path: '/docs/Basic Principles/General-Guidelines-Tips-And-Tricks',
  component: ComponentCreator('/docs/Basic Principles/General-Guidelines-Tips-And-Tricks','ccc'),
  exact: true,
},
{
  path: '/docs/Basic Principles/Injection',
  component: ComponentCreator('/docs/Basic Principles/Injection','2f1'),
  exact: true,
},
{
  path: '/docs/Basic Principles/Installers',
  component: ComponentCreator('/docs/Basic Principles/Installers','f43'),
  exact: true,
},
{
  path: '/docs/Basic Principles/Object-Graph-Validation',
  component: ComponentCreator('/docs/Basic Principles/Object-Graph-Validation','166'),
  exact: true,
},
{
  path: '/docs/Basic Principles/Using-Non-MonoBehaviour-Classes',
  component: ComponentCreator('/docs/Basic Principles/Using-Non-MonoBehaviour-Classes','fb9'),
  exact: true,
},
{
  path: '/docs/CheatSheet',
  component: ComponentCreator('/docs/CheatSheet','b7a'),
  exact: true,
},
{
  path: '/docs/Docusaur-Docs/tutorial-basics/congratulations',
  component: ComponentCreator('/docs/Docusaur-Docs/tutorial-basics/congratulations','236'),
  exact: true,
},
{
  path: '/docs/Docusaur-Docs/tutorial-basics/create-a-blog-post',
  component: ComponentCreator('/docs/Docusaur-Docs/tutorial-basics/create-a-blog-post','3c3'),
  exact: true,
},
{
  path: '/docs/Docusaur-Docs/tutorial-basics/create-a-document',
  component: ComponentCreator('/docs/Docusaur-Docs/tutorial-basics/create-a-document','90f'),
  exact: true,
},
{
  path: '/docs/Docusaur-Docs/tutorial-basics/create-a-page',
  component: ComponentCreator('/docs/Docusaur-Docs/tutorial-basics/create-a-page','ad2'),
  exact: true,
},
{
  path: '/docs/Docusaur-Docs/tutorial-basics/deploy-your-site',
  component: ComponentCreator('/docs/Docusaur-Docs/tutorial-basics/deploy-your-site','7b5'),
  exact: true,
},
{
  path: '/docs/Docusaur-Docs/tutorial-basics/markdown-features',
  component: ComponentCreator('/docs/Docusaur-Docs/tutorial-basics/markdown-features','14d'),
  exact: true,
},
{
  path: '/docs/Docusaur-Docs/tutorial-extras/manage-docs-versions',
  component: ComponentCreator('/docs/Docusaur-Docs/tutorial-extras/manage-docs-versions','c5e'),
  exact: true,
},
{
  path: '/docs/Docusaur-Docs/tutorial-extras/translate-your-site',
  component: ComponentCreator('/docs/Docusaur-Docs/tutorial-extras/translate-your-site','605'),
  exact: true,
},
{
  path: '/docs/Extensions/Auto-Mocking/Mocking-Introduction',
  component: ComponentCreator('/docs/Extensions/Auto-Mocking/Mocking-Introduction','990'),
  exact: true,
},
{
  path: '/docs/Extensions/Auto-Mocking/Using-Moq',
  component: ComponentCreator('/docs/Extensions/Auto-Mocking/Using-Moq','00e'),
  exact: true,
},
{
  path: '/docs/Extensions/Auto-Mocking/Using-NSubstitute',
  component: ComponentCreator('/docs/Extensions/Auto-Mocking/Using-NSubstitute','858'),
  exact: true,
},
{
  path: '/docs/Extensions/Signals/Abstract-Signals',
  component: ComponentCreator('/docs/Extensions/Signals/Abstract-Signals','b06'),
  exact: true,
},
{
  path: '/docs/Extensions/Signals/Asynchronous-Signals',
  component: ComponentCreator('/docs/Extensions/Signals/Asynchronous-Signals','33d'),
  exact: true,
},
{
  path: '/docs/Extensions/Signals/Introduction',
  component: ComponentCreator('/docs/Extensions/Signals/Introduction','ae6'),
  exact: true,
},
{
  path: '/docs/Extensions/Signals/Signal-Binding',
  component: ComponentCreator('/docs/Extensions/Signals/Signal-Binding','451'),
  exact: true,
},
{
  path: '/docs/Extensions/Signals/Signal-Declaration',
  component: ComponentCreator('/docs/Extensions/Signals/Signal-Declaration','9a0'),
  exact: true,
},
{
  path: '/docs/Extensions/Signals/Signal-Firing',
  component: ComponentCreator('/docs/Extensions/Signals/Signal-Firing','ace'),
  exact: true,
},
{
  path: '/docs/Extensions/Signals/Signals-Settings',
  component: ComponentCreator('/docs/Extensions/Signals/Signals-Settings','4ee'),
  exact: true,
},
{
  path: '/docs/Extensions/Signals/Signals-With-Subcontainers',
  component: ComponentCreator('/docs/Extensions/Signals/Signals-With-Subcontainers','f65'),
  exact: true,
},
{
  path: '/docs/Get Started/Hello-World',
  component: ComponentCreator('/docs/Get Started/Hello-World','a37'),
  exact: true,
},
{
  path: '/docs/Get Started/Introduction',
  component: ComponentCreator('/docs/Get Started/Introduction','05b'),
  exact: true,
},
{
  path: '/docs/intro',
  component: ComponentCreator('/docs/intro','e84'),
  exact: true,
},
]
},
{
  path: '*',
  component: ComponentCreator('*')
}
];
