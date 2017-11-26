const inventoryRoutes = require('./inventory-routes');
const partRoutes = require('./part-routes');

module.exports = function(app, db) {
    inventoryRoutes(app, db);
    partRoutes(app, db);
    // Other route groups could go here, in the future
};
