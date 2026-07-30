/**
 * BIMM Lab shared off-canvas navigation.
 * Handles open/close, outside-click, Escape, focus trap, and the
 * Openings submenu disclosure. Included on every page.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var hamburger = document.querySelector(".hamburger");
    var panel = document.getElementById("nav-panel");
    var overlay = document.querySelector(".nav-overlay");
    var closeBtn = document.querySelector(".nav-close");

    if (!hamburger || !panel || !overlay || !closeBtn) return;

    var lastFocused = null;

    function focusableElements() {
      return Array.prototype.slice.call(
        panel.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(function (el) {
        return el.offsetParent !== null;
      });
    }

    function openNav() {
      lastFocused = document.activeElement;
      panel.classList.add("open");
      overlay.classList.add("visible");
      overlay.hidden = false;
      panel.setAttribute("aria-hidden", "false");
      hamburger.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
      closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    }

    function closeNav() {
      panel.classList.remove("open");
      overlay.classList.remove("visible");
      panel.setAttribute("aria-hidden", "true");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      document.removeEventListener("keydown", onKeydown);
      window.setTimeout(function () {
        overlay.hidden = true;
      }, 250);
      if (lastFocused) {
        lastFocused.focus();
      } else {
        hamburger.focus();
      }
    }

    function isOpen() {
      return panel.classList.contains("open");
    }

    function onKeydown(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        closeNav();
        return;
      }
      if (e.key === "Tab") {
        var focusable = focusableElements();
        if (focusable.length === 0) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    hamburger.addEventListener("click", function () {
      isOpen() ? closeNav() : openNav();
    });

    closeBtn.addEventListener("click", closeNav);
    overlay.addEventListener("click", closeNav);

    panel.querySelectorAll(".nav-list a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    var submenuToggle = panel.querySelector(".submenu-toggle");
    if (submenuToggle) {
      var submenu = document.getElementById(
        submenuToggle.getAttribute("aria-controls")
      );
      submenuToggle.addEventListener("click", function () {
        var expanded = submenuToggle.getAttribute("aria-expanded") === "true";
        submenuToggle.setAttribute("aria-expanded", String(!expanded));
        if (submenu) submenu.hidden = expanded;
      });
    }
  });
})();
