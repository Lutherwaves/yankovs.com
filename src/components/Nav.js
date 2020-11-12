import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown, faFolder } from "@fortawesome/free-solid-svg-icons"
import { faFile } from "@fortawesome/free-regular-svg-icons"

class Nav extends React.Component {
  constructor() {
    super()
    this.state = {
      about_active: false,
      index_classname: "uncliked-file",
      about_classname: "unclicked-file",
    }
  }

  componentDidMount() {
    if (window.location.href.includes("about")) {
      this.setState({
        about_active: true,
        index_classname: "unclicked-file",
        about_classname: "clicked-file",
      })
    }
  }

  render() {
    const { index_classname, about_classname } = this.state
    return (
      <div className="navbar-container">
        <div className="navbar-list">
          <div className="folder-name-container">
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{ color: "#C4C4C4", fontSize: "25px" }}
            />{" "}
            &nbsp;&nbsp;
            <FontAwesomeIcon
              icon={faFolder}
              style={{ color: "#536579", fontSize: "30px" }}
            />{" "}
            &nbsp;
            <p>Martin's Folder</p>
          </div>

          <div className="navbar-pages-container">
            <div className="navbar-pages">
              <FontAwesomeIcon
                icon={faFile}
                className={index_classname}
                style={{ fontSize: "30px", float: "left" }}
              />
              &nbsp;&nbsp;&nbsp;
              <Link to="/">
                <p>index.html</p>
              </Link>
            </div>
            <div className="navbar-pages">
              <FontAwesomeIcon
                icon={faFile}
                className={about_classname}
                style={{ fontSize: "30px", float: "left" }}
              />
              &nbsp;&nbsp;&nbsp;
              <Link to="/about">
                <p>about.html</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Nav
