import { Overlay } from 'ol';

export const setOverlayMessage = (contentId: string, overlay: Overlay, message: string) => {
  const overlayElement = overlay.getElement();

  if (!overlayElement) {
    throw new Error('Overlay element not found');
  }

  const overlayContent = overlayElement.querySelector(`#${contentId}`);

  if (!overlayContent) {
    throw new Error(`Overlay content with id ${contentId} not found`);
  }

  overlayContent.textContent = message;

  overlay.setElement(overlayElement);
};
