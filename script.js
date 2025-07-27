// DOM Element References
const password = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("length-value");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const strengthIndicator = document.getElementById("strength-bar");
const strengthLabel = document.getElementById("strength-label");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");


//Character Sets
const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";

// Event Listeners
window.addEventListener("DOMContentLoaded", generatePassword);
lengthSlider.addEventListener("input", () => {
  lengthValue.textContent = lengthSlider.value;
});
generateButton.addEventListener("click", generatePassword);
copyButton.addEventListener("click", copyPassword);


// functions
function copyPassword() {
  if (!password.value) return;

  navigator.clipboard.writeText(password.value)
    .then(() => showCopySuccess())
    .catch(err => {
      console.error("Failed to copy password: ", err);
      alert("Failed to copy password. Please try again.");
    });
}

function showCopySuccess() {
  copyButton.classList.remove("far", "fa-copy");
  copyButton.classList.add("fas", "fa-check");
  copyButton.style.color = "var(--strong-color)";
  setTimeout(() => {
    copyButton.classList.remove("fas", "fa-check");
    copyButton.classList.add("far", "fa-copy");
    copyButton.style.color = "";
  }, 1500);
}

function generatePassword() {
  const length = Number(lengthSlider.value);
  const includeUpper = uppercase.checked;
  const includeLower = lowercase.checked;
  const includeNumbers = numbers.checked;
  const includeSymbols = symbols.checked;

  if (!includeUpper && !includeLower && !includeNumbers && !includeSymbols) {
    alert("Please select at least one character type.");
    return;
  }

  const newPassword = createPassword(length, includeUpper, includeLower, includeNumbers, includeSymbols);
  password.value = newPassword;
  updateStrengthIndicator(newPassword);
}

function createPassword(length, upper, lower, number, symbol) {

  const charSet = [];
  if (upper) charSet.push(...upperCaseChars);
  if (lower) charSet.push(...lowerCaseChars);
  if (number) charSet.push(...numberChars);
  if (symbol) charSet.push(...symbolChars);


  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    password += charSet[randomIndex];
  }
  return password;
};

function updateStrengthIndicator(password) {
  const length = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = symbolChars.split('').some(char => password.includes(char));

  let strength = 0;
  strength += Math.min(length * 2, 40); // Length contributes up to 40 points

  if (hasUpper) strength += 15;
  if (hasLower) strength += 15;
  if (hasNumber) strength += 15;
  if (hasSymbol) strength += 15;

  if (password.length < 8) {
    strength = Math.min(strength, 40) // Reset strength if password is below 8 characters
  }

  const safeScore = Math.max(5, Math.min(strength, 100));
  strengthIndicator.style.width = `${safeScore}%`;

  if (safeScore < 40) {
    strengthLabel.textContent = "Weak";
    strengthIndicator.style.backgroundColor = "var(--weak-color)";
  } else if (safeScore < 70) {
    strengthLabel.textContent = "Medium";
    strengthIndicator.style.backgroundColor = "var(--medium-color)";
  } else {
    strengthLabel.textContent = "Strong";
    strengthIndicator.style.backgroundColor = "var(--strong-color)";
  }

}