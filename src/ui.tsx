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
            <div className="container">
                <div className="row">
                    <div className="column">
                        <h2 className="title">Tailwindcss config Generator</h2>
                        <a
                            className="button button-copy"
                            href="#you_stealer!_you-copied-my-code!"
                        >
                            Copy
                        </a>
                    </div>
                </div>

                <div className="row">
                    <div className="column">
                        <pre className="code">
                            {JSON.stringify(this.state.data, undefined, 2)}
                        </pre>
                    </div>
                </div>

                <div className="row">
                    <div className="column">
                        <button className="button button-generate">Generate</button>
                        <button className="button button-cancel" onClick={this.onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("react-page"));
