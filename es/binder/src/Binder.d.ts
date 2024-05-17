declare const Binder: import("vue").DefineComponent<{
    syncTargetWithParent: BooleanConstructor;
    syncTarget: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    targetRef: import("vue").Ref<HTMLElement | null>;
    setTargetRef: (el: HTMLElement | null) => void;
    addScrollListener: (listener: () => void) => void;
    removeScrollListener: (listener: () => void) => void;
    addResizeListener: (listener: () => void) => void;
    removeResizeListener: (listener: () => void) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    syncTargetWithParent: BooleanConstructor;
    syncTarget: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    syncTargetWithParent: boolean;
    syncTarget: boolean;
}, {}>;
export default Binder;
