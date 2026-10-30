'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const safeUrl = value => {
    const url = new URL(value, location.href);
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname))) throw Error('Invalid tool URL');
    return url.href;
  };
  function card(tool) {
    if (!tool || typeof tool.name !== 'string' || typeof tool.summary !== 'string' || typeof tool.url !== 'string' || !/^[A-Za-z0-9_.-]+$/.test(tool.repository || '') || !['current','legacy'].includes(tool.group)) throw Error('Invalid tool entry');
    const article = document.createElement('article'); article.className = 'card';
    const open = document.createElement('a'); open.className = 'open'; open.href = safeUrl(tool.url);
    const head = document.createElement('div'); head.className = 'cardHead';
    const icon = document.createElement('span'); icon.className = 'icon'; icon.setAttribute('aria-hidden','true'); icon.textContent = tool.icon || '慶';
    const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = tool.tag || '';
    head.append(icon,tag);
    const title = document.createElement('h2'); title.textContent = tool.name;
    const summary = document.createElement('p'); summary.textContent = tool.summary;
    const go = document.createElement('span'); go.className = 'go'; go.textContent = '開啟工具 →';
    open.append(head,title,summary,go);
    const repo = document.createElement('a'); repo.className = 'repo'; repo.href = 'https://github.com/sq087786789-lgtm/' + tool.repository; repo.textContent = 'GitHub 專案 ↗'; repo.setAttribute('aria-label',tool.name + '的 GitHub 專案');
    article.append(open,repo); return article;
  }
  async function load() {
    try {
      const response = await fetch('tools.json', {cache:'no-store'});
      if (!response.ok) throw Error('Tool list unavailable');
      const data = await response.json();
      if (!Array.isArray(data.tools) || !data.tools.length) throw Error('Invalid tool list');
      // Build the whole list first; an invalid entry must not leave a partial list.
      const items = data.tools.map(tool => ({group:tool.group,node:card(tool)}));
      $('currentTools').replaceChildren(...items.filter(x=>x.group==='current').map(x=>x.node));
      $('legacyTools').replaceChildren(...items.filter(x=>x.group==='legacy').map(x=>x.node));
      $('legacySection').hidden = !items.some(x=>x.group==='legacy');
      $('loadStatus').hidden = true;
    } catch {
      $('loadStatus').textContent = '工具清單暫時無法載入，請重新整理，或使用下方「所有 GitHub 專案」。';
    }
  }
  load();
})();
