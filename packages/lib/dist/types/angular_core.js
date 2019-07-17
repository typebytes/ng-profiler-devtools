"use strict";
exports.__esModule = true;
exports.MONKEY_PATCH_KEY_NAME = '__ngContext__';
// Below are constants for LView indices to help us look up LView members
// without having to remember the specific indices.
// Uglify will inline these when minifying so there shouldn't be a cost.
exports.HOST = 0;
exports.TVIEW = 1;
exports.FLAGS = 2;
exports.PARENT = 3;
exports.NEXT = 4;
exports.CONTEXT = 9;
exports.CHILD_HEAD = 14;
exports.CHILD_TAIL = 15;
exports.DECLARATION_VIEW = 17;
/**
 * Special location which allows easy identification of type. If we have an array which was
 * retrieved from the `LView` and that array has `true` at `TYPE` location, we know it is
 * `LContainer`.
 */
/**
 * Below are constants for LContainer indices to help us look up LContainer members
 * without having to remember the specific indices.
 * Uglify will inline these when minifying so there shouldn't be a cost.
 */
exports.ACTIVE_INDEX = 2;
// PARENT, NEXT, QUERIES and T_HOST are indices 3, 4, 5 and 6.
// As we already have these constants in LView, we don't need to re-create them.
exports.NATIVE = 7;
exports.VIEW_REFS = 8;
/**
 * Size of LContainer's header. Represents the index after which all views in the
 * container will be inserted. We need to keep a record of current views so we know
 * which views are already in the DOM (and don't need to be re-added) and so we can
 * remove views from the DOM when they are no longer required.
 */
exports.CONTAINER_HEADER_OFFSET = 9;
exports.HEADER_OFFSET = 20;
/**
 * Special location which allows easy identification of type. If we have an array which was
 * retrieved from the `LView` and that array has `true` at `TYPE` location, we know it is
 * `LContainer`.
 */
exports.TYPE = 1;
//# sourceMappingURL=angular_core.js.map