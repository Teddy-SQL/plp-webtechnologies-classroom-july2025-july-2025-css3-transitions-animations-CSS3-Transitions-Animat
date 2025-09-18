/* ================================
   script.js
   - Demonstrates: scope, parameters, return values
   - Triggers animations by adding/removing classes
   - Event handling for buttons and form
   ================================ */

/* ------------------------------
   Global scope variables
   - Accessible to all functions below
   ------------------------------ */
let globalCounter = 0; // global variable demonstrating global scope

/* ------------------------------
   Helper: safeAddAnimation
   - Parameters: element (DOM node), className (string)
   - Returns: true if animation started, false otherwise
   - Purpose: add a class that triggers a CSS animation and remove it after it ends
   ------------------------------ */
function safeAddAnimation(element, className) {
  if (!element || !className) return false; // early return demonstrates return values
  // If animation already present, restart it by removing and forcing reflow
  element.classList.remove(className);
  // Force reflow to allow re-triggering same animation
  // eslint-disable-next-line no-unused-expressions
  void element.offsetWidth;
  element.classList.add(className);

  // Remove the animation class when finished to keep DOM clean
  const cleanup = () => {
    element.classList.remove(className);
    element.removeEventListener("animationend", cleanup);
  };
  element.addEventListener("animationend", cleanup);

  return true;
}

/* ------------------------------
   Demonstrating function with parameters & return
   - increments global counter and returns new value
   ------------------------------ */
function incrementGlobal(by = 1) { // 'by' is a parameter with default
  // local variable 'localDelta' demonstrates function-local scope
  let localDelta = Number(by);
  if (Number.isNaN(localDelta)) localDelta = 1;
  globalCounter += localDelta;
  return globalCounter; // return value used by callers
}

/* ------------------------------
   Demonstrating block scope vs var hoisting
   - 'var' example (function-scoped), 'let' example (block-scoped)
   ------------------------------ */
function scopeDemo(flag) {
  if (flag) {
    var varScoped = "I am function-scoped (var)";
    let letScoped = "I am block-scoped (let)";
    // both variables accessible here
    console.log(varScoped, letScoped);
  }
  // varScoped is accessible here (function scope)
  console.log("varScoped after block:", varScoped);
  // letScoped would cause ReferenceError if uncommented:
  // console.log("letScoped after block:", letScoped);
}

/* ------------------------------
   DOM elements & event bindings
   ------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  // Elements used for animations
  const heroBox = document.getElementById("heroBox");
  const pulseBtn = document.getElementById("pulseBtn");
  const slideBtn = document.getElementById("slideBtn");
  const shakeBtn = document.getElementById("shakeBtn");
  const cardB = document.getElementById("cardB");

  // Form elements
  const demoForm = document.getElementById("demoForm");
  const formMsg = document.getElementById("formMsg");

  // 1) Trigger a slide-in animation on load (class uses keyframes slideInDown)
  // Use safeAddAnimation to demonstrate reusability
  safeAddAnimation(heroBox, "animate-slide-in");

  // 2) Pulse button: triggers a quick scale animation
  pulseBtn.addEventListener("click", () => {
    const started = safeAddAnimation(heroBox, "animate-pulse");
    if (started) {
      // increment counter by 1 and show result in console (demonstrates return)
      const newCount = incrementGlobal(1);
      console.log("Pulse triggered. globalCounter =", newCount);
    }
  });

  // 3) Slide from left button: adds 'animate-from-left' to hero box
  slideBtn.addEventListener("click", () => {
    safeAddAnimation(heroBox, "animate-from-left");
    incrementGlobal(2); // increase counter by 2
    console.log("Slide triggered; counter now:", globalCounter);
  });

  // 4) Shake card B when its button is clicked (demonstrates animation trigger on a different element)
  shakeBtn.addEventListener("click", () => {
    safeAddAnimation(cardB, "animate-shake");
    // show scope demonstration
    scopeDemo(true);
  });

  /* ------------------------------
     Form handling & custom validation
     - Demonstrates event handling for form submit
     - No HTML5-only validation used; custom checks implemented here
     ------------------------------ */
  demoForm.addEventListener("submit", (evt) => {
    evt.preventDefault(); // prevent native submission

    // Grab values (local scope variables)
    const username = document.getElementById("username").value.trim();
    const ageVal = document.getElementById("age").value.trim();

    // Simple validation logic (custom)
    const errors = [];

    // Validate username length
    if (username.length < 2) errors.push("Name must be 2+ chars.");

    // Validate age numeric and in range via parsing (demonstrates parameter usage if we abstract)
    const ageNum = parseInt(ageVal, 10);
    if (Number.isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      errors.push("Provide a valid age (1–120).");
    }

    if (errors.length > 0) {
      formMsg.style.color = "#b91c1c";
      formMsg.textContent = errors.join(" ");
    } else {
      formMsg.style.color = "#065f46";
      formMsg.textContent = `Thank you, ${username}. Age recorded: ${ageNum}.`;
      // Trigger a small success animation on header to celebrate (reusing function)
      const logo = document.getElementById("logo");
      safeAddAnimation(logo, "animate-pulse");
    }
  });
});
