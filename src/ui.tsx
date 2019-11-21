import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.css";

var data = require("./template.js");

declare function require(path: string): any;

class App extends React.Component {
  textbox: HTMLInputElement;

  countRef = (element: HTMLInputElement) => {
    if (element) element.value = "5";
    this.textbox = element;
  };

  onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  render() {
    return (
      <div>
        <img src={require("./logo.svg")} />
        <h2>Tailwindcss.config.js Generator</h2>

        <div className="block-50">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Necessitatibus, impedit, voluptas saepe sunt accusantium doloribus
            tempore quisquam aut eaque dicta quidem? Quam optio esse voluptatem
            assumenda, totam molestias soluta architecto.
          </p>
        </div>
        <div className="block-50">{data}</div>

        <button id="create">Generate</button>
        <button onClick={this.onCancel}>Cancel</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-page"));
