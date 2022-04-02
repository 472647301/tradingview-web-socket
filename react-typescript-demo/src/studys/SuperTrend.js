/* eslint-disable */

/**
 * 详情：https://zlq4863947.gitbook.io/tradingview/creating-custom-studies
 */
export default function SuperTrend(s) {
  return {
    name: "myST",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: false,
      isTVScriptStub: false,
      is_hidden_study: false,
      defaults: {
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
      description: "myST",
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
      id: "myST@tv-basicstudies-1",
      scriptIdPart: "",
      name: "myST",
      isCustomIndicator: true,
      format: { type: "inherit" },
      description_localized: "超级趋势",
    },
    constructor: function () {
      (this.f_0 = function () {
        var e = this._input(0),
          t = this._input(1),
          i = s.Std.atr(e, this._context),
          r =
            ((e = s.Std.hl2(this._context) + i * t),
            (i = s.Std.hl2(this._context) - i * t),
            this._context.new_var(s.Std.close(this._context))),
          n = ((t = this._context.new_var()), s.Std.max(i, t.get(1)));
        return (
          t.set(s.Std.gt(r.get(1), t.get(1)) ? n : i),
          (i = this._context.new_var()),
          (n = s.Std.min(e, i.get(1))),
          i.set(s.Std.lt(r.get(1), i.get(1)) ? n : e),
          (e = this._context.new_var()),
          (r = s.Std.nz(e.get(1), 1)),
          (r = s.Std.lt(s.Std.close(this._context), t.get(1)) ? -1 : r),
          e.set(s.Std.gt(s.Std.close(this._context), i.get(1)) ? 1 : r),
          [
            (t = s.Std.eq(e.get(0), 1) ? t.get(0) : i.get(0)),
            s.Std.eq(e.get(0), 1) ? 0 : 1,
            1 === e.get(0) && -1 === e.get(1) ? 1 : NaN,
            -1 === e.get(0) && 1 === e.get(1) ? 1 : NaN,
          ]
        );
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this.f_0();
          return [i[0], i[1], i[2], i[3]];
        });
    },
  };
}
