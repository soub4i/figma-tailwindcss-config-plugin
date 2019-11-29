import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.css";

import * as template from "./template";
interface IState {
    data: Object;
    isNodesSelected: boolean;
    // copySuccess: string;
}

interface IProps {}

class App extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = { data: {}, isNodesSelected: true };
    }

    onCancel = () => {
        parent.postMessage({ pluginMessage: { type: "close-ui" } }, "*");
    };

    componentDidMount() {
        parent.postMessage({ pluginMessage: { type: "scan-ui" } }, "*");

        window.onmessage = event => {
            if (event.data.pluginMessage.isNodesSelected === true) {
                const result = {
                    ...template
                };
                result.theme.extend = {
                    colors: event.data.pluginMessage.colorStyle,
                    boxShadow: event.data.pluginMessage.effectStyle,
                    ...event.data.pluginMessage.textStyle
                };
            }
        };
    }

    // copyToClipboard = e => {
    //     var textField = document.getElementById("data");
    //     var range = document.createRange();
    //     var selection = window.getSelection();

    //     range.selectNodeContents(textField);
    //     selection.removeAllRanges();
    //     selection.addRange(range);

    //     document.execCommand("copy");

    //     this.setState({ copySuccess: "Copied!" });
    // };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="column">
                        <h2 className="title">Tailwindcss config Generator</h2>

                        {this.state.isNodesSelected === false ? (
                            <br /> >
                            (
                                <h4 className="text-danger">
                                    Select at least one node before you run the
                                    plugin
                                </h4>
                            )
                        ) : (
                            <span></span>
                        )}

                        <a className="button button-copy" href="#">
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
                        <button className="button button-generate">
                            Generate
                        </button>
                        <button
                            className="button button-cancel"
                            onClick={this.onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app"));
