import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.css";

interface IState {
  data: Object;
}

interface IProps {}
declare function require(path: string): any;

class App extends React.Component<IProps, IState> {
  textbox: HTMLInputElement;

  constructor(props) {
    super(props);
    this.setState({ data: {} });
  }

  onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "close-ui" } }, "*");
  };

  render() {
    (() => {
      window.onmessage = event => {
        console.log(event.data.pluginMessage);

        let result = {
          colors: event.data.pluginMessage.colorStyle,
          ...event.data.pluginMessage.textStyle
        };

        this.setState({
          data: { extends: result }
        });
      };

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
