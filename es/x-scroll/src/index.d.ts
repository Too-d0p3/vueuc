import { PropType } from 'vue';
export type { VXScrollInst } from './interface';
declare const _default: import("vue").DefineComponent<{
    disabled: BooleanConstructor;
    onScroll: PropType<(e: Event) => void>;
}, {
    scrollTo: HTMLElement["scrollTo"];
    selfRef: import("vue").Ref<HTMLElement | null>;
    handleWheel: (e: WheelEvent) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    disabled: BooleanConstructor;
    onScroll: PropType<(e: Event) => void>;
}>>, {
    disabled: boolean;
}, {}>;
export default _default;
