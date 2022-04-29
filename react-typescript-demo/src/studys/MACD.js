/* eslint-disable */

/**
 * 详情：https://zlq4863947.gitbook.io/tradingview/creating-custom-studies
 */
export default function MACD(s) {
  return {
    name: "Moving Average Convergence/Divergence",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: false,
      isTVScriptStub: false,
      is_hidden_study: false,
      defaults: {
        // 自定义样式
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 5,
            trackPrice: false,
            transparency: 35,
            visible: true,
            color: "#FF5252",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 35,
            visible: true,
            color: "#2196F3",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 35,
            visible: true,
            color: "#FF6D00",
          },
        },
        precision: 4,
        inputs: { in_0: 12, in_1: 26, in_3: "close", in_2: 9 },
        palettes: {
          palette_0: {
            colors: {
              0: { color: "#26A69A", width: 1, style: 0 },
              1: { color: "#B2DFDB", width: 1, style: 0 },
              2: { color: "#FFCDD2", width: 1, style: 0 },
              3: { color: "#FF5252", width: 1, style: 0 },
            },
          },
        },
      },
      plots: [
        { id: "plot_0", type: "line" },
        { id: "plot_1", type: "line" },
        { id: "plot_2", type: "line" },
        {
          id: "plot_3",
          palette: "palette_0",
          target: "plot_0",
          type: "colorer",
        },
      ],
      styles: {
        plot_0: { title: "Histogram", histogramBase: 0, joinPoints: false },
        plot_1: { title: "MACD", histogramBase: 0, joinPoints: false },
        plot_2: { title: "Signal", histogramBase: 0, joinPoints: false },
      },
      palettes: {
        palette_0: {
          colors: {
            0: { name: "Color 0" },
            1: { name: "Color 1" },
            2: { name: "Color 2" },
            3: { name: "Color 3" },
          },
        },
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
      format: { type: "inherit" },
    },
    constructor: function () {
      this.f_0 = function (e, t) {
        return e - t;
      };
      this.f_1 = function (e) {
        var t = e > 0 ? 1 : 3,
          i = s.Std.change(this._context.new_var(e));
        return t - (s.Std.le(i, 0) ? 0 : 1);
      };
      this.main = function (e, t) {
        this._context = e;
        this._input = t;
        var i = s.Std[this._input(2)](this._context);
        var r = this._input(0);
        var n = this._input(1);
        var o = this._input(3);
        this._context.setMinimumAdditionalDepth(Math.max(r, n) + o);
        var a = this._context.new_var(i);
        var l = s.Std.ema(a, r, this._context);
        var c = this._context.new_var(i);
        var h = s.Std.ema(c, n, this._context);
        var u = this.f_0(l, h);
        var d = this._context.new_var(u);
        var p = s.Std.ema(d, o, this._context);
        var _ = this.f_0(u, p);
        return [_, u, p, this.f_1(_)];
      };
    },
  };
}
