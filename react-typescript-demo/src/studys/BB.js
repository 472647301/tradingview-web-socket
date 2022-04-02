/* eslint-disable */

/**
 * 详情：https://zlq4863947.gitbook.io/tradingview/creating-custom-studies
 */
export default function BB(s) {
  return {
    name: "myBB",
    metainfo: {
      _metainfoVersion: 52,
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
            transparency: 0,
            visible: true,
            color: "#FF6D00",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
            visible: true,
            color: "#2196F3",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
            visible: true,
            color: "#2196F3",
          },
        },
        filledAreasStyle: {
          fill_0: { color: "#2196F3", transparency: 95, visible: true },
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
      description: "myBB",
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
      id: "myBB@tv-basicstudies-1",
      scriptIdPart: "",
      name: "myBB",
      format: { type: "inherit" },
      description_localized: "布林带(Bollinger Bands)",
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e * t;
      }),
        (this.f_1 = function (e, t) {
          return e + t;
        }),
        (this.f_2 = function (e, t) {
          return e - t;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = s.Std.close(this._context),
            r = this._input(0),
            n = this._input(1),
            o = this._context.new_var(i),
            a = s.Std.sma(o, r, this._context),
            l = this._context.new_var(i),
            c = s.Std.stdev(l, r, this._context),
            h = this.f_0(n, c);
          return [a, this.f_1(a, h), this.f_2(a, h)];
        });
    },
  };
}
