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
    let colorStyle = { colors: {} };

    const parseRGBA = (color: RGBA | RGB) => {
      if (!color) {
        return;
      }

      let hex =
        (color.r | (1 << 8)).toString(16).slice(1) +
        (color.g | (1 << 8)).toString(16).slice(1) +
        (color.b | (1 << 8)).toString(16).slice(1);

      let alpha: any = 1;
      if (color.r) {
        alpha = 1;
      }

      alpha = ((alpha * 255) | (1 << 8)).toString(16).slice(1);

      return hex + 1;
    };

    const walker = (node: BaseStyle) => {
      Object.keys(mapper).map(property => {
        if (property in node) {
          if (node.type === "TEXT") {
            if (property === "fontName") {
              textStyle[mapper[property]] = {}[
                node[property].name
              ] = (node as TextStyle).fontName.family;
            } else {
              textStyle[mapper[property]] = {}[
                node[property].name
              ] = (node as TextStyle)[property];
            }
          } else if (node.type === "PAINT") {
            if ((node as PaintStyle).paints.length > 0) {
              for (let paint of (node as PaintStyle).paints) {
                if (paint.type === "SOLID") {
                  colorStyle.colors = {}[node.name] = parseRGBA(
                    (paint as SolidPaint).color
                  );
                }
              }
            }
          }
        }
      });
    };

    for (const node of figma.currentPage.selection) {
      walker(node as any);

      if ((node as any).children) (node as any).children.forEach(walker);
    }

    console.log(textStyle);

    figma.ui.postMessage({ textStyle, colorStyle });
  }

  if (msg.type === "close-ui") {
    figma.closePlugin();
  }
};
