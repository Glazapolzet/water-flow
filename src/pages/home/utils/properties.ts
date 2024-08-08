import { drawInteractions, drawLayers, interactions, rasterLayers } from '@/utils/map';

export const RASTER_LAYERS_PROPERTIES = rasterLayers.getProperties();
export const VECTOR_LAYERS_PROPERTIES = drawLayers.getProperties();

export const DRAW_INTERACTIONS_PROPERTIES = drawInteractions.getProperties();
export const INTERACTIONS_PROPERTIES = interactions.getProperties();
