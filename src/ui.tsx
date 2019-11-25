import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.css";

let textStyle = {};

declare function require(path: string): any;

onmessage = event => {
  console.log(event.data.pluginMessage);

  textStyle = event.data.pluginMessage;
};

class App extends React.Component {
  textbox: HTMLInputElement;

  onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "close-ui" } }, "*");
  };

  render() {
    (() => {
      parent.postMessage({ pluginMessage: { type: "scan-ui" } }, "*");
    })();

    return (
      <div>
        <img src={require("./logo.svg")} />
        <h2>Tailwindcss.config.js Generator</h2>

        <div className="grid-container">
          <div className="grid-item">
            <div className="code">
              <h5>
                <b>
                  <i>tailwind.config.js</i>
                </b>
              </h5>
              <h5>
                <b>
                  <i>
                    <a href="#you_stealer!_you-copied-my-code!">Copy</a>
                  </i>
                </b>
              </h5>

              <pre>{JSON.stringify(textStyle, undefined, 2)}</pre>
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
