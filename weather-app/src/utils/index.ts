/**
 * Scrolls the passed element into view if it's outside the viewport of it's ancestor elements.
 */
export function scrollElementIntoView(element: HTMLElement): void {
  const { top, bottom } = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  if (top >= viewportHeight || bottom <= 0) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}
