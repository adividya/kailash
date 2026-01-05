document.addEventListener("DOMContentLoaded", () => {
  // 1. Navigation Scroll Effect
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 2. Smooth Scroll for Anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // 3. Form Submission Handling
  const form = document.getElementById("registrationForm");
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnjnravd";

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      try {
        const formData = new FormData(this);
        // Basic client-side validation for nationality could go here if needed,
        // but the select dropdown filtering is better UX.

        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          alert(
            "Thank you for your interest. We will contact you within 24 hours to discuss your pilgrimage journey."
          );
          this.reset();
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        alert(
          "There was a problem submitting your inquiry. Please email us directly at info@kailashpilgrimage.com"
        );
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // 4. Trip Selection Logic (Nationality Warning)
  const tripSelect = document.getElementById("trip");
  const countryInput = document.getElementById("country");

  // Simple check: if country includes "India" and trip is "May", warn the user.
  // In a real app, this would be more robust.
  function checkEligibility() {
    const country = countryInput.value.trim().toLowerCase();
    const trip = tripSelect.value;

    if (trip === "may" && (country === "india" || country === "indian")) {
      alert(
        "Please Note: Due to permit regulations, the May 2026 departure is currently reserved for International (Non-Indian) passport holders only. Indian citizens are welcome on the August departure."
      );
      tripSelect.value = ""; // Reset selection
    }
  }

  tripSelect.addEventListener("change", checkEligibility);
  countryInput.addEventListener("blur", checkEligibility);

  // 5. Map & Itinerary Sync (Advanced)
  // This assumes the HTML has data-lat/long or ID attributes on itinerary items
  // and we have a map controller. For now, we'll do a simple active class toggle.

  const itineraryItems = document.querySelectorAll(".itinerary-item");
  const mapContainer = document.querySelector(".map-container");

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -20% 0px", // Trigger when item is in middle of viewport
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Remove active from all
        itineraryItems.forEach((i) => i.classList.remove("active"));
        // Add to current
        entry.target.classList.add("active");

        // Here we would trigger the map update
        // const locId = entry.target.dataset.location;
        // updateMapMarker(locId);
        console.log(
          "Active Itinerary Step:",
          entry.target.querySelector("strong").innerText
        );
      }
    });
  }, observerOptions);

  itineraryItems.forEach((item) => observer.observe(item));
});
