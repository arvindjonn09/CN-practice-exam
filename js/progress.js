/**
 * progress.js — localStorage-based progress tracking for topics, labs, quiz scores
 * Keys are namespaced: cnj::<path>::<type>::<id>
 */

const Progress = (() => {
  const NS = 'cnj';
  const key = (path, type, id) => `${NS}::${path}::${type}::${id}`;

  /* ── Read / write ── */
  function get(path, type, id) {
    try { return JSON.parse(localStorage.getItem(key(path, type, id))); }
    catch { return null; }
  }
  function set(path, type, id, value) {
    try { localStorage.setItem(key(path, type, id), JSON.stringify(value)); }
    catch (e) { console.warn('Progress save failed:', e); }
  }
  function remove(path, type, id) {
    localStorage.removeItem(key(path, type, id));
  }

  /* ── Topic status ── */
  // Statuses: 'not-started' | 'learning' | 'lab-done' | 'quiz-passed' | 'reviewed' | 'interview-ready'
  function getTopicStatus(path, topicId) {
    return get(path, 'topic', topicId) || 'not-started';
  }
  function setTopicStatus(path, topicId, status) {
    set(path, 'topic', topicId, status);
    document.dispatchEvent(new CustomEvent('progress:changed', { detail: { path, topicId, status } }));
  }

  /* ── Step completion (learn / lab / quiz) ── */
  function getStepDone(path, topicId, step) {
    return !!get(path, `step-${step}`, topicId);
  }
  function setStepDone(path, topicId, step, done = true) {
    set(path, `step-${step}`, topicId, done);
  }

  /* ── Quiz scores ── */
  function getQuizScore(path, topicId) {
    return get(path, 'quiz', topicId); // { score, total, passed, date }
  }
  function setQuizScore(path, topicId, score, total) {
    const passed = (score / total) >= 0.8;
    set(path, 'quiz', topicId, { score, total, passed, date: new Date().toISOString() });
    if (passed) setStepDone(path, topicId, 'quiz');
    return passed;
  }

  /* ── Path-level aggregates ── */
  function getPathStats(path, topicIds) {
    const stats = { total: topicIds.length, done: 0, inProgress: 0, notStarted: 0 };
    topicIds.forEach(id => {
      const s = getTopicStatus(path, id);
      if (['quiz-passed', 'reviewed', 'interview-ready'].includes(s)) stats.done++;
      else if (s !== 'not-started') stats.inProgress++;
      else stats.notStarted++;
    });
    stats.pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;
    return stats;
  }

  /* ── UI helpers ── */
  function initStatusSelect(path, topicId) {
    const sel = document.getElementById('topic-status-select');
    if (!sel) return;
    sel.value = getTopicStatus(path, topicId);
    sel.addEventListener('change', () => {
      setTopicStatus(path, topicId, sel.value);
      const msg = document.getElementById('status-saved-msg');
      if (msg) { msg.classList.add('show'); setTimeout(() => msg.classList.remove('show'), 2000); }
    });
  }

  function updateStepBar(path, topicId) {
    const steps = ['learn', 'lab', 'quiz'];
    steps.forEach((step, i) => {
      const circle = document.querySelector(`.step-circle[data-step="${step}"]`);
      const line   = document.querySelector(`.step-line[data-after="${step}"]`);
      const name   = document.querySelector(`.step-name[data-step="${step}"]`);
      const done   = getStepDone(path, topicId, step);
      const isNext = !done && (i === 0 || getStepDone(path, topicId, steps[i - 1]));
      if (circle) {
        circle.className = 'step-circle';
        circle.classList.add(done ? 'done' : isNext ? 'active' : 'pending');
        circle.textContent = done ? '✓' : i + 1;
      }
      if (name) {
        name.className = 'step-name';
        name.classList.add(done ? 'done' : isNext ? 'active' : 'pending');
      }
      if (line) line.classList.toggle('done', done);
    });
  }

  return {
    getTopicStatus, setTopicStatus,
    getStepDone, setStepDone,
    getQuizScore, setQuizScore,
    getPathStats,
    initStatusSelect, updateStepBar,
  };
})();
