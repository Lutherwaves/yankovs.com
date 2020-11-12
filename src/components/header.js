import React from "react"
import GitlabSVG from "../Icons/GitlabSVG"
import LinkedInSVG from "../Icons/LinkedInSVG"
import MailSVG from "../Icons/MailSVG"
import GithubSVG from "../Icons/GithubSVG"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

const Header = ({ siteTitle }) => (
  // <header
  //   style={{
  //     background: `rebeccapurple`,
  //     marginBottom: `1.45rem`,
  //   }}
  // >
  <div className="header-container">
    <div className="user-info-container">
      <div className="user-info">
        <p>Martin Yankov</p>
        <p>Full Stack Software Engineer</p>
      </div>
      <div className="x-icon">
        <FontAwesomeIcon
          icon={faTimes}
          style={{
            color: "#C4C4C4",
            fontSize: "20px",
            fontWeight: "0px",
            display: "inline-block",
          }}
        />
      </div>
    </div>

    <div className="icons-container">
      <a href="mailto:martin@yankovs.com">
        <MailSVG />
      </a>

      <a href="https://www.gitlab.com/lutherwaves">
        <GitlabSVG />
      </a>

      <a href="https://www.linkedin.com/in/mdyankov/">
        <LinkedInSVG />
      </a>

      <a href="https://github.com/Lutherwaves">
        <GithubSVG />
      </a>
    </div>
  </div>

  // </header>
)

// Header.propTypes = {
//   siteTitle: PropTypes.string,
// }

// Header.defaultProps = {
//   siteTitle: ``,
// }

export default Header
