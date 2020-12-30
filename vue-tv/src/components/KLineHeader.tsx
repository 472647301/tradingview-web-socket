import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "KLineHeader",
  props: {
    name: {
      type: String,
      required: true,
    },
    symbols: {
      type: Array as PropType<Array<IApiSymbols>>,
      required: true,
    },
    onClick: {
      type: Function as PropType<(name: string) => void>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="header" style={{ height: window.innerHeight + "px" }}>
        {props.symbols.map((e) => {
          if (!e.tradable) {
            return null;
          }
          const isActive = props.name === e.name;
          return (
            <button
              key={e.name}
              class={isActive ? "secondary" : "primary"}
              onClick={() => props.onClick(e.name)}
            >
              {e.base_currency.toLocaleUpperCase()}/
              {e.quote_currency.toLocaleUpperCase()}
            </button>
          );
        })}
      </div>
    );
  },
});
