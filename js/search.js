/**
 * BIMM Lab site search.
 * Client-side only: matches the visitor's query against js/search-index.js
 * (a static index of page/section/text built from the site content).
 * No server, no network request — everything runs in the browser.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".search-toggle");
    var overlay = document.querySelector(".search-overlay");
    var panel = document.getElementById("search-panel");
    var input = document.getElementById("search-input");
    var closeBtn = document.querySelector(".search-close");
    var resultsList = document.getElementById("search-results");
    var emptyMsg = document.getElementById("search-empty");
    var index = window.SEARCH_INDEX || [];

    if (!toggle || !panel || !input || !resultsList) return;

    var lastFocused = null;

    function escapeHtml(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function highlight(text, terms) {
      var escaped = escapeHtml(text);
      terms.forEach(function (term) {
        if (!term) return;
        var re = new RegExp("(" + escapeRegExp(term) + ")", "ig");
        escaped = escaped.replace(re, "<mark>$1</mark>");
      });
      return escaped;
    }

    function snippet(text, terms) {
      var lower = text.toLowerCase();
      var pos = -1;
      for (var i = 0; i < terms.length; i++) {
        var idx = lower.indexOf(terms[i]);
        if (idx !== -1 && (pos === -1 || idx < pos)) pos = idx;
      }
      if (pos === -1) pos = 0;
      var start = Math.max(0, pos - 60);
      var end = Math.min(text.length, pos + 140);
      var snippetText = text.slice(start, end);
      if (start > 0) snippetText = "…" + snippetText;
      if (end < text.length) snippetText = snippetText + "…";
      return snippetText;
    }

    function search(query) {
      var terms = query
        .toLowerCase()
        .split(/\s+/)
        .map(function (t) {
          return t.trim();
        })
        .filter(Boolean);

      if (terms.length === 0) return [];

      var scored = [];
      index.forEach(function (entry) {
        var haystack = (
          entry.page +
          " " +
          entry.section +
          " " +
          entry.text
        ).toLowerCase();

        var matchesAll = terms.every(function (term) {
          return haystack.indexOf(term) !== -1;
        });
        if (!matchesAll) return;

        var score = 0;
        terms.forEach(function (term) {
          if (entry.section.toLowerCase().indexOf(term) !== -1) score += 5;
          if (entry.page.toLowerCase().indexOf(term) !== -1) score += 3;
          var occurrences = entry.text.toLowerCase().split(term).length - 1;
          score += occurrences;
        });

        scored.push({ entry: entry, score: score, terms: terms });
      });

      scored.sort(function (a, b) {
        return b.score - a.score;
      });

      return scored.slice(0, 8);
    }

    function renderResults(matches) {
      resultsList.innerHTML = "";

      if (matches.length === 0) {
        emptyMsg.hidden = false;
        return;
      }
      emptyMsg.hidden = true;

      matches.forEach(function (match) {
        var entry = match.entry;
        var li = document.createElement("li");
        li.className = "search-result";

        var snippetText = entry.text ? snippet(entry.text, match.terms) : "";

        li.innerHTML =
          '<a href="' +
          entry.url +
          '">' +
          '<span class="search-result-meta">' +
          highlight(entry.page, match.terms) +
          (entry.section && entry.section !== entry.page
            ? " &middot; " + highlight(entry.section, match.terms)
            : "") +
          "</span>" +
          (snippetText
            ? '<span class="search-result-snippet">' +
              highlight(snippetText, match.terms) +
              "</span>"
            : "") +
          "</a>";

        resultsList.appendChild(li);
      });
    }

    function focusableElements() {
      return Array.prototype.slice
        .call(
          panel.querySelectorAll(
            'input, button, a[href], [tabindex]:not([tabindex="-1"])'
          )
        )
        .filter(function (el) {
          return el.offsetParent !== null;
        });
    }

    function openSearch() {
      lastFocused = document.activeElement;
      overlay.hidden = false;
      panel.classList.add("open");
      panel.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("search-open");
      input.value = "";
      resultsList.innerHTML = "";
      emptyMsg.hidden = true;
      window.setTimeout(function () {
        input.focus();
      }, 10);
      document.addEventListener("keydown", onKeydown);
    }

    function closeSearch() {
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("search-open");
      document.removeEventListener("keydown", onKeydown);
      window.setTimeout(function () {
        overlay.hidden = true;
      }, 200);
      if (lastFocused) {
        lastFocused.focus();
      } else {
        toggle.focus();
      }
    }

    function onKeydown(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        closeSearch();
        return;
      }
      if (e.key === "Enter") {
        var firstResult = resultsList.querySelector("a");
        if (firstResult && document.activeElement === input) {
          window.location.href = firstResult.getAttribute("href");
        }
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

    toggle.addEventListener("click", function () {
      panel.classList.contains("open") ? closeSearch() : openSearch();
    });

    closeBtn.addEventListener("click", closeSearch);
    overlay.addEventListener("click", closeSearch);

    input.addEventListener("input", function () {
      var matches = search(input.value);
      renderResults(matches);
    });
  });
})();
