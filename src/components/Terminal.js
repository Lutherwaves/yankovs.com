import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import Typist from "react-typist"
import Delay from "react-delay"

class Terminal extends Component {
  componentDidMount() {
    // Redirect after terminal finishes typing
    setTimeout(() => {
      window.location.replace(`/about`)
    }, 21000)
  }

  render() {
    // Grab terminal data
    const { command1, command2, name, description } = this.props.data

    var description_list = []
    var sentence = ""
    // Split content into sentences
    for (var i = 0; i < description.length; i++) {
      if (description[i] === ">" || i === description.length - 1) {
        description_list.push(sentence.trim())
        sentence = ""
      } else {
        sentence += description[i]
      }
    }

    return (
      <div className="terminal-container">
        <nav className="terminal-nav">
          <div className="circles-container">
            <div
              className="circle red"
              style={{ backgroundColor: "#ED3131" }}
            ></div>
            <div
              className="circle yellow"
              style={{ backgroundColor: "#EDCF31" }}
            ></div>
            <div
              className="circle green"
              style={{ backgroundColor: "#4CED31" }}
            ></div>
          </div>
          <div className="terminal-title">bash</div>
        </nav>
        <div className="row">
          <FontAwesomeIcon
            icon={faAngleRight}
            className="angle-right"
            style={{ color: "white", fontSize: "15px" }}
          />
          <Typist cursor={{ hideWhenDone: true }}>{command1}</Typist>
        </div>

        <Delay wait={2000}>
          <div className="row">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="angle-right"
              style={{ color: "white", fontSize: "15px" }}
            />
            <Typist cursor={{ hideWhenDone: true }}>{command2}</Typist>
          </div>
        </Delay>

        <Delay wait={4000}>
          <div className="row">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="angle-right"
              style={{ color: "white", fontSize: "15px" }}
            />
            <Typist cursor={{ hideWhenDone: true }}>
              Hey, My name is {name}
            </Typist>
          </div>
        </Delay>

        <Delay wait={6000}>
          <div className="row">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="angle-right"
              style={{ color: "white", fontSize: "15px" }}
            />
            <Typist cursor={{ hideWhenDone: true }}>
              {description_list[0]}
            </Typist>
          </div>
        </Delay>

        <Delay wait={12000}>
          <div className="row">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="angle-right"
              style={{ color: "white", fontSize: "15px" }}
            />
            <Typist cursor={{ hideWhenDone: true }}>
              {description_list[1]}
            </Typist>
          </div>
        </Delay>

        <Delay wait={17000}>
          <div className="row">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="angle-right"
              style={{ color: "white", fontSize: "15px" }}
            />
            <Typist cursor={{ hideWhenDone: true }}>
              {description_list[2]}
            </Typist>
          </div>
        </Delay>

        <Delay wait={20000}>
          <div className="row">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="angle-right"
              style={{ color: "white", fontSize: "15px" }}
            />
            Got your attention? (Yes / No): &nbsp;
            <Typist cursor={{ hideWhenDone: true }}>
              <Typist.Delay ms={900} />
              Yes
            </Typist>
          </div>
        </Delay>
      </div>
    )
  }
}

const TerminalFunc = ({ data }) => {
  return (
    <div>
      <Terminal data={data.edges[0].node.frontmatter} />
    </div>
  )
}

export default TerminalFunc
