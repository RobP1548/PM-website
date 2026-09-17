import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, BarChart3, Megaphone, Network, Rocket, Search, Speech } from "lucide-react";
import { portfolioContent as content } from "./data";
import profileImage from "../pfp.jpg";
import onstageImage from "../assets/Rob_onstage.jpg";
import thoughtLeadershipImage from "../assets/THW3_Stage-D1_168.JPG";
import "./styles.css";

const ExternalLink = ({ href, children, className = "" }) => (
  <a className={className} href={href} target="_blank" rel="noreferrer noopener">
    {children}
    <span aria-hidden="true">↗</span>
  </a>
);

function LinkList({ items }) {
  return (
    <ul className="link-list">
      {items.map(([label, href]) => (
        <li key={href}>
          <ExternalLink href={href}>{label}</ExternalLink>
        </li>
      ))}
    </ul>
  );
}

function Section({ eyebrow, title, children, className = "", id }) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="section-heading">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FounderMarketing({ intro, speaking }) {
  return (
    <div className="founder-marketing">
      <p>{intro}</p>
      <div className="founder-marketing-group">
        <h4>{speaking.heading}</h4>
        <ul>
          {speaking.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function renderRichText(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, index) => (index % 2 === 1 ? <strong key={index}>{part}</strong> : part));
}

function LaunchCard({ title, fields, links }) {
  return (
    <div className="launch-card">
      <h3>{title}</h3>
      <div className="launch-fields">
        {fields.map(([label, text]) => (
          <p key={label}><strong>{label}:</strong> {renderRichText(text)}</p>
        ))}
      </div>
      <div className="launch-links">
        {links.map(([label, href]) => (
          <ExternalLink className="launch-link" href={href} key={href}>{label}</ExternalLink>
        ))}
      </div>
    </div>
  );
}

function LaunchesGrid({ items, mainnetLaunch }) {
  return (
    <div className="launches">
      <div className="launch-grid">
        {items.map((item) => (
          <LaunchCard key={item.title} {...item} />
        ))}
      </div>
      <div className="launch-card launch-mainnet">
        <h3>{mainnetLaunch.title}</h3>
        <p>{mainnetLaunch.description}</p>
        <div className="launch-links">
          {mainnetLaunch.links.map(([label, href]) => (
            <ExternalLink className="launch-link" href={href} key={href}>{label}</ExternalLink>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArticleGrid({ items, className = "" }) {
  return (
    <div className={`article-grid ${className}`}>
      {items.map(({ title, href }, index) => (
        <a className="article-card" href={href} target="_blank" rel="noreferrer noopener" key={href}>
          <span className="article-index" aria-hidden="true">0{index + 1}</span>
          <span className="article-title">{title}</span>
          <span className="article-action">Read article <span aria-hidden="true">↗</span></span>
        </a>
      ))}
    </div>
  );
}

const viewsFormatter = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const formatViews = (value) => `±${viewsFormatter.format(value)}`;

function PRViewsCount({ value, delay }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    const startTime = performance.now() + delay;
    const duration = 1200;

    const tick = (now) => {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, delay]);

  return formatViews(display);
}

function PRWinsTable({ items, authorPage }) {
  const tableRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    if (tableRef.current) observer.observe(tableRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`pr-table ${isVisible ? "is-visible" : ""}`} ref={tableRef}>
      <div className="pr-row pr-row-head" aria-hidden="true">
        <span>Publication</span>
        <span>Feature</span>
        <span>Focus</span>
        <span>Est. views</span>
      </div>
      {items.map((item, index) => (
        <div className="pr-row" style={{ "--row-index": index }} key={item.href}>
          <ExternalLink className="pr-outlet" href={item.href}>{item.outlet}</ExternalLink>
          <span className="pr-feature">{item.feature}</span>
          <span className="pr-focus">{item.focus}</span>
          <span className="pr-views">{isVisible ? <PRViewsCount value={item.views} delay={index * 180} /> : "±0"}</span>
        </div>
      ))}
      <ExternalLink className="text-link pr-author-link" href={authorPage[1]}>{authorPage[0]}</ExternalLink>
    </div>
  );
}

const skillIcons = [Search, Speech, Rocket, Megaphone, Network, BarChart3];

function SkillsFlow() {
  const flowRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0, rootMargin: "-50% 0px -50% 0px" });

    if (flowRef.current) observer.observe(flowRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={flowRef} className={`skills-section ${isVisible ? "is-visible" : ""}`} aria-labelledby="skills-heading">
      <div className="skills-heading">
        <div>
          <span className="eyebrow">How I work</span>
          <h2 id="skills-heading">From signal<br /><em>to scale.</em></h2>
        </div>
        <p>A connected product practice that carries an idea from the first question to the people who make it grow.</p>
      </div>
      <div className="skills-flow">
        {content.skills.map(([title, description], index) => {
          const Icon = skillIcons[index];
          return (
            <div className="skill-step" style={{ "--step-index": index }} key={title}>
              <div className="skill-icon"><Icon size={22} strokeWidth={1.5} aria-hidden="true" /></div>
              <span className="skill-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              {index < content.skills.length - 1 && <ArrowRight className="skill-arrow" size={18} strokeWidth={1.5} aria-hidden="true" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const navSections = [
  ["00", "how-i-work", "How I work"],
  ["01", "launches", "Go-to-Market"],
  ["02", "shipping", "Minor releases"],
  ["03", "evidence", "Case studies"],
  ["04", "pr-wins", "PR wins"],
  ["05", "speaking", "Public speaking"],
  ["06", "writing", "Thought leadership"],
  ["07", "partner-marketing", "Partner marketing"]
];

function App() {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top">RD<span>.</span></a>
          <nav aria-label="Primary navigation">
            {navSections.map(([number, id, label]) => (
              <a href={`#${id}`} title={label} aria-label={label} key={id}>{number}</a>
            ))}
          </nav>
          <a className="contact-link" href="mailto:hello@example.com">Get in touch <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-top">
            <div className="hero-copy">
              <p className="eyebrow">Product marketer / manager</p>
              <h1>Robert<br />Drage<br /><em>Portfolio</em></h1>
            </div>
            <div className="hero-portrait">
              <div className="portrait-frame">
                <img src={profileImage} alt={content.profile.name} />
              </div>
            </div>
          </div>
          <div className="hero-bio">
            {content.profile.description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <a className="text-link hero-cta" href="#how-i-work">Explore the work <span aria-hidden="true">↓</span></a>
        </section>

        <div id="work" className="content-shell">
          <SkillsFlow />
          <Section id="launches" eyebrow="01 / Go-to-Market" title="Launches" className="section-featured">
            <LaunchesGrid items={content.launches} mainnetLaunch={content.mainnetLaunch} />
          </Section>

          <div className="two-column-sections">
            <Section id="shipping" eyebrow="02 / Shipping" title="Minor releases">
              <LinkList items={content.minorReleases} />
            </Section>
            <Section id="evidence" eyebrow="03 / Evidence" title="Case studies">
              <LinkList items={content.caseStudies} />
            </Section>
          </div>

          <Section id="pr-wins" eyebrow="04 / In the press" title="PR wins" className="section-dark">
            <PRWinsTable items={content.prWins} authorPage={content.prAuthorPage} />
          </Section>

          <Section id="speaking" eyebrow="05 / On stage" title="Public speaking" className="section-speaking" >
            <div className="section-intro-row">
              <p>Conversations about product, protocol design, and the future of decentralised infrastructure.</p>
              <a href="/spaces.html" className="spaces-cta">X Spaces <span aria-hidden="true">→</span></a>
            </div>
            <figure className="editorial-image speaking-image">
              <img src={onstageImage} alt="Robert Drage speaking on a panel at DVT Summit Thailand 2024" loading="lazy" />
            </figure>
            <h3 className="video-grid-heading">Community calls & interviews</h3>
            <div className="video-grid">
              {content.publicSpeaking.map(([src, title]) => (
                <div className="video-frame" key={src}>
                  <iframe src={src} title={title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
              ))}
            </div>
          </Section>

          <div id="writing" className="writing-sections">
            <Section eyebrow="06 / Ideas" title="Thought leadership">
              <FounderMarketing {...content.founderMarketing} />
              <figure className="editorial-image writing-image">
                <img src={thoughtLeadershipImage} alt="Robert Drage speaking on stage at a technology event" loading="lazy" />
              </figure>
              <div className="contributions-break">
                <h3>Notable contributions</h3>
                <LinkList items={content.contributions} />
              </div>
            </Section>
          </div>

          <Section id="partner-marketing" eyebrow="07 / Ecosystem" title="Partner marketing" className="section-ecosystem">
            <ArticleGrid className="article-grid-compact" items={content.ecosystem.map(([title, href]) => ({ title, href }))} />
          </Section>
        </div>
      </main>

      <footer className="site-footer">
        <span>Robert Drage / Product portfolio</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
