(this.webpackJsonpvirtual_office=this.webpackJsonpvirtual_office||[]).push([[38],{1457:function(e,t,c){},1458:function(e,t,c){},1496:function(e,t,c){"use strict";c.r(t);var n=c(493),a=c(0),r=c.n(a),i=c(509),o=(c(1457),c(32)),s=c(9),l=c(515),j=c(98),u=c(128),d=c(3),b=function(){var e=Object(a.useState)(4),t=Object(o.a)(e,2),c=t[0],b=t[1],m=Object(a.useState)(!1),h=Object(o.a)(m,2),f=h[0],p=h[1],O=Object(a.useState)([]),x=Object(o.a)(O,2),g=x[0],v=x[1],y=Object(j.c)((function(e){var t=[];return Array.from(e.projects.data).forEach((function(e,c){t.push({value:e.project.work_package_number,label:e.project.task_delivery_order.title+" > "+e.project.sub_task,data:e})})),t}));return r.a.useEffect((function(){s.a.get("project/all-files/").then((function(e){console.log(e),v(e.data.data)}))}),[]),Object(d.jsxs)(d.Fragment,{children:[Object(d.jsx)("h4",{className:"project-name",children:"Select Project"}),Object(d.jsx)(n.K,{children:Object(d.jsx)(n.k,{sm:"12",md:"4",lg:"4",children:Object(d.jsx)(l.a,{options:y,onChange:function(e,t){if("select-option"==t.action){var c=[];u.a.getState().projects.data;console.log("projects",g),Array.from(g).forEach((function(t,n){console.log("dd",t.project),t.work_package_number==e.value&&c.push(t)})),v(c)}}})})}),Object(d.jsx)("div",{className:"expand-btn-holder",children:Object(d.jsx)(n.f,{className:"see-all-btn mb-3",onClick:function(){4===c?(p(!0),b(4)):p(!1)},children:f?Object(d.jsx)("span",{children:"Show less"}):Object(d.jsx)("span",{children:"Show all"})})}),Object(d.jsx)(n.K,{children:g.slice(0,c).map((function(e,t){return Object(d.jsx)(n.k,{lg:"3",md:"6",sm:"6",children:Object(d.jsx)(n.g,{className:"doc-cards",children:Object(d.jsxs)(n.h,{className:"doc-file-body",onClick:function(){return function(e,t){var c=document.createElement("a");document.body.appendChild(c),c.href=e,c.target="_blank",c.download="",c.click()}(s.c+e.file)},children:[Object(d.jsx)("div",{className:"icon-holder-shared-files",children:Object(d.jsx)(i.a,{name:"cil-file",className:"file-icon-show",size:"2xl"})}),Object(d.jsx)("h5",{className:"file-name mt-2",children:e.fileName}),Object(d.jsxs)("h6",{className:"create-time",children:[Object(d.jsx)("span",{className:"thicc-header",children:"Created:"}),e.date_created]}),Object(d.jsxs)("h6",{className:"uploadedBy",children:[Object(d.jsx)("span",{className:"thicc-header",children:"Uploaded by:"}),e.upload_by.first_name]})]})})},t)}))})]})},m=c(17),h=c(1),f=(c(1458),c(607),c(505)),p=c(513),O=c.n(p),x=function(){var e={option:function(e,t){return Object(h.a)(Object(h.a)({},e),{},{fontSize:"14px !important"})}},t=Object(a.useState)(),c=Object(o.a)(t,2),r=c[0],i=c[1],u=Object(a.useState)(""),b=Object(o.a)(u,2),p=(b[0],b[1],Object(a.useState)([])),x=Object(o.a)(p,2),g=x[0],v=x[1],y=Object(a.useState)([]),N=Object(o.a)(y,2),w=N[0],E=N[1],S=Object(j.c)((function(e){var t=[];return Array.from(e.projects.data).forEach((function(e,c){t.push({value:e.project.id,label:e.project.task_delivery_order.title+" / "+e.project.sub_task,data:e})})),t}));return Object(d.jsx)(d.Fragment,{children:Object(d.jsx)(n.g,{className:"mt-4 upload-docs",children:Object(d.jsx)(n.h,{children:Object(d.jsxs)(n.l,{children:[Object(d.jsxs)("div",{className:"mb-3",children:[Object(d.jsx)(n.z,{className:"custom-label-5",htmlFor:"prjctSelect",children:"Select Project"}),Object(d.jsx)(l.a,{closeMenuOnSelect:!0,"aria-labelledby":"prjctSelect",id:"prjctSelect",minHeight:"35px",placeholder:"Select from list",isClearable:!0,isMulti:!1,onChange:function(e,t){"select-option"==t.action||"remove-value"==t.action?i(e):"clear"==t.action&&i(null)},classNamePrefix:"custom-forminput-6",value:r,options:S,styles:e})]}),Object(d.jsxs)("div",{className:"mb-3",children:[Object(d.jsx)(n.z,{htmlFor:"attachments",className:"custom-label-5",children:"Upload Documents"}),Object(d.jsxs)(n.z,{className:"custom-file-upload",children:[Object(d.jsx)(n.y,{type:"file",id:"file",className:"form-control form-control-file",onChange:function(e){return t=e.target.files[0],v([].concat(Object(m.a)(g),[t])),void E([].concat(Object(m.a)(w),[URL.createObjectURL(t)]));var t},accept:".xlsx, .xls, .csv, .pdf, image/*, application/gzip, .zip, .tar, .txt, .doc, .docx, .pptx, .ppt"}),Object(d.jsx)("img",{src:"assets/icons/upload-thin.svg",alt:"",className:"upload-icon"})]})]}),Object(d.jsx)("div",{className:"mb-3",children:Object(d.jsx)("div",{className:"row",children:w.map((function(e,t){return Object(d.jsx)("div",{className:"col-md-6 col-sm-6 col-lg-4",children:Object(d.jsxs)("div",{className:"file-attached-ongoing rounded-pill",children:[Object(d.jsx)(n.f,{className:"remove-file-ongoing",type:"button",onClick:function(){var e;e=t,console.log(w),E(Object(f.a)(w,w[e])),v(Object(f.a)(g,g[e]))},children:Object(d.jsx)("img",{src:"assets/icons/icons8-close-64-blue.svg",className:"close-icon-size"})}),g[t].name]})},t)}))})}),Object(d.jsx)("div",{className:"mb-3 mt-4",children:Object(d.jsxs)("div",{className:"project-form-button-holders ",children:[Object(d.jsx)(n.f,{className:"profile-form-btn update-profile",type:"button",onClick:function(){var e=new FormData;e.append("project",r.data.project.id),e.append("files",g.length),e.append("upload_by",sessionStorage.getItem(s.k)),Array.from(g).forEach((function(t,c){e.append("file"+(c+1),t)})),s.a.post("project/shared/document/create/",e).then((function(e){i(null),E([]),v([]),O()("Files are uploaded!","","success")}))},children:"Upload Documents"}),Object(d.jsx)(n.f,{className:"profile-form-btn cancel-update",children:"Cancel"})]})})]})})})})};t.default=function(){Object(j.c)((function(e){var t=[];return Array.from(e.projects.data).forEach((function(e,c){t.push({value:e.project.id,label:e.project.sub_task})})),t}));return Object(d.jsx)(d.Fragment,{children:Object(d.jsx)(n.l,{children:Object(d.jsxs)(n.U,{activeTab:"uploadDocs",children:[Object(d.jsxs)(n.G,{variant:"tabs",className:"tab-style",children:[Object(d.jsx)(n.H,{children:Object(d.jsxs)(n.I,{"data-tab":"uploadDocs",className:"special",children:[Object(d.jsx)(i.a,{name:"cil-arrow-thick-to-top"})," Upload Documents"]})}),Object(d.jsx)(n.H,{children:Object(d.jsxs)(n.I,{"data-tab":"viewDocs",className:"special",children:[Object(d.jsx)(i.a,{name:"cil-library",className:"mr-1"}),"View Shared Documents"]})})]}),Object(d.jsxs)(n.S,{children:[Object(d.jsx)(n.T,{"data-tab":"uploadDocs",children:Object(d.jsxs)(n.l,{children:[Object(d.jsx)("h3",{className:"profile-page-header",children:"Upload Documents"}),Object(d.jsx)(n.K,{children:Object(d.jsx)("div",{className:"col-lg-8 offset-lg-2",children:Object(d.jsx)(x,{})})})]})}),Object(d.jsx)(n.T,{"data-tab":"viewDocs",children:Object(d.jsx)(n.l,{children:Object(d.jsx)(n.K,{children:Object(d.jsx)("div",{className:"col-md-12",children:Object(d.jsx)(b,{})})})})})]})]})})})}},607:function(e,t,c){"use strict";var n=c(562),a=c(12),r=c(582),i=c(33),o=c(0),s=c.n(o),l=c(4),j=c(510),u=c(511),d=c(517),b=c(310),m=c(1569),h=(c(561),c(581),c(507),c(23),Array.isArray),f=Object.keys,p=Object.prototype.hasOwnProperty;function O(e,t){if(e===t)return!0;if(e&&t&&"object"==Object(i.a)(e)&&"object"==Object(i.a)(t)){var c,n,a,r=h(e),o=h(t);if(r&&o){if((n=e.length)!=t.length)return!1;for(c=n;0!==c--;)if(!O(e[c],t[c]))return!1;return!0}if(r!=o)return!1;var s=e instanceof Date,l=t instanceof Date;if(s!=l)return!1;if(s&&l)return e.getTime()==t.getTime();var j=e instanceof RegExp,u=t instanceof RegExp;if(j!=u)return!1;if(j&&u)return e.toString()==t.toString();var d=f(e);if((n=d.length)!==f(t).length)return!1;for(c=n;0!==c--;)if(!p.call(t,d[c]))return!1;for(c=n;0!==c--;)if(("_owner"!==(a=d[c])||!e.$$typeof)&&!O(e[a],t[a]))return!1;return!0}return e!==e&&t!==t}var x=function(e){var t=e.component,c=e.duration,r=void 0===c?1:c,i=e.in;e.onExited;var o=Object(a.a)(e,["component","duration","in","onExited"]),j={entering:{opacity:0},entered:{opacity:1,transition:"opacity ".concat(r,"ms")},exiting:{opacity:0},exited:{opacity:0}};return s.a.createElement(b.a,{mountOnEnter:!0,unmountOnExit:!0,in:i,timeout:r},(function(e){var c={style:Object(n.j)({},j[e])};return s.a.createElement(t,Object(l.a)({innerProps:c},o))}))},g=function(e){Object(d.a)(c,e);var t=Object(n.i)(c);function c(){var e;Object(j.a)(this,c);for(var n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];return(e=t.call.apply(t,[this].concat(a))).duration=260,e.rafID=void 0,e.state={width:"auto"},e.transition={exiting:{width:0,transition:"width ".concat(e.duration,"ms ease-out")},exited:{width:0}},e.getWidth=function(t){t&&isNaN(e.state.width)&&(e.rafID=window.requestAnimationFrame((function(){var c=t.getBoundingClientRect().width;e.setState({width:c})})))},e.getStyle=function(e){return{overflow:"hidden",whiteSpace:"nowrap",width:e}},e.getTransition=function(t){return e.transition[t]},e}return Object(u.a)(c,[{key:"componentWillUnmount",value:function(){this.rafID&&window.cancelAnimationFrame(this.rafID)}},{key:"render",value:function(){var e=this,t=this.props,c=t.children,a=t.in,r=this.state.width;return s.a.createElement(b.a,{enter:!1,mountOnEnter:!0,unmountOnExit:!0,in:a,timeout:this.duration},(function(t){var a=Object(n.j)(Object(n.j)({},e.getStyle(r)),e.getTransition(t));return s.a.createElement("div",{ref:e.getWidth,style:a},c)}))}}]),c}(o.Component),v=function(e){return function(t){var c=t.in,n=t.onExited,r=Object(a.a)(t,["in","onExited"]);return s.a.createElement(g,{in:c,onExited:n},s.a.createElement(e,Object(l.a)({cropWithEllipsis:c},r)))}},y=function(e){return function(t){return s.a.createElement(x,Object(l.a)({component:e,duration:t.isMulti?260:1},t))}},N=function(e){return function(t){return s.a.createElement(x,Object(l.a)({component:e},t))}},w=function(e){return function(t){return s.a.createElement(m.a,Object(l.a)({component:e},t))}},E=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},c=Object(n.c)({components:t}),r=c.Input,i=c.MultiValue,o=c.Placeholder,l=c.SingleValue,j=c.ValueContainer,u=Object(a.a)(c,["Input","MultiValue","Placeholder","SingleValue","ValueContainer"]);return Object(n.j)({Input:(e=r,function(t){t.in,t.onExited,t.appear,t.enter,t.exit;var c=Object(a.a)(t,["in","onExited","appear","enter","exit"]);return s.a.createElement(e,c)}),MultiValue:v(i),Placeholder:y(o),SingleValue:N(l),ValueContainer:w(j)},u)},S=E(),k=(S.Input,S.MultiValue,S.Placeholder,S.SingleValue,S.ValueContainer,Object(r.a)(E,(function(e,t){try{return O(e,t)}catch(c){if(c.message&&c.message.match(/stack|recursion/i))return console.warn("Warning: react-fast-compare does not handle circular references.",c.name,c.message),!1;throw c}})));t.a=k}}]);
//# sourceMappingURL=38.7af18354.chunk.js.map