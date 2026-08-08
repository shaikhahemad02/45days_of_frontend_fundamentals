let randomImages = [];
let quotesArray = [];

const imagePromise = fetch("https://picsum.photos/v2/list?limit=20")
  .then(response => response.json())
  .then(data => {
    randomImages = data;
  });

const quotePromise = fetch("https://api.quotable.io/quotes/random?limit=20")
  .then(response => response.json())
  .then(data => {
    quotesArray = data;
  });

Promise.all([imagePromise, quotePromise]).then(displayRandomQuote);

const quoteCard = document.querySelector(".quote");
const background = document.querySelector('.background');

function displayRandomQuote() {
  if (!randomImages.length || !quotesArray.length) return;
  background.classList.add("fade-out");
  quoteCard.classList.add("fade-out");

  setTimeout(() => {
    const randonIndex = Math.floor(Math.random() * quotesArray.length);
    const randomQuote = quotesArray[randonIndex];
    const randomImage = randomImages[randonIndex];
    const imageUrl = randomImage.download_url || `https://picsum.photos/id/${randomImage.id}/800/600`;

    background.style.backgroundImage = `url(${imageUrl})`;
    background.style.backgroundSize = "cover";
    background.style.backgroundPosition = "center";

    quoteCard.innerHTML = `<span class="quoteicon">''</span><span class="quoteText">${randomQuote.content}</span>
        <span class="author">- ${randomQuote.author}</span>`;

    background.classList.remove("fade-out");
    quoteCard.classList.remove("fade-out");
  }, 200);
}

const newQuoteButton = document.querySelector(".btnQuote");
newQuoteButton.addEventListener("click", displayRandomQuote);

// quote auto change
setInterval(displayRandomQuote, 4000);