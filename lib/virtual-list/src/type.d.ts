import { VNodeChild } from 'vue';
export type ItemData = any;
export interface VScrollToOptions extends ScrollToOptions {
    index?: number;
    key?: number | string;
    position?: 'top' | 'bottom';
    debounce?: boolean;
}
export interface VVirtualListColumn extends Record<string, any> {
    key?: number | string;
    width: number;
}
export type VVirtualListRenderCell = (props: {
    item: ItemData;
    column: VVirtualListColumn;
    left: number;
}) => VNodeChild;
