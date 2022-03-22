/* eslint-disable */

/**
 * 详情：https://zlq4863947.gitbook.io/tradingview/creating-custom-studies
 */
export default function MACD(n) {
  return {
    name: "Moving Average Convergence/Divergence",
    metainfo: {
      _metainfoVersion: 27,
      isTVScript: false,
      isTVScriptStub: false,
      is_hidden_study: false,
      defaults: {
        // 自定义样式
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 1,
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
            color: "#0000FF",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 35,
            visible: true,
            color: "#FF0000",
          },
        },
        precision: 4,
        inputs: { in_0: 12, in_1: 26, in_3: "close", in_2: 9 },
      },
      plots: [
        { id: "plot_0", type: "line" },
        { id: "plot_1", type: "line" },
        { id: "plot_2", type: "line" },
      ],
      styles: {
        plot_0: { title: "Histogram", histogramBase: 0, joinPoints: false },
        plot_1: { title: "MACD", histogramBase: 0, joinPoints: false },
        plot_2: { title: "Signal", histogramBase: 0, joinPoints: false },
      },
      description: "MACD",
      shortDescription: "MACD",
      is_price_study: false,
      inputs: [
        {
          id: "in_0",
          name: "fastLength",
          defval: 12,
          type: "integer",
          min: 1,
          max: 2000,
        },
        {
          id: "in_1",
          name: "slowLength",
          defval: 26,
          type: "integer",
          min: 1,
          max: 2000,
        },
        {
          id: "in_3",
          name: "Source",
          defval: "close",
          type: "source",
          options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"],
        },
        {
          id: "in_2",
          name: "signalLength",
          defval: 9,
          type: "integer",
          min: 1,
          max: 50,
        },
      ],
      id: "Moving Average Convergence/Divergence@tv-basicstudies-2",
      scriptIdPart: "",
      name: "MACD",
      description_localized: "MACD",
    },
    constructor: function () {
      this.f_0 = function (e, t) {
        return e - t;
      };
      this.main = function (e, t) {
        var i, o, r, s, a, l, c, u, h, d, p;
        return (
          (this._context = e),
          (this._input = t),
          (i = n.Std[this._input(2)](this._context)),
          (o = this._input(0)),
          (r = this._input(1)),
          (s = this._input(3)),
          (a = this._context.new_var(i)),
          (l = n.Std.ema(a, o, this._context)),
          (c = this._context.new_var(i)),
          (u = n.Std.ema(c, r, this._context)),
          (h = this.f_0(l, u)),
          (d = this._context.new_var(h)),
          (p = n.Std.ema(d, s, this._context)),
          [this.f_0(h, p), h, p]
        );
      };
    },
  };
}
