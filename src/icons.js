import ICONS from './icons.generated.js';
import { ICON_NAMES } from './icon-names.js';

export { ICON_NAMES };

export function iconMarkup(name) {
  return ICONS[name] || ICONS['circle-help'] || '';
}
