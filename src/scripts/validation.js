const form = document.querySelector("form");
const titleInput = form.elements.title;
const noteInput = form.elements.note;

const customValidationHandler = (event) => {
  event.target.setCustomValidity("");

  if (event.target.validity.valueMissing) {
    event.target.setCustomValidity("Wajib diisi.");
    return;
  }

  if (event.target.validity.tooShort) {
    event.target.setCustomValidity("Minimal panjang adalah enam karakter.");
    return;
  }
};

const showErrorMessageStyle = (errorElement) => {
  errorElement.style.color = "red";
};

titleInput.addEventListener("change", customValidationHandler);
titleInput.addEventListener("invalid", customValidationHandler);

noteInput.addEventListener("change", customValidationHandler);
noteInput.addEventListener("invalid", customValidationHandler);

titleInput.addEventListener("blur", handleInputValidation);
noteInput.addEventListener("blur", handleInputValidation);

function handleInputValidation(event) {
  const isValid = event.target.validity.valid;
  const errorMessage = event.target.validationMessage;
  const connectedValidationId = event.target.getAttribute("aria-describedby");
  const connectedValidationEl = connectedValidationId
    ? document.getElementById(connectedValidationId)
    : null;

  if (connectedValidationEl && errorMessage && !isValid) {
    connectedValidationEl.innerText = errorMessage;
    showErrorMessageStyle(connectedValidationEl);
    event.target.style.border = "1px solid red";
  } else {
    connectedValidationEl.innerText = "";
    event.target.style.border = "1px solid #ccc";
  }
}

export { handleInputValidation, customValidationHandler };
