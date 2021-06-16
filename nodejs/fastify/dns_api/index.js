let dns = require('dns');
const { Resolver } = require('dns');
const fastify = require('fastify')({ logger: true })

//check-alive
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.get('/dns_adv/:name', (request, reply) => {
  let reso = new Resolver();
  let name = request.params.name;
  let dns_server = request.query.dns_server;
  if (dns_server === undefined || dns_server === null) {
    reso.setServers(['8.8.8.8']);
  } else {
    reso.setServers([dns_server]);
  }
  reso.resolveAny(name, (err, addresses) => {
    if (err || addresses === undefined) {
      reply.code(404).header('Content-Type', 'application/text; charset=utf-8').send(err);
    } else {
      var i;
      for (i = 0; i < addresses.length; i++) {
        if (addresses[i].address === undefined) {
          addresses[i].address = addresses[i].value;
        }
      }
      reply.code(200).header('Content-Type', 'application/json; charset=utf-8').send(addresses);
    }
  });
})
fastify.get('/dns/:name', (request, reply) => {
  let name = request.params.name;
  dns.lookup(name, (err, address) => {
    if (err || addresses === undefined) {
      reply.code(404).header('Content-Type', 'application/text; charset=utf-8').send(err);
    } else {
      reply.code(200).header('Content-Type', 'application/text; charset=utf-8').send(address);
    }
  });
})

const start = async () => {
  try {
    await fastify.listen(8088)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()