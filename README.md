# Mapyard
A full-stack web application that allows you to draw maps on the web and save them in the cloud. 

Register for an account and create a new map. Then, use the tools to add roads and buildings to map out the area you want. You can move things by dragging them and select things by clicking on them. After selecting something, you can edit its properties. You can rename the map by clicking its name in the build menu. Save the map by clicking the save button.

## Technologies
- MERN (Mongo, Express, React, Node)
- HTML, CSS (Tailwind), JavaScript (TypeScript)

## Usage

### Development
1. Setup environment (i.e. `.env`):
```
MONGO_CONN_STRING: MongoDB connection string
PORT: the port to run the server on
SESSION_SECRET: the secret used for Express sessions
```

2. Install the packages for both client and server.
```
npm install
```

3. Run the Vite frontend development server and the Express backend.
```
npm run dev
```
