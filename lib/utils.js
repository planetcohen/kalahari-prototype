var logger = require('./logger');

// ============================================================================
function keyFromFname(fname) {
  logger.debug("fname =>", fname);
  return fname.replace('.json', '').replace('.hbs', '');
}


// ============================================================================
module.exports = {
  keyFromFname: keyFromFname
};
