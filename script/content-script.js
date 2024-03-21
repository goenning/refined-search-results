function matchesUrl(url, domain) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.endsWith(domain);
  } catch (e) {
    return false;
  }
}

function findParentDivContainer(node) {
  let parentNode = node.parentNode;
  while (parentNode !== null) {
    const isDiv = parentNode.nodeName.toLowerCase() === "div";
    const isContainer = parentNode.hasAttribute("data-hveid");
    if (isDiv && isContainer) {
      return parentNode;
    }
    parentNode = parentNode.parentNode;
  }
  return null;
}

function replaceLink(node, url) {
  node.style.display = "none";

  if (node.parentNode.querySelector(".esr-replaced")) {
    return;
  }

  const p = document.createElement("p");
  p.className = "esr-replaced";

  const a = document.createElement("a");
  a.href = url;
  a.innerText = url;

  const text = document.createElement("span");
  text.innerText = `removed by the Refined Search Results`;

  p.appendChild(a);
  p.appendChild(text);

  node.parentNode.appendChild(p);
}

(async () => {
  const main = document.getElementById("main");
  const stored = await chrome.storage.local.get("excludeList");

  const excludeList = stored.excludeList || [];

  function searchAndReplace() {
    const links = main.querySelectorAll("a[ping]");
    for (const link of links) {
      const url = link.getAttribute("href");
      for (const domain of excludeList) {
        if (matchesUrl(url, domain)) {
          const parentDiv = findParentDivContainer(link);
          if (parentDiv) {
            replaceLink(parentDiv, url);
          }
        }
      }
    }
  }

  const opts = {
    attributes: false,
    childList: true,
    subtree: true,
  };

  const callback = () => {
    observer.disconnect();
    searchAndReplace();
    observer.observe(main, opts);
  };

  const observer = new MutationObserver(callback);
  observer.observe(main, opts);
  searchAndReplace();
})();
