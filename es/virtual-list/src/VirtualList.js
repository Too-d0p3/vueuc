/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { mergeProps, computed, defineComponent, ref, onMounted, h, onActivated, onDeactivated, toRef } from 'vue';
import { beforeNextFrameOnce, depx, pxfy } from 'seemly';
import { useMemo } from 'vooks';
import { useSsrAdapter } from '@css-render/vue3-ssr';
import VResizeObserver from '../../resize-observer/src/VResizeObserver';
import { c, cssrAnchorMetaName, FinweckTree } from '../../shared';
import { ensureMaybeTouch, ensureWheelScale } from './config';
import { setupXScroll } from './xScroll';
import { VirtualListRow } from './VirtualListRow';
const styles = c('.v-vl', {
    maxHeight: 'inherit',
    height: '100%',
    overflow: 'auto',
    minWidth: '1px' // a zero width container won't be scrollable
}, [
    c('&:not(.v-vl--show-scrollbar)', {
        scrollbarWidth: 'none'
    }, [
        c('&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb', {
            width: 0,
            height: 0,
            display: 'none'
        })
    ])
]);
export default defineComponent({
    name: 'VirtualList',
    inheritAttrs: false,
    props: {
        showScrollbar: {
            type: Boolean,
            default: true
        },
        columns: {
            type: Array,
            default: () => []
        },
        renderCell: Function,
        items: {
            type: Array,
            default: () => []
        },
        // it is suppose to be the min height
        itemSize: {
            type: Number,
            required: true
        },
        itemResizable: Boolean,
        itemsStyle: [String, Object],
        visibleItemsTag: {
            type: [String, Object],
            default: 'div'
        },
        visibleItemsProps: Object,
        ignoreItemResize: Boolean,
        onScroll: Function,
        onWheel: Function,
        onResize: Function,
        defaultScrollKey: [Number, String],
        defaultScrollIndex: Number,
        keyField: {
            type: String,
            default: 'key'
        },
        itemAsKey: {
            type: Boolean,
            default: false
        },
        // Whether it is a good API?
        // ResizeObserver + footer & header is not enough.
        // Too complex for simple case
        paddingTop: {
            type: [Number, String],
            default: 0
        },
        paddingBottom: {
            type: [Number, String],
            default: 0
        }
    },
    setup(props) {
        const ssrAdapter = useSsrAdapter();
        styles.mount({
            id: 'vueuc/virtual-list',
            head: true,
            anchorMetaName: cssrAnchorMetaName,
            ssr: ssrAdapter
        });
        onMounted(() => {
            const { defaultScrollIndex, defaultScrollKey } = props;
            if (defaultScrollIndex !== undefined && defaultScrollIndex !== null) {
                scrollTo({ index: defaultScrollIndex });
            }
            else if (defaultScrollKey !== undefined && defaultScrollKey !== null) {
                scrollTo({ key: defaultScrollKey });
            }
        });
        let isDeactivated = false;
        let activateStateInitialized = false;
        onActivated(() => {
            isDeactivated = false;
            if (!activateStateInitialized) {
                activateStateInitialized = true;
                return;
            }
            // remount
            scrollTo({ top: scrollTopRef.value, left: scrollLeftRef.value });
        });
        onDeactivated(() => {
            isDeactivated = true;
            if (!activateStateInitialized) {
                activateStateInitialized = true;
            }
        });
        const totalWidthRef = useMemo(() => {
            if (props.renderCell == null)
                return undefined;
            if (props.columns.length === 0)
                return undefined;
            let width = 0;
            props.columns.forEach(column => { width += column.width; });
            return width;
        });
        const keyIndexMapRef = computed(() => {
            const map = new Map();
            const { keyField, itemAsKey } = props;
            if (itemAsKey) {
                return map;
            }
            props.items.forEach((item, index) => {
                if (itemAsKey) {
                    map.set(index, index);
                }
                else {
                    map.set(item[keyField], index);
                }
            });
            return map;
        });
        const { scrollLeftRef, setListWidth } = setupXScroll({
            columnsRef: toRef(props, 'columns'),
            renderCellRef: toRef(props, 'renderCell')
        });
        const listElRef = ref(null);
        const listHeightRef = ref(undefined);
        const keyToHeightOffset = new Map();
        const itemsLengthRef = computed(() => props.items.length);
        const finweckTreeRef = computed(() => {
            const { items, itemSize, keyField, itemAsKey } = props;
            // Podmínka pro kontrolu itemAsKey
            if (itemAsKey) {
                // Použijeme itemsLengthRef pro přepočet, pokud itemAsKey je true
                const length = itemsLengthRef.value;
                const ft = new FinweckTree(length, itemSize);
                for (let index = 0; index < length; index++) {
                    const heightOffset = keyToHeightOffset.get(index);
                    if (heightOffset !== undefined) {
                        ft.add(index, heightOffset);
                    }
                }
                return ft;
            }
            else {
                const ft = new FinweckTree(items.length, itemSize);
                items.forEach((item, index) => {
                    const key = item[keyField];
                    const heightOffset = keyToHeightOffset.get(key);
                    if (heightOffset !== undefined) {
                        ft.add(index, heightOffset);
                    }
                });
                return ft;
            }
        });
        const finweckTreeUpdateTrigger = ref(0);
        const scrollTopRef = ref(0);
        const startIndexRef = useMemo(() => {
            return Math.max(finweckTreeRef.value.getBound(scrollTopRef.value - depx(props.paddingTop)) - 1, 0);
        });
        const viewportItemsRef = computed(() => {
            const { value: listHeight } = listHeightRef;
            if (listHeight === undefined)
                return [];
            const { items, itemSize, itemAsKey } = props;
            const startIndex = startIndexRef.value;
            const endIndex = Math.min(startIndex + Math.ceil(listHeight / itemSize + 1), items.length - 1);
            const viewportItems = [];
            for (let i = startIndex; i <= endIndex; ++i) {
                if (itemAsKey) {
                    viewportItems.push(i);
                }
                else {
                    viewportItems.push(items[i]);
                }
            }
            return viewportItems;
        });
        const scrollTo = (options, y) => {
            if (typeof options === 'number') {
                scrollToPosition(options, y, 'auto');
                return;
            }
            const { left, top, index, key, position, behavior, debounce = true } = options;
            if (left !== undefined || top !== undefined) {
                scrollToPosition(left, top, behavior);
            }
            else if (index !== undefined) {
                scrollToIndex(index, behavior, debounce);
            }
            else if (key !== undefined) {
                const toIndex = keyIndexMapRef.value.get(key);
                if (toIndex !== undefined)
                    scrollToIndex(toIndex, behavior, debounce);
            }
            else if (position === 'bottom') {
                scrollToPosition(0, Number.MAX_SAFE_INTEGER, behavior);
            }
            else if (position === 'top') {
                scrollToPosition(0, 0, behavior);
            }
        };
        let anchorIndex;
        let anchorTimerId = null;
        function scrollToIndex(index, behavior, debounce) {
            const { value: ft } = finweckTreeRef;
            const targetTop = ft.sum(index) + depx(props.paddingTop);
            if (!debounce) {
                listElRef.value.scrollTo({
                    left: 0,
                    top: targetTop,
                    behavior
                });
            }
            else {
                anchorIndex = index;
                if (anchorTimerId !== null) {
                    window.clearTimeout(anchorTimerId);
                }
                anchorTimerId = window.setTimeout(() => {
                    anchorIndex = undefined;
                    anchorTimerId = null;
                }, 16); // use 0 ms may be ealier than resize callback...
                const { scrollTop, offsetHeight } = listElRef.value;
                if (targetTop > scrollTop) {
                    const itemSize = ft.get(index);
                    if (targetTop + itemSize <= scrollTop + offsetHeight) {
                        // do nothing
                    }
                    else {
                        listElRef.value.scrollTo({
                            left: 0,
                            top: targetTop + itemSize - offsetHeight,
                            behavior
                        });
                    }
                }
                else {
                    listElRef.value.scrollTo({
                        left: 0,
                        top: targetTop,
                        behavior
                    });
                }
            }
        }
        function scrollToPosition(left, top, behavior) {
            listElRef.value.scrollTo({
                left,
                top,
                behavior
            });
        }
        function handleItemResize(key, entry) {
            var _a, _b, _c;
            if (isDeactivated)
                return;
            if (props.ignoreItemResize)
                return;
            if (isHideByVShow(entry.target))
                return;
            const { value: ft } = finweckTreeRef;
            const index = keyIndexMapRef.value.get(key);
            const previousHeight = ft.get(index);
            const height = (_c = (_b = (_a = entry.borderBoxSize) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.blockSize) !== null && _c !== void 0 ? _c : entry.contentRect.height;
            if (height === previousHeight)
                return;
            // height offset based on itemSize
            // used when rebuild the finweck tree
            const offset = height - props.itemSize;
            if (offset === 0) {
                keyToHeightOffset.delete(key);
            }
            else {
                keyToHeightOffset.set(key, height - props.itemSize);
            }
            // delta height based on finweck tree data
            const delta = height - previousHeight;
            if (delta === 0)
                return;
            ft.add(index, delta);
            const listEl = listElRef.value;
            if (listEl != null) {
                if (anchorIndex === undefined) {
                    const previousHeightSum = ft.sum(index);
                    if (listEl.scrollTop > previousHeightSum) {
                        listEl.scrollBy(0, delta);
                    }
                }
                else {
                    if (index < anchorIndex) {
                        listEl.scrollBy(0, delta);
                    }
                    else if (index === anchorIndex) {
                        const previousHeightSum = ft.sum(index);
                        if (height + previousHeightSum >
                            // Note, listEl shouldn't have border, nor offsetHeight won't be
                            // correct
                            listEl.scrollTop + listEl.offsetHeight) {
                            listEl.scrollBy(0, delta);
                        }
                    }
                }
                syncViewport();
            }
            finweckTreeUpdateTrigger.value++;
        }
        const mayUseWheel = !ensureMaybeTouch();
        let wheelCatched = false;
        function handleListScroll(e) {
            var _a;
            (_a = props.onScroll) === null || _a === void 0 ? void 0 : _a.call(props, e);
            if (!mayUseWheel || !wheelCatched) {
                syncViewport();
            }
        }
        function handleListWheel(e) {
            var _a;
            (_a = props.onWheel) === null || _a === void 0 ? void 0 : _a.call(props, e);
            if (mayUseWheel) {
                const listEl = listElRef.value;
                if (listEl != null) {
                    if (e.deltaX === 0) {
                        if (listEl.scrollTop === 0 && e.deltaY <= 0) {
                            return;
                        }
                        if (listEl.scrollTop + listEl.offsetHeight >= listEl.scrollHeight &&
                            e.deltaY >= 0) {
                            return;
                        }
                    }
                    e.preventDefault();
                    if (e.shiftKey) {
                        listEl.scrollLeft += e.deltaY / ensureWheelScale();
                    }
                    else {
                        listEl.scrollTop += e.deltaY / ensureWheelScale();
                        listEl.scrollLeft += e.deltaX / ensureWheelScale();
                    }
                    syncViewport();
                    wheelCatched = true;
                    beforeNextFrameOnce(() => {
                        wheelCatched = false;
                    });
                }
            }
        }
        function handleListResize(entry) {
            if (isDeactivated)
                return;
            // List is HTMLElement
            if (isHideByVShow(entry.target))
                return;
            // If height is same, return
            setListWidth(entry.contentRect.width);
            if (entry.contentRect.height === listHeightRef.value)
                return;
            listHeightRef.value = entry.contentRect.height;
            const { onResize } = props;
            if (onResize !== undefined)
                onResize(entry);
        }
        function syncViewport() {
            const { value: listEl } = listElRef;
            // sometime ref el can be null
            // https://github.com/TuSimple/naive-ui/issues/811
            if (listEl == null)
                return;
            scrollTopRef.value = listEl.scrollTop;
            scrollLeftRef.value = listEl.scrollLeft;
        }
        function isHideByVShow(el) {
            let cursor = el;
            while (cursor !== null) {
                if (cursor.style.display === 'none')
                    return true;
                cursor = cursor.parentElement;
            }
            return false;
        }
        return {
            listHeight: listHeightRef,
            listStyle: {
                overflow: 'auto'
            },
            keyToIndex: keyIndexMapRef,
            itemsStyle: computed(() => {
                const { itemResizable } = props;
                const height = pxfy(finweckTreeRef.value.sum());
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                finweckTreeUpdateTrigger.value;
                return [
                    props.itemsStyle,
                    {
                        boxSizing: 'content-box',
                        width: pxfy(totalWidthRef.value),
                        height: itemResizable ? '' : height,
                        minHeight: itemResizable ? height : '',
                        paddingTop: pxfy(props.paddingTop),
                        paddingBottom: pxfy(props.paddingBottom)
                    }
                ];
            }),
            visibleItemsStyle: computed(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                finweckTreeUpdateTrigger.value;
                return {
                    transform: `translateY(${pxfy(finweckTreeRef.value.sum(startIndexRef.value))})`
                };
            }),
            viewportItems: viewportItemsRef,
            listElRef,
            itemsElRef: ref(null),
            scrollTo,
            handleListResize,
            handleListScroll,
            handleListWheel,
            handleItemResize
        };
    },
    render() {
        const { itemResizable, keyField, keyToIndex, visibleItemsTag, itemAsKey } = this;
        return h(VResizeObserver, {
            onResize: this.handleListResize
        }, {
            default: () => {
                var _a, _b;
                return h('div', mergeProps(this.$attrs, {
                    class: ['v-vl', this.showScrollbar && 'v-vl--show-scrollbar'],
                    onScroll: this.handleListScroll,
                    onWheel: this.handleListWheel,
                    ref: 'listElRef'
                }), [
                    this.items.length !== 0
                        ? h('div', {
                            ref: 'itemsElRef',
                            class: 'v-vl-items',
                            style: this.itemsStyle
                        }, [
                            h(visibleItemsTag, Object.assign({
                                class: 'v-vl-visible-items',
                                style: this.visibleItemsStyle
                            }, this.visibleItemsProps), {
                                default: () => {
                                    const { renderCell } = this;
                                    return this.viewportItems.map((item) => {
                                        const key = itemAsKey ? item : item[keyField];
                                        const index = itemAsKey ? item : keyToIndex.get(key);
                                        const cells = (renderCell != null)
                                            ? h(VirtualListRow, {
                                                item
                                            })
                                            : undefined;
                                        const itemVNode = this.$slots.default({
                                            item,
                                            cells,
                                            index
                                        })[0];
                                        if (itemResizable) {
                                            return h(VResizeObserver, {
                                                key,
                                                onResize: (entry) => this.handleItemResize(key, entry)
                                            }, {
                                                default: () => itemVNode
                                            });
                                        }
                                        itemVNode.key = key;
                                        return itemVNode;
                                    });
                                }
                            })
                        ])
                        : (_b = (_a = this.$slots).empty) === null || _b === void 0 ? void 0 : _b.call(_a)
                ]);
            }
        });
    }
});
