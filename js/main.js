// BGS Solutions demo interactions.
// Keep interactions small and consistent with the clean corporate layout.

const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

// Mobile navigation.
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  primaryNav.classList.toggle('is-open', !isOpen);
});

function closeMenu() {
  primaryNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}

primaryNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

// Keep the footer year current.
document.querySelector('#year').textContent = new Date().getFullYear();

// Highlight the navigation link for the section currently in view.
const sectionLinks = [...primaryNav.querySelectorAll('a[href^="#"]')]
  .filter((link) => document.querySelector(link.getAttribute('href')));
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter((section) => section && section.id !== 'top');

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

// Reveal key content gently as it enters the viewport.
const revealItems = document.querySelectorAll(
  '.intro-grid, .intro-rule, .section-heading, .service-card, .approach-image, .approach-copy, .gallery-item, .contact-copy, .enquiry-form'
);

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealItems.forEach((item) => item.classList.add('reveal-ready'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

// Simple accessible image viewer for the fieldwork gallery.
const galleryImages = document.querySelectorAll('.gallery-item img');
const lightbox = document.querySelector('#image-lightbox');
const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');
let lastFocusedImage = null;

galleryImages.forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `View larger image: ${image.alt}`);

  const openLightbox = () => {
    lastFocusedImage = image;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.closest('figure').querySelector('figcaption').textContent.trim();
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  };

  image.addEventListener('click', openLightbox);
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox();
    }
  });
});

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = '';
  document.body.classList.remove('lightbox-open');
  if (lastFocusedImage) lastFocusedImage.focus();
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
});

// This front-end demo prepares the enquiry in WhatsApp; it does not store form data.
const enquiryForm = document.querySelector('#enquiry-form');
const formNote = document.querySelector('#form-note');
const bgsPhone = '2347066444545';

enquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;

  const formData = new FormData(enquiryForm);
  const message = [
    'Hello BGS Solutions, I would like to make a project enquiry.',
    '',
    `Name: ${formData.get('fullName')}`,
    `Phone: ${formData.get('phone')}`,
    `Email: ${formData.get('email') || 'Not provided'}`,
    `Service area: ${formData.get('service')}`,
    `Project details: ${formData.get('details')}`
  ].join('\n');

  const whatsappUrl = `https://wa.me/${bgsPhone}?text=${encodeURIComponent(message)}`;
  formNote.textContent = 'Your enquiry is ready. WhatsApp will open in a new tab so you can review and send it.';
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});
