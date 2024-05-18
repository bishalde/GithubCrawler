import './Navbar.css';
import { useState } from 'react';

function Navbar() {
  const [navlinksActive, setNavlinksActive] = useState(false);

  const navbarActive = () => {
    setNavlinksActive(!navlinksActive);
  };

  return (
    <>
      <nav>
        <a href="/">
          <div className="navlogo">
            <img src="logos/rm1.png" alt="Logo" />
            <h1>GitHubCrawler</h1>
          </div>
        </a>

        <div className={`hamberger ${navlinksActive ? 'open' : ''}`} onClick={navbarActive}>
          <div className="ham-lines line1"></div>
          <div className="ham-lines line2"></div>
          <div className="ham-lines line3"></div>
        </div>

        <div className={`navlinks ${navlinksActive ? 'activenavlinks' : ''}`}>
          <a href="/">Home</a>
          <a href="https://bishalde.vercel.app">Developer</a>
          <a href="https://github.com/bishalde/GithubCrawler">Repository</a>
        </div>
      </nav>
    </>
  );
}

export default Navbar;