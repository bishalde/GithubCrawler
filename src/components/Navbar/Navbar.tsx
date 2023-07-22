import './Navbar.css'

function Navbar() {
  return (
    <>
    <nav>
      <a href="/">
        <div className="navlogo">
            <img src="logos/rm1.png" />
            <h1>GitHubCrawler</h1>
        </div>
      </a>

        <div className="navlinks">
            <a href="/">Home</a>
            <a href="https://bishalde.vercel.app">Developer</a>
            <a href="https://github.com/bishalde/GithubCrawler">Repostiory</a>
        </div>
    </nav>
    </>
  )
}

export default Navbar