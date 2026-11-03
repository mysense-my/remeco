/* Remeco: forms without a server. Both forms build an email in the visitor's own email app and then show the
   template's success state. Runs in the capture phase so Webflow's form module (which would try to post to
   Webflow's servers and then show its error state) never sees the submit. Delegated on document so it keeps
   working after Barba page swaps. */
document.addEventListener("submit", function (e) {
    var f = e.target;
    var isContact = f.classList && f.classList.contains("rm-contact");
    var isNews = f.id === "wf-form-Newsletter-form";
    if (!isContact && !isNews) return;
    e.preventDefault();
    e.stopPropagation();
    var v = function (n) { return (f.elements[n] && f.elements[n].value || "").trim(); };
    var wrap = f.closest(".w-form");
    var fail = wrap && wrap.querySelector(".w-form-fail");
    var done = wrap && wrap.querySelector(".w-form-done");
    var to, subject, body, ok;
    if (isContact) {
        ok = v("name") && /.+@.+\..+/.test(v("email")) && v("topic") && v("message");
        var side = v("topic") === "side-effect";
        to = side ? f.dataset.pv : f.dataset.to;
        subject = (side ? "Side effect report" : v("topic")) + (v("product") ? " - " + v("product") : "") + " (remeco website)";
        body = v("message") + "\n\n" + v("name") + "\n" + v("email") + (v("phone") ? "\n" + v("phone") : "");
    } else {
        var email = (f.querySelector("input[type=email]") || {}).value || "";
        ok = /.+@.+\..+/.test(email.trim());
        to = f.dataset.to;
        subject = "Newsletter sign-up (remeco website)";
        body = "Please add " + email.trim() + " to the Remeco updates list.";
    }
    if (fail) fail.style.display = ok ? "none" : "block";
    if (!ok) return;
    window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    (f.closest(".form-inner") || f).style.display = "none";
    if (done) done.style.display = "block";
}, true);
