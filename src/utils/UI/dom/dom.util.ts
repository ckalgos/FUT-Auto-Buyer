export function find(
  query: string,
  parent: HTMLElement | Document = document
): HTMLElement | null {
  return parent.querySelector(query);
}

export function findElementAtIndex(
  query: string,
  index: number = 0,
  parent: HTMLElement | Document = document
): HTMLElement | null {
  return parent.querySelectorAll<HTMLElement>(query)[index];
}

export function findByText(query: string, text: string): HTMLElement {
  var elements = document.querySelectorAll(query);
  return Array.prototype.find.call(elements, function (element) {
    return RegExp(text).test(element.textContent);
  });
}

export function append(parent: HTMLElement, child: HTMLElement) {
  parent.appendChild(child);
  return parent;
}

export function appendSibling(sibling: HTMLElement, newElement: HTMLElement) {
  sibling.insertAdjacentHTML("afterend", newElement.innerHTML);
  return sibling;
}

export function htmlToElement(html: string) {
  var template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild as HTMLElement;
}

export function isVisible(element: HTMLElement) {
  return !isHidden(element);
}

export function isHidden(element: HTMLElement) {
  if (!element) return true;
  return !element.offsetWidth && !element.offsetHeight;
}

export function waitForElementToDisplay(
  element: HTMLElement
): Promise<boolean> {
  return elementWaitHelper(() => {
    return isVisible(element);
  });
}

export function waitForElement(selector: string): Promise<HTMLElement> {
  return elementWaitHelper(() => {
    return document.querySelector(selector);
  });
}

const elementWaitHelper = <T extends (...args: any) => any>(resolver: T) => {
  return new Promise<ReturnType<T>>(function (resolve, reject) {
    let tries = 10;
    waitForElementInner(200);
    function waitForElementInner(time: number) {
      if (tries <= 0) {
        reject();
      }
      const reponse = resolver();
      if (reponse) {
        resolve(reponse);
      } else {
        setTimeout(function () {
          tries--;
          waitForElementInner(time);
        }, time);
      }
    }
  });
};
