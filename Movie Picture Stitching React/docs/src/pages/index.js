import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Translate, { translate } from '@docusaurus/Translate';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          <Translate id="homepage.title">Eagle React Template</Translate>
        </Heading>
        <p className="hero__subtitle">
          <Translate id="homepage.tagline">
            Modern React + TypeScript template for building Eagle desktop plugin extensions
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/introduction"
          >
            <Translate id="homepage.cta.getStarted">🚀 Get Started</Translate>
          </Link>
          <Link
            className="button button--outline button--lg"
            to="https://github.com/LeonWong282/eagle-react-template"
            style={{ marginLeft: '1rem', color: 'white', borderColor: 'white' }}
          >
            <Translate id="homepage.cta.starGithub">⭐ Star on GitHub</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickLinks() {
  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <div className="row">
          <div className="col col--4">
            <div className={styles.quickLinkCard}>
              <h3>
                <Translate id="homepage.quicklinks.docs.title">📚 Documentation</Translate>
              </h3>
              <p>
                <Translate id="homepage.quicklinks.docs.description">
                  Comprehensive guides to help you get the most out of this template.
                </Translate>
              </p>
              <Link to="/docs/getting-started/introduction">
                <Translate id="homepage.quicklinks.docs.link">Read the Docs →</Translate>
              </Link>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.quickLinkCard}>
              <h3>
                <Translate id="homepage.quicklinks.contributing.title">🤝 Contributing</Translate>
              </h3>
              <p>
                <Translate id="homepage.quicklinks.contributing.description">
                  Learn how to contribute to this project and become part of the community.
                </Translate>
              </p>
              <Link to="/docs/reference/contributing">
                <Translate id="homepage.quicklinks.contributing.link">
                  Contribution Guide →
                </Translate>
              </Link>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.quickLinkCard}>
              <h3>
                <Translate id="homepage.quicklinks.community.title">💬 Community</Translate>
              </h3>
              <p>
                <Translate id="homepage.quicklinks.community.description">
                  Join discussions, report issues, and connect with other users.
                </Translate>
              </p>
              <Link to="https://github.com/LeonWong282/eagle-react-template/discussions">
                <Translate id="homepage.quicklinks.community.link">Join Discussions →</Translate>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={translate({ id: 'homepage.title', message: 'Eagle React Template' })}
      description={translate({
        id: 'homepage.description',
        message: 'Modern React + TypeScript template for building Eagle desktop plugin extensions',
      })}
    >
      {/* Skip link for keyboard navigation accessibility */}
      <a href="#main-content" className="skip-link">
        <Translate id="accessibility.skipToMain">Skip to main content</Translate>
      </a>
      <HomepageHeader />
      <main id="main-content" tabIndex="-1">
        <HomepageFeatures />
        <QuickLinks />
      </main>
    </Layout>
  );
}
