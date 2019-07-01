"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONKEY_PATCH_KEY_NAME = '__ngContext__';
// Below are constants for LView indices to help us look up LView members
// without having to remember the specific indices.
// Uglify will inline these when minifying so there shouldn't be a cost.
exports.HOST = 0;
exports.TVIEW = 1;
exports.FLAGS = 2;
exports.PARENT = 3;
exports.NEXT = 4;
exports.QUERIES = 5;
exports.T_HOST = 6;
exports.BINDING_INDEX = 7;
exports.CLEANUP = 8;
exports.CONTEXT = 9;
exports.INJECTOR = 10;
exports.RENDERER_FACTORY = 11;
exports.RENDERER = 12;
exports.SANITIZER = 13;
exports.CHILD_HEAD = 14;
exports.CHILD_TAIL = 15;
exports.CONTENT_QUERIES = 16;
exports.DECLARATION_VIEW = 17;
exports.PREORDER_HOOK_FLAGS = 18;
/** Size of LView's header. Necessary to adjust for it when setting slots.  */
exports.HEADER_OFFSET = 20;
exports.ACTIVE_INDEX = 2;
// PARENT, NEXT, QUERIES and T_HOST are indices 3, 4, 5 and 6.
// As we already have these constants in LView, we don't need to re-create them.
exports.NATIVE = 7;
exports.VIEW_REFS = 8;
/**
 * Special location which allows easy identification of type. If we have an array which was
 * retrieved from the `LView` and that array has `true` at `TYPE` location, we know it is
 * `LContainer`.
 */
exports.TYPE = 1;
