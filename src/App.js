import React, { Component } from "react"
import logo from "./logo.svg"
import * as jsondiffpatch from "jsondiffpatch"
import "jsondiffpatch/dist/formatters-styles/html.css"
import axios from "axios"
import { Controlled as CodeMirror } from "react-codemirror2"
import "codemirror/lib/codemirror.css"
import "codemirror/mode/javascript/javascript"
import "./App.css"

axios.defaults.baseURL = "https://testcourseapidev1.xiaoma.cn"

const diff = jsondiffpatch.create({})

class App extends Component {
  leftRef = React.createRef()
  state = {
    leftJson: "",
    rightJson: "",
    left:
      "https://courseapi.xiaoma.cn/api/community/compose/get-all-compose-list?type=hot&page=1&pageSize=20",
    right: ""
  }

  handleButtonClick = id => async event => {
    const { data } = await axios.get(document.getElementById(id).value)
    this.setState(
      {
        [`${id}Json`]: data
      },
      () => {
        if (this.state.left && this.state.right) {
          const delta = diff.diff(this.state.leftJson, this.state.rightJson)
          document.getElementById(
            "visual"
          ).innerHTML = jsondiffpatch.formatters.html.format(
            delta,
            this.state.leftJson
          )
        }
      }
    )
  }

  handle = id => e => {
    this.setState({
      [id]: e.target.value
    })
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col" style={{ width: "50%" }}>
              <h2>Left</h2>
              <div className="input-group mb-3">
                <input
                  value={this.state.left}
                  onChange={this.handle("left")}
                  id="left"
                  type="text"
                  className="form-control"
                  placeholder="Recipient's username"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={this.handleButtonClick("left")}
                    type="button"
                  >
                    Button
                  </button>
                </div>
              </div>
              <div
                className="json-output"
                style={{ border: "solid #ccc 1px " }}
              >
                <CodeMirror
                  ref={this.leftRef}
                  options={{
                    mode: "javascript",
                    json: true
                  }}
                  aria-label="With CodeMirror"
                  value={JSON.stringify(this.state.leftJson, null, 2)}
                />
              </div>
            </div>
            <div className="col" style={{ width: "50%" }}>
              <h2>Right</h2>
              <div className="input-group mb-3">
                <input
                  id="right"
                  onChange={this.handle("right")}
                  value={this.state.right}
                  type="text"
                  className="form-control"
                  placeholder="Recipient's username"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={this.handleButtonClick("right")}
                  >
                    Button
                  </button>
                </div>
              </div>
              <div
                className="json-output"
                style={{ border: "solid #ccc 1px " }}
              >
                <CodeMirror
                  options={{
                    mode: "javascript",
                    json: true
                  }}
                  aria-label="With CodeMirror"
                  value={JSON.stringify(this.state.rightJson, null, 2)}
                />
              </div>
            </div>
          </div>
        </div>
        <hr style={{ borderWidth: 4 }} />
        <div className="container" id="visual" style={{ marginTop: 10 }} />
      </div>
    )
  }
}

export default App
