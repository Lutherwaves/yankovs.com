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
        }, 9000)
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
                    <Typist avgTypingDelay={30} cursor={{ hideWhenDone: true }}>{command1}</Typist>
                </div>

                <Delay wait={500}>
                    <div className="row">
                        <FontAwesomeIcon
                            icon={faAngleRight}
                            className="angle-right"
                            style={{ color: "white", fontSize: "15px" }}
                        />
                        <Typist avgTypingDelay={30} cursor={{ hideWhenDone: true }}>{command2}</Typist>
                    </div>
                </Delay>

                <Delay wait={1200}>
                    <div className="row">
                        <FontAwesomeIcon
                            icon={faAngleRight}
                            className="angle-right"
                            style={{ color: "white", fontSize: "15px" }}
                        />
                        <Typist avgTypingDelay={30} cursor={{ hideWhenDone: true }}>
                            Hey, my name is {name}
                        </Typist>
                    </div>
                </Delay>

                <Delay wait={2000}>
                    <div className="row">
                        <FontAwesomeIcon
                            icon={faAngleRight}
                            className="angle-right"
                            style={{ color: "white", fontSize: "15px" }}
                        />
                        <Typist avgTypingDelay={30} cursor={{ hideWhenDone: true }}>
                            {description_list[0]}
                        </Typist>
                    </div>
                </Delay>

                <Delay wait={3500}>
                    <div className="row">
                        <FontAwesomeIcon
                            icon={faAngleRight}
                            className="angle-right"
                            style={{ color: "white", fontSize: "15px" }}
                        />
                        <Typist avgTypingDelay={30} cursor={{ hideWhenDone: true }}>
                            {description_list[1]}
                        </Typist>
                    </div>
                </Delay>

                <Delay wait={5000}>
                    <div className="row">
                        <FontAwesomeIcon
                            icon={faAngleRight}
                            className="angle-right"
                            style={{ color: "white", fontSize: "15px" }}
                        />
                        <Typist avgTypingDelay={30} cursor={{ hideWhenDone: true }}>
                            {description_list[2]}
                        </Typist>
                    </div>
                </Delay>


                <Delay wait={6500}>
                    <div className="row">
                        <FontAwesomeIcon
                            icon={faAngleRight}
                            className="angle-right"
                            style={{ color: "white", fontSize: "15px" }}
                        />
                        Shall we? (Yes / No): &nbsp;
                        <Typist avgTypingDelay={30} cursor={{ hideWhenDone: true }}>
                            <Typist.Delay ms={600} />
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
