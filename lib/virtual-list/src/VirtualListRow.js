"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualListRow = void 0;
const vue_1 = require("vue");
const context_1 = require("./context");
exports.VirtualListRow = (0, vue_1.defineComponent)({
    name: 'VirtualListRow',
    props: {
        item: {
            type: [Object, Number],
            required: true
        }
    },
    setup() {
        const { startIndexRef, endIndexRef, columnsRef, getLeft, renderCellRef } = 
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (0, vue_1.inject)(context_1.xScrollInjextionKey);
        return {
            startIndex: startIndexRef,
            endIndex: endIndexRef,
            columns: columnsRef,
            renderCell: renderCellRef,
            getLeft
        };
    },
    render() {
        const { startIndex, endIndex, columns, renderCell, getLeft, item } = this;
        if (renderCell == null)
            return null;
        const items = [];
        for (let i = startIndex; i <= endIndex; ++i) {
            const column = columns[i];
            items.push(renderCell({ column, left: getLeft(i), item }));
        }
        return items;
    }
});
