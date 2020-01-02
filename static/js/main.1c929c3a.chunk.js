(this["webpackJsonpchallenge-frontend"]=this["webpackJsonpchallenge-frontend"]||[]).push([[0],{103:function(e,t,n){},125:function(e,t,n){},134:function(e,t,n){},226:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(18),c=n.n(o),i=(n(103),n(29)),l=n.n(i),s=n(52),u=n(8),d=n(251),p=n(88),f=n(42),m=n(250),b=n(87),h=n.n(b),v=n(245),g=n(254),O=n(246),y=n(247),E=Object(v.a)((function(e){return{appBar:{top:"auto",bottom:0},grow:{flexGrow:1},button:{margin:e.spacing(1)},input:{display:"none"}}}));function j(e){var t=e.onGenerateChartButtonPress,n=E();return a.createElement(g.a,{position:"fixed",color:"primary",className:n.appBar},a.createElement(O.a,null,a.createElement(y.a,{variant:"contained",color:"secondary",className:n.button,onClick:t},"Generate Chart")))}var w=n(248),x=n(79),C=n.n(x),k=Object(v.a)((function(e){return{root:{flexGrow:1},icon:{marginLeft:e.spacing(1),marginRight:e.spacing(2)},title:{flexGrow:1}}}));function S(e){var t=e.title,n=k();return r.a.createElement("div",{className:n.root},r.a.createElement(g.a,{position:"static"},r.a.createElement(O.a,null,r.a.createElement(C.a,{className:n.icon}),r.a.createElement(w.a,{align:"left",variant:"h6",className:n.title},t))))}var B=n(27),N=(n(125),function(e){var t=e.height,n=void 0===t?"50vh":t,a=e.handleEditorChange;return r.a.createElement(B.ControlledEditor,{theme:"dark",height:n,onChange:a,language:"typescript"})}),P=n(80),_=n(81),z=n.n(_);n(134),n(135);function A(){return Math.round(255*Math.random())}function D(e){return e.charAt(0).toUpperCase()+e.slice(1)}function G(e,t){var n=e.map((function(e){var t,n=Object(u.a)(e,2),a=n[0],r=n[1];return"".concat(D(a),": ").concat(D((t=r).String?t.String:t.Number?t.Number:t.Bool?t.Bool:t.Null?"Null":""))})).join(", ");return"".concat(n?n+", ":"").concat(t.split("_").reduce((function(e,t){return e?"".concat(e," ").concat(D(t)):D(t)}),""))}function M(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"fun",n=performance.now(),a=e(),r=performance.now();return console.log("Call to ".concat(t," took ")+(r-n)+" milliseconds."),a}function R(e){if(e){for(var t=[],n=function(n){var a=e.get_events_data_by_idx(n);if(a){var r=M((function(){return a?a.dataset_vec():[]}),"dataset_vec"),o=M((function(){return r.map((function(e){var t={green:A(),red:A(),blue:A()},n="rgba(".concat(t.red,", ").concat(t.green,", ").concat(t.blue,", 1)"),a="rgba(".concat(t.red,", ").concat(t.green,", ").concat(t.blue,", 0.4)");return{label:G(e.group,e.selection),fill:!1,pointHoverBorderColor:"rgba(220,220,220,1)",backgroundColor:a,borderColor:n,pointBorderColor:n,pointHoverBackgroundColor:n,data:e.points.map((function(t){return{x:t.timestamp-e.points[0].timestamp,y:t.value}}))}}))}));t.push({datasets:o})}},a=0;a<e.events_count();a++)n(a);return t}return[{datasets:[]}]}var H=n(82),L=n(89),W=n(83),J=n(253),I=n(249),V=n(252);function T(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function U(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?T(n,!0).forEach((function(t){Object(H.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):T(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function Z(e){var t=e.children,n=e.value,a=e.index,o=Object(L.a)(e,["children","value","index"]);return r.a.createElement(w.a,Object.assign({component:"div",role:"tabpanel",hidden:n!==a,id:"wrapped-tabpanel-".concat(a),"aria-labelledby":"wrapped-tab-".concat(a)},o),n===a&&r.a.createElement(V.a,{p:3},t))}var $=function(e){var t=Object(a.useState)(0),n=Object(u.a)(t,2),o=n[0],c=n[1];Object(a.useEffect)((function(){c(0)}),[e.data]);var i=r.a.useMemo((function(){return{maintainAspectRatio:!1,responsive:!0,scales:{xAxes:[{type:"linear",display:!0,labelString:"Milliseconds",ticks:{fontSize:"10",fontColor:"#969da5"}}],yAxes:[{display:!0,type:"linear",labelString:"Response Time",ticks:{beginAtZero:!0}}]}}}),[]),l=r.a.useMemo((function(){return{display:!0,position:"right",fullWidth:!0}}),[]);return r.a.createElement("div",null,r.a.createElement(J.a,{value:o,onChange:function(e,t){c(t)},"aria-label":"wrapped label tabs example"},e.data.map((function(e,t){return r.a.createElement(I.a,{value:t,label:"Chart ".concat(t),key:t})}))),e.data.map((function(t,n){return r.a.createElement(Z,{value:o,index:n,key:n},r.a.createElement("div",{style:{height:"100%",width:"100%",alignItems:"center",flex:1,display:"flex"}},r.a.createElement("div",{style:U({position:"relative"},e.style)},r.a.createElement(W.a,{data:t,options:i,legend:l}))))})))},q=Object(p.a)({palette:{primary:{main:f.a[300]},secondary:{main:m.a[500]}}});function F(e){return r.a.createElement("div",{className:"draggable-icon"},r.a.createElement(h.a,{color:"primary"}))}var K=function(){var e=Object(a.useState)(""),t=Object(u.a)(e,2),o=t[0],c=t[1],i=Object(a.useState)(),p=Object(u.a)(i,2),f=p[0],m=p[1],b=Object(a.useState)([{datasets:[]}]),h=Object(u.a)(b,2),v=h[0],g=h[1],O=Object(a.useState)(0),y=Object(u.a)(O,2),E=y[0],w=y[1],x=function(){var e=Object(a.useState)([0,0]),t=Object(u.a)(e,2),n=t[0],r=t[1];return Object(a.useLayoutEffect)((function(){var e=z()((function(){r((function(e){return[window.innerWidth,window.innerHeight]}))}),150);return window.addEventListener("resize",e),e(),function(){return window.removeEventListener("resize",e)}}),[]),n}(),C=Object(u.a)(x,2),k=C[0],B=C[1],_=Object(a.useState)(0),A=Object(u.a)(_,2),D=A[0],G=A[1],M=Object(a.useCallback)(Object(s.a)(l.a.mark((function e(){var t;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:o&&f&&(t=f.Events.from_text(o))&&g(R(t));case 1:case"end":return e.stop()}}),e)}))),[o,f]);Object(a.useEffect)((function(){0===D&&(G(B/2),w(B/2-64))}),[B,D]),Object(a.useEffect)((function(){Object(s.a)(l.a.mark((function e(){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=m,e.next=3,n.e(3).then(n.bind(null,255));case 3:e.t1=e.sent,(0,e.t0)(e.t1);case 5:case"end":return e.stop()}}),e)})))()}),[]);var H=B-E-128;return r.a.createElement("div",{className:"App"},r.a.createElement(d.a,{theme:q},r.a.createElement(S,{title:"Jordao's Challenge"}),r.a.createElement("div",{style:{height:B-128}},r.a.createElement(P.ResizableBox,{height:D-64,width:1/0,axis:"y",minConstraints:[0,.25*(B-128)],maxConstraints:[1/0,.75*(B-128)],onResize:function(e,t){t.element;var n=t.size;t.handle;w(n.height)},resizeHandles:["s"],handle:F},r.a.createElement(N,{height:E,handleEditorChange:function(e,t){t&&c(t)}})),r.a.createElement("div",{style:{height:H,width:k}},r.a.createElement($,{data:v,style:{height:"".concat(.9*H-64,"px"),width:"".concat(k,"px")}}))),r.a.createElement(j,{onGenerateChartButtonPress:M})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));B.monaco.init().then((function(e){e.languages.typescript.typescriptDefaults.setDiagnosticsOptions({noSemanticValidation:!0,noSyntaxValidation:!0})})).catch((function(e){return console.error("An error occurred during initialization of Monaco: ",e)})),c.a.render(r.a.createElement(K,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},98:function(e,t,n){e.exports=n(226)}},[[98,1,2]]]);
//# sourceMappingURL=main.1c929c3a.chunk.js.map