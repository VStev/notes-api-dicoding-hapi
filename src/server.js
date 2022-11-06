// mainfile
const routes = require('./routes');
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = new Hapi.Server({
    port: 6969,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  server.route(routes);
  await server.start();
  console.log(`server started successfully ${server.info.uri}`);
};

init();
