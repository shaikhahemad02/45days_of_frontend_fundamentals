const btnToggle = document.querySelector(".mode-toggle");
btnToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if(document.body.classList.contains('light-mode')) {
        btnToggle.textContent = '🌤️'
    } else {
        btnToggle.textContent = '🌙'
    }
})