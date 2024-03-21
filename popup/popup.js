(async () => {
  const stored = await chrome.storage.local.get("excludeList");

  const input = document.getElementById("exclude-input");
  console.log("DOMContentLoaded", stored, input);

  if (stored.excludeList && stored.excludeList.length > 0) {
    stored.excludeList.forEach((excluded) => {
      input.value += `${excluded}\n`;
    });
  }

  input.addEventListener("change", function () {
    const values = input.value
      .split("\n")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    chrome.storage.local.set({ excludeList: values });
  });

  const suggestions = document.querySelectorAll(".suggestions button");
  for (const suggestion of suggestions) {
    suggestion.addEventListener("click", function () {
      const domain = suggestion.getAttribute("data-domain");
      if (!input.value.includes(domain)) {
        if (input.value === "" || input.value.endsWith("\n")) {
          input.value += `${domain}\n`;
        } else {
          input.value += `\n${domain}\n`;
        }
        input.dispatchEvent(new Event("change"));
      }
    });
  }
})();
