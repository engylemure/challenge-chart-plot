(this["webpackJsonpchallenge-frontend"]=this["webpackJsonpchallenge-frontend"]||[]).push([[0],{103:function(e,t,n){},125:function(e,t,n){},134:function(e,t,n){},226:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(18),c=n.n(o),i=(n(103),n(29)),l=n.n(i),s=n(52),u=n(10),d=n(251),p=n(88),f=n(42),m=n(250),b=n(87),h=n.n(b),v=n(245),g=n(254),O=n(246),y=n(247),E=Object(v.a)((function(e){return{appBar:{top:"auto",bottom:0},grow:{flexGrow:1},button:{margin:e.spacing(1)},input:{display:"none"}}}));function j(e){var t=e.onGenerateChartButtonPress,n=E();return a.createElement(g.a,{position:"fixed",color:"primary",className:n.appBar},a.createElement(O.a,null,a.createElement(y.a,{variant:"contained",color:"secondary",className:n.button,onClick:t},"Generate Chart")))}var w=n(248),x=n(79),C=n.n(x),k=Object(v.a)((function(e){return{root:{flexGrow:1},icon:{marginLeft:e.spacing(1),marginRight:e.spacing(2)},title:{flexGrow:1}}}));function S(e){var t=e.title,n=k();return r.a.createElement("div",{className:n.root},r.a.createElement(g.a,{position:"static"},r.a.createElement(O.a,null,r.a.createElement(C.a,{className:n.icon}),r.a.createElement(w.a,{align:"left",variant:"h6",className:n.title},t))))}var B=n(27),P=(n(125),function(e){var t=e.height,n=void 0===t?"50vh":t,a=e.handleEditorChange;return r.a.createElement(B.ControlledEditor,{theme:"dark",height:n,onChange:a,language:"typescript"})}),z=n(80),_=n(81),A=n.n(_);n(134),n(135);function N(){return Math.round(255*Math.random())}function D(e){return e.charAt(0).toUpperCase()+e.slice(1)}function G(e,t){var n=e[0]?"".concat(D(e[0])," "):"",a=e[1]?"".concat(D(e[1])," "):"";return"".concat(n).concat(a).concat(t.split("_").reduce((function(e,t){return e?"".concat(e," ").concat(D(t)):D(t)}),""))}function M(e){if(e){for(var t=[],n=0;n<e.events_count();n++){var a=e.get_events_data_by_idx(n);if(a){var r=a.dataset_vec().map((function(e){var t={green:N(),red:N(),blue:N()},n="rgba(".concat(t.red,", ").concat(t.green,", ").concat(t.blue,", 1)"),a="rgba(".concat(t.red,", ").concat(t.green,", ").concat(t.blue,", 0.4)");return{label:G(e.group,e.selection),fill:!1,pointHoverBorderColor:"rgba(220,220,220,1)",backgroundColor:a,borderColor:n,pointBorderColor:n,pointHoverBackgroundColor:n,data:e.points.map((function(t){return{x:t.timestamp-e.points[0].timestamp,y:t.value}}))}}));t.push({datasets:r})}}return t}return[{datasets:[]}]}var R=n(82),H=n(89),L=n(83),W=n(253),J=n(249),I=n(252);function V(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function T(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?V(n,!0).forEach((function(t){Object(R.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):V(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function U(e){var t=e.children,n=e.value,a=e.index,o=Object(H.a)(e,["children","value","index"]);return r.a.createElement(w.a,Object.assign({component:"div",role:"tabpanel",hidden:n!==a,id:"wrapped-tabpanel-".concat(a),"aria-labelledby":"wrapped-tab-".concat(a)},o),n===a&&r.a.createElement(I.a,{p:3},t))}var Z=function(e){var t=Object(a.useState)(0),n=Object(u.a)(t,2),o=n[0],c=n[1];Object(a.useEffect)((function(){c(0)}),[e.data]);var i=r.a.useMemo((function(){return{maintainAspectRatio:!1,responsive:!0,scales:{xAxes:[{type:"linear",display:!0,labelString:"Milliseconds",ticks:{fontSize:"10",fontColor:"#969da5"}}],yAxes:[{display:!0,type:"linear",labelString:"Response Time",ticks:{beginAtZero:!0}}]}}}),[]),l=r.a.useMemo((function(){return{display:!0,position:"right",fullWidth:!0}}),[]);return r.a.createElement("div",null,r.a.createElement(W.a,{value:o,onChange:function(e,t){c(t)},"aria-label":"wrapped label tabs example"},e.data.map((function(e,t){return r.a.createElement(J.a,{value:t,label:"Chart ".concat(t),key:t})}))),e.data.map((function(t,n){return r.a.createElement(U,{value:o,index:n,key:n},r.a.createElement("div",{style:{height:"100%",width:"100%",alignItems:"center",flex:1,display:"flex"}},r.a.createElement("div",{style:T({position:"relative"},e.style)},r.a.createElement(L.a,{data:t,options:i,legend:l}))))})))},$=Object(p.a)({palette:{primary:{main:f.a[300]},secondary:{main:m.a[500]}}});function q(e){return r.a.createElement("div",{className:"draggable-icon"},r.a.createElement(h.a,{color:"primary"}))}var F=function(){var e=Object(a.useState)(""),t=Object(u.a)(e,2),o=t[0],c=t[1],i=Object(a.useState)(),p=Object(u.a)(i,2),f=p[0],m=p[1],b=Object(a.useState)([{datasets:[]}]),h=Object(u.a)(b,2),v=h[0],g=h[1],O=Object(a.useState)(0),y=Object(u.a)(O,2),E=y[0],w=y[1],x=function(){var e=Object(a.useState)([0,0]),t=Object(u.a)(e,2),n=t[0],r=t[1];return Object(a.useLayoutEffect)((function(){var e=A()((function(){r((function(e){return[window.innerWidth,window.innerHeight]}))}),150);return window.addEventListener("resize",e),e(),function(){return window.removeEventListener("resize",e)}}),[]),n}(),C=Object(u.a)(x,2),k=C[0],B=C[1],_=Object(a.useState)(0),N=Object(u.a)(_,2),D=N[0],G=N[1],R=Object(a.useCallback)(Object(s.a)(l.a.mark((function e(){var t;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:o&&f&&(t=f.Events.from_text(o))&&g(M(t));case 1:case"end":return e.stop()}}),e)}))),[o,f]);Object(a.useEffect)((function(){0===D&&(G(B/2),w(B/2-64))}),[B,D]),Object(a.useEffect)((function(){Object(s.a)(l.a.mark((function e(){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=m,e.next=3,n.e(3).then(n.bind(null,255));case 3:e.t1=e.sent,(0,e.t0)(e.t1);case 5:case"end":return e.stop()}}),e)})))()}),[]);var H=B-E-128;return r.a.createElement("div",{className:"App"},r.a.createElement(d.a,{theme:$},r.a.createElement(S,{title:"Jordao's Challenge"}),r.a.createElement("div",{style:{height:B-128}},r.a.createElement(z.ResizableBox,{height:D-64,width:1/0,axis:"y",minConstraints:[0,.25*(B-128)],maxConstraints:[1/0,.75*(B-128)],onResize:function(e,t){t.element;var n=t.size;t.handle;w(n.height)},resizeHandles:["s"],handle:q},r.a.createElement(P,{height:E,handleEditorChange:function(e,t){t&&c(t)}})),r.a.createElement("div",{style:{height:H,width:k}},r.a.createElement(Z,{data:v,style:{height:"".concat(.9*H-64,"px"),width:"".concat(k,"px")}}))),r.a.createElement(j,{onGenerateChartButtonPress:R})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));B.monaco.init().then((function(e){e.languages.typescript.typescriptDefaults.setDiagnosticsOptions({noSemanticValidation:!0,noSyntaxValidation:!0})})).catch((function(e){return console.error("An error occurred during initialization of Monaco: ",e)})),c.a.render(r.a.createElement(F,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},98:function(e,t,n){e.exports=n(226)}},[[98,1,2]]]);
//# sourceMappingURL=main.51ea7c15.chunk.js.map