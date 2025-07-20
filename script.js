const container = document.getElementById("puzzle-container");
const message = document.getElementById("complete-message");
const gridSize = 3;
const totalPieces = gridSize * gridSize;

let positions = [...Array(totalPieces).keys()];
let pieces = [];

// Shuffle helper
function shuffle(array) {
  let currentIndex = array.length, temp, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex--);
    temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

function createParticles() {
  const particlesCount = 80;
  const particles = [];

  for(let i = 0; i < particlesCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // % ile ekranda rastgele konum
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = window.innerHeight + 'px'; // alt taraftan başlasın

    // Kalp veya konfeti emoji seç
    const emojis = ['❤️', '💖', '💘', '🎉', '✨', '🎊'];
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Animasyon gecikmesi ve süresi rastgele
    particle.style.animationDuration = (2 + Math.random() * 2) + 's';
    particle.style.animationDelay = (Math.random() * 1) + 's';

    document.body.appendChild(particle);
    particles.push(particle);

    // 3-5 saniye sonra partikülü kaldır
    setTimeout(() => {
      particle.remove();
    }, 4000);
  }
}

// Load puzzle
function loadPuzzle() {
  shuffle(positions);

  for (let i = 0; i < totalPieces; i++) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    const row = Math.floor(positions[i] / gridSize);
    const col = positions[i] % gridSize;

    piece.style.backgroundImage = "url('images/image1.jpg')";
    piece.style.backgroundPosition = `-${col * (400 / gridSize)}px -${row * (400 / gridSize)}px`;
    piece.style.backgroundSize = `400px 400px`;

    piece.setAttribute("data-index", positions[i]);

    piece.draggable = true;
    piece.addEventListener("dragstart", dragStart);
    piece.addEventListener("dragover", dragOver);
    piece.addEventListener("drop", drop);

    container.appendChild(piece);
    pieces.push(piece);
  }
}

// Drag and drop handlers
let dragged;

function dragStart(e) {
  dragged = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (dragged === e.target) return;

  const fromIndex = pieces.indexOf(dragged);
  const toIndex = pieces.indexOf(e.target);

  [pieces[fromIndex], pieces[toIndex]] = [pieces[toIndex], pieces[fromIndex]];

  container.innerHTML = "";
  pieces.forEach(p => container.appendChild(p));
  checkWin();
}

function checkWin() {
  const correct = pieces.every((piece, idx) => {
    return parseInt(piece.getAttribute("data-index")) === idx;
  });

  if (correct) {
    message.style.display = "block";
    createParticles();  // Kutlama efektini başlat
  }
}

loadPuzzle();