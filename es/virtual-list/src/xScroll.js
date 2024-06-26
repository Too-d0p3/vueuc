import { computed, provide, ref } from 'vue';
import { useMemo } from 'vooks';
import { FinweckTree } from '../../shared';
import { xScrollInjextionKey } from './context';
export function setupXScroll({ columnsRef, renderCellRef }) {
    const listWidthRef = ref(0);
    const scrollLeftRef = ref(0);
    const xFinweckTreeRef = computed(() => {
        const columns = columnsRef.value;
        if (columns.length === 0) {
            return null;
        }
        const ft = new FinweckTree(columns.length, 0);
        columns.forEach((column, index) => {
            ft.add(index, column.width);
        });
        return ft;
    });
    const startIndexRef = useMemo(() => {
        const xFinweckTree = xFinweckTreeRef.value;
        if (xFinweckTree !== null) {
            return Math.max(xFinweckTree.getBound(scrollLeftRef.value) - 1, 0);
        }
        else {
            return 0;
        }
    });
    const getLeft = (index) => {
        const xFinweckTree = xFinweckTreeRef.value;
        if (xFinweckTree !== null) {
            return xFinweckTree.sum(index);
        }
        else {
            return 0;
        }
    };
    const endIndexRef = useMemo(() => {
        const xFinweckTree = xFinweckTreeRef.value;
        if (xFinweckTree !== null) {
            return Math.min(xFinweckTree.getBound(scrollLeftRef.value + listWidthRef.value) + 1, columnsRef.value.length - 1);
        }
        else {
            return 0;
        }
    });
    provide(xScrollInjextionKey, {
        startIndexRef,
        endIndexRef,
        columnsRef,
        renderCellRef,
        getLeft
    });
    return {
        setListWidth(value) {
            listWidthRef.value = value;
        },
        scrollLeftRef
    };
}
