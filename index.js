const config = require('config');
const gateway = require('fast-gateway');
const jwt = require('jsonwebtoken');

const TARGET = config.get('target');

const getToken = (email, roles) => {
  return jwt.sign({
    external: true,
    form: {
      _id: config.get('userResourceId'),
    },
    project: {
      _id: config.get('projectId')
    },
    user: {
      _id: 'external',
      data: {
        email: email
      },
      roles: roles
    }
  }, config.get('jwtSecret'));
}

const server = gateway({
  routes: [{
    prefix: '/roleA',
    target: TARGET,
    middlewares: [
      (req, res, next) => {
        const token = getToken('roleA@example.com', [config.get('roleAId')]);
        req.headers['x-jwt-token'] = token;
        return next();
      }
    ]
  }, {
    prefix: '/roleB',
    target: TARGET,
    middlewares: [
      (req, res, next) => {
        const token = getToken('roleB@example.com', [config.get('roleBId')]);
        req.headers['x-jwt-token'] = token;
        return next();
      }
    ]
  }, {
    prefix: '/admin',
    target: TARGET,
    middlewares: [
      (req, res, next) => {
        const token = getToken('admin@example.com', [config.get('administratorRoleId')]);
        req.headers['x-jwt-token'] = token;
        return next();
      }
    ]
  }, {
    prefix: '/auth',
    target: TARGET,
    middlewares: [
      (req, res, next) => {
        const token = getToken('auth@example.com', [config.get('authenticatedRoleId')]);
        req.headers['x-jwt-token'] = token;
        return next();
      }
    ]
  }, {
    prefix: '/anon',
    target: TARGET,
    middlewares: [
      (req, res, next) => {
        const token = getToken('anon@example.com', [config.get('anonymousRoleId')]);
        req.headers['x-jwt-token'] = token;
        return next();
      }
    ]
  }
  ]
});

server.start(config.get('port'));
