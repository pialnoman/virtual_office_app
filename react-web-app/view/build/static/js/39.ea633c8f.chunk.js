(this.webpackJsonpvirtual_office=this.webpackJsonpvirtual_office||[]).push([[39],{1454:function(e,t,a){"use strict";a.r(t);var s=a(17),n=a(32),d=a(0),o=a.n(d),r=(a(632),a(532)),c=a(9),u=a(98),l=a(644),i=(a(685),a(541)),m=a(542),y=a(509),f=a(74),j=a.n(f),b=a(493),h=a(103),p=a(3);t.default=function(){var e=Object(u.c)((function(e){return e.profile.data})),t=Object(d.useState)([]),a=Object(n.a)(t,2),f=a[0],_=a[1],O=[],x=Object(d.useState)([]),g=Object(n.a)(x,2),T=g[0],k=g[1],Y=Object(d.useState)(),v=Object(n.a)(Y,2),D=(v[0],v[1],Object(d.useState)()),w=Object(n.a)(D,2),S=w[0],M=w[1],N=Object(d.useState)(),F=Object(n.a)(N,2),W=F[0],B=F[1],E=Object(d.useState)([]),V=Object(n.a)(E,2),P=V[0],A=V[1],C=Object(d.useState)([]),H=Object(n.a)(C,2),R=(H[0],H[1]),z=Object(d.useState)(0),I=Object(n.a)(z,2),J=I[0],q=I[1],G=Object(d.useState)(!1),K=Object(n.a)(G,2),U=(K[0],K[1],[]),L=Object(h.b)(),Q=L.enqueueSnackbar;L.closeSnackbar;function X(){c.a.get("wbs/user-wise/weekly-time-card/"+sessionStorage.getItem(c.k)+"/").then((function(e){if(M(e.data.start_date),B(e.data.end_date),void 0!=e.data.data&&e.data.data.forEach((function(e,t){U.push(e.project.sub_task),console.log("subtask",e.project.task_title);var a={id:e.id,project:e.project,time_card_assignee:e.time_card_assignee,actual_work_done:e.actual_work_done,time_type:e.time_type,submitted:e.submitted,hours_today:e.hours_today,date_created:e.date_created,date_updated:e.date_updated,task_title:e.project.task_title};O.push(a)})),console.log(U),console.log("new array",O),k(O),0!=O.length||void 0!=O){for(var t=[],a=0,s=0;s<O.length;s++){var n=O[s];a+=parseFloat(n.hours_today),console.log("ddddddddd",n);var d=j()(n.date_updated).weekday(),o=Z();t.push({Date:o[s],Days:["Sunday","Monday","Thursday","Wednesday","Thursday","Friday","Saturday"][s],Task:n.task_title,WP:n.project.work_package_number,id:n.id,WBS:n.actual_work_done,Time:n.time_type,Sunday:0==d?n.hours_today:"",Monday:1==d?n.hours_today:"",Tuesday:2==d?n.hours_today:"",Wednesday:3==d?n.hours_today:"",Thursday:4==d?n.hours_today:"",Friday:5==d?n.hours_today:"",Saturday:6==d?n.hours_today:"",Total:n.hours_today}),console.log(j()(n.date_updated).weekday())}t.push({Date:"",Days:"",Task:"",WP:"",id:"",WBS:"",Time:"",Sunday:"",Monday:"",Tuesday:"",Wednesday:"",Thursday:"",Friday:"",Saturday:"",Total:"Total = "+a.toFixed(1)}),_(t),R(t),q(a.toFixed(1)),console.log("table",t),console.log("tabledata from weekly timecard",J)}}))}o.a.useEffect((function(){window.scrollTo(0,0),X()}),[]),o.a.useEffect((function(){A(U)}),[]);Object(r.a)({initialValues:{wbs:"",time:"",hrs:""},validateOnBlur:!0,validateOnChange:!0});var Z=function(){for(var e=new Date,t=0;t<7;t++)if(0===e.getDay())e=j()(e).toDate();else{var a=e.getDay();e=j()(e).subtract(a,"day").toDate()}var s=[];s[0]=e.getDate()+"/"+e.getMonth()+"/"+e.getFullYear();for(var n=1;n<7;n++){var d=j()(e).add(n,"day").toDate();console.log("dd",d),s.push(d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear())}return e=e.getDate()+"/"+e.getMonth()+"/"+e.getFullYear(),console.log("week",s),s};o.a.useEffect((function(){console.log("weeeeeeeek",Z())}),[]);var $=[{value:"RHR",label:"RHR"},{value:"OTO",label:"OTO"}];function ee(e,t){console.log(e.target.value,t);var a={time_type:t.Time,hours_today:e.target.value,date_updated:""};c.a.put("wbs/time-card/update/"+t.id+"/",a).then((function(e){console.log(e),200===e.status&&(X(),Q("Actual hours update succefull.",{variant:"info"}))}))}return Object(p.jsx)(p.Fragment,{children:Object(p.jsxs)(b.l,{children:[Object(p.jsx)("h3",{className:"timecards-page-header mb-3",children:"Weekly Timecard"}),Object(p.jsxs)(b.K,{children:[0!=f.length&&Object(p.jsxs)(b.k,{md:"12",children:[Object(p.jsx)("h5",{className:"tiny-header--5 mt-0",children:"Export"}),Object(p.jsxs)("div",{className:"format-buttons mt-3 mb-3",children:[Object(p.jsxs)(b.f,{className:"file-format-download",onClick:function(){return function(){var t=new l.default("portrait","pt","A4");t.setFontSize(12),e.first_name,e.last_name,j()(S).format("DD/MM/YYYY"),j()(W).format("DD/MM/YYYY"),console.log("pdfData",T);var a={startY:120,head:[["Date","Days","Task Title","Hours","Hours Type"]],body:f.map((function(e,t){return[e.Date,e.Days,e.Task,e.Total,e.Time]}))},s=j()(W).format("DD/MM/YYYY"),n=e.first_name+" "+e.last_name;t.text(150,50,"Datasoft Manufacturing & Assembly Gulshan Branch"),t.text(42,80,"Emplyee Time card"),t.text(420,80,"Week-Ending: "+s),t.text(42,100,"Name: "+n),t.text(420,100,"NID: "),t.text(42,330,"Submitted : (date & Time)"),t.autoTable(a),t.save(e.first_name+"_"+e.last_name+"_Timecard_"+j()(S).format("DD/MM/YYYY")+"-"+j()(W).format("DD/MM/YYYY")+".pdf")}()},children:[Object(p.jsx)(y.a,{name:"cil-description",className:"mr-2"}),"PDF"]}),Object(p.jsxs)(b.f,{className:"file-format-download",onClick:function(){return function(e,t){console.log(e);var a={Sheets:{data:m.utils.json_to_sheet(e)},SheetNames:["data"]},s=m.write(a,{bookType:"xlsx",type:"array"}),n=new Blob([s],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"});i.saveAs(n,t+".xlsx")}(f,e.first_name+"_"+e.last_name+"_Timecard_"+j()(S).format("DD/MM/YYYY")+"-"+j()(W).format("DD/MM/YYYY"))},children:[Object(p.jsx)(y.a,{name:"cil-spreadsheet",className:"mr-2"}),"Excel"]})]})]}),Object(p.jsxs)(b.k,{md:"4",children:["Name: ",e.first_name+" "+e.last_name,Object(p.jsx)("br",{}),"Phone: +",e.phone]}),Object(p.jsxs)(b.k,{md:"4",children:["Week: ",j()(S).format("DD/MM/YYYY")," - ",j()(W).format("DD/MM/YYYY")," ",Object(p.jsx)("br",{}),"Month: ",j()(W).format("MMMM")," ",Object(p.jsx)("br",{}),"Year: ",j()(W).format("YYYY")]}),Object(p.jsxs)(b.k,{md:"4",children:["Project Name(s): ",Object(s.a)(new Set(P)).map((function(e,t){return Object(p.jsxs)("span",{children:[e,t<P.length-1&&Object(p.jsx)("span",{children:", "})]})}))]}),Object(p.jsx)(b.k,{md:"12",children:Object(p.jsx)("div",{className:"mt-4 mb-2",children:Object(p.jsx)(b.m,{items:f,fields:[{key:"WP",_style:{width:"auto"},_classes:"font-weight-bold"},"WBS",{key:"Time",_style:{width:"100px"}},{key:"Sunday",_style:{width:"70px"}},{key:"Monday",_style:{width:"70px"}},{key:"Tuesday",_style:{width:"70px"}},{key:"Wednesday",_style:{width:"70px"}},{key:"Thursday",_style:{width:"70px"}},{key:"Friday",_style:{width:"70px"}},{key:"Saturday",_style:{width:"70px"}},{key:"Total",_style:{width:"auto"}}],primary:!0,hover:!0,striped:!0,bordered:!0,size:"sm",scopedSlots:{Time:function(e,t){return Object(p.jsx)("td",{className:"py-2",children:""!=e.Time&&Object(p.jsx)("select",{onChange:function(t){!function(e,t){console.log(e.target.value,t);var a={time_type:e.target.value,hours_today:t.Total,date_updated:""};c.a.put("wbs/time-card/update/"+t.id+"/",a).then((function(e){console.log(e),200===e.status&&(X(),Q("Time type update succefull.",{variant:"info"}))}))}(t,e)},children:$.map((function(t){return Object(p.jsx)("option",{selected:t.value==e.Time,children:t.value})}))})})},Sunday:function(e,t){return Object(p.jsx)("td",{className:"py-2",children:""!=e.Sunday&&Object(p.jsx)(b.y,{name:"Sunday",type:"number",onBlur:function(t){ee(t,e)},defaultValue:e.Sunday,className:"custom-forminput-6"})})},Monday:function(e,t){return Object(p.jsx)("td",{className:"py-2",children:""!=e.Monday&&Object(p.jsx)(b.y,{name:"Monday",type:"number",onBlur:function(t){ee(t,e)},defaultValue:e.Monday,className:"custom-forminput-6"})})},Tuesday:function(e,t){return Object(p.jsx)("td",{className:"py-2",children:""!=e.Tuesday&&Object(p.jsx)(b.y,{name:"Tuesday",type:"number",onBlur:function(t){ee(t,e)},defaultValue:e.Tuesday,className:"custom-forminput-6"})})},Wednesday:function(e,t){return Object(p.jsx)("td",{className:"py-2",children:""!=e.Wednesday&&Object(p.jsx)(b.y,{name:"Wednesday",type:"number",onBlur:function(t){ee(t,e)},defaultValue:e.Wednesday,className:"custom-forminput-6"})})},Thursday:function(e,t){return Object(p.jsx)("td",{className:"py-2",children:""!=e.Thursday&&Object(p.jsx)(b.y,{name:"Thursday",type:"number",onBlur:function(t){ee(t,e)},defaultValue:e.Thursday,className:"custom-forminput-6"})})},Friday:function(e,t){return Object(p.jsx)("td",{className:"py-2",children:""!=e.Friday&&Object(p.jsx)(b.y,{name:"Friday",type:"number",onBlur:function(t){ee(t,e)},defaultValue:e.Friday,className:"custom-forminput-6"})})},Saturday:function(e,t){return Object(p.jsx)("td",{className:"py-2",children:""!=e.Saturday&&Object(p.jsx)(b.y,{name:"Saturday",type:"number",onBlur:function(t){ee(t,e)},defaultValue:e.Saturday,className:"custom-forminput-6"})})}}})})})]})]})})}},526:function(e,t){},543:function(e,t){},544:function(e,t){},632:function(e,t,a){}}]);
//# sourceMappingURL=39.ea633c8f.chunk.js.map