(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{101:function(e,t,n){"use strict";var r=this&&this.__extends||function(){var e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(t,n)};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();t.__esModule=!0;var i=n(182),o=n(0),a=n(93),c=n(43),u=n(96);function s(e,t,n){var r=(new i.graphlib.Graph).setGraph({}).setDefaultEdgeLabel(function(){return{}});l(r,t,n);var c=o.select("svg#"+e),u=c.select("g"),s=0===u.node().children.length,d=a.zoom().on("zoom",function(){u.attr("transform",o.event.transform)});c.call(d),(new i.render)(u,r),s&&function(e,t,n){var r=e.node().getBBox(),i=e.node().parentElement,o=i.clientWidth,c=i.clientHeight,u=r.width,s=r.height,l=r.x+u/2,d=r.y+s/2;if(0===u||0===s)return;var f=.75/Math.max(u/o,s/c),h=[o/2-f*l,c/2-f*d],p=a.zoomIdentity.translate(h[0],h[1]).scale(f);e.transition().duration(0).call(n.transform,p)}(c,0,d)}function l(e,t,n){var r=t.uuid;if(n&&n.has(r)){var i=n.get(r);e.setNode(r,{label:t.tagName,class:i.hit?c.COLORS_CLASSES[i.hit-1]:c.COLORS_CLASSES[0]})}else e.setNode(r,{label:t.tagName,class:c.NOT_UPDATED_NODE_CLASS_NAME});t.children.forEach(function(t){var i=t.uuid;l(e,t,n),e.setEdge(r,i)})}t.renderTree=s,t.walkTreeAndAddNodes=l;var d=function(e){function t(t){var n=e.call(this)||this;return n.id=t,n}return r(t,e),t.prototype.setUpdates=function(e,t){this.serializedTreeViewItem=e,this.addAll(t)},t.prototype.drawImpl=function(e){s(this.id,this.serializedTreeViewItem,this.pool)},t}(u.UpdatePoolManager);t.GraphRender=d},164:function(e,t,n){"use strict";function r(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}t.__esModule=!0;var i=n(49),o=n(176),a=n(31);r(n(50)),r(n(369)),t.startTracing=function(){console.log("starting tracing"),setTimeout(function(){var e=i.findAngularRootNode(document.body);e&&o.monkeyPatchRootNode(e[a.CONTEXT])},2e3)},t.stopTracing=function(){o.undoMonkeyPatch()},t.isAngularApp=function(){return void 0!==i.findAngularRootNode(document.body)}},165:function(e,t,n){e.exports=n(373)},170:function(e,t,n){},171:function(e,t,n){},172:function(e,t,n){},173:function(e,t,n){},174:function(e,t,n){},175:function(e,t,n){},176:function(e,t,n){"use strict";var r=this&&this.__read||function(e,t){var n="function"===typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,i,o=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=o.next()).done;)a.push(r.value)}catch(c){i={error:c}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}return a},i=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(r(arguments[t]));return e};t.__esModule=!0;var o=n(31),a=n(177),c=n(178),u=n(49),s=n(97),l=n(181),d=n(101),f=n(98),h=n(43),p=n(50),m=new a.Tracer,T=(new d.GraphRender("liveTree"),new c.LViewStateManager),v=[],w=0,E=function(e,t){if(!e.template.__template_patched__){var n=e.template;e.template=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];if(console.log(t,e[0],w),t&&w++,1===e[0]||1!==w)return console.log("short circuiting"),void n.apply(void 0,i(e));t&&(T.resetState(),console.log("scheduled!"),l.scheduleOutsideOfZone(function(){w=0;var e=p.serialiseTreeViewItem(T.getTree()),n=p.serialiseTreeViewItem(s.traverseTreeAndCreateTreeStructure(t,!0)),r=s.transformTreeToInstructions(e);window.dispatchEvent(new CustomEvent("ContentScriptEvent",{detail:{type:"ENTIRE_TREE",payload:{entireTree:n,instructions:u.mapToObject(r)}}})),console.log("updatedTree",e),window.dispatchEvent(new CustomEvent("ContentScriptEvent",{detail:{type:"UPDATED_TREE",payload:{updatedTree:e}}}))})),T.getNextLView(null,t);var c=T.predictedNextLView;c[o.HOST][h.DEVTOOLS_IDENTIFIER]||(c[o.HOST][h.DEVTOOLS_IDENTIFIER]=f()),n.apply(void 0,i(e)),y(c),l.scheduleOutsideOfZone(function(){m.present(c[o.HOST][h.DEVTOOLS_IDENTIFIER],c[o.HOST].tagName,a.createMeasurement(c[0].getBoundingClientRect()))})},e.template.__template_patched__=!0,v.push({origTemplate:n,tView:e})}};function y(e,t){var n;void 0===t&&(t=!1),n=t?function(e){return E(e[o.TVIEW],e)}:function(e){return E(e[o.TVIEW])},s.loopChildComponents({lView:e,work:n});s.loopDynamicEmbeddedViews({lView:e,work:function(e){e[o.HOST]&&E(e[o.TVIEW]),y(e)}})}t.monkeyPatchDirectChildren=y,t.monkeyPatchRootNode=function(e){for(var t=0;t<e.components.length;t++){var n=e.components[t];y(u.readPatchedLView(n),!0)}},t.undoMonkeyPatch=function(){v.forEach(function(e){e.tView.template=e.origTemplate}),v=[]}},177:function(e,t,n){"use strict";var r=this&&this.__extends||function(){var e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(t,n)};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),i=this&&this.__values||function(e){var t="function"===typeof Symbol&&e[Symbol.iterator],n=0;return t?t.call(e):{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}}},o=this&&this.__read||function(e,t){var n="function"===typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,i,o=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=o.next()).done;)a.push(r.value)}catch(c){i={error:c}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}return a};t.__esModule=!0;var a=n(96),c=n(43),u=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return r(t,e),t.prototype.present=function(e,t,n){this.add(e,t,n)},t.prototype.drawImpl=function(e){var t,n;this.ensureCanvas();var r=this.canvas,a=r.getContext("2d");a.clearRect(0,0,r.width,r.height);try{for(var u=i(e.entries()),l=u.next();!l.done;l=u.next()){var d=o(l.value,2),f=(d[0],d[1]),h=c.COLORS[f.hit-1]||c.HOTTEST_COLOR;s(a,f.data,1,h)}}catch(p){t={error:p}}finally{try{l&&!l.done&&(n=u.return)&&n.call(u)}finally{if(t)throw t.error}}},t.prototype.ensureCanvas=function(){var e=this.canvas;if(null!==e&&void 0!==e||((e=window.document.getElementById("TraceUpdatesWebNodePresenter")||window.document.createElement("canvas")).id="TraceUpdatesWebNodePresenter",e.width=window.screen.availWidth,e.height=window.screen.availHeight,e.style.cssText="\n        xx-background-color: red;\n        xx-opacity: 0.5;\n        bottom: 0;\n        left: 0;\n        pointer-events: none;\n        position: fixed;\n        right: 0;\n        top: 0;\n        z-index: 1000000000;\n      "),!e.parentNode){var t=window.document.documentElement;t.insertBefore(e,t.firstChild)}this.canvas=e},t}(a.UpdatePoolManager);function s(e,t,n,r){e.lineWidth=1,e.strokeStyle=c.OUTLINE_COLOR,e.strokeRect(t.left-1,t.top-1,t.width+2,t.height+2),e.lineWidth=1,e.strokeStyle=c.OUTLINE_COLOR,e.strokeRect(t.left+n,t.top+n,t.width-n,t.height-n),e.strokeStyle=r,e.setLineDash([0]),e.lineWidth=n,e.strokeRect(t.left+Math.floor(n/2),t.top+Math.floor(n/2),t.width-n,t.height-n),e.setLineDash([0])}t.Tracer=u,t.createMeasurement=function(e){return{left:e.left,top:e.top,width:e.width,height:e.height}}},178:function(e,t,n){"use strict";t.__esModule=!0;var r=n(31),i=n(49),o=n(97),a=n(50),c=function(){function e(){}return e.prototype.getNextLView=function(e,t){var n=this;if(!this.predictedNextLView){var c=a.createInitialTreeViewState(t,!0);return this.treeViewBuilder=new a.TreeViewBuilder,this.treeViewBuilder.addTreeViewItem(c),void(this.predictedNextLView=t)}if(e||(e=this.treeViewBuilder.currentTreeViewItem),!e.dynamicEmbeddedViewsChecked){if(o.loopDynamicEmbeddedViews({lView:e.lView,work:function(t,r,i,o){r?e.nextCurrent=o:e.currentViewRefIndex=i+1,n.getNextLView(a.createInitialTreeViewState(t,!1,e))},nextCurrentLContainer:e.nextCurrent,nextViewRefIndex:e.currentViewRefIndex,exitLoopPrematurely:!0}))return;e.dynamicEmbeddedViewsChecked=!0}var u=e.lView[r.TVIEW].components;if(!u||e.currentIndex>=u.length)return e.isRoot?void 0:void this.getNextLView(e.parent);var s=e.lView[u[e.currentIndex]];if(!e.isRoot&&i.shouldLViewBeChecked(s))return e.currentIndex++,void this.getNextLView(e);this.predictedNextLView=e.lView[u[e.currentIndex]]||e.lView,e.currentIndex++;var l=a.createInitialTreeViewState(this.predictedNextLView,!1,e);this.treeViewBuilder.addTreeViewItem(l,o.getRealParent(e))},e.prototype.resetState=function(){this.predictedNextLView=null},e.prototype.getTree=function(){return this.treeViewBuilder.rootTreeViewItem},e}();t.LViewStateManager=c},181:function(e,t,n){"use strict";t.__esModule=!0,t.scheduleOutsideOfZone=function(e){Zone.root.run(function(){return new Promise(function(e){return e()}).then(function(){return e()})})}},31:function(e,t,n){"use strict";t.__esModule=!0,t.MONKEY_PATCH_KEY_NAME="__ngContext__",t.HOST=0,t.TVIEW=1,t.FLAGS=2,t.PARENT=3,t.NEXT=4,t.CONTEXT=9,t.CHILD_HEAD=14,t.CHILD_TAIL=15,t.DECLARATION_VIEW=17,t.ACTIVE_INDEX=2,t.NATIVE=7,t.VIEW_REFS=8,t.CONTAINER_HEADER_OFFSET=9,t.HEADER_OFFSET=20,t.TYPE=1},369:function(e,t,n){"use strict";t.__esModule=!0,function(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}(n(101))},373:function(e,t,n){"use strict";n.r(t);var r,i,o=n(1),a=n.n(o),c=n(48),u=n.n(c),s=(n(170),n(22)),l=n(23),d=n(26),f=n(24),h=n(40),p=n(27),m=(n(171),n(94)),T=(n(172),function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(d.a)(this,Object(f.a)(t).call(this,e))).onMenuItemClick=function(e){return function(t){n.props.onMenuItemSelected(e)}},n.onMenuItemClick=n.onMenuItemClick.bind(Object(h.a)(n)),n}return Object(p.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return a.a.createElement("div",{className:"sidebar"},a.a.createElement("ol",null,a.a.createElement("li",{className:"header"},a.a.createElement("span",null,"Profiling"),a.a.createElement("ol",null,a.a.createElement("li",{onClick:this.onMenuItemClick("entireTree")},a.a.createElement(m.b,{className:"logo"}),a.a.createElement("span",null,"Entire Tree")),a.a.createElement("li",{onClick:this.onMenuItemClick("treePerCycle")},a.a.createElement(m.a,{className:"logo"}),a.a.createElement("span",null,"Tree per cycle"))))))}}]),t}(a.a.Component)),v=(n(173),n(41)),w=Object(v.a)(r=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(d.a)(this,Object(f.a)(t).call(this,e))).state={selectedCycle:0},n}return Object(p.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return a.a.createElement("div",null,"Coming soon...")}}]),t}(a.a.Component))||r,E=(n(174),n(175),n(164)),y=Object(v.a)(i=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(d.a)(this,Object(f.a)(t).call(this,e))).treeGraph=void 0,n.treeGraph=new E.GraphRender("liveTree"),n}return Object(p.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this,t=this.props.store,n=t.entireTree,r=t.instructions;setTimeout(function(){e.treeGraph.setUpdates(n,r)});this.props.store.test;return a.a.createElement("div",{className:"entireTree"},a.a.createElement("div",{className:"chart-container"},a.a.createElement("div",{className:"chart"},a.a.createElement("svg",{id:"liveTree",width:"100%",height:"400px"},a.a.createElement("g",null)))))}}]),t}(a.a.Component))||i,_=Object(v.a)(function(e){return e.stores.entireTreeStore.entireTree?("entireTree"===e.menuItem&&(t=a.a.createElement(y,{store:e.stores.entireTreeStore})),"treePerCycle"===e.menuItem&&(t=a.a.createElement(w,{store:e.stores.updatedTreesStore})),a.a.createElement("div",{className:"appContent"},t)):a.a.createElement("div",null,"Please trigger a CD cycle :)");var t}),O=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(d.a)(this,Object(f.a)(t).call(this,e))).count=0,n.state={menuItem:"entireTree"},n.menuItemSelected=n.menuItemSelected.bind(Object(h.a)(n)),n}return Object(p.a)(t,e),Object(l.a)(t,[{key:"componentWillMount",value:function(){this.setupConnection()}},{key:"menuItemSelected",value:function(e){this.setState({menuItem:e})}},{key:"setupConnection",value:function(){var e=this,t=chrome.runtime.connect();t.onMessage.addListener(function(t){switch(t.type){case"ENTIRE_TREE":e.count++,e.props.entireTreeStore.setTreeUpdate(t.payload.entireTree,t.payload.instructions,""+e.count);break;case"UPDATED_TREE":e.props.updatedTreeStore.addUpdatedTree(t.payload.updatedTree);break;case"RESET_DATA":e.props.updatedTreeStore.clearData(),e.props.entireTreeStore.clearData()}}),t.postMessage({type:"NG_DEVTOOLS_INIT",tabId:chrome.devtools.inspectedWindow.tabId})}},{key:"render",value:function(){var e={updatedTreesStore:this.props.updatedTreeStore,entireTreeStore:this.props.entireTreeStore};return a.a.createElement("div",{className:"App"},a.a.createElement(T,{onMenuItemSelected:this.menuItemSelected}),a.a.createElement(_,{menuItem:this.state.menuItem,stores:e}))}}]),t}(a.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var I=n(9),g=I.a.model({uuid:I.a.string,children:I.a.array(I.a.late(function(){return g})),onPush:I.a.boolean,tagName:I.a.string}),S=I.a.model({updatedTrees:I.a.array(g)}).actions(function(e){return{addUpdatedTree:function(t){e.updatedTrees.push(t)},clearData:function(){e.updatedTrees=[]}}}),V=I.a.model({entireTree:I.a.maybe(g),instructions:I.a.map(g),test:""}).actions(function(e){return{setTreeUpdate:function(t,n,r){e.instructions=n,e.entireTree=t,e.test=r},clearData:function(){e.instructions=new Map,e.entireTree=void 0,e.test=""}}}),N=S.create(),C=V.create();u.a.render(a.a.createElement(O,{updatedTreeStore:N,entireTreeStore:C}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},43:function(e,t,n){"use strict";t.__esModule=!0,t.DEVTOOLS_IDENTIFIER="__CD_PROFILER_ID__",t.UPDATED_NODE_CLASS_NAME="node-updated",t.NOT_UPDATED_NODE_CLASS_NAME="node-normal",t.COLORS_CLASSES=["node-updated-1","node-updated-2","node-updated-3","node-updated-4","node-updated-5","node-updated-6","node-updated-7"],t.OUTLINE_COLOR="#f0f0f0",t.COLORS=["#55cef6","#55f67b","#a5f655","#f4f655","#f6a555","#f66855","#ff0000"],t.HOTTEST_COLOR=t.COLORS[t.COLORS.length-1],t.DURATION=250},49:function(e,t,n){"use strict";var r=this&&this.__values||function(e){var t="function"===typeof Symbol&&e[Symbol.iterator],n=0;return t?t.call(e):{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}}},i=this&&this.__read||function(e,t){var n="function"===typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,i,o=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=o.next()).done;)a.push(r.value)}catch(c){i={error:c}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}return a};t.__esModule=!0;var o=n(31);function a(e){return Array.isArray(e)&&"object"===typeof e[o.TYPE]}function c(e){return e[o.MONKEY_PATCH_KEY_NAME]}function u(e){return 4===(4&e[o.FLAGS])}t.monkeyPatchFunction=function(e,t,n){e[t]=n},t.getComponentViewByIndex=function(e,t){var n=t[e];return a(n)?n:n[o.HOST]},t.isLView=a,t.isLContainer=function(e){return Array.isArray(e)&&!0===e[o.TYPE]},t.readPatchedData=c,t.readPatchedLView=function(e){var t=c(e);return t?Array.isArray(t)?t:t.lView:null},t.isCreationMode=u,t.shouldLViewBeChecked=function(e){return(128===(128&e[o.FLAGS])||u(e))&&0===(80&e[o.FLAGS])},t.findAngularRootNode=function e(t){if(t&&t.childNodes)for(var n=t.childNodes,r=0;r<n.length;r++){var i=n[r];if(i[o.MONKEY_PATCH_KEY_NAME])return i[o.MONKEY_PATCH_KEY_NAME];var a=e(i);if(a)return a}},t.mapToObject=function(e){var t,n,o={};try{for(var a=r(e),c=a.next();!c.done;c=a.next()){var u=i(c.value,2),s=u[0],l=u[1];o[s]=l}}catch(d){t={error:d}}finally{try{c&&!c.done&&(n=a.return)&&n.call(a)}finally{if(t)throw t.error}}return o}},50:function(e,t,n){"use strict";t.__esModule=!0;var r=n(31),i=n(43),o=function(){function e(){}return e.prototype.addTreeViewItem=function(e,t){t?(t.children.push(e),this.currentTreeViewItem=e):(this.rootTreeViewItem=e,this.currentTreeViewItem=this.rootTreeViewItem)},e}();t.TreeViewBuilder=o,t.serialiseTreeViewItem=function e(t){return{uuid:t.lView[r.HOST][i.DEVTOOLS_IDENTIFIER],children:t.children.map(function(t){return e(t)}),tagName:t.lView[0].tagName,onPush:0===(16&t.lView[r.FLAGS])}},t.createInitialTreeViewState=function(e,t,n){return{lView:e,currentIndex:0,children:[],isRoot:t,parent:n}}},96:function(e,t,n){"use strict";var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)},i=this&&this.__values||function(e){var t="function"===typeof Symbol&&e[Symbol.iterator],n=0;return t?t.call(e):{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}}},o=this&&this.__read||function(e,t){var n="function"===typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,i,o=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=o.next()).done;)a.push(r.value)}catch(c){i={error:c}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}return a};t.__esModule=!0;var a=function(){function e(){this.pool=new Map,this.drawing=!1}return e.prototype.addAll=function(e){var t,n;try{for(var a=i(e.entries?e.entries():Object.entries(e)),c=a.next();!c.done;c=a.next()){var u=o(c.value,2),s=u[0],l=u[1],d=void 0;d=this.pool.has(s)?this.pool.get(s):{hit:0,tagName:l.tagName,data:l},d=r({},d,{expiration:Date.now()+250,hit:d.hit+1}),this.pool.set(s,d)}}catch(f){t={error:f}}finally{try{c&&!c.done&&(n=a.return)&&n.call(a)}finally{if(t)throw t.error}}this.scheduleDraw()},e.prototype.add=function(e,t,n){var i;i=this.pool.has(e)?this.pool.get(e):{hit:0,tagName:t,data:n},i=r({},i,{expiration:Date.now()+250,hit:i.hit+1}),this.pool=this.pool.set(e,i),this.scheduleDraw()},e.prototype.firstExpirationDate=function(){var e,t,n=Date.now(),r=Number.MAX_VALUE,a=new Map;try{for(var c=i(this.pool.entries()),u=c.next();!u.done;u=c.next()){var s=o(u.value,2),l=s[0],d=s[1];d.expiration>n&&(r=Math.min(d.expiration,r),a.set(l,d))}}catch(f){e={error:f}}finally{try{u&&!u.done&&(t=c.return)&&t.call(c)}finally{if(e)throw e.error}}return this.pool=a,r},e.prototype.draw=function(){var e=Date.now(),t=this.firstExpirationDate();this.drawImpl(this.pool),this.pool.size>0&&(null!=this.clearTimer&&clearTimeout(this.clearTimer),this.clearTimer=setTimeout(this.redraw.bind(this),t-e)),this.drawing=!1},e.prototype.redraw=function(){this.clearTimer=null,!this.drawing&&this.pool.size>0&&(this.drawing=!0,this.draw())},e.prototype.scheduleDraw=function(){this.drawing||(this.drawing=!0,requestAnimationFrame(this.draw.bind(this)))},e}();t.UpdatePoolManager=a},97:function(e,t,n){"use strict";t.__esModule=!0;var r=n(31),i=n(49),o=n(50),a=n(98),c=n(43);function u(e){for(var t=e.lView,n=e.work,o=e.nextCurrentLContainer,a=e.nextViewRefIndex,c=e.exitLoopPrematurely,u=void 0!==c&&c,s=void 0!==o?o:t[r.CHILD_HEAD];null!==s;s=s[r.NEXT])if(-1===s[r.ACTIVE_INDEX]&&i.isLContainer(s)){for(var l=a||r.CONTAINER_HEADER_OFFSET;l<s.length;l++){if(n(s[l],l>=s.length,l,s[r.NEXT]),u)return!0}a=void 0}return!1}function s(e){var t=e.lView,n=e.work,o=e.exitLoopPrematurely,a=t[r.TVIEW];if(null!=a.components)for(var c=0;c<a.components.length;c++){if(n(i.getComponentViewByIndex(a.components[c],t)),o)return!0}return!1}t.loopDynamicEmbeddedViews=u,t.loopChildComponents=s,t.traverseTreeAndCreateTreeStructure=function(e,t){return l(function(e,t){return t.children.push(e)})(e,t)},t.traverseTreeAndCreateInstructions=function(e,t){var n=[];return l(function(e){return n.push(e)},n)(e,t)};var l=function(e,t){return function n(i,l,d){var f=o.createInitialTreeViewState(i,l,d);i[r.HOST]&&!l&&e(f,d);u({lView:i,work:function(e){n(e,!1,f.lView[r.HOST]?f:d)}});if(s({lView:i,work:function(e){e[r.HOST][c.DEVTOOLS_IDENTIFIER]||(e[r.HOST][c.DEVTOOLS_IDENTIFIER]=a()),n(e,!1,f.lView[r.HOST]?f:d)}}),l)return t||f}};t.transformTreeToInstructions=function(e){var t=new Map;return function e(n){t.set(n.uuid,n),n.children.forEach(function(t){return e(t)})}(e),t},t.getRealParent=function e(t){return t.lView[r.HOST]?t:e(t.parent)}}},[[165,1,2]]]);
//# sourceMappingURL=main.3637e436.chunk.js.map