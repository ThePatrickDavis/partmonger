const partRoutes = require('./part-routes');

module.exports = function(app, db) {
    partRoutes(app, db);
    // Other route groups could go here, in the future
};
