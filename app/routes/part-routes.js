const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

module.exports = function(app, db) {

    // -- setup up swagger-jsdoc --
    const swaggerDefinition = {
        info: {
        title: 'Partmonger',
        version: '1.0.0',
        description: 'Simple Express based NodeJS API that mocks an inventory backend.',
        },
        host: 'localhost:9001',
        basePath: '/',
    };

    const options = {
        swaggerDefinition,
        apis: [path.resolve('app/routes/part-routes.js')],
    };

    const swaggerSpec = swaggerJSDoc(options);

    // -- routes for docs and generated swagger spec --
    app.get('/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    app.get('/docs', (req, res) => {
        // const pathToDocs = path.resolve('redoc.html');
        // res.sendFile(path.join(__dirname, 'redoc.html'));
        res.sendFile(path.resolve('docs/redoc.html'));
    });

    app.delete('/parts/:id', (req, res) => {
        const id = req.params.id;
        const part = db.parts.findOne({id: parseInt(id)});
        if(part) {
            const query = {
                id: parseInt(id)
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

    /**
     * @swagger
     * /parts?search={search}:
     *   get:
     *     summary: Get parts
     *     parameters:
     *      - in: query
     *        name: search
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Returns a list of active parts that match the search terms.
     *         schema:
     *           type: array
     *           items: 
     *              type: object
     *              properties:
     *                  id:
     *                      type: integer
     *                  cost:
     *                      type: integer
     *                  partNumber: 
     *                      type: string
     *                  description:
     *                      type: string
     *                  name:
     *                      type: string
     *                  notes:
     *                      type: string
     *                  inStock:
     *                      type: integer
     *                  image:
     *                      type: object
     *                  isActive:
     *                      type: boolean             
     */
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

    /**
     * @swagger
     * /parts/{id}:
     *   get:
     *     summary: Get a part
     *     description: Fetch a part by ID
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        required: true
     *        description: Numeric ID of the part to get
     *     responses:
     *       200:
     *         description: Returns a part if one exists with the specified ID.
     *         schema:
     *           type: object
     *           properties:
     *              id:
     *                  type: integer
     *              cost:
     *                  type: integer
     *              partNumber: 
     *                  type: string
     *              description:
     *                  type: string
     *              name:
     *                  type: string
     *              notes:
     *                  type: string
     *              inStock:
     *                  type: integer
     *              image:
     *                  type: object
     *              isActive:
     *                  type: boolean
     */
    app.get('/parts/:id', (req, res) => {
        const id = req.params.id;
        const part = db.parts.findOne({id: parseInt(id)});
        if(part) {
            res.send(part);
        } else {
            res.send({ errors: [ 'Could not find part with id \'' + id + '\'']});
        }
    });


    /**
     * @swagger
     * /parts:
     *   post:
     *     summary: Create a part
     *     description: Creates a new part using the parameters provided.
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *                  cost:
     *                      type: integer
     *                      required: true
     *                  partNumber: 
     *                      type: string
     *                      required: true
     *                  description:
     *                      type: string
     *                      required: true
     *                  name:
     *                      type: string
     *                      required: true
     *                  notes:
     *                      type: string
     *                  inStock:
     *                      type: integer
     *                  image:
     *                      type: object
     *                  isActive:
     *                      type: boolean
     *     responses:
     *       200:
     *         description: Returns a part if one exists with the specified ID.
     *         schema:
     *           type: object
     *           properties:
     *              id:
     *                  type: integer
     *              cost:
     *                  type: integer
     *              partNumber: 
     *                  type: string
     *              description:
     *                  type: string
     *              name:
     *                  type: string
     *              notes:
     *                  type: string
     *              inStock:
     *                  type: integer
     *              image:
     *                  type: object
     *              isActive:
     *                  type: boolean
     */
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
                cost: parseInt(req.body.cost),
                partNumber: req.body.partNumber,
                description: req.body.description,
                isActive: true,
                inStock: parseInt(req.body.inStock),
                image: req.body.image,
                name: req.body.name,
                notes: req.body.notes, };

            db.parts.save(part);
            res.send(part);
        }
    });

    /**
     * @swagger
     * /parts:
     *   put:
     *     summary: Update a part
     *     description: Updates a part matching the ID, using the parameters provided.
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *                  id:
     *                      type: integer
     *                      required: true
     *                  cost:
     *                      type: integer
     *                      required: true
     *                  partNumber: 
     *                      type: string
     *                      required: true
     *                  description:
     *                      type: string
     *                      required: true
     *                  name:
     *                      type: string
     *                      required: true
     *                  notes:
     *                      type: string
     *                  inStock:
     *                      type: integer
     *                  image:
     *                      type: object
     *                  isActive:
     *                      type: boolean
     *     responses:
     *       200:
     *         description: Returns a part if one exists with the specified ID.
     *         schema:
     *           type: object
     *           properties:
     *              id:
     *                  type: integer
     *              cost:
     *                  type: integer
     *              partNumber: 
     *                  type: string
     *              description:
     *                  type: string
     *              name:
     *                  type: string
     *              notes:
     *                  type: string
     *              inStock:
     *                  type: integer
     *              image:
     *                  type: object
     *              isActive:
     *                  type: boolean
     */
    app.put('/parts/:id', (req, res) => {
        const id = req.params.id;
        let part = null;
        let errors = [];
        if(!id) {
            errors.push('Id is required.');
        }   else {
            part = db.parts.findOne({id: parseInt(id)});
            if(!part) {
                errors.push('No part with id \'' + id + '\' exists');
                res.status(400).send({errors: errors});
            }
        }

        if(!req.body.name) {
            errors.push('Name is Required');
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
            part.cost = parseInt(req.body.cost);
            part.name = req.body.name;
            part.notes = req.body.notes;
            db.parts.update(query, part, options);
            res.send(part);
        }
    });

    /**
     * @swagger
     * /parts/{id}/receive:
     *   put:
     *     summary: Receive a part
     *     description: Receive a part matching the ID.
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *                  id:
     *                      type: integer
     *                      required: true
     *     responses:
     *       200:
     *         description: Returns the received part if one exists with the specified ID.
     *         schema:
     *           type: object
     *           properties:
     *              id:
     *                  type: integer
     *              cost:
     *                  type: integer
     *              partNumber: 
     *                  type: string
     *              description:
     *                  type: string
     *              name:
     *                  type: string
     *              notes:
     *                  type: string
     *              inStock:
     *                  type: integer
     *              image:
     *                  type: object
     *              isActive:
     *                  type: boolean
     */
    app.put('/parts/:id/receive', (req, res) => {
        const id = req.params.id;
        let part = null;
        let errors = [];
        let newStock = null;
        if(!id) {
            errors.push('Id is required.');
        }   else {
            part = db.parts.findOne({id: parseInt(id)});
            if(!part) {
                errors.push('No part with id \'' + id + '\' exists');
                res.status(400).send({errors: errors});
            }
        }

        if(!req.body.quantity) {
            errors.push('Quantity Is Required');
        } else {
            newStock = part.inStock + parseInt(req.body.quantity);
        }

        if(errors.length > 0) {
            res.status(400).send({errors: errors});
        } else {
            const query = {
                id: parseInt(id)
            };

            var options = {
                multi: false,
                upsert: false
             };

            db.parts.update(query, {inStock: newStock}, options);
            part.inStock = newStock;
            // Return full part with new in stock quantity
            res.send(part);
        }
    });

    /**
     * @swagger
     * /parts/{id}/consume:
     *   put:
     *     summary: Consume a part
     *     description: Consume a part matching the ID.
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *                  id:
     *                      type: integer
     *                      required: true
     *     responses:
     *       200:
     *         description: Returns the consumed part if one exists with the specified ID.
     *         schema:
     *           type: object
     *           properties:
     *              id:
     *                  type: integer
     *              cost:
     *                  type: integer
     *              partNumber: 
     *                  type: string
     *              description:
     *                  type: string
     *              name:
     *                  type: string
     *              notes:
     *                  type: string
     *              inStock:
     *                  type: integer
     *              image:
     *                  type: object
     *              isActive:
     *                  type: boolean
     */
    app.put('/parts/:id/consume', (req, res) => {
        const id = req.params.id;
        let part = null;
        let errors = [];
        let newStock = null;
        if(!id) {
            errors.push('Id is required.');
        }   else {
            part = db.parts.findOne({id: parseInt(id)});
            if(!part) {
                errors.push('No part with id \'' + id + '\' exists');
                res.status(400).send({errors: errors});
            }
        }

        if(!req.body.quantity) {
            errors.push('Quantity Is Required');
        } else {
            newStock = part.inStock - parseInt(req.body.quantity);
        }

        if(errors.length > 0) {
            res.status(400).send({errors: errors});
        } else {
            const query = {
                id: parseInt(id)
            };

            var options = {
                multi: false,
                upsert: false
             };

            db.parts.update(query, {inStock: newStock}, options);
            part.inStock = newStock;
            // Return full part with new in stock quantity
            res.send(part);
        }
    });
};
