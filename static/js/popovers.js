// popovers.js — add popovers after footnote numbers

(() => {
  'use strict';

  // Find all a hrefs in the #references section
  const collectReferences = () => {
    const list = document.querySelector('h1#references + ol');
    if (!list) return [{}, {}];

    const urls = {}, titles = {};
    list.querySelectorAll('li a').forEach((a, i) => {
      const k = String(i + 1);
      urls[k]   = a.href;
      titles[k] = a.textContent.trim();
    });
    return [urls, titles];
  };

  const makePopover = (k, url, title) => {
    const details  = document.createElement('span');
    details.className = "popover";
    details.dataset.popover = 'right';

    const summary  = document.createElement('span');
    summary.className = "popover__trigger";
    summary.textContent = k;

    const div     = document.createElement('span');
    div.className = "popover__panel";
    div.innerHTML =
      `<a href="${url}" target="_blank" rel="noopener">${title}</a>`;

    details.append(summary, div);
    return details;
  };

  // Start here
  document.addEventListener('DOMContentLoaded', () => {
    const [urls, titles] = collectReferences();

    // Find all #references urls
    document.querySelectorAll('a[href*="#references"]').forEach(anchor => {
      const k = anchor.textContent.match(/\d+/)?.[0];
      if (!k || !urls[k]) return;

      const pop = makePopover(k, urls[k], titles[k]);
      anchor.replaceWith(pop); 
    });
  });
})();
