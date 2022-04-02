/* eslint-disable */

/**
 * 详情：https://zlq4863947.gitbook.io/tradingview/creating-custom-studies
 */
export default function EMA(n) {
  return {
    name: "myEMA",
    metainfo: {
      _metainfoVersion: 27,
      isTVScript: false,
      isTVScriptStub: false,
      is_hidden_study: false,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 35,
            visible: true,
            color: "#FF0000",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 35,
            visible: true,
            color: "#008000",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 4,
            plottype: 3,
            trackPrice: false,
            transparency: 35,
            visible: true,
            color: "#000080",
          },
        },
        precision: 4,
        inputs: { in_0: 9, in_1: 26 },
      },
      plots: [
        { id: "plot_0", type: "line" },
        { id: "plot_1", type: "line" },
        { id: "plot_2", type: "line" },
      ],
      styles: {
        plot_0: { title: "Short", histogramBase: 0, joinPoints: false },
        plot_1: { title: "Long", histogramBase: 0, joinPoints: false },
        plot_2: { title: "Crosses", histogramBase: 0, joinPoints: false },
      },
      description: "myEMA",
      shortDescription: "EMA Cross",
      is_price_study: true,
      inputs: [
        {
          id: "in_0",
          name: "Short",
          defval: 9,
          type: "integer",
          min: 1,
          max: 2000,
        },
        {
          id: "in_1",
          name: "Long",
          defval: 26,
          type: "integer",
          min: 1,
          max: 2000,
        },
      ],
      id: "myEMA@tv-basicstudies-1",
      scriptIdPart: "",
      name: "myEMA",
      description_localized: "EMA交叉",
    },
    constructor: function () {
      this.f_0 = function (e, t) {
        return e ? t : n.Std.na();
      };
      this.main = function (e, t) {
        var i, o, r, s, a, l, c, u, h, d;
        return (
          (this._context = e),
          (this._input = t),
          (i = this._input(0)),
          (o = this._input(1)),
          (r = n.Std.close(this._context)),
          (s = this._context.new_var(r)),
          (a = n.Std.ema(s, i, this._context)),
          (l = this._context.new_var(r)),
          (u = a),
          (h = c = n.Std.ema(l, o, this._context)),
          (d = n.Std.cross(a, c, this._context)),
          [u, h, this.f_0(d, a)]
        );
      };
    },
  };
}
