module.exports = function(app, db) {
    app.delete('/parts/:id', (req, res) => {
        const id = req.params.id;
        const part = db.parts.findOne({id: Number(id)});
        if(part) {
            const query = {
                id: Number(id)
            };

            var options = {
                multi: false,
                upsert: false
             };


            db.parts.update(query, { isActive: false }, options);
            res.send(part);
        } else {
            res.send({ errors: [ 'Could not find part with id \'' + id + '\'']});
        }
    });

    app.get('/parts', (req, res) => {
        let parts = db.parts.find({isActive: true});
        // Apply in memroy searching, disk db does not support OR operations
        if(req.query.search) {
            const search = req.query.search;
            parts = parts.filter((part) => {
                return (part.description && part.description.includes(search)) ||
                    (part.name && part.name.includes(search)) ||
                    (part.partNumber && part.partNumber.includes(search));
            });
        }

        res.send(parts);
    });

    app.get('/parts/:id', (req, res) => {
        const id = req.params.id;
        const part = db.parts.findOne({id: Number(id)});
        if(part) {
            res.send(part);
        } else {
            res.send({ errors: [ 'Could not find part with id \'' + id + '\'']});
        }
    });

    app.post('/parts', (req, res) => {
        let errors = [];
        if(!req.body.partNumber) {
            errors.push('Part Number Is Required');
        }
        if(!req.body.name) {
            errors.push('Name is Required');
        }
        if(!req.body.description) {
            errors.push('Description is Required');
        }

        if(!req.body.cost) {
            errors.push('Cost is Required');
        }
        // Get an id that is one greater than collection size
        const id = db.parts.count() + 1;
        if(errors.length > 0) {
            res.status(400).send({errors: errors});
        } else {
            const part = {
                id: id,
                cost: Number(req.body.cost),
                partNumber: req.body.partNumber,
                description: req.body.description,
                isActive: true,
                image: req.body.image,
                name: req.body.name };

            db.parts.save(part);
            res.send(part);
        }
    });

    app.put('/parts/:id', (req, res) => {
        const id = req.params.id;
        let part = null;
        let errors = [];
        if(!id) {
            errors.push('Id is required.');
        }   else {
            part = db.parts.findOne({id: Number(id)});
            if(!part) {
                errors.push('No part with id \'' + id + '\' exists');
                res.status(400).send({errors: errors});
            }
        }

        if(!req.body.partNumber) {
            errors.push('Part Number Is Required');
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

            part.partNumber = req.body.partNumber;
            part.description = req.body.description;
            part.cost = Number(req.body.cost);
            part.name = req.body.name;
            db.parts.update(query, part, options);
            res.send(part);
        }
    });
};
