document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm");
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // ------------------------------
    // Champs simples
    // ------------------------------
    formData.append("entry.1349760617", form.fullName.value); // Nom et prénom
    formData.append("entry.741531472", form.age.value);       // Âge
    formData.append("entry.801851716", form.city.value);      // Ville
    formData.append("entry.133123274", form.email.value);     // Email
    formData.append("entry.722510533", form.phone.value);     // Téléphone

    // ------------------------------
    // Fonction utilitaire pour checkboxes avec "Autre"
    // ------------------------------
    function handleCheckboxGroup(fieldName, entryId) {
      const checkboxes = form.querySelectorAll(`input[name="${fieldName}"]:checked`);
      const otherInput = form.querySelector(`input[name="${fieldName}Other"]`);

      checkboxes.forEach((cb) => {
        if (cb.value.includes("Autre")) {
          // Ajouter le flag __other_option__
          formData.append(entryId, "__other_option__");

          // Ajouter la valeur du champ texte lié
          if (otherInput && otherInput.value.trim() !== "") {
            formData.append(`${entryId}.other_option_response`, otherInput.value.trim());
          }
        } else {
          // Ajouter le choix normal
          formData.append(entryId, cb.value);
        }
      });

      // Cas : si rien de coché mais champ texte rempli → quand même envoyer
      if (checkboxes.length === 0 && otherInput && otherInput.value.trim() !== "") {
        formData.append(entryId, "__other_option__");
        formData.append(`${entryId}.other_option_response`, otherInput.value.trim());
      }
    }

    // ------------------------------
    // Champs checkbox (6 derniers)
    // ------------------------------
    handleCheckboxGroup("destination", "entry.2008478632");
    handleCheckboxGroup("professionalSituation", "entry.796984436");
    handleCheckboxGroup("funding", "entry.1726542913");
    handleCheckboxGroup("languageEligibility", "entry.474404617");
    handleCheckboxGroup("documentPreparation", "entry.925552540");
    handleCheckboxGroup("mainObjective", "entry.1079037558");

    // ------------------------------
    // Debug console
    // ------------------------------
    console.log("📤 Données envoyées à Google Forms :");
    for (let [key, value] of formData.entries()) {
      console.log(`${key} => ${value}`);
    }

    // ------------------------------
    // Envoi vers Google Forms
    // ------------------------------
    const googleFormUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSdsazXVhcRFxYxTRTOZ_rXS2Qrz6jd6q-wdH1wDhsINg6uYuQ/formResponse";

    try {
      await fetch(googleFormUrl, { method: "POST", body: formData, mode: "no-cors" });

      // Message intégré dans la page
      successMessage.style.display = "block";

      // Toast rapide de confirmation
      showToast("✅ Votre demande a été envoyée avec succès !");

      form.reset();
      form.querySelectorAll(".form-input-other").forEach((input) => (input.style.display = "none"));

      setTimeout(() => (successMessage.style.display = "none"), 5000);
    } catch (err) {
      console.error("❌ Erreur lors de l’envoi du formulaire :", err);
      showToast("❌ Une erreur est survenue. Veuillez réessayer.", true);
    }
  });

  // ------------------------------
  // Gestion dynamique des champs "Autre"
  // ------------------------------
  function toggleOtherInputs() {
    const otherInputs = form.querySelectorAll(".form-input-other");
    otherInputs.forEach((input) => {
      const fieldName = input.name.replace("Other", "");
      const trigger = form.querySelector(`input[name="${fieldName}"][value="Autre…"]`);
      if (trigger) {
        trigger.addEventListener("change", () => {
          if (trigger.checked) {
            input.style.display = "block";
            input.required = true;
          } else {
            input.style.display = "none";
            input.required = false;
            input.value = "";
          }
        });
      }
    });
  }
  toggleOtherInputs();

  // ------------------------------
  // Toast function
  // ------------------------------
  function showToast(message, isError = false) {
    const toast = document.createElement("div");
    toast.className = `toast-message ${isError ? "error" : "success"}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("fade-out"), 3000);
    setTimeout(() => toast.remove(), 4000);
  }
});
