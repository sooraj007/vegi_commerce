import { useEffect, useRef } from "react";

interface FlyToCartProps {
  sourceElement: HTMLElement;
  targetElement: HTMLElement;
  imageUrl: string;
  onComplete?: () => void;
}

export function FlyToCart({
  sourceElement,
  targetElement,
  imageUrl,
  onComplete,
}: FlyToCartProps) {
  const flyingElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const flyingElement = document.createElement("div");
    flyingElement.style.cssText = `
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-image: url(${imageUrl});
      background-size: cover;
      background-position: center;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    `;

    // Get source and target positions
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    // Set initial position
    flyingElement.style.top = `${sourceRect.top}px`;
    flyingElement.style.left = `${sourceRect.left}px`;

    // Add to DOM
    document.body.appendChild(flyingElement);
    flyingElementRef.current = flyingElement;

    // Trigger animation
    requestAnimationFrame(() => {
      flyingElement.style.transition =
        "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      flyingElement.style.top = `${targetRect.top}px`;
      flyingElement.style.left = `${targetRect.left}px`;
      flyingElement.style.transform = "scale(0.1)";
      flyingElement.style.opacity = "0";
    });

    // Cleanup
    const timer = setTimeout(() => {
      document.body.removeChild(flyingElement);
      onComplete?.();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (
        flyingElementRef.current &&
        document.body.contains(flyingElementRef.current)
      ) {
        document.body.removeChild(flyingElementRef.current);
      }
    };
  }, [sourceElement, targetElement, imageUrl, onComplete]);

  return null;
}
