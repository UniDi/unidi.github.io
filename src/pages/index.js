import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

import UniDiLogoSVG from '../../static/img/unidi-logo.svg';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">

	<UniDiLogoSVG 
	  	className={styles.headerLogo}
		style={{ height: '200px' }}
	 />

        <h1 className="hero__title">{siteConfig.title}</h1>
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

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Dependency Injection framework for Unity">
      <HomepageHeader />
      <main>
	<HomepageFeatures />
      </main>
    </Layout>
  );
}
