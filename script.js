/* ============================================================
   PORTFOLIO — script.js
   Features: Cursor, Navbar, Typed Text, Scroll Reveal,
             Skill Bars, Stats Counter, Project Filter,
             Contact Form, Notes (localStorage), Theme Toggle
   ============================================================ */

/* ── DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initTyped();
  initScrollReveal();
  initSkillBars();
  initStatCounters();
  initProjectFilter();
  initProjectCards();
  initContactForm();
  initNotes();
  initTheme();
  initBackToTop();
});

/* ================================================
   1. CUSTOM CURSOR
   ================================================ */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  // Only run on devices that support hover (non-touch)
  if (!window.matchMedia('(hover: hover)').matches) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Follower has a soft lag
  (function animateFollower() {
    fx += (mx - fx) * 0.14;
    fy += (my - fy) * 0.14;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();

  // Grow cursor on interactive elements
  document.querySelectorAll('a, button, .project-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width  = '48px';
      follower.style.height = '48px';
      follower.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width  = '28px';
      follower.style.height = '28px';
      follower.style.opacity = '0.6';
    });
  });
}

/* ================================================
   2. NAVBAR — scroll + active + mobile menu
   ================================================ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks  = document.querySelectorAll('.nav-link');
  const mobLinks  = document.querySelectorAll('.mob-link');
  const sections  = document.querySelectorAll('.section');

  /* Scroll → add shadow */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  });

  /* Hamburger toggle */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  /* Close mobile menu on link click */
  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* Highlight active section */
  function updateActiveLink() {
    let currentSection = 'home';
    sections.forEach(sec => {
      const top    = sec.getBoundingClientRect().top;
      const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      if (top <= navH + 80) {
        currentSection = sec.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentSection);
    });
  }
}

/* ================================================
   3. TYPED TEXT EFFECT
   ================================================ */
function initTyped() {
  const el    = document.getElementById('typedText');
  const words = [
    'Full Stack Developer',
    'UI / UX Designer',
    'ML Enthusiast',
    'Open Source Contributor',
    'Coffee Addict ☕'
  ];
  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function type() {
    if (pause) return;
    const current = words[wordIdx];

    if (!deleting) {
      // Typing forward
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; type(); }, 1800);
        return;
      }
    } else {
      // Deleting
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
      }
    }

    setTimeout(type, deleting ? 45 : 85);
  }

  type();
}

/* ================================================
   4. SCROLL REVEAL (Intersection Observer)
   ================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling reveals
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.08}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ================================================
   5. SKILL BARS (animate on scroll)
   ================================================ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.style.width = target.dataset.width + '%';
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.4 }
  );

  fills.forEach(fill => observer.observe(fill));
}

/* ================================================
   6. STAT COUNTER ANIMATION
   ================================================ */
function initStatCounters() {
  const numbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        let current  = 0;
        const step   = Math.ceil(target / 40);

        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(interval);
        }, 40);

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  numbers.forEach(n => observer.observe(n));
}

/* ================================================
   7. PROJECT FILTER TABS
   ================================================ */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.classList.remove('hidden');
          // Re-trigger reveal if needed
          setTimeout(() => card.classList.add('visible'), 10);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ================================================
   8. PROJECT CARD CLICK (open URL)
   ================================================ */
function initProjectCards() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.url;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    });
    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/* ================================================
   9. CONTACT FORM (UI only)
   ================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const fname   = form.querySelector('#fname').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    // Basic validation
    if (!fname || !email || !message) {
      note.textContent = '⚠️ Please fill in all required fields.';
      note.style.color = '#ef4444';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = '⚠️ Please enter a valid email address.';
      note.style.color = '#ef4444';
      return;
    }

    // Simulate success (no backend)
    note.textContent = '✅ Message sent! I\'ll get back to you soon.';
    note.style.color = '#22c55e';
    form.reset();

    setTimeout(() => { note.textContent = ''; }, 5000);
  });
}

/* ================================================
   10. NOTES (localStorage)
   ================================================ */
function initNotes() {
  const input    = document.getElementById('noteInput');
  const addBtn   = document.getElementById('addNoteBtn');
  const grid     = document.getElementById('notesGrid');
  const empty    = document.getElementById('notesEmpty');

  /* Load from storage */
  let notes = JSON.parse(localStorage.getItem('portfolio-notes') || '[]');
  renderNotes();

  /* Add note on button click */
  addBtn.addEventListener('click', addNote);

  /* Add note on Enter key */
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') addNote();
  });

  function addNote() {
    const text = input.value.trim();
    if (!text) return;

    const note = {
      id:   Date.now(),
      text: text,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    notes.unshift(note); // newest first
    saveNotes();
    renderNotes();
    input.value = '';
  }

  function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    saveNotes();
    renderNotes();
  }

  function saveNotes() {
    localStorage.setItem('portfolio-notes', JSON.stringify(notes));
  }

  function renderNotes() {
    grid.innerHTML = '';

    if (notes.length === 0) {
      empty.style.display = 'flex';
      return;
    }
    empty.style.display = 'none';

    /* Note colors for variety */
    const colors = ['#fff9f0','#f0f7ff','#f0fff4','#fff0f6','#f5f0ff'];

    notes.forEach((note, i) => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.style.background = document.documentElement.dataset.theme === 'dark'
        ? 'var(--surface)' : colors[i % colors.length];

      card.innerHTML = `
        <p class="note-text">${escapeHTML(note.text)}</p>
        <span class="note-date">${note.date}</span>
        <button class="note-delete" aria-label="Delete note">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;

      card.querySelector('.note-delete').addEventListener('click', () => deleteNote(note.id));
      grid.appendChild(card);
    });
  }

  /* Prevent XSS */
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

/* ================================================
   11. THEME TOGGLE (dark / light)
   ================================================ */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  const icon      = document.getElementById('themeIcon');

  /* Load saved theme */
  const saved = localStorage.getItem('portfolio-theme') || 'light';
  applyTheme(saved);

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);

    if (theme === 'dark') {
      icon.className = 'fa-solid fa-moon';
    } else {
      icon.className = 'fa-solid fa-sun';
    }
  }
}

/* ================================================
   12. BACK TO TOP BUTTON
   ================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================================================
   BONUS: Subtle parallax on hero blobs
   ================================================ */
window.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');
  const blob3 = document.querySelector('.blob-3');

  if (blob1) blob1.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
  if (blob2) blob2.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
  if (blob3) blob3.style.transform = `translate(${x * 1.2}px, ${y * 1.2}px)`;
});
