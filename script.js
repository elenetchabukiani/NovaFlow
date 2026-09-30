/**
 * NovaFlow - Landing Page Script
 * Implements mobile menu, scroll spy, smooth navigation, dynamic footer year,
 * interactive hero shape telemetry, and contact form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-action .btn');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      // Prevent body scrolling when mobile menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          menuToggle.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // 3. Header Scrolled State
  const siteHeader = document.getElementById('site-header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 4. ScrollSpy: Highlight active navigation link based on current section
  const sections = document.querySelectorAll('section[id]');
  const mainNavLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        mainNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach((section) => sectionObserver.observe(section));

  // 5. Interactive Hero Shape - Dynamic Chart Bars Animation
  const chartBars = document.querySelectorAll('.chart-col');
  if (chartBars.length > 0) {
    // Periodically update active bar with subtle telemetry feel
    setInterval(() => {
      chartBars.forEach((bar) => {
        // Vary heights slightly between 35% and 95%
        const randomHeight = Math.floor(Math.random() * 55) + 40;
        bar.style.setProperty('--height', `${randomHeight}%`);
      });
    }, 3500);
  }

  // 6. Contact Form Validation and Submission Handling
  const contactForm = document.getElementById('contact-form');
  const feedbackBox = document.getElementById('form-feedback');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const submitBtn = document.getElementById('contact-submit-btn');

  // Helper validation functions
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const clearFieldError = (inputEl, errorEl) => {
    inputEl.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  };

  const setFieldError = (inputEl, errorEl, message) => {
    inputEl.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  };

  // Real-time input cleanup on typing
  [nameInput, emailInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      const errorMap = {
        'contact-name': nameError,
        'contact-email': emailError,
        'contact-message': messageError,
      };
      clearFieldError(input, errorMap[input.id]);
      if (feedbackBox) {
        feedbackBox.className = 'form-feedback';
        feedbackBox.textContent = '';
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;
      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const messageVal = messageInput.value.trim();

      // Validate Name
      if (!nameVal) {
        setFieldError(nameInput, nameError, 'Please enter your name.');
        hasError = true;
      } else if (nameVal.length < 2) {
        setFieldError(nameInput, nameError, 'Name must be at least 2 characters.');
        hasError = true;
      } else {
        clearFieldError(nameInput, nameError);
      }

      // Validate Email
      if (!emailVal) {
        setFieldError(emailInput, emailError, 'Please enter your email address.');
        hasError = true;
      } else if (!isValidEmail(emailVal)) {
        setFieldError(emailInput, emailError, 'Please enter a valid email address.');
        hasError = true;
      } else {
        clearFieldError(emailInput, emailError);
      }

      // Validate Message
      if (!messageVal) {
        setFieldError(messageInput, messageError, 'Please write a message.');
        hasError = true;
      } else if (messageVal.length < 10) {
        setFieldError(messageInput, messageError, 'Message must be at least 10 characters.');
        hasError = true;
      } else {
        clearFieldError(messageInput, messageError);
      }

      if (hasError) {
        if (feedbackBox) {
          feedbackBox.className = 'form-feedback error';
          feedbackBox.textContent = 'Please correct the highlighted fields above.';
        }
        return;
      }

      // Form is valid: simulate sending state
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Sending...</span>
        <svg class="btn-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
      `;

      // Simulating API response delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;

        // Reset form
        contactForm.reset();

        // Show friendly success confirmation
        if (feedbackBox) {
          feedbackBox.className = 'form-feedback success';
          feedbackBox.textContent = `Thank you, ${nameVal}! Your message has been received. We'll be in touch soon.`;
        }
      }, 900);
    });
  }
});

// Inline keyframe animation for button spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
