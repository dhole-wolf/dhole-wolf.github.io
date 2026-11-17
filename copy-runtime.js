'use strict';
(() => {
  let values={};
  const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const text=(key,language,fallback='')=>values[language]?.[key]??fallback;
  function applyHTML(node,key,language,html){
    const probe=document.createElement('div');probe.innerHTML=html.replace(/<br\s*\/?\s*>/gi,'\n');
    const fallback=probe.textContent;
    const value=text(key,language,fallback);
    node.innerHTML=value===fallback?html:escape(value).replace(/\n/g,'<br>');
  }
  function applyShared(language){document.querySelectorAll('[data-shared]').forEach(node=>{node.textContent=text('shared.'+node.dataset.shared,language,node.textContent);});}
  const ready=fetch('/site-copy.json',{cache:'no-cache',signal:AbortSignal.timeout(12000)}).then(async response=>{if(!response.ok)throw new Error('load');const data=await response.json();values=data;}).catch(()=>{
    const message=document.createElement('div');message.className='copy-unavailable';message.setAttribute('role','status');message.textContent='网站文字暂时读取失败，请刷新重试。';document.body.prepend(message);
  });
  window.DholeCopy={ready,text,applyHTML,applyShared};
})();
