import React from "react"
import picture from "../images/about-picture.jpg"

class Bio extends React.Component {
  render() {
    return (
      <div>
        <div className="line-numbers">
          <p>
            1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26
            27 28 29 30 31 32 33 34
          </p>
        </div>
        <div className="divider"></div>

        <div className="about-content-container">
          {/**
         <div className="comments">
            <p>// This is a comment.</p>
            <p>// This is another comment.</p>
            <p>// This is another comment for symmetry.</p>
          </div>
 */}
          <div className="about-main-section">
            <ul className="about-list">
              <li>
                <p>
                  <span style={{ color: "#FF97FF" }}>.name</span> &#123;{" "}
                </p>
                <p className="tag-info">Martin Yankov</p>
                <p>&#125;</p>
              </li>
              <li>
                <p>
                  <span style={{ color: "#86FFF8" }}>.bio</span> &#123;{" "}
                </p>
                <p className="tag-info">
                  I'm from Stara Zagora, where I work as a full stack software
                  engineer at Tekom, a family-run construction company striving
                  to innnovate. I have 3 years of professional experience
                  working as a full-stack software engineer with a focus on
                  delivering simple and usable solutions to complex problems.
                  When I am not working I like to experiment with food recipes,
                  home automation technologies and DIY construction projects.{" "}
                </p>
                <p>&#125;</p>
              </li>
              <li>
                <p>
                  <span style={{ color: "#94D381" }}>.skills</span> &#123;{" "}
                </p>
                <p className="tag-info">
                  <strong>Languages</strong>: Python 3; JavaScript (ES6);
                  TypeScript; CSS/Sass, HTML/HTML5;
                </p>
                <p className="tag-info">
                  <strong>Technologies:</strong> Django / Django Rest Framework;
                  Angular; React / Redux; Ionic and Cordova; Scrapy; SQLAlchemy;
                  uWSGI; nGINX;
                </p>
                <p className="tag-info">
                  <strong>Databases</strong>: PostgreSQL; Firebase; MongoDB
                  (loading);
                </p>
                <p className="tag-info">
                  <strong>Tools</strong>: Node.js; Bash; Git & Github; GitLab
                  CI/CD; VS Code; Trello; Yarn / npm; XCode; Android Studio;
                </p>
                <p>&#125;</p>
              </li>
            </ul>

            {/**
           <div className="about-image-container">
              <img src={picture} />
            </div> */}
          </div>
        </div>
      </div>
    )
  }
}

export default Bio
