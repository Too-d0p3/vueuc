import { PropType } from 'vue';
export declare const VirtualListRow: import("vue").DefineComponent<{
    item: {
        type: PropType<any>;
        required: true;
    };
}, {
    startIndex: import("vue").ComputedRef<number>;
    endIndex: import("vue").ComputedRef<number>;
    columns: import("vue").Ref<import("./type").VVirtualListColumn[]>;
    renderCell: import("vue").Ref<import("./type").VVirtualListRenderCell | undefined>;
    getLeft: (index: number) => number;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    item: {
        type: PropType<any>;
        required: true;
    };
}>>, {}, {}>;
