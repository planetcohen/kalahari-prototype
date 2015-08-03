function verbose() {
  console.log.apply(this, arguments);
}

function silent() {
}

var VerboseLogger = {
  debug: verbose,
  info: verbose,
  warn: verbose,
  error: verbose,
  critical: verbose
}

var SilentLogger = {
  debug: silent,
  info: silent,
  warn: silent,
  error: silent,
  critical: silent
}

SilentLogger.verbose = VerboseLogger;

// ============================================================================
module.exports = SilentLogger;
