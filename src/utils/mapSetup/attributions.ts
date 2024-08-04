import { Attribution, defaults } from 'ol/control.js';

export const OPEN_TOPO_MAP_ATTRIBUTION =
  'Kartendaten: &copy; <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> -Mitwirkende, <a href="http://viewfinderpanoramas.org">SRTM</a> | Kartendarstellung: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';

export const OPEN_TOPO_MAP_RU_ATTRIBUTION =
  'Kartendaten: &copy; <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> -Mitwirkende, <a href="http://viewfinderpanoramas.org">SRTM</a> | Kartendarstellung: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>, <a href="https://opentopomap.cz">OpenTopoMap.cz</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';

const attribution = new Attribution({
  collapsible: true,
  collapsed: true,
});

export const attributionSetting = defaults({ attribution: false }).extend([attribution]);
