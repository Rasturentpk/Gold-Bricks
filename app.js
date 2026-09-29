(function(){
const $=id=>document.getElementById(id); const DEFAULT=window.GOLD_BRICKS_DEFAULTS;
let sb=null; try{if(window.SUPABASE_CONFIG?.url?.startsWith('http') && !window.SUPABASE_CONFIG.anonKey.includes('PASTE_')) sb=window.supabase.createClient(window.SUPABASE_CONFIG.url,window.SUPABASE_CONFIG.anonKey)}catch(e){console.warn(e)}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pkr=n=>n>=1e7?'PKR '+(n/1e7).toFixed(2).replace(/\.?0+$/,'')+' Crore':n>=1e5?'PKR '+(n/1e5).toFixed(2).replace(/\.?0+$/,'')+' Lakh':'PKR '+Number(n||0).toLocaleString('en-PK');
function wa(m,D){return 'https://wa.me/'+String(D.wa||'').replace(/\D/g,'')+'?text='+encodeURIComponent(m)}
async function load(){
 let D=DEFAULT;
 if(sb){try{const {data,error}=await sb.from('site_content').select('data').eq('id',true).single();if(!error&&data?.data)D=data.data}catch(e){console.warn('Database read failed; using bundled defaults.',e)}}
 render(D)
}
function render(D){
 $('lg').src=D.logo||'';$('bn').textContent=D.brand||'';$('hk').textContent=D.kicker||'';$('ht').textContent=D.title||'';$('hs').textContent=D.sub||'';$('hi').src=D.hero||'';
 ['nwa','hwa','cwa','fwa'].forEach(i=>$(i).href=wa("Hello Gold Bricks, I'd like to know about your properties.",D));
 $('tg').innerHTML=(D.stats||[]).map(s=>`<div><b>${esc(s[0])}</b>${esc(s[1])}</div>`).join('');
 $('pg').innerHTML=(D.props||[]).map(p=>`<div class="card"><div class="ph"><img src="${p.img||''}" alt=""><span class="badge">${esc(p.badge)}</span></div><div class="b"><h3>${esc(p.title)}</h3><div class="loc">${esc(p.loc)}</div><div class="meta"><span>${esc(p.area)}</span><span>${+p.beds||0} beds</span><span>${+p.baths||0} baths</span></div><div class="price"><div><b>${pkr(+p.price)}</b><small>PKR ${(+p.price||0).toLocaleString('en-PK')}</small></div><a class="btn" target="_blank" rel="noopener" href="${wa("Hello, I'm interested in: "+p.title+" ("+pkr(+p.price)+")",D)}">Inquire</a></div></div></div>`).join('');
 $('ci').src=D.ceo?.img||'';$('cn').textContent=D.ceo?.name||'';$('ct').textContent=D.ceo?.role||'';$('cb').textContent=D.ceo?.bio||'';
 $('rg').innerHTML=(D.reviews||[]).map(r=>`<div class="card rv"><div class="stars">★★★★★</div><p>${esc(r.text)}</p><div class="who"><div class="av">${esc((r.name||'?')[0])}</div><div><b>${esc(r.name)}</b><small>${esc(r.meta)}</small></div></div></div>`).join('');
 $('ad').textContent=D.address||'';$('ph').textContent=D.phone||'';$('cl').href='tel:+'+String(D.wa||'').replace(/\D/g,'');$('mp').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(D.address||'');
 const td=(new Date().getDay()+6)%7;$('hr').innerHTML=(D.hours||[]).map((h,i)=>`<li class="${i==td?'t':''}"><span>${esc(h[0])}</span><span>${esc(h[1])}</span></li>`).join('');$('fc').textContent='© '+new Date().getFullYear()+' '+(D.brand||'');
}
load();
})();
