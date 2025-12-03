import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '📋 Community Health Files',
    description: (
      <>
        Pre-configured issue templates, PR templates, code of conduct, and security
        policy. Everything you need for a healthy open source community.
      </>
    ),
  },
  {
    title: '📚 Documentation-First',
    description: (
      <>
        Beautiful documentation powered by Docusaurus. Multi-language support,
        dark mode, and search included out of the box.
      </>
    ),
  },
  {
    title: '⚙️ Developer Tools',
    description: (
      <>
        EditorConfig for consistent formatting, pre-commit hooks for quality
        control, and CI/CD workflows ready to use.
      </>
    ),
  },
  {
    title: '🔒 Security Best Practices',
    description: (
      <>
        Security policy template, CodeQL scanning, dependency management, and
        responsible disclosure guidelines included.
      </>
    ),
  },
  {
    title: '🌍 Multi-Language Support',
    description: (
      <>
        Built-in internationalization with English and Traditional Chinese.
        Easy to add more languages for global reach.
      </>
    ),
  },
  {
    title: '🚀 Ready to Deploy',
    description: (
      <>
        GitHub Pages deployment, automated releases, Docker templates, and
        everything configured for production use.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2">Why Use This Template?</Heading>
          <p className={styles.subtitle}>
            Everything you need to start a professional open source project
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
