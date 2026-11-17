'use strict';

(async () => {
  await window.DholeCopy.ready;
  const {categories, entries} = window.DHOLE_CONTENT;
  const $ = selector => document.querySelector(selector);
  const dictionaryNodes = [...document.querySelectorAll('[data-i18n]')];
  const zh = Object.fromEntries(dictionaryNodes.map(node => [node.dataset.i18n, node.innerHTML]));
  const en = {
    skip:'Skip to content',siteName:'Mr.Dhole’s little corner',brandCaption:'A small place on the internet',about:'About me',
    profileNote:'Learn a little.<br>Have a little fun.',navigationLabel:'TAKE A LOOK AROUND',sidebarNote:'A work in progress. Stay curious.',
    welcomeLabel:'HELLO, WORLD / MAKE YOURSELF AT HOME',greeting:'Hey, I’m<br><span class="identity-name">Mr.Dhole<span class="orange">.</span></span>',welcomeCopy:'Also known as 豺狼先生.<br>A little learning, a little nonsense.',welcomeTopics:'Learning · Courses · 道在屎溺',browse:'Have a look around',deskCaption:'A little desk for a bit of everything.',
    searchLabel:'Search learning resources and courses',clearSearch:'Clear',
    bookmarksTitle:'Bookmarks',bookmarksDescription:'Public resources, ready to open',rdkitLabel:'Python introduction',pytorchLabel:'Official tutorials',d2lLabel:'Dive into Deep Learning',openBook:'Open textbook',littleNote:'Some things need a closer look.<br>Others are just here for fun.',footerText:'A little corner, still growing',backTop:'Back to the opening',close:'Close'
  };
  const palette = {learning:['#e7eee1','#7b9667'],courses:['#f4e6dc','#bb8968']};
  let language = 'zh';
  let category = 'all';
  let query = '';
  let readerId = null;
  let routeBeforeReader = '#home';
  const reader = $('#reader');
  const search = $('#search');
  const translated = pair => typeof pair === 'string' ? pair : pair[language];
  const copy = (chinese, english) => language === 'zh' ? chinese : english;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normalize = text => text.normalize('NFKC').toLocaleLowerCase().trim();
  const edited=(key,fallback,locale=language)=>window.DholeCopy.text(key,locale,fallback);
  const label = item => edited('category.'+item.id+'.label',item[language]);
  const resourceText=(entry,field,locale=language)=>edited('resource.'+entry.id+'.'+field,entry[field][locale],locale);
  const countFor = id => id === 'all' ? entries.length : entries.filter(entry => entry.category === id).length;
  const routeFor = id => id === 'all' ? '#home' : '#category/' + id;
  const pageTitle = () => edited('home.metaTitle',copy('Mr.Dhole（豺狼先生）的小站','Mr.Dhole’s little corner'));

  function renderNavigation() {
    $('#category-nav').innerHTML = categories.map(item => `<a class="nav-link ${category === item.id ? 'active' : ''}" href="${routeFor(item.id)}" ${category === item.id ? 'aria-current="page"' : ''}><span class="nav-icon" aria-hidden="true">${item.icon}</span><span>${escape(label(item))}</span><span class="nav-count" aria-hidden="true">${String(countFor(item.id)).padStart(2,'0')}</span></a>`).join('') + `<a class="nav-link" href="talk/"><span class="nav-icon" aria-hidden="true">◌</span><span>${escape(edited('nav.talk',copy('闲谈','Casual notes')))}</span></a><a class="nav-link offbeat-nav" href="offbeat/"><span class="nav-icon" aria-hidden="true">✳</span><span>${escape(edited('nav.offbeat','道在屎溺'))}</span></a>`;
    $('#category-nav').setAttribute('aria-label',copy('内容栏目','Content categories'));
    $('#filter-row').innerHTML = categories.map(item => `<button type="button" data-filter="${item.id}" aria-pressed="${category === item.id}">${escape(item.id === 'all' ? copy('全部','All') : label(item))}</button>`).join('');
    $('#filter-row').setAttribute('aria-label',copy('筛选栏目','Filter categories'));
  }

  function matchingEntries() {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return entries.filter(entry => {
      if (category !== 'all' && entry.category !== category) return false;
      const itemCategory = categories.find(item => item.id === entry.category);
      const haystack = normalize([resourceText(entry,'title','zh'),resourceText(entry,'title','en'),resourceText(entry,'summary','zh'),resourceText(entry,'summary','en'),...entry.tags,edited('category.'+itemCategory.id+'.label',itemCategory.zh,'zh'),edited('category.'+itemCategory.id+'.label',itemCategory.en,'en'),entry.source || ''].join(' '));
      return terms.every(term => haystack.includes(term));
    });
  }

  function renderCollection() {
    const active = categories.find(item => item.id === category);
    const matching = matchingEntries();
    $('#collection-title').textContent = edited('category.'+active.id+'.heading',translated(active.heading));
    $('#collection-description').textContent = edited('category.'+active.id+'.description',translated(active.description));
    $('#collection-eyebrow').textContent = active.eyebrow;
    $('#collection-count').textContent = copy(`${matching.length} 项内容`,`${matching.length} ${matching.length === 1 ? 'item' : 'items'}`);
    $('#clear-search').hidden = !query;
    if (!matching.length) {
      const isSearch = Boolean(normalize(query));
      $('#content-grid').innerHTML = `<div class="empty-state"><div class="empty-mark" aria-hidden="true">${isSearch ? '⌕' : active.icon}</div><h3>${escape(isSearch ? copy('没有找到匹配的内容','No matching content') : copy('给下一次发现留个位置','Room for the next discovery'))}</h3><p>${escape(isSearch ? copy('换个关键词试试，也可以清除搜索，看看这个栏目。','Try another keyword, or clear the search to browse this category.') : translated(active.empty || {zh:'暂时还没有内容。',en:'Nothing here yet.'}))}</p><button type="button" data-empty-action="${isSearch ? 'clear' : 'all'}">${isSearch ? copy('清除搜索','Clear search') : copy('先逛逛其他内容','Explore other things')}</button></div>`;
      return;
    }
    $('#content-grid').innerHTML = matching.map(entry => {
      const itemCategory = categories.find(item => item.id === entry.category);
      const [tint,color] = palette[entry.category];
      const external = Boolean(entry.url);
      const tags = entry.tags.map(tag => language === 'en' && tag === '中文' ? 'Chinese' : tag).join(' / ');
      return `<article class="content-card ${external ? 'resource-card' : ''}" style="--card-tint:${tint};--card-color:${color}"><div class="card-top"><span class="card-symbol" aria-hidden="true">${entry.icon}</span><span class="card-category">${escape(label(itemCategory))}</span></div><h3><a class="card-link" href="${escape(entry.url)}" target="_blank" rel="noopener noreferrer">${escape(resourceText(entry,'title'))}<span class="visually-hidden">${copy('（在新标签页打开）',' (opens in a new tab)')}</span></a></h3><p class="card-description">${escape(resourceText(entry,'summary'))}</p><div class="card-footer"><span class="card-tags">${escape(entry.source || tags)}</span></div></article>`;
    }).join('');
  }

  function renderReader(id) {
    if (id !== 'about') return;
    readerId = id;
    $('#reader-category').textContent = copy('关于这个角落','About this little corner');
    $('#reader-kicker').textContent = 'MR.DHOLE';
    $('#reader-title').textContent = edited('about.title','Mr.Dhole（豺狼先生）');
    $('#reader-summary').textContent = edited('about.summary',copy('学点东西，也找点乐子。','Learn a little. Have a little fun.'));
    $('#reader-content').innerHTML = edited('about.body','').split(/\n\n+/).map(paragraph=>'<p>'+escape(paragraph).replace(/\n/g,'<br>')+'</p>').join('');
    if (!reader.open) { reader.showModal(); document.body.classList.add('body-reading'); }
    $('#reader-title').focus({preventScroll:true});
    document.title = $('#reader-title').textContent;
  }

  function closeReader() {
    if (reader.open) reader.close();
    document.body.classList.remove('body-reading');
    readerId = null;
  }

  function setLanguage(next) {
    language = next === 'en' ? 'en' : 'zh';
    dictionaryNodes.forEach(node => {window.DholeCopy.applyHTML(node,'home.'+node.dataset.i18n,language,(language === 'en' ? en : zh)[node.dataset.i18n]);});
    window.DholeCopy.applyShared(language);
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.title = pageTitle();
    $('meta[name="description"]').content = edited('home.metaDescription','');
    search.placeholder = edited('home.searchPlaceholder',copy('找点什么？试试 Python、课程……','Looking for something? Try Python…'));
    $('.desk-figure img').alt = copy('一张迷你木书桌，上面有蓝色电脑、书、橙色杯子、分子模型和绿植','A miniature wooden desk with a blue laptop, books, an orange mug, a decorative molecule, and a plant');
    $('.desk-side').setAttribute('aria-label',copy('桌边信息','Beside the desk'));
    $('#close-reader').setAttribute('aria-label',copy('关闭阅读','Close reader'));
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.language === language)));
    renderNavigation();renderCollection();
    if (readerId) renderReader(readerId);
    try { localStorage.setItem('dhole-homepage-language',language); } catch (_) { /* Optional device-local language preference. */ }
  }

  function readRoute() {
    const hash = location.hash || '#home';
    if (hash === '#about') { renderReader('about');return; }
    if (hash === '#category/current' || hash === '#category/fun') { location.replace('offbeat/');return; }
    closeReader();
    if (hash === '#collection') return;
    const next = hash.startsWith('#category/') ? hash.slice(10) : 'all';
    category = categories.some(item => item.id === next) ? next : 'all';
    if (hash !== '#home' && hash !== routeFor(category)) {
      history.replaceState(null,'',location.pathname + location.search + routeFor(category));
    }
    routeBeforeReader = routeFor(category);
    query = new URLSearchParams(location.search).get('q') || '';
    search.value = query;
    renderNavigation();renderCollection();
    document.title = pageTitle();
    if (category !== 'all') $('#collection').scrollIntoView({block:'start'});
    else if (hash === '#home') window.scrollTo({top:0,behavior:'smooth'});
  }

  function updateSearch() {
    query = search.value;
    const url = new URL(location.href);
    if (query) url.searchParams.set('q',query); else url.searchParams.delete('q');
    history.replaceState(null,'',url);
    renderCollection();
  }

  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click',() => setLanguage(button.dataset.language)));
  $('#filter-row').addEventListener('click',event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    category = button.dataset.filter;
    const url = new URL(location.href);url.hash = routeFor(category);
    history.pushState(null,'',url);routeBeforeReader = routeFor(category);
    renderNavigation();renderCollection();
    // Rerendered controls retain the keyboard focus that initiated the filter.
    $(`[data-filter="${category}"]`).focus({preventScroll:true});
  });
  $('#content-grid').addEventListener('click',event => {
    const button = event.target.closest('[data-empty-action]');if (!button) return;
    if (button.dataset.emptyAction === 'clear') {search.value='';updateSearch();search.focus();}
    else {location.hash='#home';}
  });
  search.addEventListener('input',updateSearch);
  $('#search-form').addEventListener('submit',event => {event.preventDefault();renderCollection();});
  $('#clear-search').addEventListener('click',() => {search.value='';updateSearch();search.focus();});
  function dismissReader() {closeReader();history.replaceState(null,'',location.pathname+location.search+routeBeforeReader);document.title=pageTitle();}
  $('#close-reader').addEventListener('click',dismissReader);
  reader.addEventListener('cancel',event => {event.preventDefault();dismissReader();});
  reader.addEventListener('click',event => {if(event.target===reader){const bounds=reader.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dismissReader();}});
  window.addEventListener('hashchange',readRoute);
  document.addEventListener('keydown',event => {if(event.key==='/'&&!reader.open&&!/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)&&!document.activeElement.isContentEditable){event.preventDefault();search.focus();search.scrollIntoView({block:'center'});}});
  try {language=localStorage.getItem('dhole-homepage-language')==='en'?'en':'zh';}catch(_){ /* Chinese is the default. */ }
  setLanguage(language);readRoute();
})();
