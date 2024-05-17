import { ComputedRef, InjectionKey, Ref } from 'vue';
import { VVirtualListColumn, VVirtualListRenderCell } from './type';
export declare const xScrollInjextionKey: InjectionKey<{
    startIndexRef: ComputedRef<number>;
    endIndexRef: ComputedRef<number>;
    columnsRef: Ref<VVirtualListColumn[]>;
    renderCellRef: Ref<VVirtualListRenderCell | undefined>;
    getLeft: (index: number) => number;
}>;
