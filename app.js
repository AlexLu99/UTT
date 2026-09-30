'use strict';
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const dots = [...carousel.querySelectorAll('[data-index]')];
  let current = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));
    carousel.querySelector('.slide-status').textContent = (current + 1) + ' / ' + slides.length;
  }
  carousel.querySelector('[data-prev]').addEventListener('click', () => show(current - 1));
  carousel.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
  dots.forEach(dot => dot.addEventListener('click', () => show(Number(dot.dataset.index))));
  carousel.addEventListener('keydown', event => {
    if (event.target.closest('.table-wrap')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
  });
});
document.getElementById('copy-citation').addEventListener('click', async event => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(document.getElementById('bibtex').textContent);
    button.textContent = 'Copied';
    document.getElementById('copy-status').textContent = 'BibTeX copied. The arXiv record will be linked when available.';
    setTimeout(() => { button.textContent = 'Copy'; }, 2200);
  } catch {
    const range = document.createRange(); range.selectNodeContents(document.getElementById('bibtex'));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    document.getElementById('copy-status').textContent = 'Select and copy the highlighted BibTeX text using your browser.';
  }
});


document.querySelectorAll('[data-copy-primer]').forEach(button => {
  button.addEventListener('click', async () => {
    const key = button.dataset.copyPrimer;
    const text = JSON.parse(document.getElementById('primer-data-' + key).textContent);
    const status = document.getElementById('primer-status-' + key);
    try {
      // Copy synchronously from the click so embedded browsers can also use it.
      const field = document.createElement('textarea');
      field.value = text;
      field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(field);
      field.select();
      let copied = false;
      try { copied = document.execCommand('copy'); }
      finally { field.remove(); button.focus({preventScroll:true}); }
      if (!copied) await navigator.clipboard.writeText(text);
      button.textContent = 'Copied';
      status.textContent = 'Full Primer copied. Formulas are preserved in LaTeX notation.';
      setTimeout(() => { button.textContent = 'Copy Primer'; }, 2200);
    } catch {
      const body = document.getElementById('primer-body-' + key);
      const range = document.createRange(); range.selectNodeContents(body);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      status.textContent = 'Use your browser to copy the selected text, or choose Download text.';
    }
  });
});

