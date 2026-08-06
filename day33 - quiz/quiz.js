
// Seetings Dropdown
const settingsIcon = document.querySelector('.setting-btn');
const menuDropdown = document.querySelector('.menu');
settingsIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    menuDropdown.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!menuDropdown.contains(e.target)) {
        menuDropdown.classList.remove('show');
    }
})
// theme toggle
const btnToggle = document.querySelector(".mode-toggle");
btnToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        btnToggle.querySelector('img').src = '/images/day.png'
    } else {
        btnToggle.querySelector('img').src = '/images/night.png'
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
    if (!faqWrapper.classList.contains('hidden')) {
        faqWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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

// FAQ search...
const clearSearchBtn = document.querySelector('.clear-faq-search');
const searchInput = document.querySelector('.faq-search');
const faqItems = document.querySelectorAll('.accordion-item');
const noResultText = document.querySelector('.no-results');

function filterFaqs(query) {
    const searchQuery = query.toLowerCase().trim();
    clearSearchBtn.style.display = searchQuery === '' ? 'none' : 'block';

    let matchCount = 0;
    faqItems.forEach(item => {
        const questionText = item.querySelector('.accordion-header').textContent.toLowerCase().trim();
        const isMatch = questionText.includes(searchQuery);
        item.style.display = isMatch ? '' : 'none';
        if (isMatch) matchCount++;
    });

    noResultText.style.display = matchCount === 0 ? 'block' : 'none';
}

searchInput.addEventListener('input', (e) => {
    filterFaqs(e.target.value);
    noResultText.textContent = 'No results found for ' + searchInput.value;
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterFaqs('');
});

// Contact-us & char count
const textarea = document.querySelector('.char-textarea');
const charCountLable = document.querySelector('.char-count');
const maxLength = 280;
textarea.addEventListener('input', () => {
    const currentLength = textarea.value.length;
    charCountLable.textContent = `${currentLength}/${maxLength}`
    if (currentLength > maxLength - 20) {
        charCountLable.style.color = 'var(--accent-amber)'
    } else {
        charCountLable.style.color = ''
    }
});

// form validation

const nameInput = document.getElementById('contact-name');
const emailInput = document.getElementById('contact-email');
const messageInput = document.getElementById('contact-message');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactForm() {
    let isValid = true;

    if (nameInput.value.trim() === '') {
        showError(nameInput, "Name is required");
        isValid = false;
    } else {
        clearError(nameInput);
    }


    if (!emailPattern.test(emailInput.value.trim())) {
        showError(emailInput, "Enter a valid email address");
        isValid = false;
    } else {
        clearError(emailInput);
    }

    if (messageInput.value.trim() === '') {
        showError(messageInput, 'Message cannot be empty');
        isValid = false;
    } else {
        clearError(messageInput);
    }

    return isValid;
}
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateContactForm()) {
        return;
    }
    alert('Thank you! for your message. We will get back to you at the earliest.');
    contactForm.submit();
});
// alternative show Errors as user provides input
nameInput.addEventListener('change', (e) => {
    if (e.target.value.trim() === '') {
        showError(e.target, "Name is required");

    } else {
        clearError(e.target);
    }
});
emailInput.addEventListener('change', (e) => {
    if (!emailPattern.test(e.target.value.trim()) || e.target.value.trim() === '') {
        showError(e.target, "Enter a valid email address");

    } else {
        clearError(e.target);
    }
});
messageInput.addEventListener('change', (e) => {
    if (e.target.value.trim() === '') {
        showError(e.target, 'Message cannot be empty');
    } else {
        clearError(e.target);
    }
});
function showError(inputEl, message) {
    inputEl.classList.add('input-error');
    const errorEl = inputEl.parentElement.querySelector('.field-error');
    errorEl.textContent = message;
    errorEl.style.display = 'block'
}
function clearError(inputEl) {
    inputEl.classList.remove('input-error');
    const errorEl = inputEl.parentElement.querySelector('.field-error');
    errorEl.textContent = '';
    errorEl.style.display = 'none'
}
// Live Demo To do List
let todos = [];
const saved = localStorage.getItem('todos');
todos = saved ? JSON.parse(saved) : [];
let currentFilter = 'all';
let todoList = document.querySelector('.todo-list');
const todoInput = document.querySelector('.todo-input');

const filterBtn = document.querySelectorAll('.filter-btn');
filterBtn.forEach(b => {
    b.addEventListener('click', () => {
        filterBtn.forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        currentFilter = b.dataset.filter;
        renderTodos();
    });
});

renderTodos();
function renderTodos() {
    todoList.innerHTML = '';
    const filtered = todos.filter(t => {
        if (currentFilter === 'active') return !t.done;
        if (currentFilter === 'completed') return t.done;
        return true;
    });

    filtered.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = todo.id;
        li.innerHTML = `<span class="todo-text ${todo.done ? 'done' : ''}">${todo.text}</span>
            <button class="todo-remove" type="button">×</button>`;
        todoList.appendChild(li);
    });
}
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo(input) {
    const inputText = input
    if (inputText === '') return;
    todos.push({ done: false, text: inputText, id: Date.now() });
    saveTodos();
    renderTodos();
}

function removeTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    todo.done = !todo.done;
    saveTodos();
    renderTodos();
}

const todoAddBtn = document.querySelector('.todo-add-btn');

todoAddBtn.addEventListener('click', () => {
    input = document.querySelector('.todo-input');
    addTodo(input.value.trim());
    input.value = '';
});
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        let input = document.querySelector('.todo-input');
        addTodo(input.value.trim());
        input.value = '';
        saveTodos();
        renderTodos();
    }
});


todoList.addEventListener('click', (e) => {
    const li = e.target.closest('.todo-item');
    if (!li) return;
    const id = Number(li.dataset.id);
    if (e.target.classList.contains('todo-remove')) {
        removeTodo(id);
        saveTodos();
        renderTodos();
    }

    if (e.target.classList.contains('todo-text')) {
        e.target.classList.toggle('done');
        toggleTodo(id);
        saveTodos();
        renderTodos();
    }
});

/* ----- Image Slider ------- */
const slideImages = document.querySelectorAll('.slide');
const btnPrev = document.querySelector('.prev');
const btnNext = document.querySelector('.next');
const sliderDots = document.querySelector('.slider-dots');
let currentSlideIndex = 0;

function showSlideToggle(index) {
    slideImages.forEach((s, i) => s.classList.toggle('active', i === index));
    imageDots.forEach((d, i) => d.classList.toggle('active', i === index));
    /*
    slideImages.forEach((s, i)=> {
     if( i === index) {
         s.classList.add('active');
     } else {
         s.classList.remove('active'); }
    })*/
}
btnNext.addEventListener('click', () => {
    currentSlideIndex = (currentSlideIndex + 1) % slideImages.length;
    showSlideToggle(currentSlideIndex);
});
btnPrev.addEventListener('click', () => {
    currentSlideIndex = (currentSlideIndex - 1 + slideImages.length) % slideImages.length;
    showSlideToggle(currentSlideIndex);
});

// image change based on dot click.
const imageDots = sliderDots.childNodes;
imageDots.forEach((d, i) => {
    d.addEventListener('click', () => {
        currentSlideIndex = i;
        showSlideToggle(currentSlideIndex);
    })
});
// continuous image change based on time
setInterval(() => {
    currentSlideIndex = (currentSlideIndex + 1) % slideImages.length;
    showSlideToggle(currentSlideIndex);
}, 1500);

// Estimator 
const baseInputs = document.querySelectorAll('input[name="base"]');
const estimateTotal = document.querySelector('.estimator-amount');
const addOnInputs = document.querySelectorAll('.addon');
const estimatRequestor = document.querySelector('.estimator-request-btn');

function estimateCalculate() {
    const baseInputValue = document.querySelector('input[name="base"]:checked').value;
    let total = parseFloat(baseInputValue);
    addOnInputs.forEach(addOn => {
        if (addOn.checked) {
            total += parseFloat(addOn.value);
        }
    })
    estimateTotal.textContent = `$${total.toLocaleString()}`;

}
baseInputs.forEach(i => { i.addEventListener('change', estimateCalculate) });
addOnInputs.forEach(i => { i.addEventListener('change', estimateCalculate) });
estimatRequestor.addEventListener('click', () => {
    const selectedPlan = document.querySelector('input[name="base"]:checked');
    planName.textContent = selectedPlan.dataset.label;
    openModalOverlay();
})

// Request quote - Modal popup
const modalOverlay = document.getElementById('plan-modal');
const pricingBtn = document.querySelectorAll('.pricing-btn');
const planName = document.querySelector('.modal-plan-name');
const btnCloseModal = document.querySelector('.close-modal');

// close pop if clicked outside of form
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        hideModalOverlay();
    }
})

// close popup on escape key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideModalOverlay();
    }
})
btnCloseModal.addEventListener('click', () => {
    hideModalOverlay();
})
pricingBtn.forEach((b) => {
    b.addEventListener('click', () => {
        planName.textContent = b.closest('.pricing-card').querySelector('h3').textContent;
        openModalOverlay();
    })
});
function openModalOverlay() {
    modalOverlay.classList.add('open');
}
function hideModalOverlay() {
    modalOverlay.classList.remove('open');
}
// Quiz
const questionArray = [

    {
        question: "How do you track tasks and deadlines?",
        options: ["Manually (notes, Excel)", "Basic task tools (Trello, Asana)", "Automated workflow system"],
        points: [0, 1, 2]
    },
    {
        question: "How do you handle client communication?",
        options: ["Email only", "Mix of email + chat apps", "Centralized client portal"],
        points: [0, 1, 2]
    },
    {
        question: "How do you store and share project files?",
        options: ["Local drives", "Cloud storage (Google Drive, Dropbox)", "Integrated project system"],
        points: [0, 1, 2]
    },
    {
        question: "How do you monitor project progress?",
        options: ["Manual updates", "Basic dashboards", "Real-time reporting tools"],
        points: [0, 1, 2]
    },
    {
        question: "How often do manual tasks slow your team down?",
        options: ["Constantly", "Sometimes", "Rarely"],
        points: [0, 1, 2]
    }
]

let quizQuestionEl = document.querySelector('.quiz-question');
let quizOptionsEl = document.querySelector('.quiz-options');
let currentQindex = 0;
let userAnswers = [];

function renderQuestions() {
    const quizProgressLabel = document.querySelector('.quiz-progress');
    quizProgressLabel.textContent = `Question ${currentQindex + 1} of ${questionArray.length}`;

    quizQuestionEl.textContent = questionArray[currentQindex].question;

    const q = questionArray[currentQindex];

    q.options.forEach((op, i) => {

        const quizOptionsEl = document.querySelector('.quiz-options');
        const quizOptionsLabel = document.createElement('label');
        quizOptionsLabel.className = 'option-name';

        quizOptionsLabel.innerHTML = `<input type="radio" name="ans-quiz" value="${i}"> ${op} `;

        quizOptionsEl.appendChild(quizOptionsLabel);


    })

}


renderQuestions();
const qPrevBtn = document.querySelector('.quiz-prev-btn');
const qNextBtn = document.querySelector('.quiz-next-btn');

qPrevBtn.addEventListener('click', () => {
    if (currentQindex > 0) {
        document.querySelector('.quiz-options').innerHTML = '';
        currentQindex--;
        renderQuestions();
    }
});

qNextBtn.addEventListener('click', () => {
    if (currentQindex === (questionArray.length - 1)) {
        showQuizResults();
    } else {
        const selected = document.querySelector('input[name="ans-quiz"]:checked');
        console.log(!selected)
        if (!selected) { alert("Please provide an answer"); return; }

        const ansIndex = parseFloat(selected.value);
        userAnswers[currentQindex] = ansIndex;
        document.querySelector('.quiz-options').innerHTML = '';
        currentQindex++;
        renderQuestions();
    }
});
function showQuizResults() {
    document.querySelector('.quiz-results').style.display = 'flex';
    const totalScore = userAnswers.reduce((sum, ansIndex, i) => {
        return sum + questionArray[i].points[ansIndex];
    
    });
    const scoreLabel = document.querySelector('.quiz-score');
    scoreLabel.textContent = `${totalScore} / ${questionArray.length * 2}`;
    resultMessage = document.querySelector('.quiz-result-message');
    resultMessage.textContent = 'Your answers give us a snapshot of your current workflow. We’ll now prepare a personalized roadmap showing how Air Dev can simplify and optimize your process.';
}
const btnzRetakeQuiz = document.querySelector('.quiz-retake-btn');
btnzRetakeQuiz.addEventListener('click', ()=> {
    document.querySelector('.quiz-results').style.display = 'none';
    currentQindex = 0;
    renderQuestions();

})