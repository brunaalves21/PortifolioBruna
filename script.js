/* ============================================
   MENU MOBILE
   ============================================ */
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__link');

function toggleMenu() {
  const isOpen = nav.classList.toggle('open');
  menuToggle.classList.toggle('active');
  menuToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  nav.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
    closeMenu();
  }
});
/* ============================================
   NAVBAR — Efeito glassmorphism ao scroll
   ============================================ */
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

/* ============================================
   NAVBAR — Link ativo conforme seção visível
   ============================================ */
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

/* ============================================
   SCROLL SUAVE
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();

    const target = document.querySelector(href);
    if (!target) return;

    const headerHeight = header.offsetHeight;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});
/* ============================================
   FORMULÁRIO DE CONTATO — Validação + Formspree
   ============================================ */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const messageInput = document.getElementById('form-message');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const successMessage = document.createElement('div');
  successMessage.className = 'form__success';
  successMessage.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
  contactForm.appendChild(successMessage);

  const submitBtn = contactForm.querySelector('.form__submit');

  function setError(input, errorEl) {
    input.classList.add('error');
    errorEl.classList.add('visible');
  }

  function clearError(input, errorEl) {
    input.classList.remove('error');
    errorEl.classList.remove('visible');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim()) clearError(nameInput, nameError);
  });

  emailInput.addEventListener('input', () => {
    if (validateEmail(emailInput.value.trim())) clearError(emailInput, emailError);
  });

  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim()) clearError(messageInput, messageError);
  });

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    let isValid = true;
    successMessage.classList.remove('visible');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
      setError(nameInput, nameError);
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    if (!email || !validateEmail(email)) {
      setError(emailInput, emailError);
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    if (!message) {
      setError(messageInput, messageError);
      isValid = false;
    } else {
      clearError(messageInput, messageError);
    }

    if (!isValid) return;

    // Desabilita o botão durante o envio
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        successMessage.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
        successMessage.classList.add('visible');
        contactForm.reset();
        setTimeout(() => {
          successMessage.classList.remove('visible');
        }, 5000);
      } else {
        successMessage.textContent = 'Erro ao enviar. Tente novamente mais tarde.';
        successMessage.classList.add('visible');
      }
    } catch (error) {
      successMessage.textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
      successMessage.classList.add('visible');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Enviar Mensagem
      `;
    }
  });
}

