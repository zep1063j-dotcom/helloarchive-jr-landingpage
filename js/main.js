'use strict';
const config = window.HELLO_ARCHIVE_JR_CONFIG || {};
let formURL;
try {
  const url = new URL(config.GOOGLE_FORM_URL);
  if (url.protocol === 'https:' && (url.hostname === 'forms.gle' || (url.hostname === 'docs.google.com' && url.pathname.startsWith('/forms/')))) formURL = url.href;
} catch { /* Missing configuration is handled visibly below. */ }
document.querySelectorAll('[data-cta]').forEach(link => {
  if (formURL) { link.href = formURL; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.setAttribute('aria-label', `${link.textContent.trim()} (Google Form, 새 탭)`); }
  else { link.addEventListener('click', event => { event.preventDefault(); document.querySelector('#form-dialog').showModal(); }); }
});
if (!formURL) document.querySelector('#form-status').textContent = '신청 폼 준비 중 · 현재는 신청을 받지 않습니다.';
const memories = {
  6: ['공룡 박사가 될 거야!', '공룡 이름을 줄줄 외우던 요즘. 꿈도 온통 공룡이다.'],
  10: ['게임을 만드는 사람이 되고 싶어.', '직접 만든 게임을 친구들과 해보고 싶다고 했다.'],
  15: ['아직 모르겠지만, 내가 좋아하는 일을 하고 싶어.', '정답을 서두르지 않고, 좋아하는 것을 찾아가는 중.']
};
const tabs = [...document.querySelectorAll('[data-age]')];
function selectAge(tab) {
  tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
  const age = tab.dataset.age;
  const panel = document.querySelector('#age-panel');
  panel.setAttribute('aria-labelledby', tab.id);
  document.querySelector('#answer-age').textContent = `${age}살의 생각`;
  document.querySelector('#age-answer').textContent = memories[age][0];
  document.querySelector('#age-note').textContent = memories[age][1];
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) panel.animate([{ opacity: .3, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, easing: 'ease-out' });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectAge(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectAge(tabs[next]); tabs[next].focus(); }
  });
});
const questions = ['요즘 가장 행복한 순간은 언제야?', '커서 어떤 사람이 되고 싶어?', '오늘 처음 알게 된 게 있어?', '너에게 용기란 어떤 모습이야?'];
let questionIndex = 0;
const input = document.querySelector('#answer-input');
input.addEventListener('input', () => { input.setCustomValidity(''); document.querySelector('#counter').textContent = `${input.value.length} / 300`; });
document.querySelector('#next-question').addEventListener('click', () => { questionIndex = (questionIndex + 1) % questions.length; document.querySelector('#demo-question').textContent = questions[questionIndex]; });
document.querySelector('#demo-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!input.value.trim()) { input.setCustomValidity('아이의 대답을 한 문장 남겨주세요.'); input.reportValidity(); return; }
  document.querySelector('#result-question').textContent = questions[questionIndex];
  document.querySelector('#result-answer').textContent = input.value.trim();
  event.currentTarget.hidden = true;
  document.querySelector('#demo-result').hidden = false;
  const heading = document.querySelector('#demo-result h3'); heading.tabIndex = -1; heading.focus();
});
document.querySelector('#write-again').addEventListener('click', () => {
  document.querySelector('#demo-result').hidden = true; document.querySelector('#demo-form').hidden = false; input.value = ''; input.dispatchEvent(new Event('input')); input.focus();
});
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08 });
  document.querySelectorAll('.section-heading, .steps article, .book-grid article').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
}
