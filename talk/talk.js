'use strict';
(async () => {
  await window.DholeCopy.ready;
  const copy = {
    zh:{back:'回到小站',title:'闲谈',intro:'日常见闻，随手记下。',empty:'这里还没有文章，想到什么再慢慢写。'},
    en:{back:'Back to the homepage',title:'Casual notes',intro:'Everyday observations, jotted down.',empty:'No notes here yet. Something will come to mind.'}
  };
  function setLanguage(language) {
    const next=language==='en'?'en':'zh';
    document.documentElement.lang=next==='en'?'en':'zh-CN';
    document.querySelectorAll('[data-talk-i18n]').forEach(node=>{node.textContent=window.DholeCopy.text('talk.'+node.dataset.talkI18n,next,copy[next][node.dataset.talkI18n]);});
    window.DholeCopy.applyShared(next);
    document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===next)));
    document.title=window.DholeCopy.text('talk.title',next,copy[next].title)+' · '+window.DholeCopy.text('shared.name',next,'Mr.Dhole');
    document.querySelector('meta[name="description"]').content=next==='zh'?'Mr.Dhole（豺狼先生）的闲谈：日常见闻与随手记下的想法。':'Casual notes by Mr.Dhole: everyday observations and little reflections.';
    try{localStorage.setItem('dhole-homepage-language',next);}catch(_){}
  }
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
  let language='zh';
  try{language=localStorage.getItem('dhole-homepage-language')==='en'?'en':'zh';}catch(_){}
  setLanguage(language);
})();
