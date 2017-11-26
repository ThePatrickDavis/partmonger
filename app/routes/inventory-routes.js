module.exports = function(app, db) {
    app.delete('/inventory/:id', (req, res) => {
        const id = req.params.id;
        const inventory = db.inventory.findOne({id: Number(id)});
        if(inventory) {
            const query = {
                id: Number(id)
            };

            var options = {
                multi: false,
                upsert: false
             };


            db.inventory.update(query, { isActive: false }, options);
            res.send(inventory);
        } else {
            res.send({ errors: [ 'Could not find inventory with id \'' + id + '\'']});
        }
    });

    app.get('/inventory', (req, res) => {
        const inventory = db.inventory.find({isActive: true});
        res.send(inventory);
    });

    app.get('/inventory/:id', (req, res) => {
        const id = req.params.id;
        const inventory = db.inventory.findOne({id: Number(id)});
        if(inventory) {
            res.send(inventory);
        } else {
            res.send({ errors: [ 'Could not find inventory with id \'' + id + '\'']});
        }
    });

    app.post('/inventory', (req, res) => {
        let errors = [];
        if(!req.body.inventoryId) {
            errors.push('Inventory Id Is Required');
        }
        // Get an id that is one greater than collection size
        const id = db.inventory.count() + 1;
        if(errors.length > 0) {
            res.status(400).send({errors: errors});
        } else {
            const inventory = {
                id: id,
                inventoryId: Number(req.body.inventoryId),
                quantity: Number(req.body.quantity),
                isActive: true };

            db.inventory.save(inventory);
            res.send(inventory);
        }
    });

    app.put('/inventory/:id', (req, res) => {
        const id = req.params.id;
        let inventory = null;
        let errors = [];
        if(!id) {
            errors.push('Id is required.');
        }   else {
            inventory = db.inventory.findOne({id: Number(id)});
            if(!inventory) {
                errors.push('No inventory with id \'' + id + '\' exists');
                res.status(400).send({errors: errors});
            }
        }

        if(!req.body.description) {
            errors.push('Description is Required');
        }

        if(!req.body.cost) {
            errors.push('Cost is Required');
        }

        if(errors.length > 0) {
            res.status(400).send({errors: errors});
        } else {
            const query = {
                id: Number(id)
            };

            var options = {
                multi: false,
                upsert: false
             };

            inventory.inventoryNumber = req.body.inventoryNumber;
            inventory.description = req.body.description;
            inventory.cost = Number(req.body.cost);
            db.inventory.update(query, inventory, options);
            res.send(inventory);
        }
    });
};