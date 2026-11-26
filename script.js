(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const animateEntrance = (element) => {
    if (reducedMotion.matches || !element) return;
    element.getAnimations().forEach((animation) => animation.cancel());
    element.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 320, easing: "cubic-bezier(.2,.75,.25,1)" },
    );
  };

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // A small navigation that works with touch, keyboard and resizing.
  const menuButton = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("navMobile");
  const mobileViewport = window.matchMedia("(max-width: 767px)");
  const setMenuOpen = (open, returnFocus = false) => {
    if (!menuButton || !mobileNav) return;
    mobileNav.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Fermer le menu" : "Ouvrir le menu",
    );
    if (open) animateEntrance(mobileNav);
    if (returnFocus) menuButton.focus();
  };
  menuButton?.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });
  mobileNav
    ?.querySelectorAll("a")
    .forEach((link) =>
      link.addEventListener("click", () => setMenuOpen(false)),
    );
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton?.getAttribute("aria-expanded") === "true"
    )
      setMenuOpen(false, true);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header")) setMenuOpen(false);
  });
  mobileViewport.addEventListener("change", () => setMenuOpen(false));

  // Motion is optional: all content remains visible without an observer.
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => revealObserver.observe(element));

    const header = document.querySelector(".header");
    const top = document.getElementById("pageTop");
    if (top) {
      const headerObserver = new IntersectionObserver(([entry]) =>
        header?.classList.toggle("is-scrolled", !entry.isIntersecting),
      );
      headerObserver.observe(top);
    }
    const navLinks = [...document.querySelectorAll(".desktop-nav a")];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            if (link.hash === "#" + entry.target.id)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    navLinks.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section) sectionObserver.observe(section);
    });

    const journeyObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    document
      .querySelectorAll(".journey-steps li")
      .forEach((step) => journeyObserver.observe(step));

    const stickyCTA = document.querySelector(".mobile-sticky-cta");
    const hero = document.querySelector(".hero");
    const consultation = document.querySelector(".consultation-section");
    if (stickyCTA && hero && consultation) {
      let beyondHero = false;
      let formVisible = false;
      const updateSticky = () => {
        const visible = beyondHero && !formVisible && mobileViewport.matches;
        stickyCTA.classList.toggle("is-visible", visible);
        stickyCTA.setAttribute("aria-hidden", String(!visible));
        stickyCTA.tabIndex = visible ? 0 : -1;
      };
      const heroObserver = new IntersectionObserver(([entry]) => {
        beyondHero =
          !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
        updateSticky();
      });
      const formObserver = new IntersectionObserver(
        ([entry]) => {
          formVisible = entry.isIntersecting;
          updateSticky();
        },
        { threshold: 0 },
      );
      heroObserver.observe(hero);
      formObserver.observe(consultation);
      mobileViewport.addEventListener("change", updateSticky);
    }
  }

  const readingProgress = document.querySelector(".reading-progress");
  if (readingProgress) {
    let scheduled = false;
    const renderProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      readingProgress.style.transform = "scaleX(" + progress + ")";
      scheduled = false;
    };
    const requestProgress = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(renderProgress);
    };
    window.addEventListener("scroll", requestProgress, { passive: true });
    window.addEventListener("resize", requestProgress, { passive: true });
    if ("ResizeObserver" in window)
      new ResizeObserver(requestProgress).observe(document.body);
    requestProgress();
  }

  // Tabs follow the WAI keyboard pattern and preselect the matching form answer.
  const projectTabs = [...document.querySelectorAll(".project-tab")];
  const tabList = document.querySelector(".project-tabs");
  const horizontalTabs = window.matchMedia("(max-width: 959px)");
  const setTabOrientation = () =>
    tabList?.setAttribute(
      "aria-orientation",
      horizontalTabs.matches ? "horizontal" : "vertical",
    );
  setTabOrientation();
  horizontalTabs.addEventListener("change", setTabOrientation);
  const selectTab = (selected, focus = false) => {
    projectTabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      panel.hidden = !active;
      if (active) animateEntrance(panel);
    });
    if (focus) selected.focus();
  };
  projectTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      const previousKey = horizontalTabs.matches ? "ArrowLeft" : "ArrowUp";
      const nextKey = horizontalTabs.matches ? "ArrowRight" : "ArrowDown";
      let next;
      if (event.key === previousKey)
        next = (index - 1 + projectTabs.length) % projectTabs.length;
      if (event.key === nextKey) next = (index + 1) % projectTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = projectTabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectTab(projectTabs[next], true);
    });
  });

  document.querySelectorAll(".faq-list details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (detail.open) animateEntrance(detail.querySelector("div"));
    });
  });

  const form = document.getElementById("userForm");
  if (!form) return;

  const steps = [...form.querySelectorAll(".form-step")];
  const nextButton = document.getElementById("nextStep");
  const previousButton = document.getElementById("prevStep");
  const submitButton = document.getElementById("submitBtn");
  const errorMessage = document.getElementById("formError");
  const successMessage = document.getElementById("successMessage");
  const progressButtons = [...form.querySelectorAll("[data-go-step]")];
  let currentStep = 0;
  let furthestStep = 0;
  let sending = false;

  const clearError = () => {
    errorMessage.hidden = true;
    errorMessage.textContent = "";
  };
  const showStep = (index, focus = true) => {
    currentStep = index;
    furthestStep = Math.max(furthestStep, index);
    steps.forEach((step, i) => {
      step.hidden = i !== index;
    });
    previousButton.hidden = index === 0;
    nextButton.hidden = index === steps.length - 1;
    submitButton.hidden = index !== steps.length - 1;
    progressButtons.forEach((button, i) => {
      button.disabled = i > furthestStep;
      button.classList.toggle("is-complete", i < index);
      if (i === index) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    document.getElementById("formProgress").style.transform =
      "scaleX(" + (index + 1) / steps.length + ")";
    clearError();
    animateEntrance(steps[index]);
    if (focus) {
      steps[index].querySelector("h3").focus({ preventScroll: true });
      form.scrollIntoView({
        behavior: reducedMotion.matches ? "instant" : "smooth",
        block: "start",
      });
    }
  };
  const validateStep = (index) => {
    const invalid = [...steps[index].querySelectorAll("input")].find(
      (input) => input.willValidate && !input.checkValidity(),
    );
    if (!invalid) return true;
    if (currentStep !== index) showStep(index, false);
    errorMessage.textContent = invalid.validity.valueMissing
      ? "Complétez les champs obligatoires de cette étape pour continuer."
      : invalid.validationMessage;
    errorMessage.hidden = false;
    invalid.reportValidity();
    return false;
  };
  const updateOtherInput = (question) => {
    const wrapper = question.querySelector(".other-field");
    if (!wrapper) return;
    const other =
      question.querySelector('input[type="checkbox"][value="Autre…"]')
        ?.checked === true;
    const input = wrapper.querySelector("input");
    wrapper.hidden = !other;
    input.disabled = !other;
    input.required = other;
    if (!other) input.value = "";
  };
  form.querySelectorAll(".question").forEach((question) => {
    question.addEventListener("change", () => updateOtherInput(question));
    updateOtherInput(question);
  });
  form.addEventListener("input", clearError);
  form.addEventListener("change", clearError);
  nextButton.addEventListener("click", () => {
    if (validateStep(currentStep)) showStep(currentStep + 1);
  });
  previousButton.addEventListener("click", () => showStep(currentStep - 1));
  progressButtons.forEach((button, index) =>
    button.addEventListener("click", () => {
      if (sending || index === currentStep) return;
      if (index < currentStep || validateStep(currentStep)) showStep(index);
    }),
  );
  document.querySelectorAll("[data-project]").forEach((link) => {
    link.addEventListener("click", () => {
      const input = [
        ...form.querySelectorAll('input[name="mainObjective"]'),
      ].find((input) => input.value === link.dataset.project);
      if (input) input.checked = true;
      form.hidden = false;
      successMessage.hidden = true;
      showStep(0, false);
    });
  });

  // These values match the existing Google Form connected to the sheet.
  const simpleFields = {
    fullName: "entry.1349760617",
    age: "entry.741531472",
    city: "entry.801851716",
    email: "entry.133123274",
    phone: "entry.722510533",
  };
  const questionFields = {
    destination: "entry.2008478632",
    professionalSituation: "entry.796984436",
    funding: "entry.1726542913",
    languageEligibility: "entry.474404617",
    documentPreparation: "entry.925552540",
    mainObjective: "entry.1079037558",
  };
  const googleFormUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSdsazXVhcRFxYxTRTOZ_rXS2Qrz6jd6q-wdH1wDhsINg6uYuQ/formResponse";
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    if (currentStep < steps.length - 1) {
      if (validateStep(currentStep)) showStep(currentStep + 1);
      return;
    }
    for (let i = 0; i < steps.length; i++) if (!validateStep(i)) return;
    const values = new FormData(form);
    const payload = new FormData();
    Object.entries(simpleFields).forEach(([name, entry]) =>
      payload.append(entry, String(values.get(name) || "")),
    );
    Object.entries(questionFields).forEach(([name, entry]) => {
      const answers = values.getAll(name);
      const otherResponse = String(
        form.elements.namedItem(name + "Other")?.value || "",
      ).trim();
      answers.forEach((answer) => {
        if (answer.includes("Autre")) {
          payload.append(entry, "__other_option__");
          if (otherResponse) {
            payload.append(entry + ".other_option_response", otherResponse);
          }
        } else {
          payload.append(entry, answer);
        }
      });
      if (answers.length === 0 && otherResponse) {
        payload.append(entry, "__other_option__");
        payload.append(entry + ".other_option_response", otherResponse);
      }
    });
    sending = true;
    submitButton.disabled = true;
    previousButton.disabled = true;
    progressButtons.forEach((button) => {
      button.disabled = true;
    });
    submitButton.querySelector("span").textContent = "Envoi en cours…";
    form.setAttribute("aria-busy", "true");
    clearError();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(googleFormUrl, {
        method: "POST",
        body: payload,
        mode: "no-cors",
        signal: controller.signal,
      });
      // Google returns an opaque response: delivery cannot be verified client-side.
      if (response.type !== "opaque" && !response.ok)
        throw new Error("Submission rejected");
      form.hidden = true;
      successMessage.hidden = false;
      animateEntrance(successMessage);
      successMessage.querySelector("h3").tabIndex = -1;
      successMessage.querySelector("h3").focus({ preventScroll: true });
      successMessage.scrollIntoView({
        behavior: reducedMotion.matches ? "instant" : "smooth",
        block: "center",
      });
    } catch {
      errorMessage.textContent =
        "L’envoi n’a pas abouti. Vos réponses sont conservées. Réessayez ou contactez-nous au 0556 00 65 22.";
      errorMessage.hidden = false;
    } finally {
      clearTimeout(timeout);
      sending = false;
      submitButton.disabled = false;
      previousButton.disabled = false;
      progressButtons.forEach((button, i) => {
        button.disabled = i > furthestStep;
      });
      submitButton.querySelector("span").textContent =
        "Demander ma consultation";
      form.removeAttribute("aria-busy");
    }
  });
  document.getElementById("restartForm").addEventListener("click", () => {
    form.reset();
    form.querySelectorAll(".question").forEach(updateOtherInput);
    furthestStep = 0;
    form.hidden = false;
    successMessage.hidden = true;
    showStep(0);
  });
  showStep(0, false);
})();
