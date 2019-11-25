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
              let _value: FontName = (node as TextStyle)[property];

              textStyle[mapper[property]][
                `font-${_value.family.toLocaleLowerCase()}`
              ] = _value.family;
            } else if (property === "fontSize") {
              let _value: number = (node as TextStyle)[property];
              textStyle[mapper[property]][`text-${_value}`] = `${_value}'px'`;
            } else if (property === "letterSpacing") {
              let _value: LetterSpacing = (node as TextStyle)[property];
              textStyle[mapper[property]][`tracking-${_value.value}`] = `${
                _value.value
              }${_value.unit === "PERCENT" ? "%" : "px"}`;
            } else if (property === "textDecoration") {
              let _value: TextDecoration = (node as TextStyle)[property];
              textStyle[mapper[property]][
                `${_value.toLocaleLowerCase()}`
              ] = `${_value.toLocaleLowerCase()}`;
            } else if (property === "lineHeight") {
              let _value: any = (node as TextStyle)[property];
              if (_value.unit && _value.unit === "AUTO") {
                textStyle[mapper[property]][
                  `leading-normal`
                ] = `${_value.unit}`;
              } else {
                textStyle[mapper[property]][`leading-${_value.value}`] = `${
                  _value.value
                }${_value.unit === "PERCENT" ? "%" : "px"}`;
              }
            } else {
              textStyle[mapper[property]][
                node[property].name
              ] = (node as TextStyle)[property];
            }
          } else if (node.type === "PAINT") {
            let paints: ReadonlyArray<Paint> = (node as PaintStyle).paints;

            for (let i = 0; i < paints.length; i++) {
              if (paints[0].type === "SOLID") {
                let _value: SolidPaint = paints[0] as SolidPaint;
                colorStyle.colors[`color-${i}`] = parseRGBA(_value.color);
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

    figma.ui.postMessage({ textStyle, colorStyle });
  }

  if (msg.type === "close-ui") {
    figma.closePlugin();
  }
};
