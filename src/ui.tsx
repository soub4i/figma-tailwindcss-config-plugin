import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.css";

const mapper = {
  fontName: "fontFamily",
  fontSize: "fontSize",
  textDecoration: "textDecoration",
  letterSpacing: "letterSpacing",
  lineHeight: "lineHeight"
};

const textStyle = {};

declare function require(path: string): any;

class App extends React.Component {
  textbox: HTMLInputElement;

  onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  render() {
    (() => {
      for (const node of figma.currentPage.selection) {
        Object.keys(mapper).map(property => {
          if (node.type === "TEXT" && property in node) {
            textStyle[mapper[property]] = node[property];
          }
        });
      }
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
                  <i>HTML</i>
                </b>
              </h5>
              <h5>
                <b>
                  <i>
                    <a href="#you_stealer!_you-copied-my-code!">Copy</a>
                  </i>
                </b>
              </h5>

              <xmp>{JSON.stringify(textStyle, undefined, 2)}</xmp>
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
