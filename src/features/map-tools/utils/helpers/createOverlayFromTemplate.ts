import { Overlay } from 'ol';

type OverlayOptions = Omit<ConstructorParameters<typeof Overlay>[0], 'element'>;

export const createOverlayFromTemplate = (templateId: string, overlayId: string, options?: OverlayOptions) => {
  const overlayTemplate = document.getElementById(templateId);

  if (!overlayTemplate) {
    throw new Error(`Overlay template with id ${templateId} not found`);
  }

  const overlay = document.createElement('div');

  overlayTemplate.childNodes.forEach((child) => overlay.appendChild(child.cloneNode(true)));

  overlay.setAttribute('id', overlayId);

  return new Overlay({
    element: overlay,
    ...options,
  });
};
