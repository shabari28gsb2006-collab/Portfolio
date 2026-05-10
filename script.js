// ===== LOADER =====

/**
 * hideLoader - Hides the full-screen loading overlay.
 *
 * Adds the `.hidden` class to #loader, which triggers a CSS opacity transition
 * (opacity: 0, pointer-events: none). Once the transition ends, sets
 * display: none so the loader is fully removed from the layout.
 */
function hideLoader() {
  if (typeof document === 'undefined') return; // Guard: no DOM in Node/test environments
  const loader = document.getElementById('loader');
  if (!loader) return; // Guard: do nothing if loader element is missing

  // Add .hidden to trigger the CSS fade-out transition
  loader.classList.add('hidden');

  // After the CSS transition completes, remove the loader from layout entirely
  loader.addEventListener('transitionend', function onTransitionEnd() {
    loader.style.display = 'none';
    // Remove listener so it only fires once
    loader.removeEventListener('transitionend', onTransitionEnd);
  });
}

// Fallback: hide loader after 5 seconds in case the load event is slow or never fires
if (typeof setTimeout !== 'undefined') setTimeout(hideLoader, 5000);

// Primary trigger: hide loader once all page resources have finished loading
if (typeof window !== 'undefined') window.addEventListener('load', hideLoader);

// ===== END LOADER =====

// Export for CommonJS (Jest) compatibility — extended below after all functions are defined
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { hideLoader };
}

// ===== NAVBAR =====

/**
 * handleNavbarScroll - Adds or removes the `.scrolled` class on the navbar
 * based on how far the user has scrolled down the page.
 *
 * When scrollY > 50px, `.scrolled` is added to trigger a CSS shadow/background
 * effect that visually separates the navbar from the page content.
 */
function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return; // Guard: do nothing if navbar element is missing

  // Add .scrolled when past 50px, remove it when back at the top
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Attach scroll listener to update navbar appearance as the user scrolls
if (typeof window !== 'undefined') window.addEventListener('scroll', handleNavbarScroll);

// ===== END NAVBAR =====

// ===== HAMBURGER TOGGLE =====

/**
 * initHamburgerToggle - Wires up the hamburger button to show/hide the nav links.
 *
 * Clicking the hamburger button toggles the `.nav-open` class on the `<ul>`
 * element (#nav-links). The CSS uses a `max-height` transition on `.nav-open`
 * to smoothly expand or collapse the mobile menu.
 */
function initHamburgerToggle() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return; // Guard: do nothing if elements are missing

  hamburger.addEventListener('click', function () {
    // Toggle .nav-open to expand/collapse the nav list on mobile
    navLinks.classList.toggle('nav-open');
  });
}

// Initialise the hamburger toggle once the DOM is ready
if (typeof document !== 'undefined') initHamburgerToggle();

// ===== END HAMBURGER TOGGLE =====

// Update module.exports to include new functions (validateForm and hideLoader are the primary exports)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Object.assign(module.exports, { handleNavbarScroll, initHamburgerToggle });
}

// ===== SMOOTH SCROLLING =====

/**
 * initSmoothScroll - Adds smooth scrolling behaviour to all anchor links
 * that point to an in-page section (i.e. href starts with "#").
 *
 * For each matching anchor:
 *  1. Prevents the browser's default instant-jump behaviour.
 *  2. Resolves the target element from the href value.
 *  3. Calls scrollIntoView({ behavior: 'smooth' }) so the page glides to
 *     the target section instead of snapping.
 *  4. Closes the mobile menu (if open) so the nav collapses after a link tap.
 */
function initSmoothScroll() {
  // Select every anchor whose href begins with "#" (nav links + CTA button)
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      // Stop the browser from jumping instantly to the anchor target
      event.preventDefault();

      // Derive the target selector from the href attribute (e.g. "#projects")
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      // Only scroll if the target section actually exists in the DOM
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }

      // Close the mobile nav menu if it is currently open
      const navLinks = document.getElementById('nav-links');
      if (navLinks) {
        // Removing .nav-open collapses the menu via the CSS max-height transition
        navLinks.classList.remove('nav-open');
      }
    });
  });
}

// Initialise smooth scrolling once the DOM is ready
if (typeof document !== 'undefined') initSmoothScroll();

// ===== END SMOOTH SCROLLING =====

// Update module.exports to expose initSmoothScroll for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Object.assign(module.exports, { initSmoothScroll });
}

// ===== SKILLS PROGRESS BAR ANIMATION =====

/**
 * animateProgressBars - Sets each .progress-bar's width to its data-target value.
 *
 * Iterates all .progress-bar elements in the document and sets their inline
 * style.width to the value stored in data-target (as a percentage). The CSS
 * `transition: width 1s ease` on .progress-bar handles the smooth animation.
 *
 * Exported so tests can call it directly without needing IntersectionObserver.
 */
function animateProgressBars() {
  // Select every progress bar element on the page
  const bars = document.querySelectorAll('.progress-bar');

  bars.forEach(function (el) {
    // Read the target percentage from the data-target attribute and apply it
    el.style.width = el.dataset.target + '%';
  });
}

/**
 * initSkillsObserver - Creates an IntersectionObserver that watches the
 * #skills section and triggers the progress bar animation once when the
 * section enters the viewport.
 *
 * The observer is disconnected immediately after the first trigger so the
 * animation only plays once (not every time the user scrolls back to Skills).
 */
function initSkillsObserver() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return; // Guard: do nothing if the section is missing

  // Create an observer that fires when #skills becomes visible in the viewport
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Section has entered the viewport — animate all progress bars
        animateProgressBars();

        // Disconnect so the animation only triggers once
        observer.disconnect();
      }
    });
  });

  // Start observing the #skills section
  observer.observe(skillsSection);
}

// Initialise the skills observer once the DOM is ready
if (typeof document !== 'undefined') initSkillsObserver();

// ===== END SKILLS PROGRESS BAR ANIMATION =====

// Update module.exports to expose animateProgressBars and initSkillsObserver for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Object.assign(module.exports, { animateProgressBars, initSkillsObserver });
}

// ===== CONTACT FORM — EMAILJS =====
// ⚠️  Replace SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY with your actual EmailJS values.
// Setup steps:
//   1. Sign up at https://www.emailjs.com
//   2. Add Email Service → connect Gmail (shabari28gsb2006@gmail.com)
//   3. Create Email Template with variables: {{from_name}}, {{from_email}}, {{message}}
//   4. Copy your Service ID, Template ID, and Public Key and paste below

function initContactForm() {
  var form       = document.getElementById('contact-form');
  var submitBtn  = document.getElementById('submit-btn');
  var btnText    = document.getElementById('btn-text');
  var btnLoading = document.getElementById('btn-loading');
  var success    = document.getElementById('form-success');
  var generalErr = document.getElementById('form-error-general');
  var nameInput  = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var msgInput   = document.getElementById('message');
  var nameErr    = document.getElementById('name-error');
  var emailErr   = document.getElementById('email-error');
  var msgErr     = document.getElementById('message-error');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear all previous errors
    [nameInput, emailInput, msgInput].forEach(function (el) { el.classList.remove('error'); });
    nameErr.textContent = '';
    emailErr.textContent = '';
    msgErr.textContent = '';
    if (success) success.style.display = 'none';
    if (generalErr) generalErr.textContent = '';

    var name    = nameInput.value.trim();
    var email   = emailInput.value.trim();
    var message = msgInput.value.trim();
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var valid   = true;

    // Validate fields
    if (!name)               { nameErr.textContent  = 'Name is required.';         nameInput.classList.add('error');  valid = false; }
    if (!emailRe.test(email)){ emailErr.textContent = 'Valid email is required.';  emailInput.classList.add('error'); valid = false; }
    if (!message)            { msgErr.textContent   = 'Message is required.';      msgInput.classList.add('error');   valid = false; }
    if (!valid) return;

    // Show loading state
    if (btnText)    btnText.style.display    = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';
    if (submitBtn)  submitBtn.disabled       = true;

    // Send via EmailJS
    // ⚠️  Replace the strings below with your actual IDs
    emailjs.send(
      'service_4qwqau6',
      'template_sg488ci',
      {
        from_name:  name,
        from_email: email,
        message:    message
      }
    ).then(function () {
      // Success
      if (success) {
        success.style.display = 'block';
        success.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
      }
      form.reset();
    }).catch(function (err) {
      // Failure — show specific reason if available
      console.error('EmailJS error:', err);
      var reason = (err && err.text) ? err.text : 'Unknown error';
      if (generalErr) generalErr.textContent = '❌ Failed to send: ' + reason + '. Please try again.';
    }).finally(function () {
      // Restore button state
      if (btnText)    btnText.style.display    = 'inline';
      if (btnLoading) btnLoading.style.display = 'none';
      if (submitBtn)  submitBtn.disabled       = false;
    });
  });
}

if (typeof document !== 'undefined') initContactForm();

// ===== END CONTACT FORM =====

/**
 * initProfileUpload - Clicking the pen icon button opens a file picker.
 * The selected image is saved to localStorage so it persists across page refreshes.
 */
function initProfileUpload() {
  const editBtn = document.getElementById('profile-edit-btn');
  const input = document.getElementById('profile-upload');
  const img = document.getElementById('profile-img');
  if (!editBtn || !input || !img) return;

  // Restore saved profile image from localStorage on page load
  const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    img.src = savedImage;
  }

  // Clicking the pen button opens the file picker
  editBtn.addEventListener('click', function () {
    input.click();
  });

  // When a file is selected, display it and save to localStorage
  input.addEventListener('change', function () {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
      try {
        localStorage.setItem('profileImage', e.target.result);
      } catch (err) {
        console.warn('Could not save profile image to localStorage:', err);
      }
    };
    reader.readAsDataURL(file);
  });
}

initProfileUpload();

// ===== END PROFILE IMAGE UPLOAD =====

// ===== ADD SKILL =====

/**
 * initAddSkill - Wires up the "+ Add Skill" button to show an inline form.
 * On confirm, a new skill item with a progress bar is appended to the skills grid.
 */
function initAddSkill() {
  const addBtn     = document.getElementById('add-skill-btn');
  const form       = document.getElementById('add-skill-form');
  const confirmBtn = document.getElementById('skill-confirm-btn');
  const cancelBtn  = document.getElementById('skill-cancel-btn');
  const nameInput  = document.getElementById('skill-name-input');
  const grid       = document.querySelector('.skills-grid');
  if (!addBtn || !form || !grid) return;

  // Remove skill via event delegation — works for existing and new tags
  grid.addEventListener('click', function (e) {
    if (e.target.classList.contains('skill-remove')) {
      e.target.closest('.skill-tag').remove();
    }
  });

  addBtn.addEventListener('click', function () {
    form.style.display = 'flex';
    nameInput.focus();
  });

  cancelBtn.addEventListener('click', function () {
    form.style.display = 'none';
    nameInput.value = '';
  });

  confirmBtn.addEventListener('click', function () {
    const name = nameInput.value.trim();
    if (!name) { nameInput.focus(); return; }

    const iconMap = {
      'html': 'devicon-html5-plain colored',
      'css': 'devicon-css3-plain colored',
      'javascript': 'devicon-javascript-plain colored',
      'js': 'devicon-javascript-plain colored',
      'python': 'devicon-python-plain colored',
      'git': 'devicon-git-plain colored',
      'github': 'devicon-github-original',
      'react': 'devicon-react-original colored',
      'nodejs': 'devicon-nodejs-plain colored',
      'node': 'devicon-nodejs-plain colored',
      'typescript': 'devicon-typescript-plain colored',
      'ts': 'devicon-typescript-plain colored',
      'vue': 'devicon-vuejs-plain colored',
      'angular': 'devicon-angularjs-plain colored',
      'sass': 'devicon-sass-original colored',
      'mysql': 'devicon-mysql-plain colored',
      'mongodb': 'devicon-mongodb-plain colored',
      'java': 'devicon-java-plain colored',
      'c': 'devicon-c-plain colored',
      'cpp': 'devicon-cplusplus-plain colored',
      'c++': 'devicon-cplusplus-plain colored',
      'php': 'devicon-php-plain colored',
      'docker': 'devicon-docker-plain colored',
      'figma': 'devicon-figma-plain colored',
    };

    const key = name.toLowerCase().replace(/\s+/g, '');
    const iconClass = iconMap[key] || null;
    const iconHTML = iconClass ? '<i class="' + iconClass + '"></i>' : '<i class="devicon-devicon-plain"></i>';

    // Add as a skill card to the grid
    const grid = document.getElementById('skills-card-grid');
    if (grid) {
      const card = document.createElement('div');
      card.className = 'skill-card fade-in visible';
      card.innerHTML =
        '<div class="skill-card-icon">' + iconHTML + '</div>' +
        '<h3>' + name + '</h3>' +
        '<p>Added skill.</p>';
      grid.appendChild(card);
    }

    nameInput.value = '';
    form.style.display = 'none';
  });
}

initAddSkill();

// ===== END ADD SKILL =====

// ===== PARTICLE NETWORK BACKGROUND =====

/**
 * initParticles - Draws an animated network of dots and connecting lines
 * on the hero section canvas, matching the design reference.
 */
function initParticles() {
  var canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var particles = [];
  var count = 80;
  var maxDist = 140;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create particles with random positions and velocities
  for (var i = 0; i < count; i++) {
    particles.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r:  Math.random() * 2 + 1.5,
      // Random colour: white, indigo, or orange dots
      color: ['#ffffff','#6c63ff','#f5a623','#a09af8'][Math.floor(Math.random()*4)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connecting lines between nearby particles
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(160,154,248,' + (1 - dist/maxDist) * 0.4 + ')';
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw and move each particle
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

if (typeof document !== 'undefined') initParticles();

// ===== END PARTICLE NETWORK BACKGROUND =====

// ===== TYPED ANIMATION =====

/**
 * initTyped - Cycles through role titles with a typewriter effect
 * on the hero section's #typed-text element.
 */
function initTyped() {
  var el = document.getElementById('typed-text');
  if (!el) return;

  var roles = ['Web Developer', 'AI & DS Student', 'Frontend Developer', 'Tech Enthusiast'];
  var roleIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function type() {
    var current = roles[roleIndex];
    if (deleting) {
      el.textContent = current.substring(0, charIndex--);
    } else {
      el.textContent = current.substring(0, charIndex++);
    }

    var speed = deleting ? 60 : 100;

    if (!deleting && charIndex === current.length + 1) {
      speed = 1800; // pause at end
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

if (typeof document !== 'undefined') initTyped();

// ===== END TYPED ANIMATION =====

// ===== FADE-IN ON SCROLL =====

/**
 * initFadeIn - Adds .visible class to .fade-in elements when they enter viewport.
 */
function initFadeIn() {
  var els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(function (el) { observer.observe(el); });
}

if (typeof document !== 'undefined') initFadeIn();

// ===== END FADE-IN ON SCROLL =====

// ===== SKILLS BACKGROUND PARTICLES =====

/**
 * initSkillsParticles - Draws floating glowing dots on the skills section
 * canvas, matching the reference design's starfield background effect.
 */
function initSkillsParticles() {
  var canvas = document.getElementById('skills-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dots = [];
  var count = 60;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create dots with random positions, sizes, speeds and opacities
  for (var i = 0; i < count; i++) {
    dots.push({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 2 + 0.5,
      vx:      (Math.random() - 0.5) * 0.3,
      vy:      (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      // Twinkle: each dot fades in/out at its own speed
      twinkleSpeed: Math.random() * 0.01 + 0.005,
      twinkleDir:   Math.random() > 0.5 ? 1 : -1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(function (d) {
      // Twinkle effect
      d.opacity += d.twinkleSpeed * d.twinkleDir;
      if (d.opacity >= 0.85 || d.opacity <= 0.1) d.twinkleDir *= -1;

      // Draw glowing dot
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(160, 154, 248, ' + d.opacity + ')';
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(108, 99, 255, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Move
      d.x += d.vx;
      d.y += d.vy;

      // Wrap around edges
      if (d.x < 0) d.x = canvas.width;
      if (d.x > canvas.width) d.x = 0;
      if (d.y < 0) d.y = canvas.height;
      if (d.y > canvas.height) d.y = 0;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

if (typeof document !== 'undefined') initSkillsParticles();

// ===== END SKILLS BACKGROUND PARTICLES =====

// ===== UPCOMING PROJECTS BACKGROUND =====

function initUpcomingParticles() {
  var canvas = document.getElementById('upcoming-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var stars = [];
  var count = 120;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.008 + 0.003,
      dir: Math.random() > 0.5 ? 1 : -1,
      color: ['#a09af8','#f5a623','#00d4ff','#ffffff'][Math.floor(Math.random()*4)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function(s) {
      s.opacity += s.speed * s.dir;
      if (s.opacity > 0.85 || s.opacity < 0.05) s.dir *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color.replace(')', ',' + s.opacity + ')').replace('rgb', 'rgba');

      // Use hex colors with opacity via globalAlpha
      ctx.globalAlpha = s.opacity;
      ctx.fillStyle = s.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = s.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

if (typeof document !== 'undefined') initUpcomingParticles();

// ===== END UPCOMING PROJECTS BACKGROUND =====

// ===== CARD TILT EFFECT =====

function initCardTilt() {
  var cards = document.querySelectorAll('.ucard');
  cards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rotX = ((y - cy) / cy) * -8;
      var rotY = ((x - cx) / cx) * 8;
      card.style.transform = 'translateY(-10px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });
}

if (typeof document !== 'undefined') initCardTilt();

// ===== END CARD TILT EFFECT =====

// ===== PROJECTS BACKGROUND PARTICLES =====

function initProjectsParticles() {
  var canvas = document.getElementById('projects-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var stars = [];
  var count = 100;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.01 + 0.004,
      dir: Math.random() > 0.5 ? 1 : -1,
      color: ['#a09af8','#00d4ff','#ffffff','#6c63ff'][Math.floor(Math.random()*4)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function(s) {
      s.opacity += s.speed * s.dir;
      if (s.opacity > 0.8 || s.opacity < 0.05) s.dir *= -1;
      ctx.globalAlpha = s.opacity;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = s.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

if (typeof document !== 'undefined') initProjectsParticles();

// ===== END PROJECTS BACKGROUND PARTICLES =====

// ===== PROJECT CARD TILT =====

function initProjectCardTilt() {
  var cards = document.querySelectorAll('.pcard');
  cards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var rotX = ((y - rect.height/2) / rect.height) * -8;
      var rotY = ((x - rect.width/2)  / rect.width)  *  8;
      card.style.transform = 'translateY(-10px) rotateX('+rotX+'deg) rotateY('+rotY+'deg) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });
}

if (typeof document !== 'undefined') initProjectCardTilt();

// ===== END PROJECT CARD TILT =====

// ===== CONTACT BACKGROUND PARTICLES =====

function initContactParticles() {
  var canvas = document.getElementById('contact-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var stars = [];
  var count = 80;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.008 + 0.003,
      dir: Math.random() > 0.5 ? 1 : -1,
      color: ['#a09af8','#00d4ff','#ffffff'][Math.floor(Math.random()*3)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function(s) {
      s.opacity += s.speed * s.dir;
      if (s.opacity > 0.7 || s.opacity < 0.05) s.dir *= -1;
      ctx.globalAlpha = s.opacity;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = s.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

if (typeof document !== 'undefined') initContactParticles();

// ===== END CONTACT BACKGROUND PARTICLES =====
