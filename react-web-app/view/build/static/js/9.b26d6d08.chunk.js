(this.webpackJsonpvirtual_office=this.webpackJsonpvirtual_office||[]).push([[9],{1062:function(e,t,a){},1098:function(e,t,a){},1100:function(e,t,a){},1550:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(98),c=a(9),s=a(120),i=a(100),l=a(107),d=a(1),u=a(32),m=a(14),b=a(493),j=a(510),h=a(511),p=function(){function e(t){var a=t.timeout,n=t.onTimeout,o=t.onExpired;Object(j.a)(this,e),this.timeout=a,this.onTimeout=n;var r=parseInt(localStorage.getItem("_expiredTime"),10);r>0&&r<Date.now()?o():(this.eventHandler=this.updateExpiredTime.bind(this),this.tracker(),this.startInterval())}return Object(h.a)(e,[{key:"startInterval",value:function(){var e=this;this.updateExpiredTime(),this.interval=setInterval((function(){parseInt(localStorage.getItem("_expiredTime"),10)<Date.now()&&e.onTimeout&&(e.onTimeout(),e.cleanUp())}),1e3)}},{key:"updateExpiredTime",value:function(){var e=this;this.timeoutTracker&&clearTimeout(this.timeoutTracker),this.timeoutTracker=setTimeout((function(){localStorage.setItem("_expiredTime",Date.now()+2e3*e.timeout)}),300)}},{key:"tracker",value:function(){window.addEventListener("mousemove",this.eventHandler),window.addEventListener("scroll",this.eventHandler),window.addEventListener("keydown",this.eventHandler)}},{key:"cleanUp",value:function(){localStorage.removeItem("_expiredTime"),clearInterval(this.interval),window.removeEventListener("mousemove",this.eventHandler),window.removeEventListener("scroll",this.eventHandler),window.removeEventListener("keydown",this.eventHandler)}}]),e}(),x=a(789),f=a(3),g=Object(f.jsx)("div",{className:"pt-3 text-center",children:Object(f.jsx)("div",{className:"sk-spinner sk-spinner-pulse"})}),v=function(){var e=o.a.useState(!1),t=Object(u.a)(e,2),a=(t[0],t[1]),r=Object(m.g)();return o.a.useEffect((function(){var e=new p({timeout:600,onTimeout:function(){a(!0),sessionStorage.clear(),r.push("/login"),console.log("timed out")},onExpired:function(){a(!0),sessionStorage.clear(),r.push("/login"),console.log("expired")}});return function(){e.cleanUp()}}),[]),Object(f.jsx)("main",{className:"c-main",children:Object(f.jsx)(b.l,{children:Object(f.jsx)(n.Suspense,{fallback:g,children:Object(f.jsx)(m.d,{children:x.a.map((function(e,t){return e.component&&Object(f.jsx)(m.b,{path:e.path,exact:e.exact,name:e.name,render:function(t){return Object(f.jsx)(b.r,{children:Object(f.jsx)(e.component,Object(d.a)({},t))})}},t)}))})})})})},O=o.a.memo(v),y=a(40),k=function(){var e=Object(n.useState)(""),t=Object(u.a)(e,2),a=t[0],o=t[1];return Object(n.useEffect)((function(){var e=(new Date).getFullYear();o(e)}),[]),Object(f.jsxs)(b.s,{fixed:!1,children:[Object(f.jsxs)("div",{children:[Object(f.jsx)(y.b,{to:"/dashboard/release-notes",children:"Release Notes"}),Object(f.jsxs)("span",{className:"ml-1",children:["\xa9 DMA ",a]})]}),Object(f.jsxs)("div",{className:"mfs-auto",children:[Object(f.jsx)("span",{className:"mr-1",children:"Powered by"}),Object(f.jsx)("a",{href:"https://dma.com.bd",target:"_blank",rel:"noopener noreferrer",children:"DMA"})]})]})},w=o.a.memo(k),S=a(509),P=a(125),N=(a(1062),a(1558)),_=a(1552),C=a(1574),T=a(707),D=a.n(T),M=a(630),I=a.n(M),z=a(1560),E=a(1562),W=a(1571),Y=a(1565),A=a(1544),B=a(790),Q=a.n(B),F=a(479),H=a(36),V=a(1546),L=a(1570),R=a(1559),U=(a(792),a(1564)),G=(a(1566),a(1567),a(1568)),J=a(1554);a(1547);Object(H.a)(N.a)((function(e){var t=e.theme;return Object(d.a)(Object(d.a)({backgroundColor:"dark"===t.palette.mode?"#1A2027":"#fff"},t.typography.body2),{},{padding:t.spacing(1),textAlign:"center",color:t.palette.text.secondary})}));a(1572),a(1573),a(1070);var q=a(12),K=a(1575),X=a(1551),Z=a(1576),$=a(1071),ee=a.n($),te=a(1548),ae=a(53),ne=a(1091),oe=a.n(ne),re=a(1092),ce=a.n(re),se=a(1093),ie=a.n(se),le=a(1095),de=a.n(le),ue=a(1094),me=a.n(ue),be=["children","value","index"],je=n.forwardRef((function(e,t){return Object(f.jsx)(F.a,Object(d.a)({direction:"up",ref:t},e))}));function he(e){return Object(f.jsx)(Q.a,{handle:"#draggable-dialog-title",cancel:'[class*="MuiDialogContent-root"]',children:Object(f.jsx)(N.a,Object(d.a)({},e))})}Object(H.a)(N.a)((function(e){var t=e.theme;return Object(d.a)(Object(d.a)({backgroundColor:"dark"===t.palette.mode?"#1A2027":"#fff"},t.typography.body2),{},{padding:t.spacing(1),textAlign:"center",color:t.palette.text.secondary})}));function pe(e){var t=e.children,a=e.value,n=e.index,o=Object(q.a)(e,be);return Object(f.jsx)("div",Object(d.a)(Object(d.a)({role:"tabpanel",hidden:a!==n,id:"full-width-tabpanel-".concat(n),"aria-labelledby":"full-width-tab-".concat(n)},o),{},{children:a===n&&Object(f.jsx)(K.a,{sx:{p:3},children:Object(f.jsx)(U.a,{children:t})})}))}function xe(e){return{id:"full-width-tab-".concat(e),"aria-controls":"full-width-tabpanel-".concat(e)}}function fe(e){var t,a,o,r,s,i,l,b,j=n.useState(!1),h=Object(u.a)(j,2),p=(h[0],h[1],Object(m.g)()),x=n.useState(0),g=Object(u.a)(x,2),v=g[0],O=g[1],y=Object(ae.a)();return Object(f.jsx)("div",{children:Object(f.jsxs)(E.a,{maxWidth:"sm",fullWidth:!0,open:e.open,onClose:e.handleClose,PaperComponent:he,"aria-labelledby":"draggable-dialog-title",TransitionComponent:je,children:[Object(f.jsx)(A.a,{style:{cursor:"move"},id:"draggable-dialog-title",children:"Search Result"}),Object(f.jsxs)(Y.a,{children:[Object(f.jsxs)(U.a,{sx:{fontSize:14,fontWeight:"bold",marginBottom:3},color:"#000000",children:["You searched for '",e.searchText,"'"]}),Object(f.jsxs)(K.a,{sx:{width:"100%",bgcolor:"background.paper"},children:[Object(f.jsxs)(X.a,{value:v,onChange:function(e,t){O(t)},centered:!0,indicatorColor:"primary",children:[Object(f.jsx)(Z.a,Object(d.a)({icon:Object(f.jsx)(oe.a,{fontSize:"small"}),label:"Employees ("+(null===(t=e.result)||void 0===t||null===(a=t.employees)||void 0===a?void 0:a.length)+")"},xe(0))),Object(f.jsx)(Z.a,Object(d.a)({icon:Object(f.jsx)(ce.a,{fontSize:"small"}),label:"Projects ("+(null===(o=e.result)||void 0===o||null===(r=o.projects)||void 0===r?void 0:r.length)+")"},xe(1))),Object(f.jsx)(Z.a,Object(d.a)({icon:Object(f.jsx)(ie.a,{fontSize:"small"}),label:"WBS"},xe(2))),Object(f.jsx)(Z.a,Object(d.a)({icon:Object(f.jsx)(me.a,{fontSize:"small"}),label:"Meetings"},xe(3)))]}),Object(f.jsxs)(ee.a,{axis:"rtl"===y.direction?"x-reverse":"x",index:v,onChangeIndex:function(e){O(e)},children:[Object(f.jsx)(pe,{value:v,index:0,dir:y.direction,children:Object(f.jsx)(G.a,{sx:{width:"100%",bgcolor:"background.paper"},children:(null===(s=e.result)||void 0===s||null===(i=s.employees)||void 0===i?void 0:i.length)>0&&Array.from(e.result.employees).map((function(t,a){var n,o;return Object(f.jsxs)(J.a,{secondaryAction:Object(f.jsx)(C.a,{edge:"end","aria-label":"View Profile",title:"View Profile",onClick:function(){e.handleClose(),p.push("/dashboard/profile/"+t.id)},children:Object(f.jsx)(de.a,{})}),children:[Object(f.jsx)(L.a,{children:Object(f.jsx)(R.a,{children:Object(f.jsx)("img",{src:c.c+t.profile_pic})})}),Object(f.jsx)(V.a,{primary:t.first_name+" "+t.last_name,secondary:null===(n=t.slc_details)||void 0===n||null===(o=n.slc)||void 0===o?void 0:o.name})]},a)}))})}),Object(f.jsx)(pe,{value:v,index:1,dir:y.direction,children:Object(f.jsx)(G.a,{sx:{width:"100%",maxWidth:360,bgcolor:"background.paper"},children:(null===(l=e.result)||void 0===l||null===(b=l.projects)||void 0===b?void 0:b.length)>0&&Array.from(e.result.projects).map((function(t,a){return Object(f.jsxs)(J.a,{onClick:function(){e.handleClose(),function(e){console.log(e),p.push({pathname:"/dashboard/Projects/my-projects/details/"+e.work_package_number,state:{project:e}})}(t)},children:[Object(f.jsx)(te.a,{children:Object(f.jsx)(ce.a,{})}),Object(f.jsx)(V.a,{primary:t.sub_task,secondary:"Planned Delivery Date: "+t.planned_delivery_date})]},a)}))})}),Object(f.jsx)(pe,{value:v,index:2,dir:y.direction,children:"This Section is currently under development"}),Object(f.jsx)(pe,{value:v,index:3,dir:y.direction,children:"This Section is currently under development"})]})]})]}),Object(f.jsx)(W.a,{children:Object(f.jsx)(z.a,{autoFocus:!0,onClick:e.handleClose,children:"Close"})})]})})}var ge=a(480),ve=a(1557),Oe=a(1577),ye=a(1097),ke=a.n(ye),we=Object(H.a)((function(e){return Object(f.jsx)(ve.a,Object(d.a)({elevation:0,anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"}},e))}))((function(e){var t=e.theme;return{"& .MuiPaper-root":{borderRadius:6,marginTop:t.spacing(1),minWidth:180,color:"light"===t.palette.mode?"rgb(55, 65, 81)":t.palette.grey[300],boxShadow:"rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px","& .MuiMenu-list":{padding:"4px 0"},"& .MuiMenuItem-root":{"& .MuiSvgIcon-root":{fontSize:18,color:t.palette.text.secondary,marginRight:t.spacing(1.5)},"&:active":{backgroundColor:Object(ge.a)(t.palette.primary.main,t.palette.action.selectedOpacity)}}}}}));function Se(e){var t=o.a.useState(null),a=Object(u.a)(t,2),n=a[0],r=a[1],c=Boolean(n),s=o.a.useState(["Employee","Project"]),i=Object(u.a)(s,2),l=i[0],d=(i[1],o.a.useState("Employee")),m=Object(u.a)(d,2),b=m[0],j=m[1],h=function(e){j(e),r(null)};return Object(f.jsxs)("div",{children:[Object(f.jsx)(z.a,{id:"demo-customized-button","aria-controls":c?"demo-customized-menu":void 0,"aria-haspopup":"true","aria-expanded":c?"true":void 0,disableElevation:!0,onClick:function(e){r(e.currentTarget)},endIcon:Object(f.jsx)(ke.a,{}),children:b}),Object(f.jsx)(we,{id:"demo-customized-menu",MenuListProps:{"aria-labelledby":"demo-customized-button"},anchorEl:n,open:c,onClose:h,children:Array.from(l).map((function(e,t){return Object(f.jsx)(Oe.a,{onClick:function(){h(e)},disableRipple:!0,children:e})}))})]})}var Pe=function(){var e=Object(n.useState)(""),t=Object(u.a)(e,2),a=t[0],o=t[1],r=Object(n.useState)(!1),s=Object(u.a)(r,2),i=s[0],l=s[1],d=Object(n.useState)([]),m=Object(u.a)(d,2),b=m[0],j=m[1],h=function(){String(a).length>0&&c.a.get("search?key="+a).then((function(e){console.log(e.data.data),j(e.data.data),l(!0)}))};return Object(f.jsx)(f.Fragment,{children:Object(f.jsxs)(N.a,{component:"form",variant:"outlined",rounded:"true",sx:{p:"2px 4px",margin:1,display:"flex",alignItems:"center",width:400},children:[Object(f.jsx)(Se,{onSelect:function(){}}),Object(f.jsx)(_.a,{sx:{ml:1,flex:1},placeholder:"Search",inputProps:{"aria-label":"search"},value:a,onChange:function(e){return o(e.target.value)},onKeyPress:function(e){"Enter"===e.key&&h()}}),0==String(a).length?Object(f.jsx)(C.a,{type:"button",sx:{p:"10px",color:"rgb(0 82 204)"},"aria-label":"search",onClick:h,children:Object(f.jsx)(I.a,{})}):Object(f.jsx)(C.a,{type:"button",sx:{p:"10px",color:"rgb(0 82 204)"},"aria-label":"search",onClick:function(){return o("")},children:Object(f.jsx)(D.a,{})}),Object(f.jsx)(fe,{open:i,handleClose:function(){return l(!1)},searchText:a,result:b})]})})},Ne=function(){var e=Object(r.b)(),t=Object(r.c)((function(e){return e.sidebar.sidebarShow})),a=Object(m.g)();return o.a.useEffect((function(){console.log("sidebar --- ",t)}),[]),Object(f.jsxs)(b.u,{withSubheader:!0,className:"justify-content-between",colorScheme:"light",children:[Object(f.jsx)(b.W,{inHeader:!0,className:"ml-md-3 d-lg-none",onClick:function(){var a=!![!1,"responsive"].includes(t)||"responsive";e(Object(P.a)(a))}}),Object(f.jsx)(b.W,{inHeader:!0,className:"ml-3 d-md-down-none",onClick:function(){var a=![!0,"responsive"].includes(t)&&"responsive";e(Object(P.a)(a))}}),Object(f.jsx)(b.v,{className:"d-md-down-none",children:Object(f.jsx)(b.w,{className:"px-3 justify-content-between",children:Object(f.jsx)(Pe,{})})}),Object(f.jsx)(b.v,{className:"px-3",children:Object(f.jsx)(_e,{})}),Object(f.jsxs)(b.R,{className:"px-3 justify-content-between",children:[Object(f.jsxs)(b.f,{className:"back-button",onClick:function(){a.length>0?a.goBack():a.push({pathname:"/dashboard"})},children:[Object(f.jsx)(S.a,{name:"cil-arrow-thick-from-right",className:"mr-2"}),"Back"]}),Object(f.jsx)(b.e,{className:"border-0 c-subheader-nav m-0 px-0 px-md-3 custom-router",routes:x.a})]})]})},_e=function(){var e=Object(m.g)(),t=Object(r.c)((function(e){return e.profile.data}));return Object(f.jsxs)(b.n,{inNav:!0,className:"c-header-nav-items mx-2",direction:"down",children:[Object(f.jsxs)(b.q,{className:"c-header-nav-link",caret:!1,children:[Object(f.jsx)("div",{className:"c-avatar",children:Object(f.jsx)(b.x,{src:null!=t.profile_pic?c.c+t.profile_pic:"avatars/user-avatar-default.png",className:"c-avatar-img",alt:"admin@bootstrapmaster.com"})}),Object(f.jsx)("span",{className:"ml-2  u-name",children:t.first_name})]}),Object(f.jsxs)(b.p,{className:"pt-0",placement:"bottom-end",children:[Object(f.jsx)(b.o,{header:!0,tag:"div",color:"light",className:"text-center drop-text",children:Object(f.jsx)("strong",{children:"Account"})}),Object(f.jsxs)(b.o,{className:"drop-text",to:"/dashboard/profile/"+sessionStorage.getItem(c.k),children:[Object(f.jsx)(S.a,{name:"cil-user",className:"mfe-2"}),"Profile"]}),Object(f.jsx)(b.o,{divider:!0}),Object(f.jsxs)(b.o,{onClick:function(){c.a.get("auth/logout/").then((function(t){window.sessionStorage.clear(),e.push("/")})).catch((function(t){sessionStorage.clear(),e.push("/")}))},className:"drop-text",children:[Object(f.jsx)(S.a,{name:"cil-account-logout",className:"mfe-2"}),"Log out"]})]})]})},Ce=(a(1098),a(505)),Te=function(){var e=Object(r.b)(),t=Object(m.g)(),a=Object(r.c)((function(e){return e.sidebar.sidebarShow})),n=Object(m.h)();o.a.useEffect((function(){var e=n.pathname;console.log(e),e.match("/dashboard/Projects/")&&console.log(e),e.match("/dashboard/WBS/")&&console.log(e),e.match("/dashboard/EVMS/")&&console.log(e)}),[n]);return Object(f.jsxs)(b.L,{colorScheme:"light",show:a,onShowChange:function(t){return e(Object(P.a)(t))},children:[Object(f.jsxs)(b.M,{className:"d-md-down-none custom-color",to:"/",children:[Object(f.jsx)(b.x,{className:"c-sidebar-brand-full",src:"assets/icons/VirtualOffice.svg",height:115,width:250}),Object(f.jsx)("span",{className:"c-sidebar-brand-minimized name-brand1",children:"VO"})]}),Object(f.jsxs)(b.O,{className:"vo-sidebar",children:[Object(f.jsx)(b.Q,{to:"/dashboard",icon:"cil-list",name:"Dashboard",className:"vo-navItem "}),Object(f.jsxs)(b.P,{icon:"cil-lightbulb",name:"Projects",className:"vo-navItem",route:"/dashboard/Projects/",children:[Object(Ce.g)("projects.add_projects")&&Object(f.jsx)(b.Q,{to:"/dashboard/Projects/create-new-project",name:"Create New Project",className:"vo-navItem"}),Object(Ce.g)("projects.add_projects")&&Object(f.jsx)(b.Q,{to:"/dashboard/Projects/my-projects",name:"My Projects",className:"vo-navItem"}),Object(f.jsx)(b.Q,{to:"/dashboard/Projects/assigned-projects",name:"Assigned Projects",className:"vo-navItem"}),Object(Ce.g)("projects.add_projects")&&Object(f.jsx)(b.Q,{to:"/dashboard/Projects/time-extension",name:"Time Extension",className:"vo-navItem"}),Object(f.jsx)(b.Q,{to:"/dashboard/Projects/completed-projects",name:"Completed Projects",className:"vo-navItem"})]}),Object(f.jsxs)(b.P,{icon:"cil-spreadsheet",name:"WBS",className:"vo-navItem",children:[Object(f.jsx)(b.Q,{to:"/dashboard/WBS/create-wbs-employee",name:"Create WBS",className:"vo-navItem"}),Object(Ce.g)("projects.add_projects")&&Object(f.jsx)(b.Q,{to:"/dashboard/WBS/not-started",name:"Create WBS (PM)",className:"vo-navItem"}),Object(f.jsx)(b.Q,{to:"/dashboard/WBS/board",name:"Board",className:"vo-navItem"})]}),Object(Ce.g)("evms.view_evms")&&Object(f.jsxs)(b.P,{icon:"cil-chart-line",name:"EVMS",className:"vo-navItem",children:[Object(f.jsx)(b.Q,{to:"/dashboard/EVMS/create",name:"Create EVMS",className:"vo-navItem"}),Object(f.jsx)(b.Q,{to:"/dashboard/EVMS/view",name:"View EVMS",className:"vo-navItem"})]}),!Object(Ce.g)("projects.add_projects")&&Object(f.jsxs)(b.P,{icon:"cil-library",name:"Timecards",className:"vo-navItem",children:[Object(f.jsx)(b.Q,{to:"/dashboard/timecard/generate-timecard",name:"This Week",className:"vo-navItem"}),Object(f.jsx)(b.Q,{to:"/dashboard/timecard/view-previous-hours",name:"Previous Weeks",className:"vo-navItem"}),Object(f.jsx)(b.Q,{to:"/dashboard/timecard/submitted-timecards",name:"Submitted Timecards",className:"vo-navItem"})]}),Object(Ce.g)("projects.add_projects")&&Object(f.jsxs)(b.P,{icon:"cil-library",name:"Timecards",className:"vo-navItem",children:[Object(f.jsx)(b.Q,{to:"/dashboard/timecard/generate-timecard",name:"This Week",className:"vo-navItem"}),Object(f.jsx)(b.Q,{to:"/dashboard/timecard/view-previous-hours",name:"Previous Weeks",className:"vo-navItem"}),Object(f.jsx)(b.Q,{to:"/dashboard/timecard/submitted-timecards",name:"Submitted Timecards",className:"vo-navItem"})]}),Object(f.jsx)(b.Q,{to:"/dashboard/meetings",icon:"cil-group",name:"Meetings",className:"vo-navItem"}),Object(f.jsx)(b.Q,{to:"/dashboard/shared-documents",name:"Shared Documents",icon:"cil-folder-open",className:"vo-navItem"}),Object(f.jsx)(b.Q,{to:"/dashboard/holidays",icon:"cil-calendar",name:"Holidays",className:"vo-navItem"}),Object(f.jsx)("hr",{}),Object(f.jsx)(b.Q,{to:"/dashboard/profile/"+sessionStorage.getItem(c.k),name:"Profile",icon:"cil-user",className:"vo-navItem"}),Object(f.jsx)(b.Q,{onClick:function(){c.a.get("auth/logout/").then((function(e){sessionStorage.clear(),t.push("/")})).catch((function(e){sessionStorage.clear(),t.push("/")}))},name:"Logout",icon:"cil-account-logout",className:"vo-navItem"})]}),Object(f.jsx)(b.N,{})]})},De=o.a.memo(Te),Me=(a(1100),a(110)),Ie=a(116),ze=a(117),Ee=a(127);t.default=function(){var e=Object(r.b)();return o.a.useEffect((function(){e(Object(i.e)(sessionStorage.getItem(c.k))),e(Object(l.c)(sessionStorage.getItem(c.k))),e(Object(l.b)(sessionStorage.getItem(c.k))),e(Object(s.b)(sessionStorage.getItem(c.k))),e(Object(Ie.b)(sessionStorage.getItem(c.k))),e(Object(ze.c)(sessionStorage.getItem(c.k))),e(Object(ze.b)(sessionStorage.getItem(c.k))),e(Object(Ee.b)()),Object(Ce.g)("projects.add_projects")&&(console.log("is PM"),e(Object(i.d)(sessionStorage.getItem(c.k))),e(Object(Me.b)(sessionStorage.getItem(c.k))))}),[]),Object(f.jsxs)("div",{className:"c-app c-default-layout",children:[Object(f.jsx)(De,{}),Object(f.jsxs)("div",{className:"c-wrapper",children:[Object(f.jsx)(Ne,{}),Object(f.jsx)("div",{className:"c-body pt-10 custom-color-c-app",children:Object(f.jsx)(O,{})}),Object(f.jsx)(w,{})]})]})}},505:function(e,t,a){"use strict";a.d(t,"h",(function(){return d})),a.d(t,"g",(function(){return u})),a.d(t,"a",(function(){return m})),a.d(t,"b",(function(){return b})),a.d(t,"c",(function(){return j})),a.d(t,"f",(function(){return h})),a.d(t,"d",(function(){return x})),a.d(t,"e",(function(){return f}));var n=a(6),o=a(10),r=a(9),c=a(74),s=a.n(c),i=a(644),l=(a(685),a(541)),d=function(e){r.a.get("organizations/user/hours/used-left/"+e+"/").then((function(e){return console.log("used and left hours",e.data.data),e.data.data}))},u=function(e){return null!=sessionStorage.getItem(r.g)&&sessionStorage.getItem(r.g).split(",").includes(e)};function m(e,t){return e.filter((function(e){return e!=t}))}function b(e){return void 0!=e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():""}function j(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return e.charAt(0).toUpperCase()+e.slice(1)}function h(e,t,a,n,o){return p.apply(this,arguments)}function p(){return(p=Object(o.a)(Object(n.a)().mark((function e(t,o,r,c,i){var d,u,m,b,j,h,p,x,f,g,v,O,y,k,w;return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(console.log("pdf",t.length),console.log("pdftitle",o),d=a(793),u=new d.Workbook,(m=u.addWorksheet("sheet1")).mergeCells("C1:E2"),(b=m.getCell("C1")).value="Datasoft Manufacturing & Assembly",b.font={size:15,bold:!0},m.getCell("C1").alignment={horizontal:"center",vertical:"center"},m.mergeCells("C3:E3"),(j=m.getCell("C3")).value="Gulshan Branch",j.font={size:13,bold:!0},j.alignment={horizontal:"center",vertical:"center"},m.mergeCells("A5:B5"),m.getCell("A5").value="Actual Worked Hours",m.mergeCells("F6:G6"),s()(r).format("DD/MM/YYYY"),m.mergeCells("A6:D6"),m.getCell("A6").value="Name: "+o,{top:{style:"thin"},left:{style:"thin"},bottom:{style:"thin"},right:{style:"thin"}},m.getRow(8).values=["WP","Project Name","Task Title","Description","Hour(s)","Type","Date Created"],m.getRow(8).font={name:"Arial Black",family:3,size:10},m.getRow(8).height=20,m.columns=[{key:"wp",width:10},{key:"name",width:30},{key:"task_title",width:32},{key:"description",width:32},{key:"hours",width:17},{key:"type",width:15},{key:"date_created",width:15}],h=0;h<t.length;h++)m.addRow({wp:t[h].data.project.work_package_number,name:t[h].data.project.sub_task,task_title:t[h].data.project.task_title,description:t[h].data.actual_work_done,hours:t[h].data.hours_today,type:t[h].data.time_type,date_created:t[h].data.date_created});return p=t.length+11,0!=c&&(x=t.length+10,m.getRow(x).values=["","","","","Total="+Number(c).toFixed(2)]),0!=c&&(m.getRow(p).values=["From "+i+" to "+r]),f=new Date,f.toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}),f=s()(f).format("DD/MM/YY"),e.next=35,u.xlsx.writeBuffer(t);case 35:g=e.sent,"application/octet-stream",".xlsx",v=new Blob([g],{type:"application/octet-stream"}),O=new Date,y=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][O.getDay()],k=s()(O).format("DD-MM-YYYY"),w=o+"_"+y+"_"+k+".xlsx",Object(l.saveAs)(v,w);case 46:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function x(e,t,a,n,o){var r=new i.default("portrait","pt","A4");r.setFontSize(15);var c={startY:145,head:[["WP","Project Name","Task Title","Description","Hour(s)","Type","Date Created"]],body:e.map((function(e,t){return[e.data.project.work_package_number,e.data.project.sub_task,e.data.project.task_title,e.data.actual_work_done,e.data.hours_today,e.data.time_type,e.data.date_created]}))},l=new Date;l.toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0});l=s()(l).format("DD/MM/YY");s()(a).format("DD/MM/YYYY");r.setFontSize(17),r.text(170,50,"Datasoft Manufacturing & Assembly"),r.setFontSize(13),r.text(245,75,"Gulshan Branch"),r.setFontSize(11),r.text(42,105,"Actual Worked Hours"),r.text(42,125,"Name: "+t),r.autoTable(c);var d=new Date;console.log("date",d),0!=n&&r.text(42,r.lastAutoTable.finalY+25,"From "+o+" to "+a),r.text(430,r.lastAutoTable.finalY+25," Total Hours "+Number(n).toFixed(2));var u=new Date,m=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][u.getDay()],b=s()(u).format("DD-MM-YYYY"),j=t;r.save(j+"_"+m+"_"+b+".pdf"),console.log("data",e)}function f(e,t,a,n,o){var r=new i.default("portrait","pt","A4");r.setFontSize(15);var c={startY:145,head:[["WP","Project Name","Task Title","Description","Hour(s)","Type","Date Created"]],body:e.map((function(e,t){return[e.data.project.work_package_number,e.data.project.sub_task,e.data.project.task_title,e.data.actual_work_done,e.data.hours_today,e.data.time_type,e.data.date_created]}))},l=new Date;l.toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0});l=s()(l).format("DD/MM/YY");s()(a).format("DD/MM/YYYY");r.setFontSize(17),r.text(170,50,"Datasoft Manufacturing & Assembly"),r.setFontSize(13),r.text(245,75,"Gulshan Branch"),r.setFontSize(11),r.text(42,105,"Actual Worked Hours"),r.text(42,125,"Name: "+t),r.autoTable(c);var d=new Date;console.log("date",d),0!=n&&r.text(42,r.lastAutoTable.finalY+25,"From "+o+" to "+a),r.text(430,r.lastAutoTable.finalY+25," Total Hours "+Number(n).toFixed(2));var u=new Date;u.getDay(),s()(u).format("DD-MM-YYYY"),t.replace(/\s/g,"_");window.open(r.output("bloburl"),"_blank"),console.log("data",e)}},789:function(e,t,a){"use strict";var n=a(0),o=a.n(n),r=[{path:"/dashboard",exact:!0,name:"Dashboard",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(1),a.e(33)]).then(a.bind(null,1494))}))},{path:"/dashboard/Projects/assigned-projects",exact:!0,name:"Assigned Projects",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(5),a.e(6),a.e(24)]).then(a.bind(null,710))}))},{path:"/dashboard/Projects/assigned-projects/details/:work_package_number",exact:!0,name:"Assigned Project Details",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(3),a.e(21)]).then(a.bind(null,1104))}))},{path:"/dashboard/Projects/my-projects",exact:!0,name:"My Projects",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(3),a.e(5),a.e(20)]).then(a.bind(null,1493))}))},{path:"/dashboard/Projects/my-projects/details/:work_package_number",exact:!0,name:"My Project Details",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(3),a.e(25)]).then(a.bind(null,1110))}))},{path:"/dashboard/Projects/my-projects/subtask-details/:tdo_id",exact:!0,name:"Subtasks Details",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(3),a.e(26)]).then(a.bind(null,1111))}))},{path:"/dashboard/task/details/:work_package_index",exact:!0,name:"My Task Details",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(5),a.e(6),a.e(23)]).then(a.bind(null,1112))}))},{path:"/dashboard/Meetings",exact:!0,name:"Meetings",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(3),a.e(28)]).then(a.bind(null,1497))}))},{path:"/dashboard/Projects/completed-projects",exact:!0,name:"Completed Projects",component:o.a.lazy((function(){return Promise.all([a.e(5),a.e(6),a.e(42),a.e(34)]).then(a.bind(null,1498))}))},{path:"/dashboard/Projects/time-extension",exact:!0,name:"Time Extension",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(3),a.e(5),a.e(22)]).then(a.bind(null,1116))}))},{path:"/dashboard/Projects/completed-projects/details/:work_package_number",exact:!0,name:"Completed Projects details",component:o.a.lazy((function(){return Promise.all([a.e(5),a.e(6),a.e(37)]).then(a.bind(null,1118))}))},{path:"/dashboard/Projects/create-new-project",exact:!0,name:"Create New Project",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(3),a.e(27)]).then(a.bind(null,1499))}))},{path:"/dashboard/EVMS/create",exact:!0,name:"EVMS Create",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(3),a.e(43)]).then(a.bind(null,1119))}))},{path:"/dashboard/EVMS/view",exact:!0,name:"EVMS View",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(1),a.e(6),a.e(12),a.e(45)]).then(a.bind(null,1120))}))},{path:"/dashboard/EVMS/details",exact:!0,name:"EVMS Details",component:o.a.lazy((function(){return Promise.all([a.e(12),a.e(44)]).then(a.bind(null,1123))}))},{path:"/dashboard/WBS/create-wbs",exact:!0,name:"WBS",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(3),a.e(36)]).then(a.bind(null,1125))}))},{path:"/dashboard/WBS/not-started",exact:!0,name:"Not Created WBS",component:o.a.lazy((function(){return Promise.all([a.e(2),a.e(3),a.e(30)]).then(a.bind(null,1127))}))},{path:"/dashboard/WBS/create-wbs-employee",exact:!0,name:"Create WBS",component:o.a.lazy((function(){return Promise.all([a.e(2),a.e(3),a.e(29)]).then(a.bind(null,1129))}))},{path:"/dashboard/WBS/board",exact:!0,name:"Board",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(3),a.e(19)]).then(a.bind(null,1131))}))},{path:"/dashboard/holidays",exact:!0,name:"Holidays",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(1),a.e(40)]).then(a.bind(null,1198))}))},{path:"/dashboard/timecard/generate-timecard",exact:!0,name:"Generate Timecard",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(3),a.e(41)]).then(a.bind(null,1495))}))},{path:"/dashboard/timecard/view-previous-hours",exact:!0,name:"Previous Weeks",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(3),a.e(16)]).then(a.bind(null,1200))}))},{path:"/dashboard/timecard/submitted-timecards",exact:!0,name:"Submitted Timecards",component:o.a.lazy((function(){return Promise.all([a.e(2),a.e(3),a.e(32)]).then(a.bind(null,1453))}))},{path:"/dashboard/timecard/weekly-timecards",exact:!0,name:"Weekly Timecard",component:o.a.lazy((function(){return Promise.all([a.e(1),a.e(5),a.e(39)]).then(a.bind(null,1454))}))},{path:"/dashboard/profile/:id?",exact:!0,name:"Profile",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(3),a.e(35)]).then(a.bind(null,1500))}))},{path:"/dashboard/shared-documents",exact:!0,name:"Shared Documents",component:o.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(3),a.e(38)]).then(a.bind(null,1496))}))},{path:"/dashboard/release-notes",exact:!0,name:"Release Notes",component:o.a.lazy((function(){return a.e(31).then(a.bind(null,1459))}))}];t.a=r}}]);
//# sourceMappingURL=9.b26d6d08.chunk.js.map