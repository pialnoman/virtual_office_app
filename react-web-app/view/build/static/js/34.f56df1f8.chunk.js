(this.webpackJsonpvirtual_office=this.webpackJsonpvirtual_office||[]).push([[34],{1498:function(e,s,a){"use strict";a.r(s);var t=a(32),c=a(493),n=a(569),r=a.n(n),l=(a(580),a(886)),i=a(14),o=a(0),d=a(509),j=a(98),h=a(9),m=(a(798),a(586)),p=(a(587),a(3)),b=a(529),x=a(541),u=a(542);s.default=function(){var e=Object(i.g)(),s=Object(j.c)((function(e){return e.projects.data.filter((function(e){return 1===e.project.status}))})),a=Object(o.useState)(!1),n=Object(t.a)(a,2),O=n[0],N=n[1],f=Object(o.useState)(),g=Object(t.a)(f,2),v=g[0],_=g[1];function k(e,s){return 100*(parseFloat(e)-parseFloat(s))/parseFloat(e)}var y=[];return Object(p.jsxs)(p.Fragment,{children:[v&&Object(p.jsxs)(c.B,{closeOnBackdrop:!1,size:"lg",alignment:"center",show:O,onClose:function(){N(!O)},children:[Object(p.jsx)(c.E,{onClose:function(){return N(!O)},closeButton:!0,children:Object(p.jsx)(c.F,{className:"modal-title-projects",children:Object(p.jsx)("span",{className:"edit-profile-form-header",children:"Subtask Details"})})}),Object(p.jsx)(c.C,{children:Object(p.jsx)(c.l,{children:Object(p.jsx)(c.t,{children:Object(p.jsxs)(c.K,{children:[Object(p.jsx)("div",{className:"card-header-portion-ongoing",children:Object(p.jsxs)("h4",{className:"ongoing-card-header-1",children:[Object(p.jsx)(l.a,{"aria-label":"favourite",disabled:!0,size:"medium",color:"primary",children:Object(p.jsx)(r.a,{fontSize:"inherit",className:"fav-button"})}),void 0!=v?v.task_delivery_order.title:""]})}),Object(p.jsx)("div",{className:"row justify-content-center",children:Object(p.jsx)("div",{className:"col-md-12 col-sm-12 col-xs-12 col-lg-12 mt-1 mb-2",children:Object(p.jsx)(c.g,{className:"card-ongoing-project",children:Object(p.jsxs)(c.h,{className:"details-project-body",children:[Object(p.jsxs)("div",{className:"ongoing-initial-info row",children:[Object(p.jsxs)("div",{className:"tasks-done-2 col-lg-4",children:[Object(p.jsx)("h6",{className:"tiny-header2",children:"Sub Task Name"}),Object(p.jsx)("h6",{className:"project-point-details",children:v.task_title})]}),Object(p.jsxs)("div",{className:"tasks-done-2 col-lg-4",children:[Object(p.jsx)("h6",{className:"tiny-header2",children:"PM Name"}),Object(p.jsx)("h6",{className:"project-point-details",children:v.pm.first_name+" "+v.pm.last_name})]}),Object(p.jsxs)("div",{className:"tasks-done-2 col-lg-4",children:[Object(p.jsx)("h6",{className:"tiny-header2",children:"Work Package Number"}),Object(p.jsx)("h6",{className:"project-point-details",children:v.work_package_number})]}),Object(p.jsxs)("div",{className:"tasks-done-2 col-lg-4",children:[Object(p.jsx)("h6",{className:"tiny-header2",children:"Task Title"}),Object(p.jsx)("h6",{className:"project-point-details",children:v.task_title})]}),Object(p.jsxs)("div",{className:"tasks-done-2 col-lg-4",children:[Object(p.jsx)("h6",{className:"tiny-header2",children:"Estimated Person(s)"}),Object(p.jsx)("h6",{className:"project-point-details",children:v.estimated_person})]}),Object(p.jsxs)("div",{className:"tasks-done-2 col-lg-4",children:[Object(p.jsx)("h6",{className:"tiny-header2",children:"Planned Value"}),Object(p.jsxs)("h6",{className:"project-point-details",children:[Number(parseFloat(v.assignees[0].project.planned_value)).toFixed(2)," "]})]}),Object(p.jsxs)("div",{className:"tasks-done-2 col-lg-4",children:[Object(p.jsx)("h6",{className:"tiny-header2",children:"Planned Hours"}),Object(p.jsxs)("h6",{className:"project-point-details",children:[Number(parseFloat(v.assignees[0].project.planned_hours)).toFixed(2)," "]})]}),Object(p.jsxs)("div",{className:"tasks-done-2 col-lg-4",children:[Object(p.jsx)("h6",{className:"tiny-header2",children:"Remaining Hours"}),Object(p.jsxs)("h6",{className:"project-point-details",children:[Number(parseFloat(v.remaining_hours)).toFixed(2)," "]})]})]}),Object(p.jsxs)("div",{className:"col-md-12 mt-4 mb-2",children:[Object(p.jsxs)("h5",{className:"projectName mb-3",children:["Asssignee(s)-(",Array.from(v.assignees).length,")"]}),Object(p.jsx)("div",{className:"file-show-ongoing-details row",children:void 0!=v&&Array.from(v.assignees).map((function(e,s){return Object(p.jsx)("div",{className:"col-md-4 col-sm-6 col-lg-4",children:Object(p.jsx)("div",{className:"file-attached-ongoing rounded-pill",children:e.assignee.first_name+" "+e.assignee.last_name})},s)}))})]})]})})})})]})})})})]}),Object(p.jsx)("div",{className:"container",children:Object(p.jsx)("div",{className:"row",children:Object(p.jsxs)("div",{className:"col-md-11 col-sm-12 col-xs-12 mt-1",children:[Object(p.jsxs)("h3",{className:"dash-header",children:["Completed Projects(",s.length,") ",Object(p.jsxs)(c.f,{className:"export-project-list",onClick:function(){return function(){for(var e=function(){var e=s[a],n=[];Array.from(e.subtasks).map((function(e){n.push(e.task_title)})),t=n.join(",");var r=[];Array.from(e.assignees).map((function(e){r.push(e.first_name+" "+e.last_name)})),c=r.join(","),y.push({"Sl. No":a+1,TDO:e.project.task_delivery_order.title,"Work Package Number":e.project.work_package_number,"Work Package Index":e.project.work_package_index,"Project Name":e.project.sub_task,Subtasks:t,"Assignee(s)":c,"Planned Value":e.project.planned_value,"Planned Hours":e.project.planned_hours,"Planned Delivery Date":e.project.planned_delivery_date})},a=0;a<s.length;a++){var t,c;e()}var n={Sheets:{data:u.utils.json_to_sheet(y)},SheetNames:["data"]},r=u.write(n,{bookType:"xlsx",type:"array"}),l=new Blob([r],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"});x.saveAs(l,"Completed project(s) List.xlsx")}()},children:[Object(p.jsx)(d.a,{name:"cil-spreadsheet",className:"mr-2"}),"Export to excel"]})]}),void 0!=s&&Object(p.jsx)(m.a,{allowMultipleExpanded:!1,className:"remove-acc-bg",allowZeroExpanded:!0,children:s.map((function(s,a){return Object(p.jsxs)(m.b,{className:"card-ongoing-project",children:[Object(p.jsx)(m.d,{className:"ongoing-accordion-header",children:Object(p.jsxs)(m.c,{children:[Object(p.jsx)(l.a,{"aria-label":"favourite",disabled:!0,size:"medium",children:Object(p.jsx)(r.a,{fontSize:"inherit",className:"fav-button"})}),String(s.project.sub_task).toUpperCase(),Object(p.jsx)("span",{className:"fix-action-btn-alignment",children:Object(p.jsxs)(c.f,{className:"view-ongoing-details",onClick:function(){return e.push({pathname:"/dashboard/Projects/completed-projects/details/"+s.project.work_package_number,state:{project:s}})},children:[Object(p.jsx)(d.a,{name:"cil-list-rich",className:"mr-1"}),"View Details"]})})]})}),Object(p.jsxs)(m.e,{children:[Object(p.jsxs)("div",{children:[Object(p.jsxs)("h6",{className:"show-amount",children:[(t=s.project.remaining_hours,n=s.project.planned_hours,String(parseFloat(n)-parseFloat(t))),"/",parseInt(s.project.planned_hours)," Hrs"]}),Object(p.jsx)(b.a,{progress:k(s.project.planned_hours,s.project.remaining_hours)})]}),Object(p.jsx)("div",{className:"all-da-buttons-1",children:Array.from(s.subtasks).length>0&&Array.from(s.subtasks).map((function(e,s){return Object(p.jsxs)(c.f,{className:"package-button rounded-pill",type:"button",onClick:function(){N(!0),_(e),console.log("task",e)},children:[e.task_title,Object(p.jsx)("span",{className:"tooltiptext",children:e.work_package_index})]})}))}),Object(p.jsx)("div",{className:"all-da-workers1",children:s.assignees.length>0&&Array.from(s.assignees).map((function(e,s){return Object(p.jsx)("img",{className:"img-fluid worker-image",src:null!=e.profile_pic?h.c+e.profile_pic:"avatars/user-avatar-default.png"})}))}),Object(p.jsxs)("div",{className:"information-show row",children:[Object(p.jsxs)("div",{className:"info-show-now col-md-6",children:[Object(p.jsxs)("h5",{className:"project-details-points child",children:[Object(p.jsx)("h5",{className:"info-header-1",children:"Assigned by :"}),s.project.pm.first_name+" "+s.project.pm.last_name]}),Object(p.jsxs)("h5",{className:"project-details-points",children:[Object(p.jsx)("h5",{className:"info-header-1",children:"Project Manager : "}),s.project.pm.first_name+" "+s.project.pm.last_name]})]}),Object(p.jsxs)("div",{className:"info-show-now col-md-6",children:[Object(p.jsxs)("h5",{className:"project-details-points child",children:[Object(p.jsx)("h5",{className:"info-header-1",children:"Start Date : "}),s.project.date_created]}),Object(p.jsxs)("h5",{className:"project-details-points",children:[Object(p.jsx)("h5",{className:"info-header-1",children:"Planned Delivery Date : "}),s.project.planned_delivery_date]})]})]})]})]},a);var t,n}))}),""==s?Object(p.jsx)(c.a,{className:"no-value-show-alert",color:"primary",children:"Currently there are no completed projects"}):null]})})})]})}},526:function(e,s){},529:function(e,s,a){"use strict";a.d(s,"a",(function(){return j}));var t=a(32),c=a(1),n=a(0),r=a(567),l=a(1564),i=a(1575),o=a(3);function d(e){return Object(o.jsxs)(i.a,{sx:{display:"flex",alignItems:"center"},children:[Object(o.jsx)(i.a,{sx:{width:"100%",mr:1},children:Object(o.jsx)(r.a,Object(c.a)({variant:"determinate"},e))}),Object(o.jsx)(i.a,{sx:{minWidth:35},children:Object(o.jsx)(l.a,{variant:"body2",color:"text.secondary",children:"".concat(Math.round(e.value),"%")})})]})}function j(e){var s=n.useState(e.progress),a=Object(t.a)(s,2),c=a[0];a[1];return n.useEffect((function(){}),[]),Object(o.jsx)(i.a,{sx:{width:"100%"},children:Object(o.jsx)(d,{value:c})})}},543:function(e,s){},544:function(e,s){},580:function(e,s,a){},798:function(e,s,a){}}]);
//# sourceMappingURL=34.f56df1f8.chunk.js.map