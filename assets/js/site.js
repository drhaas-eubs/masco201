/* EUBS course website · cards, three-tier modal, search, accordion
   Needs figures.js (FIG) loaded first. © Dr. Hildegard Haas */
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function THUMB(fw,mode){
  if(fw.svg)return fw.svg;
  if(window.THUMBS&&THUMBS[fw.name])return THUMBS[fw.name];
  return FIG(fw.shape,fw.labels,fw.color,mode);
}
function fwCard(fw,i){
  return '<button class="card'+(fw.svg?' card2':'')+'" style="--accent:'+fw.color+'" data-i="'+i+'" data-unit="'+fw.unit+'" data-kind="'+fw.kind+'" '+
   'data-search="'+esc((fw.name+' '+fw.desc+' '+fw.slibTitle+' '+fw.def+' '+(fw.author||'')).toLowerCase())+'">'+
'<span class="card-accent" style="background:'+fw.color+'"></span>'+
   '<span class="card-thumb">'+THUMB(fw,'thumb')+'</span>'+
   '<span class="card-body"><span class="card-title">'+esc(fw.name)+'</span>'+
   '<span class="card-desc">'+esc(fw.desc)+'</span>'+
   '<span class="card-tag" style="background:'+fw.color+'">Slibrary '+fw.slibNum+'</span></span></button>';
}
function openModal(fw){
  var m=document.getElementById('modal');
  m.style.setProperty('--accent',fw.color);
  if(fw.svg){
  m.innerHTML='<div class="modal-inner m2">'+
   '<button class="modal-close" onclick="closeModal()" aria-label="Close">&times;</button>'+
   '<div class="m2-slib">Slibrary '+fw.slibNum+' &mdash; '+esc(fw.slibTitle)+'</div>'+
   '<div class="m2-title">'+esc(fw.name)+'</div>'+
   '<div class="m2-def">'+esc(fw.def)+'</div>'+
   '<div class="m2-desc">'+esc(fw.desc)+'</div>'+
   '<div class="m2-fig">'+fw.svg+'</div>'+
   '<div class="m2-ref"><div class="m2-ref-label">Reference</div>'+esc(fw.ref)+'</div>'+
   (fw.sheetUrl?'<a class="m2-btn" href="'+fw.sheetUrl+'">&#128196;&nbsp; View Full A4 Reference Sheet</a>':'')+
   '</div>';
  } else {
  m.innerHTML='<div class="modal-accent" style="background:'+fw.color+'"></div><div class="modal-inner">'+
   '<button class="modal-close" onclick="closeModal()" aria-label="Close">&times;</button>'+
   '<div class="modal-slib">Unit '+fw.unit+' &middot; Slibrary '+fw.slibNum+' &mdash; '+esc(fw.slibTitle)+'</div>'+
   '<div class="modal-title">'+esc(fw.name)+'</div>'+
   '<div class="modal-def">'+esc(fw.def)+'</div>'+
   '<div class="modal-desc">'+esc(fw.desc)+'</div>'+
   '<div class="modal-thumb">'+THUMB(fw,'full')+'</div>'+
   (fw.caption?'<div class="modal-cap">'+esc(fw.caption)+'</div>':'')+
   '<ul class="modal-details">'+(fw.details||[]).map(function(d){return '<li>'+esc(d)+'</li>'}).join('')+'</ul>'+
   '<div class="modal-ref"><div class="modal-ref-label">Reference</div>'+esc(fw.ref)+'</div>'+
   '</div>';
  }
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){document.getElementById('modalOverlay').classList.remove('open');document.body.style.overflow='';}
document.addEventListener('keydown',function(ev){if(ev.key==='Escape')closeModal()});
function renderGrid(el,list){
  if(!el)return;
  el.innerHTML=list.map(function(fw){return fwCard(fw,FW.indexOf(fw))}).join('');
  el.querySelectorAll('.card').forEach(function(c){c.addEventListener('click',function(){openModal(FW[+c.dataset.i])})});
}
function wireSearch(inputId,selector,emptyId){
  var inp=document.getElementById(inputId);if(!inp)return;
  inp.addEventListener('input',function(){
    var q=inp.value.toLowerCase().trim(),shown=0;
    document.querySelectorAll(selector).forEach(function(el){
      var hit=!q||(el.dataset.search||'').indexOf(q)>-1;
      el.classList.toggle('hidden',!hit);if(hit)shown++;
      if(q&&hit&&el.classList.contains('unit'))el.classList.add('open');
    });
    var e=document.getElementById(emptyId);if(e)e.classList.toggle('on',shown===0);
  });
}
function wireFilters(groupId,selector){
  var g=document.getElementById(groupId);if(!g)return;
  g.addEventListener('click',function(ev){
    var b=ev.target.closest('button');if(!b)return;
    g.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)});
    var f=b.dataset.f;
    document.querySelectorAll(selector).forEach(function(el){
      el.classList.toggle('hidden',!(f==='all'||el.dataset.unit===f||el.dataset.kind===f));
    });
  });
}
function wireAccordion(){
  document.querySelectorAll('.unit-header').forEach(function(h){
    function t(){h.parentNode.classList.toggle('open');h.setAttribute('aria-expanded',h.parentNode.classList.contains('open'))}
    h.addEventListener('click',t);
    h.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();t()}});
  });
  var m=location.hash.match(/^#unit(\d+)$/);
  if(m){var u=document.getElementById('unit'+m[1]);if(u){u.classList.add('open');u.scrollIntoView()}}
}
