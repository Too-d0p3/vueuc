import { PropType, CSSProperties } from 'vue';
import { VScrollToOptions, VVirtualListColumn, VVirtualListRenderCell } from './type';
export interface CommonScrollToOptions {
    behavior?: ScrollBehavior;
    debounce?: boolean;
}
export interface ScrollTo {
    (x: number, y: number): void;
    (options: {
        left?: number;
        top?: number;
    } & CommonScrollToOptions): void;
    (options: {
        index: number;
    } & CommonScrollToOptions): void;
    (options: {
        key: string | number;
    } & CommonScrollToOptions): void;
    (options: {
        position: 'top' | 'bottom';
    } & CommonScrollToOptions): void;
    (options: VScrollToOptions): void;
}
export interface VirtualListInst {
    listElRef: HTMLElement;
    itemsElRef: HTMLElement | null;
    scrollTo: ScrollTo;
}
declare const _default: import("vue").DefineComponent<{
    showScrollbar: {
        type: BooleanConstructor;
        default: boolean;
    };
    columns: {
        type: PropType<VVirtualListColumn[]>;
        default: () => never[];
    };
    renderCell: PropType<VVirtualListRenderCell>;
    items: {
        type: PropType<any[]>;
        default: () => never[];
    };
    itemSize: {
        type: NumberConstructor;
        required: true;
    };
    itemResizable: BooleanConstructor;
    itemsStyle: PropType<string | CSSProperties>;
    visibleItemsTag: {
        type: PropType<string | object>;
        default: string;
    };
    visibleItemsProps: ObjectConstructor;
    ignoreItemResize: BooleanConstructor;
    onScroll: PropType<(event: Event) => void>;
    onWheel: PropType<(event: WheelEvent) => void>;
    onResize: PropType<(entry: ResizeObserverEntry) => void>;
    defaultScrollKey: (StringConstructor | NumberConstructor)[];
    defaultScrollIndex: NumberConstructor;
    keyField: {
        type: StringConstructor;
        default: string;
    };
    itemAsKey: {
        type: BooleanConstructor;
        default: boolean;
    };
    paddingTop: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    paddingBottom: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
}, {
    listHeight: import("vue").Ref<number | undefined>;
    listStyle: {
        overflow: string;
    };
    keyToIndex: import("vue").ComputedRef<Map<any, any>>;
    itemsStyle: import("vue").ComputedRef<(string | CSSProperties | {
        boxSizing: string;
        width: string | undefined;
        height: string;
        minHeight: string;
        paddingTop: string;
        paddingBottom: string;
    } | undefined)[]>;
    visibleItemsStyle: import("vue").ComputedRef<{
        transform: string;
    }>;
    viewportItems: import("vue").ComputedRef<any[]>;
    listElRef: import("vue").Ref<HTMLElement | null>;
    itemsElRef: import("vue").Ref<Element | null>;
    scrollTo: ScrollTo;
    handleListResize: (entry: ResizeObserverEntry) => void;
    handleListScroll: (e: UIEvent) => void;
    handleListWheel: (e: WheelEvent) => void;
    handleItemResize: (key: string | number, entry: ResizeObserverEntry) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    showScrollbar: {
        type: BooleanConstructor;
        default: boolean;
    };
    columns: {
        type: PropType<VVirtualListColumn[]>;
        default: () => never[];
    };
    renderCell: PropType<VVirtualListRenderCell>;
    items: {
        type: PropType<any[]>;
        default: () => never[];
    };
    itemSize: {
        type: NumberConstructor;
        required: true;
    };
    itemResizable: BooleanConstructor;
    itemsStyle: PropType<string | CSSProperties>;
    visibleItemsTag: {
        type: PropType<string | object>;
        default: string;
    };
    visibleItemsProps: ObjectConstructor;
    ignoreItemResize: BooleanConstructor;
    onScroll: PropType<(event: Event) => void>;
    onWheel: PropType<(event: WheelEvent) => void>;
    onResize: PropType<(entry: ResizeObserverEntry) => void>;
    defaultScrollKey: (StringConstructor | NumberConstructor)[];
    defaultScrollIndex: NumberConstructor;
    keyField: {
        type: StringConstructor;
        default: string;
    };
    itemAsKey: {
        type: BooleanConstructor;
        default: boolean;
    };
    paddingTop: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    paddingBottom: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
}>>, {
    columns: VVirtualListColumn[];
    showScrollbar: boolean;
    items: any[];
    itemResizable: boolean;
    visibleItemsTag: string | object;
    ignoreItemResize: boolean;
    keyField: string;
    itemAsKey: boolean;
    paddingTop: string | number;
    paddingBottom: string | number;
}, {}>;
export default _default;
