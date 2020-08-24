import React, { useState, useEffect } from 'react';
import { FiSearch, FiStar, FiUsers, FiBook, FiChevronRight } from 'react-icons/fi'
import api from '../../services';

import bolinha from '../../assets/bolinha.png';
import gitnetwork from '../../assets/git-network.png';
import gitlogo from '../../assets/github-logo.png';

import { Header, Form, Profile, InfoMain, InfoSecundary, Repositories } from './styles';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [profile, setProfile] = useState(false);
  const [newProfile, setNewProfile] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [infoProfile, setInfoProfile] = useState();

  async function handleProfile(e) {
    e.preventDefault();

    const response = await api.get(`users/${newProfile}`);
    const responseRepo = await api.get(`users/${newProfile}/repos`);

    const {
      avatar_url,
      login,
      name,
      html_url,
      repos_url,
      bio,
      public_repos,
      followers,
    } = response.data;

    let starCount = 0;
    let i = 0;
    for (i = 0; i < responseRepo.data.length; ++i) {
      starCount += responseRepo.data[i].stargazers_count;
    }

    const profile = {
      avatar_url,
      login,
      name,
      html_url,
      repos_url,
      bio,
      public_repos,
      followers,
      starCount,
    }

    setInfoProfile(profile);
    setProfile(true);
    setRepositories(responseRepo.data);

  }


  return (
    <>
      <Header>
        <div className="title">
          <img src={gitlogo} alt="Github Logo" />
          <h1>Github Profiles</h1>
        </div>

        <div className="description">
          <p>search  Github profiles</p>
        </div>
      </Header>

      <Form onSubmit={handleProfile}>
        <input
          value={newProfile}
          onChange={e => setNewProfile(e.target.value)}
          placeholder="Search profile..."
        />

        <button type="submit">
          <FiSearch color="#FFF" size={30} />
        </button>
      </Form>

      {profile &&
        <Profile>
          <InfoMain>
            <img
              src={infoProfile.avatar_url}
              alt={infoProfile.name}
            />
            <div>
              <strong>{infoProfile.name}</strong>
              <p>{infoProfile.login}</p>
              <p>{infoProfile.bio}</p>
            </div>
            <Link to="/"><button type="button">View on Github</button></Link>
          </InfoMain>

          <InfoSecundary>
            <ul className="statusInfo">
              <li>
                <FiStar color="#FFF" size={35} />
                <p>{infoProfile.starCount}</p>
              </li>

              <li>
                <FiUsers color="#FFF" size={35} />
                <p>{infoProfile.followers}</p>
              </li>

              <li>
                <FiBook color="#FFF" size={35} />
                <p>{infoProfile.public_repos} Repositories</p>
              </li>
            </ul>

            <strong>Repositories</strong>

            <Repositories>
              {repositories.map(repository => (
                <a key={repository.id} href="/">
                  <div className="infos">
                    <strong>{repository.full_name}</strong>
                    <p>{repository.description}</p>

                    <footer>
                      {repository.language &&
                        <div>
                          <img src={bolinha} alt="Language" />
                          <p>{repository.language}</p>
                        </div>
                      }

                      <div>
                        <FiStar color="#DDFF0C" size={14} />
                        <p>{repository.stargazers_count}</p>
                      </div>

                      <div>
                        <img src={gitnetwork} alt="fork" />
                        <p>{repository.forks_count}</p>
                      </div>
                    </footer>
                  </div>

                  <FiChevronRight size={30} />
                </a>
              ))}
            </Repositories>


          </InfoSecundary>
        </Profile>}

    </>
  )
}