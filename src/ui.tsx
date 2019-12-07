import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.css";

import * as template from "./template";
interface IState {
  data: Object;
  isNodesSelected: boolean;
  isGenerated: boolean;
}

interface IProps {}

class App extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = { data: {}, isNodesSelected: true, isGenerated: false };
  }

  onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "close-ui" } }, "*");
  };

  onGenerate = () => {
      if (this.state.isGenerated)
      {
         return
      }

      this.setState({
        data: this.generateDataWithTemplate(),
        isNodesSelected: true,
        isGenerated: true
      });
  };

  componentDidMount() {
    parent.postMessage({ pluginMessage: { type: "scan-ui" } }, "*");

    window.onmessage = event => {
       if (event.data.pluginMessage.isNodesSelected !== true) {
          this.setState({
            isNodesSelected: false
          });

          return
       }

      this.setState({
        data: this.generateExtendObject(event),
        isNodesSelected: true
      });
    };
  }

  generateDataWithTemplate()
  {
     const result = {
       ...template
     };

     result.theme = Object.assign(result.theme, this.state.data)

     return result
  }

  generateExtendObject(event) {
    return {
      extend: {
        colors: event.data.pluginMessage.colorStyle,
        boxShadow: event.data.pluginMessage.effectStyle,
        ...event.data.pluginMessage.textStyle
      }
    }
  }

  copyToClipboard = e => {
    var textField = document.getElementById("code");
    var range = document.createRange();
    var selection = window.getSelection();

    range.selectNodeContents(textField);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("copy");
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="column">
            <h2 className="title">Tailwindcss config Generator</h2>
            {this.state.isNodesSelected === false ? (
              <h4 className="text-danger">
                <br />
                Select at least one node before you run the plugin
              </h4>
            ) : (
              <span></span>
            )}
            {document.queryCommandSupported("copy") && (
              <button
                className="button button-copy"
                onClick={this.copyToClipboard}
              >
                Copy
              </button>
            )}
          </div>
        </div>

        <div className="row">
          <div className="column">
            <pre className="code" id="code">
              {JSON.stringify(this.state.data, undefined, 2)}
            </pre>
          </div>
        </div>

        <div className="row">
          <div className="column">
            <button className="button button-generate" onClick={this.onGenerate}>
              Generate
            </button>
            <button className="button button-cancel" onClick={this.onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
