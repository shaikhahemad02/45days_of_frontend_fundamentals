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

