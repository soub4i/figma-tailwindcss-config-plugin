figma.showUI(__html__);

const mapper = {
  fontName: "fontFamily",
  fontSize: "fontSize",
  textDecoration: "textDecoration",
  letterSpacing: "letterSpacing",
  lineHeight: "lineHeight"
};

figma.ui.onmessage = msg => {
  if (msg.type === "scan-ui") {
    let textStyle = {};

    for (const node of figma.currentPage.selection) {
      Object.keys(mapper).map(property => {
        if (node.type === "TEXT" && property in node) {
          textStyle[mapper[property]] = node[property];
        }
      });
    }
    figma.ui.postMessage(textStyle);
  }

  if (msg.type === "close-ui") {
    figma.closePlugin();
  }
};
