# Partmonger simple API

Partmonger API is a simple API writting using Node.js and Express. The intent is to allow a developer to get a simple inventory api up and running
quickly with minimal setup.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.


### Prerequisites

Node.js

NPM or Yarn

### Installation
Via yarn:

```
yarn install 
```

Via npm:
```
npm install
```

### Starting the API

Via yarn:

```
yarn start
```

Via npm:

```
npm start
```

You should now see that the server is live and listening on port 9001. You can test that it is working by opening the below URL in a browser.

```
http://localhost:9001/parts
```

### Calling the API

A tool such as postman is recommended to test API Calls.

Create a Part

```
POST /parts HTTP/1.1
Host: localhost:9001
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: fb4ded7b-6fe6-1310-c23e-8760d8db38ea

{
	"partNumber": "12345",
	"name": "Test Part Number",
	"description": "Description goes here.",
	"cost": 1.00,
	"image": "http://localhost:9001/images/myimage.jpg"
}
```

Get All Parts

```
GET /parts HTTP/1.1
Host: localhost:9001
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 76855dc7-0fa6-6395-311c-a0a9c179d7a1
```

Get a Single Part

```
GET /parts/1 HTTP/1.1
Host: localhost:9001
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: ef791439-a1b9-b580-5b1d-7a592851c119
```


Update a Part

```
PUT /parts/1 HTTP/1.1
Host: localhost:9001
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: cee4b798-bd4e-5c69-08a2-4013d3e0486c

{
	"partNumber": "12345",
	"name": "Test Part Number",
	"description": "Description goes here.",
	"cost": 1.00,
	"image": "http://localhost:9001/images/myimage.jpg"
}
```

(Soft) Delete a Part

```
DELETE /parts/2 HTTP/1.1
Host: localhost:9001
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: a7442291-b83b-533a-307f-aef7cf9ea61d


```

Receive a part

```
PUT /parts/1/receive HTTP/1.1
Host: localhost:9001
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 4422fa41-32ac-cac9-1906-159f80564dd4

{
	"quantity": 1
}
```

Consume a part

```
PUT /parts/1/consume HTTP/1.1
Host: localhost:9001
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 9b4e5abc-588a-436e-fe09-689381215217

{
	"quantity": 1
}
```

## Running the tests

Coming Soon.

### And coding style tests

Coming soon.

## Deployment

Why?

## Built With

* [Express](https://expressjs.com/) - Web framework for Node.js

## Authors

* **Patrick Davis** - *Initial work* - [ThePatrickDavis](https://github.com/ThePatrickDavis)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
