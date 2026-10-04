const KEY="hostelhub_complaints_v1";
const suggestions={
  "Food / Mess":"Check today's mess menu and submit a mess quality complaint with details.",
  "Room Maintenance":"Check whether the issue is a simple fixture problem, then contact maintenance/warden.",
  "Water":"Check the maintenance notice and contact the warden if supply is interrupted.",
  "Electricity":"Check the room switchboard safely; report outages to maintenance. Do not handle exposed wires.",
  "Wi-Fi / Internet":"Restart your device/router connection and contact hostel IT support if the issue continues.",
  "Safety & Security":"Move to a safe place and contact hostel security/warden immediately for urgent concerns.",
  "Laundry":"Check the laundry schedule and report machine, collection, or service issues.",
  "Roommate Conflict":"Try a calm conversation; if unresolved, request support from the warden.",
  "Noise / Study Environment":"Use a quiet-study area and report repeated disturbance through HostelHub.",
  "Hostel Rules":"Review the hostel handbook and contact the warden for clarification.",
  "Medical / Emergency":"For urgent medical needs, contact the hostel medical team or emergency services immediately.",
  "Other":"Describe the issue clearly so the responsible hostel team can route it correctly."
};
const icons={"Food / Mess":"🍱","Room Maintenance":"🛠️","Water":"💧","Electricity":"⚡","Wi-Fi / Internet":"📶","Safety & Security":"🛡️","Laundry":"🧺","Roommate Conflict":"🤝","Noise / Study Environment":"🔇","Hostel Rules":"📋","Medical / Emergency":"⚕️","Other":"💡"};

function uid(){return "HH-"+Date.now().toString().slice(-7)+"-"+Math.random().toString(36).slice(2,5).toUpperCase()}
function seed(){
  if(localStorage.getItem(KEY)) return;
  const d=new Date(); const day=n=>new Date(d.getTime()-n*86400000).toISOString();
  localStorage.setItem(KEY,JSON.stringify([
    {id:"HH-24081",name:"Demo Student",hostel:"Block A",room:"204",category:"Wi-Fi / Internet",description:"Wi-Fi disconnects frequently during evening study hours.",priority:"Medium",status:"In Progress",date:day(1),expected:"2 days",progress:65},
    {id:"HH-24076",name:"Demo Student",hostel:"Block C",room:"118",category:"Water",description:"Low water pressure in the washroom since morning.",priority:"High",status:"Under Review",date:day(2),expected:"1 day",progress:35},
    {id:"HH-24061",name:"Demo Student",hostel:"Block B",room:"312",category:"Food / Mess",description:"Dinner quality complaint: food was cold and repetitive.",priority:"Low",status:"Resolved",date:day(5),expected:"Completed",progress:100},
    {id:"HH-24054",name:"Demo Student",hostel:"Block A",room:"109",category:"Room Maintenance",description:"Ceiling fan making unusual noise.",priority:"High",status:"Reported",date:day(6),expected:"3 days",progress:15},
    {id:"HH-24039",name:"Demo Student",hostel:"Block D",room:"401",category:"Noise / Study Environment",description:"Late-night noise affecting study time.",priority:"Medium",status:"Resolved",date:day(9),expected:"Completed",progress:100},
    {id:"HH-24025",name:"Demo Student",hostel:"Block C",room:"207",category:"Laundry",description:"Laundry collection delayed.",priority:"Low",status:"In Progress",date:day(11),expected:"2 days",progress:70}
  ]));
}
function getData(){return JSON.parse(localStorage.getItem(KEY)||"[]")}
function saveData(d){localStorage.setItem(KEY,JSON.stringify(d))}
function dateFmt(x){return new Date(x).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
function statusClass(s){return s==="Resolved"?"resolved":s==="In Progress"?"progress":""}
function render(){
  const data=getData(), status=document.getElementById("statusFilter").value, cat=document.getElementById("categoryFilter").value;
  const list=data.filter(x=>(status==="All"||x.status===status)&&(cat==="All"||x.category===cat));
  document.getElementById("complaintGrid").innerHTML=list.length?list.map(x=>`
    <article class="card complaint">
      <div class="complaint-top"><span class="tag">${x.id}</span><span class="status ${statusClass(x.status)}">${x.status}</span></div>
      <h3>${icons[x.category]||"💡"} ${x.category}</h3>
      <p>${escapeHtml(x.description)}</p>
      <div class="meta"><span class="tag">${x.hostel} • Room ${x.room}</span><span class="tag priority-${x.priority.toLowerCase()}">${x.priority}</span></div>
      <div class="progress"><i style="width:${x.progress||0}%"></i></div>
      <div class="complaint-footer"><span>Reported ${dateFmt(x.date)}</span><span>${x.progress||0}% • ${x.expected}</span></div>
    </article>`).join(""):`<div class="card" style="padding:30px;grid-column:1/-1;text-align:center;color:#68758a">No complaints match the selected filters.</div>`;
  updateStats(data); renderBars(data);
}
function updateStats(data){
  const total=data.length,res=data.filter(x=>x.status==="Resolved").length,active=total-res,high=data.filter(x=>["High","Emergency"].includes(x.priority)).length;
  [["heroTotal",total],["heroResolved",res],["heroActive",active],["heroHigh",high],["totalMetric",total],["resolvedMetric",res],["activeMetric",active],["highMetric",high]].forEach(([id,v])=>document.getElementById(id).textContent=v);
}
function renderBars(data){
  const counts={};data.forEach(x=>counts[x.category]=(counts[x.category]||0)+1);
  const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,6), max=entries[0]?.[1]||1;
  document.getElementById("bars").innerHTML=entries.length?entries.map(([k,v])=>`<div class="bar-row"><span>${k}</span><div class="bar"><i style="width:${v/max*100}%"></i></div><b>${v}</b></div>`).join(""):"<p style='color:#68758a'>No data yet.</p>";
  const top=entries[0];document.getElementById("topCategory").textContent=top?`${top[0]} needs attention`:"No insight yet";
  document.getElementById("insightText").textContent=top?`${top[1]} of ${data.length} recorded complaint${data.length===1?"":"s"} relate to this category. Focused action here could improve hostel satisfaction.`:"Submit complaints to generate a category insight.";
}
function populateCategories(){
  const cats=[...new Set(getData().map(x=>x.category))];
  document.getElementById("categoryFilter").innerHTML='<option value="All">All Categories</option>'+cats.map(x=>`<option>${x}</option>`).join("");
}
function renderSuggestions(){
  document.getElementById("suggestionGrid").innerHTML=Object.entries(suggestions).slice(0,8).map(([k,v])=>`<div class="card suggestion"><div class="icon">${icons[k]}</div><h3>${k}</h3><p>${v}</p></div>`).join("");
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}

seed();populateCategories();render();renderSuggestions();

document.getElementById("category").addEventListener("change",e=>{
  const c=e.target.value;document.getElementById("suggestionPreview").textContent=c?(icons[c]+" "+suggestions[c]):"💡 Select a category to see a quick suggestion.";
  if(c==="Safety & Security"||c==="Medical / Emergency") document.getElementById("priority").value="Emergency";
});
["statusFilter","categoryFilter"].forEach(id=>document.getElementById(id).addEventListener("change",render));

document.getElementById("problemForm").addEventListener("submit",e=>{
  e.preventDefault();
  const category=document.getElementById("category").value, priority=document.getElementById("priority").value;
  let detected=priority;
  if(category==="Safety & Security"||category==="Medical / Emergency") detected="Emergency";
  else if(["Water","Electricity","Room Maintenance"].includes(category)&&priority==="Low") detected="Medium";
  const expected=detected==="Emergency"?"Immediate":detected==="High"?"1 day":detected==="Medium"?"2 days":"3–5 days";
  const data=getData();
  data.unshift({id:uid(),name:document.getElementById("studentName").value.trim(),hostel:document.getElementById("hostel").value.trim(),room:document.getElementById("room").value.trim(),category,description:document.getElementById("description").value.trim(),priority:detected,status:"Reported",date:new Date().toISOString(),expected,progress:10});
  saveData(data);populateCategories();render();e.target.reset();document.getElementById("suggestionPreview").textContent="💡 Select a category to see a quick suggestion.";
  showToast(`Problem submitted successfully • Smart priority: ${detected}`);
  location.hash="dashboard";
});
document.querySelector(".nav-toggle").addEventListener("click",()=>{const n=document.querySelector("nav");n.style.display=n.style.display==="flex"?"none":"flex";n.style.position="absolute";n.style.top="72px";n.style.left="0";n.style.right="0";n.style.background="#fff";n.style.padding="18px";n.style.flexDirection="column"});
