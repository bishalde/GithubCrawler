import { useState, useTransition } from "react";
import "./Introbar.css";
import Profilebox from "../Profilebox/Profilebox";

const Introbar = () => {
  const [isPending, startTransition] = useTransition();
  const [userName, setUserName] = useState<any | null>(null);
  const [userData, setUserData] = useState({});
  const [userFound, setUserFound] = useState<any | null>(null);

  const [repos, setRepos] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const handleChange = (event: any) => {
    event.preventDefault();
    startTransition(() => {
      fetch(`https://api.github.com/users/${userName}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("User not found");
          }
          return res.json();
        })
        .then((data) => {
          // Remove {/other_user} from the following_url
          const followingUrl = data.following_url.replace("{/other_user}", "");

          // Fetch data for repos, followers, and following
          Promise.all([
            fetch(data.repos_url).then((res) => res.json()),
            fetch(data.followers_url).then((res) => res.json()),
            fetch(followingUrl).then((res) => res.json()),
          ]).then(([reposData, followersData, followingData]) => {
            setRepos(reposData);
            setFollowers(followersData);
            setFollowing(followingData);
          });

          // Set user data and name
          setUserData(data);
          setUserName(data.login);
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
          <form onSubmit={handleChange}>
            <input
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              type="text"
              placeholder="Search for a user"
            />
            <button onClick={handleChange}>Search</button>
          </form>
        </div>
      </section>
      {userFound ? (
        isPending ? (
          <h1 className="showinfo">Searching...</h1>
        ) : (
          <Profilebox
            profileData={userData}
            repos={repos}
            followers={followers}
            following={following}
          />
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
