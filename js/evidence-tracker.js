/**
 * evidence-tracker.js — Notes, commands, screenshots, export to Markdown
 * Saves to localStorage. Each field identified by topicId + fieldName.
 */

const Evidence = (() => {
  const NS = 'cnj::evidence';
  const key = (topicId, field) => `${NS}::${topicId}::${field}`;

  function save(topicId, field, value) {
    try { localStorage.setItem(key(topicId, field), value); return true; }
    catch { return false; }
  }
  function load(topicId, field) {
    return localStorage.getItem(key(topicId, field)) || '';
  }
  function clear(topicId) {
    Object.keys(localStorage)
      .filter(k => k.startsWith(`${NS}::${topicId}::`))
      .forEach(k => localStorage.removeItem(k));
  }

  function bindTextarea(topicId, fieldName, elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.value = load(topicId, fieldName);
    let timer;
    el.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const ok = save(topicId, fieldName, el.value);
        const msg = el.closest('.topic-section')?.querySelector('.notes-saved-msg');
        if (msg && ok) { msg.classList.add('show'); setTimeout(() => msg.classList.remove('show'), 2000); }
      }, 600);
    });
  }

  function bindFileUpload(topicId, fieldName, inputId, previewId) {
    const input   = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!input) return;
    const saved = load(topicId, fieldName);
    if (saved && preview) renderPreview(preview, saved, load(topicId, fieldName + '-name'));
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      if (file.size > 3 * 1024 * 1024) { alert('File too large — keep under 3MB.'); return; }
      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        save(topicId, fieldName, data);
        save(topicId, fieldName + '-name', file.name);
        if (preview) renderPreview(preview, data, file.name);
      };
      reader.readAsDataURL(file);
    });
  }

  function renderPreview(el, dataUrl, name) {
    el.classList.add('show');
    const isVideo = dataUrl.startsWith('data:video');
    el.innerHTML = isVideo
      ? `<video controls><source src="${dataUrl}"></video><div class="file-preview-name">${name || 'video'}<span>Saved</span></div>`
      : `<img src="${dataUrl}" alt="proof"><div class="file-preview-name">${name || 'screenshot'}<span>Saved</span></div>`;
  }

  function exportMarkdown(topicId, topicTitle) {
    const notes    = load(topicId, 'notes');
    const commands = load(topicId, 'commands');
    const comments = load(topicId, 'comments');
    const md = [
      `# ${topicTitle}`,
      `> Exported from CN Journey — ${new Date().toLocaleDateString()}`,
      '',
      notes    ? `## My Notes\n${notes}` : '',
      commands ? `## Commands Used\n\`\`\`\n${commands}\n\`\`\`` : '',
      comments ? `## Questions / Confusion\n${comments}` : '',
      '',
      '## GitHub Proof Checklist',
      '- [ ] Screenshot uploaded',
      '- [ ] .pkt file committed',
      '- [ ] Commands verified',
      '- [ ] Lab note pushed',
    ].filter(Boolean).join('\n\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${topicId}-notes.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function initTopicPage(topicId, topicTitle) {
    bindTextarea(topicId, 'notes',    'evidence-notes');
    bindTextarea(topicId, 'commands', 'evidence-commands');
    bindTextarea(topicId, 'comments', 'evidence-comments');
    bindFileUpload(topicId, 'screenshot', 'screenshot-input', 'screenshot-preview');
    bindFileUpload(topicId, 'video',      'video-input',      'video-preview');
    const exportBtn = document.getElementById('export-md-btn');
    if (exportBtn) exportBtn.addEventListener('click', () => exportMarkdown(topicId, topicTitle));
    const clearBtn = document.getElementById('clear-evidence-btn');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      if (!confirm('Clear all saved notes and files for this topic?')) return;
      clear(topicId);
      ['evidence-notes','evidence-commands','evidence-comments'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
      ['screenshot-preview','video-preview'].forEach(id => {
        const el = document.getElementById(id); if (el) { el.classList.remove('show'); el.innerHTML = ''; }
      });
    });
    document.querySelectorAll('.gh-item input[type="checkbox"]').forEach(cb => {
      const k = `cnj::evidence::${topicId}::gh-${cb.id}`;
      cb.checked = localStorage.getItem(k) === 'true';
      cb.closest('.gh-item')?.classList.toggle('checked', cb.checked);
      cb.addEventListener('change', () => {
        localStorage.setItem(k, cb.checked);
        cb.closest('.gh-item')?.classList.toggle('checked', cb.checked);
      });
    });
  }

  return { save, load, clear, bindTextarea, bindFileUpload, exportMarkdown, initTopicPage };
})();
