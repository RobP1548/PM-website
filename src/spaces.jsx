import { createRoot } from "react-dom/client";
import { portfolioContent as content } from "./data";
import "./styles.css";

function SpacesPage() {
  const { subheading, items } = content.xSpaces;

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="/index.html#top">RD<span>.</span></a>
          <nav aria-label="Primary navigation">
            <a href="/index.html#work">Work</a>
            <a href="/index.html#speaking">Speaking</a>
            <a href="/index.html#writing">Writing</a>
          </nav>
          <a className="contact-link" href="mailto:hello@example.com">Get in touch <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <main>
        <section className="spaces-hero content-shell">
          <span className="eyebrow">On stage / X Spaces</span>
          <h1>X Spaces<br /><em>in conversation.</em></h1>
          <p className="hero-description">{subheading}</p>
        </section>

        <div className="content-shell">
          <section className="section spaces-section">
            <ul className="spaces-list">
              {items.map(([title, withWho, href]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noreferrer noopener">
                    <span className="spaces-row">
                      <span className="spaces-title">{title}</span>
                      <span aria-hidden="true">↗</span>
                    </span>
                    <span className="spaces-with">w/ {withWho}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <span>Robert Drage / X Spaces</span>
        <a href="/index.html#top">Back to portfolio ↑</a>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<SpacesPage />);
