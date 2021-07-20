import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import HomepageFeatures from '../components/HomepageFeatures';
import Section from '../components/Section';
import LogoCarousel from '../components/LogoCarousel'
import Highlight from '../components/Highlight';
import UniDiLogoSVG from '../../static/img/unidi-logo.svg';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">

	<UniDiLogoSVG 
	  	className={styles.headerLogo}
		style={{ height: '200px' }}
	 />

        <h1 className="hero__title">
	  {siteConfig.title}
	</h1>
	<p className="hero__subtitle">{siteConfig.tagline}</p>
	<iframe 
	  src="https://ghbtns.com/github-btn.html?user=UniDi&repo=UniDi&type=star&count=true&size=large" 
	  frameborder="0" 
	  scrolling="0" 
	  width="170" 
	  height="30" 
	  title="GitHub">
	</iframe>
	<div className={styles.buttons}>
	  <Link
            className="button button--secondary button--lg"
            to="/docs">
            Read the Docs 📚
	  </Link>
	  &nbsp;
          <Link
            className="button button--secondary button--lg"
            to="/docs/cheatsheet">
           Cheat sheet 📋
          </Link>
        </div>
      </div>
    </header>
  );
}

const ReactIntegration = `
public class Mage
{
	private readonly ISpell _spell;

	public Mage(ISpell spell)
	{
		_spell = spell;
	}
}

public class MageInstaller : Installer
{
	public override void InstallBindings()
	{
		Container
			.Bind<ISpell>()
			.To<FlameStrike>()
			.AsSingle();
	}
}
`
const logos = [
	{
		/**
		 * Page 1
		 */
		img: '../../static/img/logos/macOS.svg',
		alt: 'BuildTarget.StandaloneOSX',
		url: 'https://docs.unity3d.com/ScriptReference/BuildTarget.StandaloneOSX.html'
	}, {
		img: '../../static/img/logos/windows.svg',
		alt: 'BuildTarget.StandaloneWindows',
		url: 'https://docs.unity3d.com/ScriptReference/BuildTarget.StandaloneWindows.html'
	}, {
		img: '../../static/img/logos/linux.svg',
		alt: 'BuildTarget.StandaloneLinux64',
		url: 'https://docs.unity3d.com/ScriptReference/BuildTarget.StandaloneLinux64.html'
	}, {
		img: '../../static/img/logos/iOS.svg',
		alt: 'BuildTarget.iOS',
		url: 'https://docs.unity3d.com/ScriptReference/BuildTarget.iOS.html'
	}, {
		img: '../../static/img/logos/android.svg',
		alt: 'BuildTarget.Android',
		url: 'https://docs.unity3d.com/ScriptReference/BuildTarget.Android.html'
	}, {
		img: '../../static/img/logos/tvOS.svg',
		alt: 'BuildTarget.tvOS',
		url: 'https://docs.unity3d.com/ScriptReference/BuildTarget.tvOS.html'
	}, {
		img: '../../static/img/logos/stadia.svg',
		alt: 'BuildTarget.Stadia',
		url: 'https://docs.unity3d.com/ScriptReference/BuildTarget.Stadia.html'
	}, {
		img: '../../static/img/logos/playstation.svg',
		alt: 'BuildTarget.PS4',
		url: 'https://docs.unity3d.com/ScriptReference/BuildTarget.PS4.html'
	}, {
		img: '../../static/img/logos/nintendo-switch.svg',
		alt: 'BuildTarget.Switch',
		url: 'https://docs.unity3d.com/ScriptReference/BuildTarget.Switch.html'
	}, {
		img: '../../static/img/logos/xbox.svg',
		alt: 'BuildTarget.XboxOne',
		url: 'https://docs.unity3d.com/ScriptReference/BuildTarget.XboxOne.html'
	}, {
		img: '../../static/img/logos/webgl.svg',
		alt: 'BuildTarget.XboxOne',
		url: 'https://docs.unity3d.com/ScriptReference/BuildTarget.WebGL.html'
	}]

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Dependency Injection framework for Unity">
      <HomepageHeader />
      <main>
	<Section>
	  <LogoCarousel logos={logos}></LogoCarousel>
	</Section>
	<Highlight
	  img={
		  <CodeBlock className="csharp" children={ReactIntegration}></CodeBlock>
	  }
	  isDark
	  title="Let UniDi glue.."
	  text={
		  <>
		  <p>
		  Lorum ipsum
		  </p>
		  </>
	  }
	/>
  	<Highlight
	  img={
                  <CodeBlock className="csharp" children={ReactIntegration}></CodeBlock>
	  }
	  reversed
	  title="Let UniDi glue.."
	  text={
		  <>
		  Lorum ipsum
		  </>
	  }
	/>
      </main>
    </Layout>
  );
}
