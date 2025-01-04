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
      transform-origin: center;
    `;

    // Get source and target positions
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    // Calculate center positions
    const startX = sourceRect.left + sourceRect.width / 2 - 25;
    const startY = sourceRect.top + sourceRect.height / 2 - 25;
    const endX = targetRect.left + targetRect.width / 2 - 25;
    const endY = targetRect.top + targetRect.height / 2 - 25;

    // Set initial position
    flyingElement.style.top = `${startY}px`;
    flyingElement.style.left = `${startX}px`;

    // Add to DOM
    document.body.appendChild(flyingElement);
    flyingElementRef.current = flyingElement;

    // Trigger animation with keyframes
    flyingElement.animate(
      [
        {
          top: `${startY}px`,
          left: `${startX}px`,
          transform: "scale(1)",
          opacity: 1,
        },
        {
          top: `${endY}px`,
          left: `${endX}px`,
          transform: "scale(0.1)",
          opacity: 0,
        },
      ],
      {
        duration: 800,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        fill: "forwards",
      }
    );

    // Cleanup
    const timer = setTimeout(() => {
      if (document.body.contains(flyingElement)) {
        document.body.removeChild(flyingElement);
      }
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
