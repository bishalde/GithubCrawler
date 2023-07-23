import './Navbar.css'
import { useState } from "react";

function Navbar() {
  const [navlinksvalue, setnavlinks] = useState("navlinks");


  const navbarActive = () => {
    if (navlinksvalue === "navlinks") {
      setnavlinks("navlinks activenavlinks");
    } else {
      setnavlinks("navlinks");
    }
  };

  return (
    <>
    <nav>
      <a href="/">
        <div className="navlogo">
            <img src="logos/rm1.png" />
            <h1>GitHubCrawler</h1>
        </div>
      </a>

      <div className="hamberger" onClick={navbarActive}>
        <div className="ham-lines"></div>
        <div className="ham-lines"></div>
        <div className="ham-lines"></div>
      </div>

        <div className={navlinksvalue}>
            <a href="/">Home</a>
            <a href="https://bishalde.vercel.app">Developer</a>
            <a href="https://github.com/bishalde/GithubCrawler">Repostiory</a>
        </div>
    </nav>
    </>
  )
}

export default Navbar