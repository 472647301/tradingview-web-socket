import { defineComponent, ref, onMounted } from "vue";
import { apiGet } from "./api";
import KLineHeader from "./components/KLineHeader";
import KLineWidget from "./components/KLineWidget";
import { ws } from "./utils/socket";

export default defineComponent({
  name: "App",
  setup() {
    const symbol = ref("btcusdt");
    const symbols = ref<Array<IApiSymbols>>([]);

    const onClick = (name: string) => {
      symbol.value = name;
      // 暂时没搞明白defineComponent组件，先用event事件实现
      ws.evt.emit("onChangeSymbol", name);
    };

    const fetchSymbolList = () => {
      apiGet<IApiSymbols[]>("public_symbols").then((res) => {
        if (!res || !res.data) {
          return;
        }
        symbols.value = res.data;
      });
    };

    onMounted(() => {
      fetchSymbolList();
      ws.initWebSocket();
    });

    return () => (
      <div class="box">
        <div class="left-box">
          <KLineHeader
            name={symbol.value}
            symbols={symbols.value}
            onClick={onClick}
          />
        </div>
        <div class="right-box">
          <KLineWidget symbol={symbol.value} />
        </div>
      </div>
    );
  },
});
