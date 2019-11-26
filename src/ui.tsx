import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.css";

import * as template from "./template";
interface IState {
  data: Object;
}

interface IProps {}
declare function require(path: string): any;

class App extends React.Component<IProps, IState> {
  textbox: HTMLInputElement;

  constructor(props) {
    super(props);
    this.state = { data: {} };
  }

  onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "close-ui" } }, "*");
  };

  componentDidMount() {
    parent.postMessage({ pluginMessage: { type: "scan-ui" } }, "*");

    window.onmessage = event => {
      let result = {
        colors: event.data.pluginMessage.colorStyle,
        ...event.data.pluginMessage.textStyle
      };

      this.setState({
        data: { extends: result, ...template }
      });
    };
  }

  render() {
    return (
      <div>
        <h2 className="title">Tailwindcss config Generator</h2>

        <div className="grid-container">
          <div className="grid-item">
            <div className="code">
              <h5>
                <b>
                  <a href="#you_stealer!_you-copied-my-code!">Copy</a>
                </b>
              </h5>

              <pre>{JSON.stringify(this.state.data, undefined, 2)}</pre>
            </div>
          </div>

          <div className="grid-item"></div>
        </div>

        <button id="create">Generate</button>
        <button onClick={this.onCancel}>Cancel</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-page"));
