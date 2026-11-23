// Okno ze showreelem dla obu stron. Każdy element z [data-showreel] otwiera film z dźwiękiem.
// Komputer: wersja 16:9, telefon (pion): 9:16. Zamknięcie: przycisk, Esc, klik w tło.
(function(){
  const baza=(document.currentScript&&document.currentScript.src)?new URL('.',document.currentScript.src).href:'../showreel/';
  const css=`.sr-okno{position:fixed;inset:0;z-index:200;width:100%;height:100%;max-width:none;max-height:none;margin:0;padding:clamp(12px,3vw,40px);border:0;background:rgba(11,7,18,.95);display:none;place-items:center}
.sr-okno[open]{display:grid}.sr-okno::backdrop{background:transparent}
.sr-okno video{display:block;max-width:100%;max-height:calc(100vh - 110px);border-radius:14px;background:#000;box-shadow:0 40px 120px -30px #000}
.sr-zamknij{position:absolute;top:14px;right:14px;min-width:48px;min-height:48px;border-radius:999px;border:1px solid rgba(244,244,242,.35);background:#2b1810;color:#fff;font:700 15px "Schibsted Grotesk",system-ui,sans-serif;padding:0 18px;cursor:pointer}
.sr-zamknij:focus-visible{outline:2px solid #f4f4f2;outline-offset:3px}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  let okno,wideo;
  function zbuduj(){
    okno=document.createElement('dialog');okno.className='sr-okno';
    okno.innerHTML='<button type="button" class="sr-zamknij"></button><video controls playsinline preload="none"></video>';
    document.body.appendChild(okno);wideo=okno.querySelector('video');
    okno.querySelector('.sr-zamknij').onclick=zamknij;
    okno.addEventListener('click',e=>{if(e.target===okno)zamknij()});
    okno.addEventListener('close',()=>wideo.pause());
  }
  function zamknij(){okno.close()}
  function otworz(){
    if(!okno)zbuduj();
    const pion=matchMedia('(max-aspect-ratio: 4/5)').matches;
    const plik=pion?'showreel-9x16':'showreel-16x9';
    const en=(document.documentElement.lang||'pl').startsWith('en');
    okno.querySelector('.sr-zamknij').textContent=en?'Close ✕':'Zamknij ✕';
    wideo.setAttribute('aria-label',en?'Showreel, 55 seconds':'Showreel, 55 sekund');
    if(!wideo.src.endsWith(plik+'.mp4')){wideo.poster=baza+'okladka-'+plik.slice(9)+'.jpg';wideo.src=baza+plik+'.mp4';}
    wideo.currentTime=0;wideo.muted=false;
    okno.showModal();wideo.play().catch(()=>{});
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-showreel]');if(b){e.preventDefault();otworz();}});
})();
