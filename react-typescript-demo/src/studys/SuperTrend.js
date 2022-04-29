/* eslint-disable */

/**
 * 详情：https://zlq4863947.gitbook.io/tradingview/creating-custom-studies
 */
export default function SuperTrend(s) {
  return {
    name: "SuperTrend",
    metainfo: {
      _metainfoVersion: 39,
      isTVScript: false,
      isTVScriptStub: false,
      is_hidden_study: false,
      defaults: {
        // 自定义样式
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 3,
            plottype: 0,
            trackPrice: false,
            transparency: 35,
            visible: true,
            color: "#000080",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 3,
            plottype: "shape_arrow_up",
            trackPrice: false,
            location: "BelowBar",
            transparency: 35,
            visible: true,
            color: "#00FF00",
          },
          plot_3: {
            linestyle: 0,
            linewidth: 3,
            plottype: "shape_arrow_down",
            trackPrice: false,
            location: "AboveBar",
            transparency: 35,
            visible: true,
            color: "#FF0000",
          },
        },
        precision: 4,
        palettes: {
          palette_0: {
            colors: {
              0: { color: "#008000", width: 3, style: 0 },
              1: { color: "#800000", width: 3, style: 0 },
            },
          },
        },
        inputs: { in_0: 10, in_1: 3 },
      },
      plots: [
        { id: "plot_0", type: "line" },
        {
          id: "plot_1",
          palette: "palette_0",
          target: "plot_0",
          type: "colorer",
        },
        { id: "plot_2", type: "shapes" },
        { id: "plot_3", type: "shapes" },
      ],
      styles: {
        plot_0: {
          title: "SuperTrend",
          histogramBase: 0,
          joinPoints: false,
          isHidden: false,
        },
        plot_2: {
          title: "Up Arrow",
          histogramBase: 0,
          joinPoints: false,
          isHidden: false,
        },
        plot_3: {
          title: "Down Arrow",
          histogramBase: 0,
          joinPoints: false,
          isHidden: false,
        },
      },
      description: "SuperTrend",
      shortDescription: "SuperTrend",
      is_price_study: true,
      palettes: {
        palette_0: {
          colors: { 0: { name: "Color 0" }, 1: { name: "Color 1" } },
          valToIndex: { 0: 0, 1: 1 },
        },
      },
      inputs: [
        {
          id: "in_0",
          name: "Length",
          defval: 10,
          type: "integer",
          min: 1,
          max: 100,
        },
        {
          id: "in_1",
          name: "Factor",
          defval: 3,
          type: "float",
          min: 1,
          max: 100,
        },
      ],
      id: "SuperTrend@tv-basicstudies-2",
      scriptIdPart: "",
      name: "SuperTrend",
      isCustomIndicator: true,
      description_localized: "超级趋势",
    },
    constructor: function () {
      this.f_0 = function () {
        var e,
          t,
          i = this._input(0),
          n = this._input(1),
          o = s.Std.atr(i, this._context);
        return (
          (i = s.Std.hl2(this._context) + o * n),
          (o = s.Std.hl2(this._context) - o * n),
          (e = this._context.new_var(s.Std.close(this._context))),
          (n = this._context.new_var()),
          (t = s.Std.max(o, n.get(1))),
          n.set(s.Std.gt(e.get(1), n.get(1)) ? t : o),
          (o = this._context.new_var()),
          (t = s.Std.min(i, o.get(1))),
          o.set(s.Std.lt(e.get(1), o.get(1)) ? t : i),
          (i = this._context.new_var()),
          (e = s.Std.nz(i.get(1), 1)),
          (e = s.Std.lt(s.Std.close(this._context), n.get(1)) ? -1 : e),
          i.set(s.Std.gt(s.Std.close(this._context), o.get(1)) ? 1 : e),
          [
            (n = s.Std.eq(i.get(0), 1) ? n.get(0) : o.get(0)),
            s.Std.eq(i.get(0), 1) ? 0 : 1,
            1 === i.get(0) && -1 === i.get(1),
            -1 === i.get(0) && 1 === i.get(1),
          ]
        );
      };
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = this.f_0();
        return [i[0], i[1], i[2], i[3]];
      };
    },
  };
}
