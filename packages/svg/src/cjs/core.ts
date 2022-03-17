let svg;

if (typeof window !== 'undefined') {
  svg = require('./core.web');
} else {
  svg = require('./common');
}

export = svg;
