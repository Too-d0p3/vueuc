import { PropType } from 'vue';
export type VResizeObserverOnResize = (entry: ResizeObserverEntry) => void;
declare const _default: import("vue").DefineComponent<{
    onResize: PropType<VResizeObserverOnResize>;
}, void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    onResize: PropType<VResizeObserverOnResize>;
}>>, {}, {}>;
export default _default;
