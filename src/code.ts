figma.showUI(__html__);
figma.ui.resize(750, 575);

interface Color {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a?: number;
}

const mapper = {
  fontName: "fontFamily",
  fontSize: "fontSize",
  textDecoration: "textDecoration",
  letterSpacing: "letterSpacing",
  lineHeight: "lineHeight"
};

figma.ui.onmessage = async msg => {
  if (msg.type === "scan-ui") {
    let textStyle = {},
      colorStyle = {},
      effectStyle = {};

    const parseRGBA = (color: Color) => {
      let r = (+color.r).toString(16),
        g = (+color.g).toString(16),
        b = (+color.b).toString(16),
        a =
          color.a !== undefined
            ? Math.round(+color.a * 255).toString(16)
            : Math.round(1 * 255).toString(16);

      if (r.length == 1) r = "0" + r;
      if (g.length == 1) g = "0" + g;
      if (b.length == 1) b = "0" + b;
      if (a.length == 1) a = "0" + a;

      return "#" + r + g + b + a;
    };

    const handleText = (property, node) => {
      textStyle[mapper[property]] = textStyle[mapper[property]] || {};

      if (property === "fontName") {
        let _value: FontName = (node as TextStyle)[property];

        if (_value.family) {
          Array.isArray(textStyle[mapper[property]])
            ? textStyle[mapper[property]]["default"].push(_value.family)
            : (textStyle[mapper[property]]["default"] = [_value.family]);
        }
      } else if (property === "fontSize") {
        let _value: number = (node as TextStyle)[property];
        textStyle[mapper[property]][
          `text-${_value.toFixed(0)}`
        ] = `${_value.toFixed(1)}px'`;
      } else if (property === "letterSpacing") {
        let _value: LetterSpacing = (node as TextStyle)[property];
        textStyle[mapper[property]][
          `tracking-${_value.value.toFixed(0)}`
        ] = `${_value.value.toFixed(2)}${
          _value.unit === "PERCENT" ? "%" : "px"
        }`;
      } else if (property === "textDecoration") {
        if (typeof (node as TextStyle)[property] !== "symbol") {
          let _value: TextDecoration = (node as TextStyle)[property];
          textStyle[mapper[property]][
            `${_value.toLocaleLowerCase()}`
          ] = `${_value.toLocaleLowerCase()}`;
        }
      } else if (property === "lineHeight") {
        let _value: any = (node as TextStyle)[property];
        if (_value.unit && _value.unit === "AUTO") {
          textStyle[mapper[property]][`leading-normal`] = `${_value.unit}`;
        } else {
          textStyle[mapper[property]][`leading-${_value.value}`] = `${
            _value.value
          }${_value.unit === "PERCENT" ? "%" : "px"}`;
        }
      } else {
        textStyle[mapper[property]][node[property].name] = (node as TextStyle)[
          property
        ];
      }
    };

    const handleEffect = node => {
      let effects: ReadonlyArray<Effect> = (node as EffectStyle).effects;

      for (let i = 0; i < effects.length; i++) {
        let _value: any;
        if (
          effects[i].type === "DROP_SHADOW" ||
          effects[i].type === "INNER_SHADOW"
        ) {
          _value = effects[i] as ShadowEffect;
        } else {
          _value = effects[i] as BlurEffect;
        }
        effectStyle[`shadow-${i + 1}`] = `${
          _value.type === "INNER_SHADOW" ? "inset" : ""
        } ${_value.offset.x.toFixed(0)}px ${_value.offset.y.toFixed(
          0
        )}px ${_value.radius.toFixed(0)}px  rgba(${_value.color.r}, ${
          _value.color.g
        }, ${_value.color.b}, ${_value.color.a.toFixed(2)})`;
      }
    };

    const handlePaint = node => {
      let paints: ReadonlyArray<Paint> = (node as PaintStyle).paints;

      for (let i = 0; i < paints.length; i++) {
        if (paints[i].type === "SOLID") {
          let _value: SolidPaint = paints[i] as SolidPaint;
          colorStyle[`color-${i + 1}`] = "#" + parseRGBA(_value.color);
        }
      }
    };

    const walker = (node: any) => {
      try {
        Object.keys(mapper).map(property => {
          if (property in node) {
            switch (node.type) {
              case "TEXT":
                handleText(property, node);

                break;
              case "EFFECT":
              case "FRAME":
              case "RECTANGLE":
              case "ELLIPSE":
              case "GROUP":
              case "COMPONENT":
              case "INSTANCE":
              case "LINE":
              case "POLYGON":
              case "STAR":
              case "TEXT":
              case "VECTOR":
                handleEffect(node);

                break;
              case "PAINT":
                handlePaint(node);

                break;
              default:
                console.log(node);
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (
      figma.currentPage &&
      figma.currentPage.selection &&
      figma.currentPage.selection.length > 0
    ) {
      for (const node of figma.currentPage.selection) {
        walker(node as any);

        if (node["children"] && Array.isArray(node["children"])) {
          node["children"].forEach(walker);
        }
      }

      figma.ui.postMessage({
        textStyle,
        colorStyle,
        effectStyle,
        ...{ isNodesSelected: true }
      });
    } else {
      figma.ui.postMessage({ isNodesSelected: false });
    }
  }

  if (msg.type === "close-ui") {
    figma.closePlugin();
  }
};
