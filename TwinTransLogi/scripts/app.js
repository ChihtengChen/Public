/* ============================================================
 * TwinTransLogi — 互動邏輯
 * Tab nav · Sub-nav · Lightbox · Search · Keyboard · Filter · Carousel · Dark mode · Print · Trial
 * ============================================================ */

(function() {
  'use strict';

  const D = window.BOOK_DATA;

  /* --------- Role mapping --------- */
  const ROLE = {
    'A': { cls: 'allen', name: 'Allen 顧問', avatar: 'A' },
    'W': { cls: 'ware', name: 'Ware（倉儲）', avatar: 'W' },
    'R': { cls: 'route', name: 'Route（運輸）', avatar: 'R' },
    'N': { cls: 'narrator', name: '', avatar: '' }
  };

  /* --------- Render: Hero & Home features --------- */
  function renderHome() {
    const m = D.meta;
    document.getElementById('hero-title').innerHTML = m.title;
    document.getElementById('hero-subtitle').innerHTML = m.subtitle;
    document.getElementById('hero-tagline').innerHTML =
      `<strong>14 章</strong>從觀點建構到實作落地　·　<strong>585 道</strong>章末習題　·　<strong>61 張</strong>結構圖示　·　<strong>三人敘事體例</strong>跟著角色學物流——一本為 <strong>AI 時代物流人</strong>寫的新教科書`;

    const fGrid = document.getElementById('features-grid');
    fGrid.innerHTML = D.features.map(f => `
      <div class="feature-card color-${f.color}">
        <div class="feature-num">FEATURE / ${f.n}</div>
        <div class="feature-title">${f.title}</div>
        <div class="feature-body">${f.body}</div>
      </div>
    `).join('');

    const pGrid = document.getElementById('parts-preview');
    pGrid.innerHTML = D.parts.map((p, i) => `
      <div class="part-preview p${i+1}" data-jump="${p.id}">
        <div class="part-eyebrow">${p.eyebrow}</div>
        <div class="part-name">${p.label}</div>
        <div class="part-tagline">${p.tagline}</div>
        <div class="part-chapters">
          ${p.chapters.map(c => `<span class="part-chip">Ch ${D.chapters[c].num}</span>`).join('')}
        </div>
      </div>
    `).join('');

    // Make part previews clickable
    pGrid.querySelectorAll('.part-preview').forEach(el => {
      el.addEventListener('click', () => switchTab(el.dataset.jump));
    });

    // Quotes carousel
    const qC = document.getElementById('quotes-carousel');
    qC.innerHTML = D.quotes.map(q => `
      <div class="quote-card">
        <div class="quote-mark">"</div>
        <div class="quote-text">${q.text}</div>
        <div class="quote-cite">— ${q.cite}</div>
      </div>
    `).join('');
  }

  /* --------- Render: Each part page --------- */
  function renderPart(part) {
    const partEl = document.getElementById('page-' + part.id);
    if (!partEl) return;

    partEl.innerHTML = `
      <div class="part-header">
        <div class="part-header-inner">
          <div class="part-header-eyebrow">${part.eyebrow}</div>
          <h2 class="part-header-title">${part.label}</h2>
          <div class="part-header-tagline">${part.tagline}　·　${part.cast}</div>
        </div>
      </div>
      <div class="subnav">
        <div class="subnav-inner">
          ${part.chapters.map(c => {
            const ch = D.chapters[c];
            return `<a href="#${c}" data-ch="${c}">Ch ${ch.num}　${ch.title}</a>`;
          }).join('')}
        </div>
      </div>
      <div class="section">
        <div class="section-inner">
          <div class="filter-bar">
            <span class="filter-label">DOUBLE AXIS FILTER</span>
            <button class="filter-chip active all" data-filter="all">全部</button>
            <button class="filter-chip" data-filter="dx">純 DX</button>
            <button class="filter-chip" data-filter="sx">純 SX</button>
            <button class="filter-chip" data-filter="both">雙軸（兩者兼具）</button>
            <span class="filter-count" data-part="${part.id}"></span>
          </div>
          <div class="ch-list">
            ${part.chapters.map(c => renderChapterCard(c, D.chapters[c])).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind filter chips
    partEl.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        partEl.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active', 'all', 'dx', 'sx', 'both'));
        chip.classList.add('active', chip.dataset.filter);
        applyFilter(partEl, chip.dataset.filter);
      });
    });

    // Bind figure → lightbox
    partEl.querySelectorAll('.ch-figure').forEach(fig => {
      fig.addEventListener('click', () => openLightbox(fig.querySelector('img').src, fig.dataset.caption));
    });

    // Bind trial questions
    partEl.querySelectorAll('.ch-trial').forEach(t => {
      t.querySelectorAll('.ch-trial-opt').forEach(o => {
        o.addEventListener('click', () => {
          t.classList.add('show');
          if (o.dataset.ans === t.dataset.correct) o.classList.add('correct');
        });
      });
    });

    // Sub-nav highlight on scroll
    setupSubnavHighlight(partEl);

    // Initialize filter count display
    applyFilter(partEl, 'all');
  }

  function applyFilter(partEl, filter) {
    let shown = 0, total = 0;
    partEl.querySelectorAll('.ch-card').forEach(card => {
      total++;
      const axes = (card.dataset.axes || '').split(',').filter(Boolean);
      let visible;
      if (filter === 'all') {
        visible = true;
      } else if (filter === 'both') {
        visible = axes.length >= 2 && axes.includes('dx') && axes.includes('sx');
      } else {
        visible = axes.length === 1 && axes[0] === filter;
      }
      card.classList.toggle('hidden', !visible);
      if (visible) shown++;
    });
    const cnt = partEl.querySelector('.filter-count');
    if (cnt) {
      const labelMap = { all: '全部', dx: '純 DX', sx: '純 SX', both: '雙軸' };
      const filterLabel = labelMap[filter] || filter;
      if (filter === 'all') {
        cnt.textContent = `顯示全部 ${total} 章`;
      } else if (shown === 0) {
        cnt.textContent = `本篇沒有「${filterLabel}」章節`;
      } else {
        cnt.textContent = `顯示 ${shown} / ${total} 章（${filterLabel}）`;
      }
    }
  }

  function renderChapterCard(id, ch) {
    const trial = D.trialQuestions.find(t => t.ch === id);
    const trialHtml = trial ? `
      <div class="ch-trial" data-correct="${trial.ans}">
        <div class="ch-trial-tag">章末習題　試讀</div>
        <div class="ch-trial-q">${trial.q}</div>
        <div class="ch-trial-opts">
          ${trial.opts.map((o, i) => {
            const letter = String.fromCharCode(65 + i);
            return `<span class="ch-trial-opt" data-ans="${letter}">(${letter}) ${o}</span>`;
          }).join('')}
        </div>
        <div class="ch-trial-exp">✅ <strong>正解 ${trial.ans}</strong>　·　${trial.exp}</div>
      </div>
    ` : '';

    const statusLabel = {
      done: 'v' + (ch.version || '') + ' 已交付',
      draft: '修訂中',
      todo: '規劃中'
    }[ch.status] || '';

    return `
      <article class="ch-card" id="${id}" data-axes="${ch.axes.map(a => a.toLowerCase()).join(',')}">
        <div class="ch-card-head">
          <span class="ch-num">CH ${ch.num.padStart(2, '0')}</span>
          <h3 class="ch-title">${ch.title}<span class="ch-subtitle">　${ch.subtitle}</span></h3>
          <div class="ch-axes">
            ${ch.axes.map(a => `<span class="ch-axis-chip ${a.toLowerCase()}">${a}</span>`).join('')}
          </div>
          <span class="ch-status-chip ${ch.status === 'done' ? '' : ch.status}">${statusLabel}</span>
        </div>
        ${ch.video ? `
        <div class="ch-video">
          <div class="ch-video-tag">▶ ${ch.video.title}</div>
          <div class="ch-video-frame">
            <iframe
              src="${ch.video.list ? 'https://www.youtube.com/embed/videoseries?list=' + ch.video.list : 'https://www.youtube.com/embed/' + ch.video.id}"
              title="${ch.video.title}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              loading="lazy"></iframe>
          </div>
          <a class="ch-video-link" href="${ch.video.shorts ? 'https://youtube.com/shorts/' + ch.video.id : 'https://youtu.be/' + ch.video.id + (ch.video.list ? '?list=' + ch.video.list : '')}" target="_blank" rel="noopener">
            在 YouTube 開啟（含播放清單）→
          </a>
        </div>
        ` : ''}
        <div class="ch-body">
          <div class="ch-body-left">
            <div class="dialogue">
              ${ch.dialogue.map(line => renderBubble(line)).join('')}
            </div>
          </div>
          <div class="ch-body-right">
            <figure class="ch-figure" data-caption="${ch.figCaption}">
              <img src="assets/figures/${ch.figure}" alt="${ch.figCaption}" loading="lazy">
              <figcaption class="ch-fig-caption">${ch.figCaption}</figcaption>
            </figure>
            <div class="ch-summary">${ch.summary}</div>
            <div class="ch-kri-list">
              ${ch.kri.map(k => `<span class="ch-kri-chip">${k}</span>`).join('')}
            </div>
            ${trialHtml}
          </div>
        </div>
      </article>
    `;
  }

  function renderBubble(line) {
    const r = ROLE[line.who];
    if (line.who === 'N') {
      return `<div class="bubble narrator">${line.text}</div>`;
    }
    return `
      <div class="bubble ${r.cls}">
        <div class="avatar ${r.cls}">${r.avatar}</div>
        <div>
          <div class="bubble-name">${r.name}</div>
          <div class="bubble-content">${line.text}</div>
        </div>
      </div>
    `;
  }

  /* --------- Tab navigation --------- */
  function switchTab(tabId) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
    document.querySelectorAll('.tab-page').forEach(p => p.classList.toggle('active', p.id === 'page-' + tabId));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#' + tabId);
  }

  function setupTabs() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    // Initial route from hash
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById('page-' + hash)) {
      switchTab(hash);
    } else if (hash && document.getElementById(hash)) {
      // Direct chapter link: find its part
      for (const p of D.parts) {
        if (p.chapters.includes(hash)) {
          switchTab(p.id);
          setTimeout(() => document.getElementById(hash).scrollIntoView({ behavior: 'smooth' }), 200);
          return;
        }
      }
    }
  }

  /* --------- Sub-nav highlight via IntersectionObserver --------- */
  function setupSubnavHighlight(partEl) {
    const subnavLinks = partEl.querySelectorAll('.subnav a');
    if (!subnavLinks.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          subnavLinks.forEach(a => a.classList.toggle('current', a.dataset.ch === id));
        }
      });
    }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

    partEl.querySelectorAll('.ch-card').forEach(c => observer.observe(c));
  }

  /* --------- Lightbox --------- */
  function openLightbox(src, caption) {
    const lb = document.getElementById('lightbox');
    lb.querySelector('img').src = src;
    lb.querySelector('.lightbox-caption').textContent = caption || '';
    lb.classList.add('show');
  }
  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('show');
  }
  function setupLightbox() {
    const lb = document.getElementById('lightbox');
    lb.addEventListener('click', e => {
      if (e.target === lb || e.target.classList.contains('lightbox-close')) closeLightbox();
    });
  }

  /* --------- Search --------- */
  function setupSearch() {
    const btn = document.getElementById('search-btn');
    const box = document.getElementById('search-box');
    const input = document.getElementById('search-input');
    btn.addEventListener('click', () => {
      box.classList.toggle('show');
      if (box.classList.contains('show')) input.focus();
    });
    input.addEventListener('input', () => doSearch(input.value.trim()));
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { box.classList.remove('show'); input.value = ''; doSearch(''); }
    });
  }
  function doSearch(q) {
    if (!q) {
      document.querySelectorAll('.ch-card').forEach(c => c.classList.remove('hidden'));
      return;
    }
    const lower = q.toLowerCase();
    Object.entries(D.chapters).forEach(([id, ch]) => {
      const text = (ch.title + ch.subtitle + ch.summary + ch.kri.join(' ') +
        ch.dialogue.map(d => d.text).join(' ')).toLowerCase();
      const card = document.getElementById(id);
      if (card) card.classList.toggle('hidden', !text.includes(lower));
    });
    // If hits exist, jump to that part
    for (const p of D.parts) {
      const hits = p.chapters.some(c => {
        const ch = D.chapters[c];
        const text = (ch.title + ch.subtitle + ch.summary + ch.kri.join(' ') +
          ch.dialogue.map(d => d.text).join(' ')).toLowerCase();
        return text.includes(lower);
      });
      if (hits) {
        const currentTab = document.querySelector('.nav-tab.active')?.dataset.tab;
        if (currentTab === 'home' || !p.chapters.some(c => D.chapters[c].part === currentTab)) {
          // Don't auto-switch — let user pick
        }
        break;
      }
    }
  }

  /* --------- Keyboard shortcuts --------- */
  function setupKeyboard() {
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === '1') switchTab('home');
      if (e.key === '2') switchTab('part1');
      if (e.key === '3') switchTab('part2');
      if (e.key === '4') switchTab('part3');
      if (e.key === '5') switchTab('epilogue');
      if (e.key === '/') {
        e.preventDefault();
        document.getElementById('search-btn').click();
      }
    });
  }

  /* --------- Dark mode --------- */
  function setupDarkMode() {
    const btn = document.getElementById('dark-btn');
    const saved = localStorage.getItem('ttl-dark');
    if (saved === '1' || (saved == null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark');
    }
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('ttl-dark', document.body.classList.contains('dark') ? '1' : '0');
    });
  }

  /* --------- Print --------- */
  function setupPrint() {
    document.getElementById('print-btn').addEventListener('click', () => {
      // Show all part pages for print
      document.querySelectorAll('.tab-page').forEach(p => p.classList.add('print-show'));
      window.print();
      setTimeout(() => {
        document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('print-show'));
      }, 1000);
    });
  }

  /* --------- Init --------- */
  function init() {
    renderHome();
    D.parts.forEach(p => renderPart(p));
    setupTabs();
    setupLightbox();
    setupSearch();
    setupKeyboard();
    setupDarkMode();
    setupPrint();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
