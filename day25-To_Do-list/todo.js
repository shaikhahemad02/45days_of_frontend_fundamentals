
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
// Live Demo To do List
const todoInput = document.querySelector('.todo-input');
const todoAddBtn = document.querySelector('.todo-add-btn');
const todoList = document.querySelector('.todo-list');

function addTodo() {
    const text = todoInput.value.trim();
    const li = document.createElement('li');
    if(text === '') return;
    li.classList.add('todo-item');
    li.innerHTML = `<span class="todo-text">${text}</span>
   
        <button class="todo-remove" type="button">×</button>
    `
    todoList.appendChild(li);
    todoInput.value='';
}
todoAddBtn.addEventListener('click',addTodo);
todoInput.addEventListener('keydown',(e)=> {
    if (e.key === 'Enter') addTodo()
});


todoList.addEventListener('click', (e) => {

    if (e.target.classList.contains('todo-remove')) {
        e.target.closest('.todo-item').remove();
    }
    if (e.target.classList.contains('todo-text')) {
        e.target.classList.toggle('done');
    }
});

