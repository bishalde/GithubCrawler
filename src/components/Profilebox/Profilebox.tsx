import "./Profilebox.css";

const Profilebox = (props: any) => {
  const data = props.profileData;
  const repos = props.repos;
  const followers = props.followers;
  const following = props.following;

  return (
    <>
      <section className="databox">
        <div className="profilebox">
          <img src={data.avatar_url} alt="Profile Picture" />
          <div className="profileinfo">
            <h1>{data.name}</h1>
            <h3>@{data.login}</h3>
            <h5>ID : {data.id}</h5>
            <a target="_blank" className="blog" href={data.blog}>
              Blog : {data.blog}
            </a>
            <p>{data.bio}</p>
            <div className="info-btns">
              <a className="infobtns" href="#followers">
                Followers {data.followers}
              </a>
              <a className="infobtns" href="#following">
                Following {data.following}
              </a>
              <a className="infobtns" href="#repositories">
                Repository {data.public_repos}
              </a>
            </div>
          </div>
          <a target="_blank" className="profile" href={data.html_url}>
            Profile
          </a>
        </div>
        <div className="profiledetails">
          <div>
            <h1>Profile Details </h1>
            <h2>
              Name : <span>{data.name}</span>{" "}
            </h2>
            <h2>
              Username : <span>@{data.login}</span>{" "}
            </h2>
            <h2>
              User Id : <span>{data.id}</span>{" "}
            </h2>
            <h2>
              User Type : <span>{data.type}</span>{" "}
            </h2>
            <h2>
              Node Id : <span>{data.node_id}</span>{" "}
            </h2>
            <h2>
              Profile Picture URL :{" "}
              <a target="_blank" href={data.avatar_url}>
                {data.avatar_url}
              </a>{" "}
            </h2>
            <h2>
              Date Of Joining : <span>{data.created_at}</span>{" "}
            </h2>
            <h2>
              Last Updated At : <span>{data.updated_at}</span>{" "}
            </h2>
            <h2>
              Location : <span>{data.location}</span>{" "}
            </h2>
            <h2>
              Company : <span>{data.company ? data.company : "N/A"}</span>{" "}
            </h2>
          </div>

          <h1 id="followers">Followers</h1>
          <div className="repobox">
            {followers.map((followers: any) => {
              return (
                <a href={followers.html_url} key={followers.id} target="_blank">
                  <div className="repo">
                    <span>
                      <img
                        src={followers.avatar_url}
                        height={100}
                        width={100}
                        alt="avatar"
                      />
                      <h3>{followers.login}</h3>
                    </span>
                    <a href={followers.html_url} target="_blank">
                      {followers.html_url}
                    </a>
                    <div className="iddata">
                      <h3>ID : {followers.id}</h3>
                      <h3>Node ID : {followers.node_id}</h3>
                    </div>

                    <h3>Counts</h3>
                    <div className="countdetails">
                      <button>
                        <a href={followers.repos_url} target="_blank">
                          Repos
                        </a>
                      </button>
                      <button>
                        <a href={followers.followers_url} target="_blank">
                          Followers
                        </a>
                      </button>
                      <button>
                        <a
                          href={followers.following_url.replace(
                            "{/other_user}",
                            ""
                          )}
                          target="_blank"
                        >
                          Following
                        </a>
                      </button>
                      {/* <button>
                        <a
                          href={followers.starred_url.replace(
                            "{/owner}{/repo}",
                            ""
                          )}
                          target="_blank"
                        >
                          Starred
                        </a>
                      </button> */}
                      <button>
                        <a href={followers.organizations_url} target="_blank">
                          Organizations
                        </a>
                      </button>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <h1 id="following">Following</h1>
          <div className="repobox">
            {following.map((following: any) => {
              return (
                <a href={following.html_url} key={following.id} target="_blank">
                  <div className="repo">
                    <span>
                      <img
                        src={following.avatar_url}
                        height={100}
                        width={100}
                        alt="avatar"
                      />
                      <h3>{following.login}</h3>
                    </span>

                    <a href={following.html_url} target="_blank">
                      {following.html_url}
                    </a>
                    <div className="iddata">
                      <h3>ID : {following.id}</h3>
                      <h3>Node ID : {following.node_id}</h3>
                    </div>

                    <h3>Counts</h3>
                    <div className="countdetails">
                      <button>
                        <a href={following.repos_url} target="_blank">
                          Repos
                        </a>
                      </button>
                      <button>
                        <a href={following.followers_url} target="_blank">
                          Followers
                        </a>
                      </button>
                      <button>
                        <a
                          href={following.following_url.replace(
                            "{/other_user}",
                            ""
                          )}
                          target="_blank"
                        >
                          Following
                        </a>
                      </button>
                      {/* <button>
                        <a
                          href={following.starred_url.replace(
                            "{/owner}{/repo}",
                            ""
                          )}
                          target="_blank"
                        >
                          Starred
                        </a>
                      </button> */}
                      <button>
                        <a href={following.organizations_url} target="_blank">
                          Organizations
                        </a>
                      </button>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <h1 id="repositories">Repositories</h1>
          <div className="repobox">
            {repos.map((repo: any) => {
              return (
                <a href={repo.html_url} key={repo.id} target="_blank">
                  <div className="repo">
                    <h3>{repo.name}</h3>
                    <p>{repo.description}</p>
                    <a href={repo.homepage} target="_blank">
                      {repo.homepage}
                    </a>
                    <div className="iddata">
                      <h3>ID : {repo.id}</h3>
                      <h3>Node ID : {repo.node_id}</h3>
                    </div>
                    {/* <h3>Languages</h3>
                <div className="languages">
                  <button>{languages}</button>
                  <button>Css</button>
                  <button>JavaScript</button>
                  <button>C++</button>
                </div> */}
                    <h3>Counts</h3>
                    <div className="countdetails">
                      <button>Forks {repo.forks}</button>
                      <button>Watchers {repo.watchers}</button>
                      <button>Issues {repo.open_issues}</button>
                      <button>Branch : {repo.default_branch}</button>
                    </div>
                    <h3>Size</h3>
                    <h4>{repo.size}</h4>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Profilebox;
