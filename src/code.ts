figma.showUI(__html__);
figma.ui.resize(750, 575);

const mapper = {
  fontName: "fontFamily",
  fontSize: "fontSize",
  textDecoration: "textDecoration",
  letterSpacing: "letterSpacing",
  lineHeight: "lineHeight",
  effects: "effects"
};

figma.ui.onmessage = async msg => {
  if (msg.type === "scan-ui") {
    let textStyle = {},
      colorStyle = {},
      effectStyle = {};

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

      return hex + alpha;
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
        textStyle[mapper[property]][`text-${_value}`] = `${_value}px'`;
      } else if (property === "letterSpacing") {
        let _value: LetterSpacing = (node as TextStyle)[property];
        textStyle[mapper[property]][`tracking-${_value.value}`] = `${
          _value.value
        }${_value.unit === "PERCENT" ? "%" : "px"}`;
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
          _value = effects[0] as ShadowEffect;
        } else {
          _value = effects[0] as BlurEffect;
        }
        effectStyle[`shadow-${i}`] = `${
          _value.type === "INNER_SHADOW" ? "inset" : ""
        } ${_value.offset.x}px ${_value.offset.y}px ${_value.radius}px  rgba(${
          _value.color.r
        }, ${_value.color.g}, ${_value.color.b}, ${_value.color.a})`;
      }
    };

    const handlePaint = node => {
      let paints: ReadonlyArray<Paint> = (node as PaintStyle).paints;

      for (let i = 0; i < paints.length; i++) {
        if (paints[i].type === "SOLID") {
          let _value: SolidPaint = paints[0] as SolidPaint;
          colorStyle[`color-${i}`] = "#" + parseRGBA(_value.color);
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
