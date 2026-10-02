(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // fireflies
  var scene = document.getElementById('scene');
  var positions = [
    [12, 18], [25, 8], [68, 12], [82, 22], [8, 45], [90, 50],
    [20, 70], [75, 65], [45, 30], [55, 80], [35, 55], [65, 38]
  ];
  positions.forEach(function (pos, i) {
    var f = document.createElement('div');
    f.className = 'firefly';
    f.style.left = pos[0] + '%';
    f.style.top = pos[1] + '%';
    f.style.animationDelay = (i * 1.1) + 's, ' + (i * 0.7) + 's';
    scene.appendChild(f);
  });

  // breathing word sync, matches the 8s breathe keyframe (in 4s / out 4s)
  var breatheText = document.getElementById('breatheText');
  var phrases = ['in...', 'hold...', 'out...', 'hold...'];
  var idx = 0;
  breatheText.textContent = phrases[0];
  setInterval(function () {
    idx = (idx + 1) % phrases.length;
    breatheText.textContent = phrases[idx];
  }, 2000);

  // step 1 -> step 2
  var screenIntro = document.getElementById('screen-intro');
  var screenReminder = document.getElementById('screen-reminder');
  document.getElementById('toReminderBtn').addEventListener('click', function () {
    screenIntro.hidden = true;
    screenReminder.hidden = false;
  });

  // step 2: reveal gentle reminder
  var reminderBtn = document.getElementById('reminderBtn');
  var reminderText = document.getElementById('reminderText');
  var cheerBtn = document.getElementById('cheerBtn');
  reminderBtn.addEventListener('click', function () {
    reminderText.hidden = false;
    cheerBtn.hidden = false;
    reminderBtn.hidden = true;
  });

  // ---------- cheer-up deck ----------
  var decks = [
    [
      "Studying and running a startup at the same time is genuinely hard, I know it. And I know you're doing it really well.",
      "I know you're stressed about the startup right now, but hey, just believe everything will be fine. I know you're capable of solving this on your own, and I believe in you too."
    ],
    [
      "Look at everything you've already pulled off while running on no sleep. That's not luck, that's you being capable.",
      "You don't need it all figured out today. Just keep showing up to both things, one step at a time."
    ],
    [
      "Most people never even start a company, let alone while still studying. You're already ahead just for trying.",
      "One bad exam or one bad week doesn't define you. It's one result, not a verdict."
    ],
    [
      "You've gotten through harder things than this. You'll get through this too.",
      "You figure things out. Not because it's easy, but because you don't quit. That's the skill that matters most."
    ]
  ];
  var deckIndex = 0;

  var modalBody = document.getElementById('modalBody');
  var modalDots = document.getElementById('modalDots');

  function renderDots() {
    modalDots.innerHTML = '';
    decks.forEach(function (_, i) {
      var dot = document.createElement('span');
      dot.className = 'dot' + (i === deckIndex ? ' dot-active' : '');
      modalDots.appendChild(dot);
    });
  }

  function renderDeck(i) {
    modalBody.classList.remove('deck-in');
    modalBody.innerHTML = decks[i].map(function (line) {
      return '<p>' + line + '</p>';
    }).join('');
    void modalBody.offsetWidth; // restart animation
    modalBody.classList.add('deck-in');
    renderDots();
  }

  // ---------- spark burst ----------
  function spawnSparks(container) {
    if (reduceMotion) return;
    var rect = container.getBoundingClientRect();
    for (var i = 0; i < 9; i++) {
      var spark = document.createElement('div');
      spark.className = 'spark';
      var left = rect.left + rect.width * (0.15 + Math.random() * 0.7);
      var bottom = window.innerHeight - rect.bottom + Math.random() * 16;
      spark.style.left = left + 'px';
      spark.style.bottom = bottom + 'px';
      spark.style.animationDelay = (Math.random() * 0.4) + 's';
      document.body.appendChild(spark);
      (function (el) {
        setTimeout(function () { el.remove(); }, 2200);
      })(spark);
    }
  }

  function spawnScreenSparks(count) {
    if (reduceMotion) return;
    for (var i = 0; i < count; i++) {
      var spark = document.createElement('div');
      spark.className = 'spark';
      spark.style.left = (5 + Math.random() * 90) + '%';
      spark.style.bottom = (Math.random() * 20) + 'px';
      spark.style.animationDelay = (Math.random() * 0.9) + 's';
      spark.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
      document.body.appendChild(spark);
      (function (el) {
        setTimeout(function () { el.remove(); }, 3200);
      })(spark);
    }
  }

  // ---------- modal open/close ----------
  var modalBackdrop = document.getElementById('modalBackdrop');
  var modalEl = document.querySelector('.modal');
  var modalClose = document.getElementById('modalClose');
  var againBtn = document.getElementById('againBtn');

  function openModal() {
    deckIndex = 0;
    renderDeck(deckIndex);
    modalBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    spawnSparks(modalEl);
  }
  function closeModal() {
    modalBackdrop.hidden = true;
    document.body.style.overflow = '';
  }

  cheerBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  againBtn.addEventListener('click', function () {
    deckIndex = (deckIndex + 1) % decks.length;
    renderDeck(deckIndex);
    spawnSparks(modalEl);
  });
  modalBackdrop.addEventListener('click', function (e) {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modalBackdrop.hidden) closeModal();
    if (e.key === 'Escape' && !finaleOverlay.hidden) closeFinale();
  });

  // ---------- finale: "you can do it" ----------
  var finaleOverlay = document.getElementById('finaleOverlay');
  var doItBtn = document.getElementById('doItBtn');
  var finaleBackBtn = document.getElementById('finaleBackBtn');
  var sparkWave = null;

  function openFinale() {
    closeModal();
    screenReminder.hidden = true;
    finaleOverlay.hidden = false;
    scene.classList.add('lit');
    spawnScreenSparks(16);
    var waves = 0;
    sparkWave = setInterval(function () {
      spawnScreenSparks(10);
      waves++;
      if (waves >= 4) {
        clearInterval(sparkWave);
        sparkWave = null;
      }
    }, 900);
  }

  function closeFinale() {
    finaleOverlay.hidden = true;
    screenReminder.hidden = false;
    scene.classList.remove('lit');
    if (sparkWave) {
      clearInterval(sparkWave);
      sparkWave = null;
    }
  }

  doItBtn.addEventListener('click', openFinale);
  finaleBackBtn.addEventListener('click', closeFinale);
})();
