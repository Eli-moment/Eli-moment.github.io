// Abstracts: shown in full without JavaScript; with it, each folds behind the
// "Abstract" button that sits next to the paper's tags.
for (const text of document.querySelectorAll('.abstract-text')) {
  const button = text.closest('.paper').querySelector('.abstract-toggle');
  text.hidden = true;
  button.hidden = false;
  button.addEventListener('click', () => {
    const open = text.hidden;
    text.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
  });
}

// Nav highlight: the last section whose top has scrolled past the bar is current.
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const navTargets = navLinks.map((a) => document.querySelector(a.getAttribute('href')));
let navTicking = false;
let navCurrent = -1;

function markCurrentSection() {
  navTicking = false;
  let current = 0;
  navTargets.forEach((target, i) => {
    if (target && target.getBoundingClientRect().top <= 120) current = i;
  });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) {
    current = navLinks.length - 1;
  }
  navLinks.forEach((a, i) => {
    if (i === current) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });

  // On phones the bar scrolls sideways: keep the current tab in view.
  if (current !== navCurrent && navLinks[current]) {
    navCurrent = current;
    const link = navLinks[current];
    const bar = link.parentElement;
    const left = link.offsetLeft;
    if (left < bar.scrollLeft || left + link.offsetWidth > bar.scrollLeft + bar.clientWidth) {
      bar.scrollLeft = left - 16;
    }
  }
}

for (const type of ['scroll', 'resize']) {
  addEventListener(type, () => {
    if (!navTicking) {
      navTicking = true;
      requestAnimationFrame(markCurrentSection);
    }
  }, { passive: true });
}
markCurrentSection();

// Field filter for the research list. Without JavaScript the buttons stay
// hidden and every paper is shown.
const filters = document.querySelector('.filters');

if (filters) {
  const papers = document.querySelectorAll('.paper');
  const groups = document.querySelectorAll('.paper-group');
  filters.hidden = false;

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-field]');
    if (!button) return;
    const field = button.dataset.field;

    for (const b of filters.querySelectorAll('button')) {
      b.setAttribute('aria-pressed', String(b === button));
    }
    for (const paper of papers) {
      paper.hidden = field !== 'all' && !paper.dataset.fields.split(' ').includes(field);
    }
    for (const group of groups) {
      group.hidden = !group.querySelector('.paper:not([hidden])');
    }
  });
}
