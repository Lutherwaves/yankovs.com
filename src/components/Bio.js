import React from "react"
import picture from "../images/about-picture.jpg"

class Bio extends React.Component {
  render() {
    return (
      <div>
        <div className="line-numbers">
          <p>
            1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26
            27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46
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
                  <span style={{ color: "#FF97FF" }}>.name</span>&nbsp; &#123;
                </p>
                <p className="tag-info">Martin Yankov</p>
                <p>&#125;</p>
              </li>
              <li>
                <p>
                  <span style={{ color: "#86FFF8" }}>.bio</span>&nbsp; &#123;
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
                  <span style={{ color: "#94D381" }}>.skills</span>&nbsp; &#123;
                </p>
              </li>
              <li>
                <p className="tag-info">
                  <span style={{ color: "#8EE9FD" }}>
                    <i>.languages</i>
                  </span>
                  &nbsp; &#123;
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>python</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>3</span>;
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>javascript</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>'es6'</span>;{" "}
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>typescript</span>: true;{" "}
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>css</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>'sass'</span>;{" "}
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>html</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>5</span>;{" "}
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>sql</span>: &nbsp;
                    <span>true</span>;{" "}
                  </p>
                  <p>&#125;</p>
                </p>
              </li>
              <li>
                <p className="tag-info">
                  <span style={{ color: "#8EE9FD" }}>
                    <i>.technologies</i>
                  </span>
                  &nbsp; &#123;
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>django</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>3</span>;
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>
                      django-rest-framework
                    </span>
                    : &nbsp;
                    <span>true</span>;{" "}
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>react</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>'^16.12.0'</span>;{" "}
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>redux</span>: &nbsp;
                    <span>true</span>;{" "}
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>angular</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>'^7.2.15'</span>;{" "}
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>ionic</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>5</span>;{" "}
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>postgresql</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>'^10.15'</span>;
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>firebase</span>: &nbsp;
                    <span>true</span>;
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>mongo-db</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>'learning'</span>;
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>bash</span>: &nbsp;
                    <span>true</span>;
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>node</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>'js'</span>;
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>git</span>: &nbsp;
                    <span>true</span>;
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>gitlab</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>'ci/cd'</span>;
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>docker</span>: &nbsp;
                    <span>true</span>;
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>trello</span>: &nbsp;
                    <span>true</span>;
                  </p>
                  <p className="tag-info-2">
                    <span style={{ color: "#FF524D" }}>other</span>: &nbsp;
                    <span style={{ color: "#50F683" }}>
                      'uwsgi; nginx; sqlalchemy'
                    </span>
                    ;{" "}
                  </p>
                  <p>&#125;</p>
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
