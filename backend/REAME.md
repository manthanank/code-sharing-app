# Code Sharing Backend

This is the backend for the Code Sharing project. It is a node.js application that uses express.js to serve the API. Socket.io is used to provide real-time updates to the frontend.

## Installation

To install the backend, you need to have node.js installed. You can download it from [here](https://nodejs.org/).

After you have node.js installed, you can install the dependencies by running:

```bash
npm install
```

## Running the server

To run the server, you can use the following command:

```bash
npm start
```

This will start the server on port 3000. You can access the API at [http://localhost:3000](http://localhost:3000).

## API

The API provides the following endpoints:

- `GET /snippets`: Get a list of all snippets
- `POST /snippets`: Create a new snippet

## Real-time updates

The server uses socket.io to provide real-time updates to the frontend. When a new snippet is created or updated, the server will emit a `snippet` event with the new snippet data.

## License
