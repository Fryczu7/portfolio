// Wspólne: odtwarzacz filmów w oknie, wykres retencji, pojawianie przy przewijaniu.
(function(){
  // okno z pełnym filmem
  const okno=document.createElement('div');
  okno.className='okno';okno.setAttribute('role','dialog');okno.setAttribute('aria-modal','true');const EN=document.documentElement.lang==='en';okno.setAttribute('aria-label',EN?'Video':'Film');
  okno.innerHTML='<video controls playsinline></video><button class="okno__zamknij" aria-label="'+(EN?'Close':'Zamknij')+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button><p class="okno__podpis"></p>';
  document.body.appendChild(okno);
  const v=okno.querySelector('video'),podpis=okno.querySelector('.okno__podpis');
  let ostatni=null;
  function zamknij(){okno.classList.remove('otwarte');v.pause();v.removeAttribute('src');v.load();if(ostatni)ostatni.focus();}
  okno.addEventListener('click',e=>{if(e.target===okno||e.target.closest('.okno__zamknij'))zamknij();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&okno.classList.contains('otwarte'))zamknij();});
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-film]');if(!b)return;
    ostatni=b;v.src=b.dataset.film;podpis.textContent=b.dataset.podpis||'';
    okno.classList.add('otwarte');v.play().catch(()=>{});okno.querySelector('.okno__zamknij').focus();
  });

  // podglądy grają tylko, gdy są widoczne
  const podglady=document.querySelectorAll('video[data-podglad]');
  const io=new IntersectionObserver(w=>w.forEach(x=>{
    if(x.isIntersecting&&!matchMedia('(prefers-reduced-motion: reduce)').matches){x.target.play().catch(()=>{});}else x.target.pause();
  }),{threshold:.25});
  podglady.forEach(p=>{p.muted=true;p.loop=true;p.playsInline=true;io.observe(p);});

  // wykres retencji – prawdziwe pomiary robota retencji (Złap Termin, reklamy 10–11.2026)
  const DANE=[
    ['22.10 · 21 s',0.55,0.06,'102 tys.'],
    ['02.11 · 6 s',0.61,0.23,'98 tys.'],
    ['29.10 · 11 s',0.68,0.23,'72 tys.'],
    ['26.10 · 9 s',0.63,0.12,'23 tys.'],
    ['06.11 · 11 s',0.67,0.08,'22 tys.'],
    ['09.11 · 7 s',0.64,0.28,'16 tys.']
  ];
  document.querySelectorAll('[data-wykres]').forEach(w=>{
    const en=document.documentElement.lang==='en';
    w.innerHTML=DANE.map(([n,a,b,wy])=>`<div class="wykres__wiersz"><span class="liczba">${n}</span><div class="wykres__pas" role="img" aria-label="${n}: ${Math.round(a*100)}% ${en?'viewers after 3 seconds':'widzów po 3 sekundach'}, ${Math.round(b*100)}% ${en?'to the end':'do końca'}, ${en?wy.replace(' tys.','k'):wy} ${en?'views':'wyświetleń'}"><i class="a" style="width:${a*100}%"></i><i class="b" style="width:${b*100}%"></i></div></div>`).join('');
    new IntersectionObserver((w2,o)=>w2.forEach(x=>{if(x.isIntersecting){x.target.classList.add('widoczny');o.disconnect();}}),{threshold:.3}).observe(w);
  });

  // pojawianie się – element jest widoczny od początku, tylko dostaje ruch
  const wejscia=document.querySelectorAll('[data-wejscie]');
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    wejscia.forEach(e=>e.classList.add('czeka'));
    const io2=new IntersectionObserver(w=>w.forEach(x=>{if(x.isIntersecting){x.target.classList.remove('czeka');io2.unobserve(x.target);}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    wejscia.forEach(e=>io2.observe(e));
  }
})();
