import { ArrowUp, ArrowUpRight } from "lucide-react";
export default function Footer() {
  return (
    <footer className="site-footer page-shell">
      <div className="footer-name" aria-hidden="true">
        EDDY CASAS<span>✳</span>
      </div>
      <div className="footer-bottom">
        <p>
          SOFTWARE DEVELOPER
          <br />
          <span>Bacolod City, Philippines</span>
        </p>
        <div>
          <a
            href="https://github.com/Ydde21"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <ArrowUpRight size={13} />
          </a>
          <a
            href="https://www.linkedin.com/in/eddy-casas-72a07b364/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
            <ArrowUpRight size={13} />
          </a>
          <a href="#home">
            Back to top
            <ArrowUp size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
