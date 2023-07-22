import { useState, useTransition  } from "react";
import "./Introbar.css";
import Profilebox from "../Profilebox/Profilebox";

const Introbar = () => {
  const [isPending, startTransition] = useTransition();
  const [userName, setUserName] = useState('bishalde');
  const [userData, setUserData] = useState({});
  const [userFound, setUserFound] = useState(null);

  const [repos,setRepos] = useState([]);

  const handleChange = () => {
    startTransition(() => {
      fetch(`https://api.github.com/users/${userName}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("User not found");
          }
          return res.json();
        })
        .then((data) => {
          fetch(data.repos_url)
            .then((res) => res.json())
            .then((data) => {
              setRepos(data);
            });
          setUserData(data);
          setUserName(data.login)
          setUserFound(true);
        })
        .catch((error) => {
          console.log("Error:", error.message);
          setUserFound(false);
        });
    });
  };

  return (
    <>
      <section className="introbar">
        <h1>
          Search Users <span>Instantly</span>
          <br /> Using GithubCrawler
        </h1>
        <h4>
          Seamless access to profiles, repositories, and contributions.
          Effortless and efficient exploration !
        </h4>
        <div className="searchbox">
          <input
            value={userName}
            onChange={handleChange}
            type="text"
            placeholder="Search for a user"
          />
          <button onClick={handleChange}>Search</button>
        </div>
      </section>
      {userFound ? (
        isPending ? (
          <h1 className="showinfo">Searching...</h1>
        ) : (
          <Profilebox profileData={userData} repos={repos} />
        )
      ) : userFound != null ? (
        <h1 className="showinfo">No User Found</h1>
      ) : (
        <h1></h1>
      )}
    </>
  );
};

export default Introbar;
