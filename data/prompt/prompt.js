// Ask user for the text
const rawInput = prompt(
  "Paste your full form content here, including all sections:\nMain Description, Key Highlights, etc.",
  ""
);

// If user cancels, stop
if (!rawInput) {
  console.warn("No input provided, script canceled.");
} else {
  // ===== REUSE THE REACT-SAFE AUTOFILL =====
  function setReactValue(el, value) {
    const setter = Object.getOwnPropertyDescriptor(el.__proto__, "value").set;
    setter.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function extract(section) {
    const regex = new RegExp(`\\*\\*${section} \\*\\*\\*[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n\\*\\*|$)`, "i");
    const match = rawInput.match(regex);
    return match ? match[1].trim() : "";
  }

  const textareas = document.querySelectorAll("textarea");

  if (textareas.length < 6) {
    console.warn("Not enough textareas found.");
  } else {
    setReactValue(textareas[0], extract("Main Description"));
    setReactValue(textareas[1], extract("Key Highlights"));
    setReactValue(textareas[2], extract("Visitor Information"));
    setReactValue(textareas[3], extract("Tips for Visiting"));
    setReactValue(textareas[4], extract("Why Visit"));
    setReactValue(textareas[5], extract("Image URLs"));

    console.log("✅ Form auto-filled from prompt input");
  }
}
