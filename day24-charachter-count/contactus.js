
const btnToggle = document.querySelector(".mode-toggle");
btnToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        btnToggle.textContent = '🌤️'
    } else {
        btnToggle.textContent = '🌙'
    }
});
// show hide FAQ body
const items = document.querySelectorAll('.accordion-item');
items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

         hideFaq(items);

        if (!isOpen) {
            item.classList.add('active');
        }
    });
});
// show hide FAQ section
const faqToggle = document.querySelector('.showFaq');
const faqWrapper = document.querySelector('.faq-wrapper');
faqWrapper.classList.toggle('hidden');
faqToggle.addEventListener('click', () => {
    faqWrapper.classList.toggle('hidden');
     hideFaq(items);
})
//hide faq body
function hideFaq(items) {
items.forEach(i => i.classList.remove('active'));
}
// hide show tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(`.tab-panel[data-panel="${target}"]`).classList.add('active')
    })
});
// Contact-us & char count
const textarea = document.querySelector('.char-textarea');
const charCountLable = document.querySelector('.char-count');
const maxLength = 280;
textarea.addEventListener('input', () => {
    const currentLength = textarea.value.length;
    charCountLable.textContent = `${currentLength}/${maxLength}`
    if(currentLength > maxLength-20) {
        charCountLable.style.color = 'var(--accent-amber)'
    } else {
        charCountLable.style.color = ''
    }
});
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you! for your message. We will get back to you at the earliest.');
});
