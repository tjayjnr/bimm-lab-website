/**
 * BIMM Lab shared navigation.
 * Handles the "Openings" dropdown in the horizontal top nav: click to
 * toggle, Escape to close, click outside to close, keyboard accessible.
 * Included on every page.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".dropdown-toggle");
    if (!toggle) return;

    var menu = document.getElementById(toggle.getAttribute("aria-controls"));
    if (!menu) return;

    function isOpen() {
      return toggle.getAttribute("aria-expanded") === "true";
    }

    function openMenu() {
      toggle.setAttribute("aria-expanded", "true");
      menu.hidden = false;
      document.addEventListener("click", onDocumentClick);
      document.addEventListener("keydown", onKeydown);
    }

    function closeMenu(focusToggle) {
      toggle.setAttribute("aria-expanded", "false");
      menu.hidden = true;
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKeydown);
      if (focusToggle) toggle.focus();
    }

    function onDocumentClick(e) {
      if (!toggle.parentElement.contains(e.target)) {
        closeMenu(false);
      }
    }

    function onKeydown(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        closeMenu(true);
      }
    }

    toggle.addEventListener("click", function () {
      isOpen() ? closeMenu(false) : openMenu();
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(false);
      });
    });
  });
})();
