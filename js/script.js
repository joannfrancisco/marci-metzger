// ========================================
// MOBILE MENU TOGGLE
// ========================================
const mobileToggle = document.querySelector(".mobile-menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-nav-links a");

// Open/Close mobile menu with hamburger toggle
if (mobileToggle) {
  mobileToggle.addEventListener("click", () => {
    mobileToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "";
  });
}

// Close menu when clicking a link
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileToggle.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    mobileMenu.classList.contains("active") &&
    !mobileMenu.contains(e.target) &&
    !mobileToggle.contains(e.target)
  ) {
    mobileToggle.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================
const header = document.querySelector("header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// ========================================
// SCROLL INDICATOR
// ========================================
const scrollIndicator = document.querySelector(".scroll-indicator");

if (scrollIndicator) {
  scrollIndicator.addEventListener("click", () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  });
}

// ========================================
// ACTIVE NAVIGATION LINK ON SCROLL
// ========================================
const sections = document.querySelectorAll("section[id]");
const navLinksArray = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinksArray.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

// ========================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ========================================
// SEARCH FORM HANDLER
// ========================================
const searchForm = document.querySelector(".search-form");
if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      location: document.getElementById("location").value,
      type: document.getElementById("type").value,
      sortBy: document.getElementById("sortBy").value,
      bedrooms: document.getElementById("bedrooms").value,
      baths: document.getElementById("baths").value,
      minPrice: document.getElementById("minPrice").value,
      maxPrice: document.getElementById("maxPrice").value,
    };

    console.log("Search Parameters:", formData);

    // Display search parameters
    alert(
      `Searching for properties...\n\n` +
        `Location: ${formData.location || "Any"}\n` +
        `Type: ${formData.type || "All"}\n` +
        `Bedrooms: ${formData.bedrooms || "Any"}\n` +
        `Baths: ${formData.baths || "Any"}\n` +
        `Price Range: $${formData.minPrice || "0"} - $${
          formData.maxPrice || "Any"
        }`
    );

    // In production, send to backend API:
    // fetch('/api/search', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })
  });
}

// ========================================
// CONTACT FORM HANDLER
// ========================================
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Validation
    if (!name || !email || !message) {
      showAlert("Please fill in all fields.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Please enter a valid email address.", "error");
      return;
    }

    console.log("Contact Form Submission:", { name, email, message });

    // Show success message
    showAlert(
      `Thank you ${name}! Your message has been sent.\n\nWe will contact you at ${email} soon.`,
      "success"
    );

    // Reset form
    this.reset();

    // In production, send to backend:
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, message })
    // })
  });
}

// ========================================
// GALLERY CAROUSEL WITH VIEWPORT AUTOPLAY
// ========================================
class GalleryCarousel {
  constructor() {
    this.currentIndex = 0;
    this.isAnimating = false;
    this.autoplayInterval = null;
    this.autoplayDelay = 4000; // 4 seconds
    this.isPaused = false;
    this.isInViewport = false; // Track viewport visibility

    this.track = document.querySelector(".carousel-track");
    this.slides = document.querySelectorAll(".carousel-slide");
    this.thumbnails = document.querySelectorAll(".thumbnail-item");
    this.prevBtn = document.querySelector(".carousel-prev");
    this.nextBtn = document.querySelector(".carousel-next");
    this.currentIndexEl = document.querySelector(".current-index");
    this.totalImagesEl = document.querySelector(".total-images");

    this.init();
  }

  init() {
    if (!this.slides.length) return;

    // Set total images
    if (this.totalImagesEl) {
      this.totalImagesEl.textContent = this.slides.length;
    }

    // Set initial position
    this.updateCarousel(false);

    // Add click events to thumbnails
    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        if (!this.isAnimating) {
          this.goToSlide(index);
          this.resetAutoplay();
        }
      });
    });

    // Add click events to arrows
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        if (!this.isAnimating) {
          this.prevSlide();
          this.resetAutoplay();
        }
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        if (!this.isAnimating) {
          this.nextSlide();
          this.resetAutoplay();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (this.isInViewport) {
        if (e.key === "ArrowLeft" && !this.isAnimating) {
          this.prevSlide();
          this.resetAutoplay();
        }
        if (e.key === "ArrowRight" && !this.isAnimating) {
          this.nextSlide();
          this.resetAutoplay();
        }
      }
    });

    // Touch swipe support
    this.addSwipeSupport();

    // Preload images
    this.preloadImages();

    // Setup visibility observer
    this.addVisibilityObserver();

    // Pause on hover
    this.addHoverPause();
  }

  // ========================================
  // AUTOPLAY METHODS
  // ========================================

  startAutoplay() {
    this.stopAutoplay(); // Clear any existing interval

    this.autoplayInterval = setInterval(() => {
      if (!this.isPaused && !this.isAnimating && this.isInViewport) {
        this.nextSlide();
      }
    }, this.autoplayDelay);

    console.log("✅ Autoplay started");
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
      console.log("⏹️ Autoplay stopped");
    }
  }

  pauseAutoplay() {
    this.isPaused = true;
    console.log("⏸️ Autoplay paused");
  }

  resumeAutoplay() {
    this.isPaused = false;
    console.log("▶️ Autoplay resumed");
  }

  resetAutoplay() {
    if (this.isInViewport) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  toggleAutoplay() {
    if (this.autoplayInterval) {
      this.stopAutoplay();
    } else {
      this.startAutoplay();
    }
  }

  // ========================================
  // VISIBILITY OBSERVER
  // ========================================

  addVisibilityObserver() {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3, // 30% of gallery needs to be visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Gallery entered viewport
          this.isInViewport = true;
          this.resumeAutoplay();

          if (!this.autoplayInterval) {
            this.startAutoplay();
          }

          console.log("👁️ Gallery in viewport - autoplay active");
        } else {
          // Gallery left viewport
          this.isInViewport = false;
          this.stopAutoplay();

          console.log("🚫 Gallery out of viewport - autoplay stopped");
        }
      });
    }, observerOptions);

    const gallery = document.querySelector(".gallery");
    if (gallery) {
      observer.observe(gallery);
    } else {
      console.warn("Gallery section not found");
    }
  }

  // ========================================
  // HOVER PAUSE
  // ========================================

  addHoverPause() {
    const carouselContainer = document.querySelector(".carousel-container");

    if (carouselContainer) {
      carouselContainer.addEventListener("mouseenter", () => {
        this.pauseAutoplay();
      });

      carouselContainer.addEventListener("mouseleave", () => {
        this.resumeAutoplay();
      });
    }
  }

  // ========================================
  // CAROUSEL NAVIGATION
  // ========================================

  goToSlide(index) {
    if (index === this.currentIndex || this.isAnimating) return;

    this.isAnimating = true;

    // Remove active classes
    this.thumbnails[this.currentIndex].classList.remove("active");
    this.slides[this.currentIndex].classList.remove("active");

    // Update index
    this.currentIndex = index;

    // Add active classes
    this.thumbnails[this.currentIndex].classList.add("active");
    this.slides[this.currentIndex].classList.add("active");

    // Update carousel
    this.updateCarousel(true);

    // Update counter
    if (this.currentIndexEl) {
      this.currentIndexEl.textContent = this.currentIndex + 1;
    }

    // Scroll thumbnail into view
    this.thumbnails[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    // Reset animation lock
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  updateCarousel(animate = true) {
    const slideWidth = this.slides[0].offsetWidth;
    const offset = -this.currentIndex * slideWidth;

    if (!animate) {
      this.track.style.transition = "none";
    } else {
      this.track.style.transition =
        "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    }

    this.track.style.transform = `translateX(${offset}px)`;

    if (!animate) {
      setTimeout(() => {
        this.track.style.transition =
          "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      }, 50);
    }
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  // ========================================
  // SWIPE SUPPORT
  // ========================================

  addSwipeSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    const container = document.querySelector(".carousel-track-container");

    if (!container) return;

    container.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        this.pauseAutoplay();
      },
      { passive: true }
    );

    container.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);

        if (this.isInViewport) {
          this.resumeAutoplay();
        }
      },
      { passive: true }
    );
  }

  handleSwipe(startX, endX, startY, endY) {
    const diffX = Math.abs(startX - endX);
    const diffY = Math.abs(startY - endY);

    if (diffX > diffY && diffX > 50 && !this.isAnimating) {
      if (endX < startX) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
      this.resetAutoplay();
    }
  }

  // ========================================
  // UTILITIES
  // ========================================

  preloadImages() {
    this.slides.forEach((slide, index) => {
      if (index !== this.currentIndex) {
        const img = slide.querySelector("img");
        if (img && !img.complete) {
          img.loading = "eager";
        }
      }
    });
  }
}

// ========================================
// INITIALIZE
// ========================================
let galleryCarousel;

document.addEventListener("DOMContentLoaded", () => {
  galleryCarousel = new GalleryCarousel();
});

// Handle window resize
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (galleryCarousel) {
      galleryCarousel.updateCarousel(false);
    }
  }, 250);
});

// Clean up on page unload
window.addEventListener("beforeunload", () => {
  if (galleryCarousel) {
    galleryCarousel.stopAutoplay();
  }
});

// ========================================
// PAGE LOAD
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  console.log(
    "Marci Metzger - The Ridge Realty Group website loaded successfully!"
  );
  console.log("Contact: (206) 919-6886");

  // Add fade-in animation to body
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// ========================================
// CSS ANIMATIONS (Add to your CSS file)
// ========================================
/*
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
*/

// ========================================
// ANIMATED COUNTER FOR STATS
// ========================================
function animateCounter(element) {
  const target = parseFloat(element.getAttribute("data-target"));
  const isDecimal = target % 1 !== 0;
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const updateCounter = () => {
    current += increment;

    if (current < target) {
      if (isDecimal) {
        element.textContent = "$" + current.toFixed(1) + "M";
      } else {
        element.textContent = Math.floor(current);
      }
      requestAnimationFrame(updateCounter);
    } else {
      if (isDecimal) {
        element.textContent = "$" + target.toFixed(1) + "M";
      } else {
        element.textContent = target;
      }
    }
  };

  updateCounter();
}

// Observe stat cards and trigger counter animation
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
        const statNumber = entry.target.querySelector(".stat-number");
        if (statNumber) {
          animateCounter(statNumber);
          entry.target.classList.add("counted");
        }
      }
    });
  },
  { threshold: 0.5 }
);

// Observe all stat cards
document.querySelectorAll(".stat-card").forEach((card) => {
  statObserver.observe(card);
});
// Scroll animation for features
const featureItems = document.querySelectorAll(".feature-item");

const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px",
};

const featureObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animated");
    }
  });
}, observerOptions);

featureItems.forEach((item) => {
  featureObserver.observe(item);
});

// ========================================
// ANIMATE STATS COUNTER ON SCROLL
// ========================================
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50; // Adjust speed here
  const duration = 1500; // Total animation time in ms
  const stepTime = duration / 50;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    // Format the number
    if (element.textContent.includes("M")) {
      element.textContent = "$" + current.toFixed(1) + "M";
    } else if (element.textContent.includes("+")) {
      element.textContent = Math.floor(current) + "+";
    } else {
      element.textContent = Math.floor(current);
    }
  }, stepTime);
}

// Observe stats section
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (
        entry.isIntersecting &&
        !entry.target.classList.contains("animated")
      ) {
        entry.target.classList.add("animated");

        // Get all stat numbers in this section
        const statNumbers = entry.target.querySelectorAll(".stat-number");

        statNumbers.forEach((stat) => {
          const text = stat.textContent;
          let targetValue;

          if (text.includes("M")) {
            targetValue = parseFloat(text.replace(/[$M]/g, ""));
          } else if (text.includes("+")) {
            targetValue = parseInt(text.replace("+", ""));
          } else {
            targetValue = parseInt(text);
          }

          animateCounter(stat, targetValue);
        });
      }
    });
  },
  { threshold: 0.3 }
);

// Observe hero stats and about stats
const heroStats = document.querySelector(".hero-stats");
if (heroStats) {
  statsObserver.observe(heroStats);
}
