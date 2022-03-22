/* eslint-disable */

/**
 * 详情：https://zlq4863947.gitbook.io/tradingview/creating-custom-studies
 */
export default function BB(n) {
  return {
    name: "Bollinger Bands",
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
            linewidth: 5,
            plottype: 0,
            trackPrice: false,
            transparency: 70,
            visible: true,
            color: "#FF0000",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 5,
            plottype: 0,
            trackPrice: false,
            transparency: 70,
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
            color: "#0000FF",
          },
        },
        precision: 4,
        filledAreasStyle: {
          fill_0: { color: "#000080", transparency: 90, visible: true },
        },
        inputs: { in_0: 20, in_1: 2 },
      },
      plots: [
        { id: "plot_0", type: "line" },
        { id: "plot_1", type: "line" },
        { id: "plot_2", type: "line" },
      ],
      styles: {
        plot_0: { title: "Median", histogramBase: 0, joinPoints: false },
        plot_1: { title: "Upper", histogramBase: 0, joinPoints: false },
        plot_2: { title: "Lower", histogramBase: 0, joinPoints: false },
      },
      description: "Bollinger Bands",
      shortDescription: "BB",
      is_price_study: true,
      filledAreas: [
        {
          id: "fill_0",
          objAId: "plot_1",
          objBId: "plot_2",
          type: "plot_plot",
          title: "Plots Background",
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 10000,
        },
        {
          id: "in_1",
          name: "mult",
          defval: 2,
          type: "float",
          min: 0.001,
          max: 50,
        },
      ],
      id: "Bollinger Bands@tv-basicstudies-2",
      scriptIdPart: "",
      name: "Bollinger Bands",
      description_localized: "布林带(Bollinger Bands)",
    },
    constructor: function () {
      this.f_0 = function (e, t) {
        return e * t;
      };

      this.f_1 = function (e, t) {
        return e + t;
      };

      this.f_2 = function (e, t) {
        return e - t;
      };

      this.main = function (e, t) {
        var i, o, r, s, a, l, c, u;
        return (
          (this._context = e),
          (this._input = t),
          (i = n.Std.close(this._context)),
          (o = this._input(0)),
          (r = this._input(1)),
          (s = this._context.new_var(i)),
          (a = n.Std.sma(s, o, this._context)),
          (l = this._context.new_var(i)),
          (c = n.Std.stdev(l, o, this._context)),
          (u = this.f_0(r, c)),
          [a, this.f_1(a, u), this.f_2(a, u)]
        );
      };
    },
  };
}
