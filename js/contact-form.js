/**
 * BIMM Lab contact form.
 * This site is static with no backend, so "sending" composes a mailto:
 * link from the field values and hands off to the visitor's own email
 * app, addressed to Dr. Ghosh. Nothing is transmitted or stored here.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("cf-name").value.trim();
      var email = document.getElementById("cf-email").value.trim();
      var message = document.getElementById("cf-message").value.trim();

      var subject = encodeURIComponent("BIMM Lab Inquiry from " + name);
      var body = encodeURIComponent(
        message + "\n\n— " + name + " (" + email + ")"
      );

      window.location.href =
        "mailto:ashok.ghosh@nmt.edu?subject=" + subject + "&body=" + body;
    });
  });
})();
