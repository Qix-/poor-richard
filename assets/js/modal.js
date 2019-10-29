import { on, once, transition, loadDate, storeDate } from "./dom-utils.js";

export function openModal() {
  let modal = document.querySelector("#modal-newsletter");
  if (!modal) {
    return;
  }
  window.ga("send", "event", {
    eventCategory: "Modal interaction",
    eventAction: "Saw modal",
    nonInteraction: true
  });

  let root = document.body.parentElement;
  let closeBtn = modal.querySelectorAll("[aria-label=close]");
  let bg = modal.querySelectorAll(".modal-background");
  let inputs = modal.querySelectorAll("input");
  let form = modal.querySelectorAll("form");

  modal.classList.add("is-active");
  transition(modal, "fade-enter", "fade-enter-active");
  root.classList.add("is-clipped");
  const ESCkeyCode = 27;

  let cancelFns = [
    on("click", closeBtn, closeModal),
    on("click", bg, closeModal),
    on("touchmove", bg, e => {
      e.preventDefault();
    }),
    on("keydown", document, e => {
      if (e.keyCode === ESCkeyCode) {
        closeModal();
      }
    }),
    // eslint-disable-next-line no-unused-vars
    on("focus", inputs, e => {
      window.ga("send", "event", {
        eventCategory: "Modal interaction",
        eventAction: "Focus input"
      });
    }),
    // eslint-disable-next-line no-unused-vars
    on("submit", form, e => {
      window.ga("send", "event", {
        eventCategory: "Modal interaction",
        eventAction: "Sign up for newsletter",
        transport: "beacon"
      });
    })
  ];

  function closeModal() {
    modal.classList.remove("is-active");
    root.classList.remove("is-clipped");
    cancelFns.forEach(fn => {
      fn();
    });
    window.ga("send", "event", {
      eventCategory: "Modal interaction",
      eventAction: "Dismiss modal",
      nonInteraction: true
    });
  }
}

export function addModal() {
  once("scroll", [window], () => {
    const onTestPage = !!window.location.href.match(/debug-modal/);
    const LAST_VISIT_KEY = "last-visit";
    const SAW_NEWSLETTER_MODAL_KEY = "saw-newsletter-modal";
    const FROM_MC_KEY = "originated-from-mailchimp";
    const delay = onTestPage ? 500 : 5000; // 5s

    let now = new Date();
    let showModal = true;

    storeDate(LAST_VISIT_KEY, now);

    // If we're not already on the newsletter page...
    if (window.location.pathname.match(/newsletters/)) {
      storeDate(SAW_NEWSLETTER_MODAL_KEY, now);
    }
    // And haven't seen the modal recently...
    if (loadDate(SAW_NEWSLETTER_MODAL_KEY)) {
      showModal = false;
    }
    // And didn't come from the newsletter...
    if (window.location.href.match(/utm_source=email/)) {
      storeDate(FROM_MC_KEY, now);
    }
    if (document.referrer.match(/campaign-archive/)) {
      storeDate(FROM_MC_KEY, now);
    }
    if (loadDate(FROM_MC_KEY)) {
      showModal = false;
    }
    // And it's not excluded from the page
    if (document.body.dataset.modalExclude) {
      showModal = false;
    }
    // Or we're just testing...
    if (onTestPage) {
      showModal = true;
    }
    // Then show it...
    if (showModal) {
      storeDate(SAW_NEWSLETTER_MODAL_KEY, now);
      window.setTimeout(openModal, delay);
    }
  });
}
