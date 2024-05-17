import { Ref } from 'vue';
import type { VVirtualListColumn, VVirtualListRenderCell } from './type';
export declare function setupXScroll({ columnsRef, renderCellRef }: {
    columnsRef: Ref<VVirtualListColumn[]>;
    renderCellRef: Ref<VVirtualListRenderCell | undefined>;
}): {
    setListWidth: (value: number) => void;
    scrollLeftRef: Ref<number>;
};
