import React, { useState, useEffect } from "react";
import { marked } from "marked";
import smoothscroll from "smoothscroll-polyfill";


const App = () => {
  const [markdown, setMarkdown] = useState("");
  const [tableOfContents, setTableOfContents] = useState([]);

  useEffect(() => {
    // Fetch the Markdown text and parse it into HTML
    fetch("/markdown.md")
      .then(res => res.text())
      .then(text => {
        console.log({ text })
        setMarkdown(marked(text));
        extractTableOfContents(text);
      });
  }, []);

  const extractTableOfContents = text => {
    // Extract the headings from the Markdown text
    const lines = text.split("\n");
    const headings = [];
    lines.forEach(line => {
      if (line.startsWith("#")) {
        headings.push(line);
      }
    });

    // Generate the table of contents
    const toc = headings.map(heading => {
      const level = heading.split(" ")[0].length;
      const text = heading.substring(level + 1);
      const id = text.toLowerCase().replace(/ /g, "-");
      return { level, text, id };
    });

    setTableOfContents(toc);
  };

  return (
    <div className="markdown-display">
      <aside className="table-of-contents">
        {tableOfContents.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => {
              smoothscroll.polyfill();
              window.scroll({
                top: document.querySelector(`#${item.id}`).offsetTop,
                behavior: "smooth"
              });
            }}
          >
            {item.text}
          </a>
        ))}
      </aside>
      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: markdown }}
      />
    </div>
  );
};

export default App;
