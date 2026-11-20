// PL/EN dla obu podstron. Wybór: ?lang=en → pamięć przeglądarki → PL.
// Ładowany w <head> bez defer – ustawia data-j przed pierwszym rysowaniem.
(function(){
  const h=document.documentElement;
  let j=new URLSearchParams(location.search).get('lang');
  if(!j){try{j=localStorage.getItem('mf-jezyk')}catch(e){}}
  if(j!=='en')j='pl';
  h.dataset.j=j;h.lang=j;

  function ustaw(n){
    h.dataset.j=n;h.lang=n;
    try{localStorage.setItem('mf-jezyk',n)}catch(e){}
    document.querySelectorAll('[data-jezyk]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.jezyk===n)));
    const t=h.getAttribute('data-tytul-'+n);if(t)document.title=t;
    // linki zależne od języka (PDF, mail)
    document.querySelectorAll('[data-href-pl]').forEach(a=>a.setAttribute('href',a.getAttribute('data-href-'+n)));
    // linki między podstronami niosą język
    document.querySelectorAll('a[data-wew]').forEach(a=>{
      const [sciezka,kotw]=a.getAttribute('data-wew').split('#');
      a.setAttribute('href',sciezka+'?lang='+n+(kotw?'#'+kotw:''));
    });
    const u=new URL(location.href);
    if(u.searchParams.get('lang')!==n){u.searchParams.set('lang',n);history.replaceState(null,'',u)}
    dispatchEvent(new CustomEvent('jezyk',{detail:n}));
  }
  window.MF={jezyk:()=>h.dataset.j,ustaw};
  document.addEventListener('DOMContentLoaded',()=>ustaw(h.dataset.j));
  document.addEventListener('click',e=>{const b=e.target.closest('[data-jezyk]');if(b)ustaw(b.dataset.jezyk)});

  // słowa nagłówków do odsłaniania (.podzial)
  window.MF.podziel=root=>{
    (root||document).querySelectorAll('.podzial').forEach(el=>{
      if(el.dataset.podzielone)return;el.dataset.podzielone=1;
      const slowa=el.innerHTML.trim().split(/\s+/);
      el.innerHTML=slowa.map((s,i)=>`<span class="sl"><span style="transition-delay:${i*0.07}s">${s}</span></span>`).join(' ');
    });
  };
})();
