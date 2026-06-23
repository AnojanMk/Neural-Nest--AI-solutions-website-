/**
 * NeuralNest - Main JavaScript File
 * Author: NeuralNest Team
 * Version: 1.0
 */

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Initialize AOS (Animate on Scroll)
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: "ease-in-out",
  });

  // Loading Spinner
  const loader = document.querySelector(".loader-wrapper");
  window.addEventListener("load", function () {
    setTimeout(function () {
      loader.classList.add("fade-out");
    }, 500);
  });

  // Neural Network Canvas Animation
  const canvas = document.getElementById("neuralCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    const particleCount = 100;
    const connectionDistance = 150;

    function initCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      ctx.strokeStyle = "rgba(111, 66, 193, 0.1)";
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(111, 66, 193, ${opacity * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((particle) => {
        ctx.fillStyle = "#6f42c1";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = "#20c997";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
      });

      requestAnimationFrame(drawParticles);
    }

    initCanvas();
    drawParticles();

    window.addEventListener("resize", function () {
      initCanvas();
    });
  }

  // Navbar Scroll Effect
  const navbar = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active link highlighting
    let current = "";
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Smooth Scroll for Navigation Links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          navbarCollapse.classList.remove("show");
        }
      }
    });
  });

  // Counter Animation for Statistics
  const counters = document.querySelectorAll(".counter");
  const speed = 200;

  function animateCounters() {
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;
      const increment = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(animateCounters, 1);
      } else {
        counter.innerText = target;
      }
    });
  }

  // Trigger counter animation when stats section is in view
  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.5},
    );

    observer.observe(statsSection);
  }

  // Contact Form Validation and Submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form fields
      const name = this.querySelector('input[placeholder="Your Name"]');
      const email = this.querySelector('input[placeholder="Your Email"]');
      const message = this.querySelector("textarea");

      // Simple validation
      let isValid = true;

      if (!name.value.trim()) {
        showError(name, "Name is required");
        isValid = false;
      } else {
        removeError(name);
      }

      if (!email.value.trim()) {
        showError(email, "Email is required");
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showError(email, "Please enter a valid email");
        isValid = false;
      } else {
        removeError(email);
      }

      if (!message.value.trim()) {
        showError(message, "Message is required");
        isValid = false;
      } else {
        removeError(message);
      }

      if (isValid) {
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        setTimeout(() => {
          showNotification("Message sent successfully!", "success");
          contactForm.reset();
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }
    });
  }

  // Helper Functions for Form Validation
  function showError(field, message) {
    const parent = field.parentElement;
    const error = parent.querySelector(".error-message") || document.createElement("div");
    error.className = "error-message";
    error.style.color = "#dc3545";
    error.style.fontSize = "0.875rem";
    error.style.marginTop = "0.25rem";
    error.innerText = message;

    if (!parent.querySelector(".error-message")) {
      parent.appendChild(error);
    }

    field.style.borderColor = "#dc3545";
  }

  function removeError(field) {
    const parent = field.parentElement;
    const error = parent.querySelector(".error-message");
    if (error) {
      error.remove();
    }
    field.style.borderColor = "";
  }

  function isValidEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // Notification System
  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.style.position = "fixed";
    notification.style.top = "100px";
    notification.style.right = "20px";
    notification.style.padding = "1rem 2rem";
    notification.style.background = type === "success" ? "var(--secondary-color)" : "#dc3545";
    notification.style.color = "#fff";
    notification.style.borderRadius = "10px";
    notification.style.zIndex = "9999";
    notification.style.animation = "slideInRight 0.3s ease";
    notification.innerText = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Back to Top Button
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Typing Effect for Hero Subtitle (Optional)
  const heroSubtitle = document.querySelector(".hero-subtitle");
  if (heroSubtitle) {
    const text = heroSubtitle.innerText;
    heroSubtitle.innerText = "";

    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        heroSubtitle.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }

    // Start typing effect after page load
    setTimeout(typeWriter, 1000);
  }

  // Newsletter Form Submission
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]');

      if (email.value && isValidEmail(email.value)) {
        showNotification("Successfully subscribed to newsletter!", "success");
        email.value = "";
      } else {
        showNotification("Please enter a valid email address", "error");
      }
    });
  }

  // Parallax Effect on Scroll
  window.addEventListener("scroll", function () {
    const scrolled = window.scrollY;
    const heroSection = document.querySelector(".hero-section");

    if (heroSection) {
      heroSection.style.backgroundPositionY = scrolled * 0.5 + "px";
    }
  });

  // Hover Effects for Service Cards (Mobile Friendly)
  const serviceCards = document.querySelectorAll(".service-card");
  if (window.innerWidth <= 768) {
    serviceCards.forEach((card) => {
      card.addEventListener("click", function () {
        this.classList.toggle("hover");
      });
    });
  }

  // Preloader Animation
  const preloader = document.querySelector(".loader");
  if (preloader) {
    const dots = document.createElement("div");
    dots.className = "loading-dots";
    preloader.appendChild(dots);
  }

  // Add CSS animations for notifications
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // Initialize Bootstrap Tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize Bootstrap Popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Dynamic Year in Footer
  const yearElement = document.querySelector(".footer-bottom p");
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace("2024", currentYear);
  }

  // Lazy Loading Images
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  // Mobile Menu Close on Link Click
  const navLinksMobile = document.querySelectorAll(".navbar-nav .nav-link");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  navLinksMobile.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    });
  });

  // Add active class to current nav item on page load
  const currentLocation = window.location.hash;
  if (currentLocation) {
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === currentLocation) {
        link.classList.add("active");
      }
    });
  }

  // Prevent default anchor click behavior for empty links
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (e) => e.preventDefault());
  });
});

// Add smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#") {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});

// Handle window resize events
window.addEventListener("resize", function () {
  // Reinitialize any responsive features here
  if (window.innerWidth > 768) {
    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach((card) => {
      card.classList.remove("hover");
    });
  }
});

// Error handling for images
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", function () {
    this.src = "https://via.placeholder.com/400x300/6f42c1/ffffff?text=Image+Not+Found";
  });
});

// Performance optimization
if ("performance" in window) {
  window.addEventListener("load", function () {
    const timing = performance.getEntriesByType("navigation")[0];
    console.log("Page loaded in " + timing.loadEventEnd + "ms");
  });
}

// Service Worker Registration (for PWA features - optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.log("ServiceWorker registration failed: ", err);
    });
  });
}
