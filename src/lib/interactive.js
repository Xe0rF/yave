let tabSeq = 0;
let sliderSeq = 0;

export function initTabs() {
  document.querySelectorAll('.y-tabs').forEach(box => {
    if (box.__yaveReady) return;
    box.__yaveReady = true;

    let tablist = Array.from(box.children).find(el => el.classList && el.classList.contains('y-tablist'));
    let tabs = Array.from(box.querySelectorAll('.y-tab'));
    if (!tabs.length) return;

    if (!tablist) {
      tablist = document.createElement('div');
      tablist.className = 'y-tablist';
      box.insertBefore(tablist, box.firstChild);
      tabs.forEach(tab => tablist.appendChild(tab));
    }

    const panels = Array.from(box.children).filter(
      el => el.classList && (el.classList.contains('y-panel') || el.classList.contains('y-tabpanel')),
    );
    tabs = Array.from(tablist.querySelectorAll('.y-tab'));
    if (!panels.length) return;

    tablist.setAttribute('role', 'tablist');
    tabs.forEach((tab, i) => {
      const panel = panels[i];
      const id = `yave-tab-${++tabSeq}`;
      const panelId = `yave-panel-${id}`;
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      tab.id = id;
      tab.setAttribute('aria-controls', panelId);
      if (panel) {
        panel.id = panelId;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', id);
      }
    });

    function activate(index, focus) {
      const i = Math.max(0, Math.min(tabs.length - 1, index));
      tabs.forEach((tab, j) => {
        const on = j === i;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
      });
      panels.forEach((panel, j) => {
        panel.hidden = j !== i;
        panel.classList.toggle('is-active', j === i);
      });
      if (focus) tabs[i].focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(i, false));
    });

    tablist.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      const current = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
      let next = current < 0 ? 0 : current;
      if (e.key === 'ArrowLeft') next = (next - 1 + tabs.length) % tabs.length;
      else if (e.key === 'ArrowRight') next = (next + 1) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      activate(next, true);
    });

    activate(0, false);
  });
}

export function initSliders() {
  document.querySelectorAll('.y-slider input[type=range]').forEach(input => {
    if (input.__yaveSlider) return;
    input.__yaveSlider = true;
    if (!input.name) {
      const varName = input.getAttribute('data-yave-var');
      input.name = varName ? varName.replace(/^--/, '') : `yave-slider-${++sliderSeq}`;
    }
    const update = () => {
      const wrap = input.closest('.y-slider');
      const out = wrap && wrap.querySelector('output');
      if (out) out.textContent = input.value;
      const varName = input.getAttribute('data-yave-var');
      if (varName) {
        const scope = input.closest('[data-yave-scope]') || document.body;
        scope.style.setProperty(varName, input.value);
      }
    };
    input.addEventListener('input', update);
    update();
  });
}

export function initTables() {
  document.querySelectorAll('.y-page table').forEach(table => {
    if (table.parentElement && table.parentElement.classList.contains('y-table-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'y-table-wrap';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });
}

export function bootInteractive() {
  initTabs();
  initSliders();
  initTables();
}
