'use strict';
(async () => {
  await window.DholeCopy.ready;
  const copy = {
    zh:{back:'回到小站',intro:'时事、闲话和乐子，先留个位置。',aside:'还没想好，先不装了。'},
    en:{back:'Back to the homepage',intro:'A place for perspectives, idle talk, and fun.',aside:'Still figuring it out. No grand claims just yet.'}
  };
  function setLanguage(language) {
    const next = language === 'en' ? 'en' : 'zh';
    document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-offbeat-i18n]').forEach(node => {node.textContent=window.DholeCopy.text('offbeat.'+node.dataset.offbeatI18n,next,copy[next][node.dataset.offbeatI18n]||'道在屎溺');});
    window.DholeCopy.applyShared(next);
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.language === next)));
    document.title = window.DholeCopy.text('offbeat.title',next,'道在屎溺')+' · '+window.DholeCopy.text('shared.name',next,'Mr.Dhole');
    document.querySelector('meta[name="description"]').content = next === 'zh' ? 'Mr.Dhole（豺狼先生）的「道在屎溺」。时事、闲话与乐子的角落，慢慢构思中。' : 'Mr.Dhole’s offbeat corner for perspectives, idle talk, and fun. Still taking shape.';
    try {localStorage.setItem('dhole-homepage-language',next);}catch(_){}
  }
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click',() => setLanguage(button.dataset.language)));
  let language='zh';
  try {language=localStorage.getItem('dhole-homepage-language')==='en'?'en':'zh';}catch(_){}
  setLanguage(language);
})();
