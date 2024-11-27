import { PropType } from 'vue';
import { ItemData } from './type';
export declare const VirtualListRow: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    item: {
        type: PropType<ItemData>;
        required: true;
    };
}>, {
    startIndex: import("vue").ComputedRef<number>;
    endIndex: import("vue").ComputedRef<number>;
    columns: import("vue").Ref<import("./type").VVirtualListColumn[], import("./type").VVirtualListColumn[]>;
    renderCell: import("vue").Ref<import("./type").VVirtualListRenderCell | undefined, import("./type").VVirtualListRenderCell | undefined>;
    getLeft: (index: number) => number;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    item: {
        type: PropType<ItemData>;
        required: true;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
