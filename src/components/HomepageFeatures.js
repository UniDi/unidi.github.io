import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Keep your code maintainable',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        UniDi makes sure your classes and Game Objects are there when you want them, where you want them, and how you want them initialized.
      </>
    ),
  },
  {
    title: 'Keep your code flexible',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Loose coupling makes adding new features and modifying old ones is a breeze.
      </>
    ),
  },
  {
    title: 'Keep your code testable',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        UniDi manages your dependencies for you, so your classes can be small simple, and easy to reason about.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
