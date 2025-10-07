import * as http from 'http';
import { BaseRouter } from '../../common/base.router';
import { UserController } from '../controllers/user.controller';

export class UserRouter extends BaseRouter {
  constructor(private userController: UserController) {
    super();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Ruta pública para registro de usuarios
    this.addRoute('/api/auth/register', 'POST', (req, res) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          this.userController.create({
            ...data,
            role: 'user' // Asignar rol por defecto
          })
            .then(result => {
              // Eliminar la contraseña de la respuesta
              const { password, ...userWithoutPassword } = result;
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(userWithoutPassword));
            })
            .catch(error => {
              const statusCode = error.message.includes('already exists') ? 409 : 400;
              res.writeHead(statusCode, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: error.message }));
            });
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid request body' }));
        }
      });
    });

    // Rutas protegidas que requieren autenticación
    this.addRoute('/api/users', 'GET', (req, res) => {
      this.userController.findAll()
        .then(result => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });

    // Crear un nuevo usuario (ruta protegida para admins)
    this.addRoute('/api/users', 'POST', (req, res) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const data = JSON.parse(body);
        this.userController.create(data)
          .then(result => {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          })
          .catch(error => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          });
      });
    });

    // Obtener un usuario específico
    this.addRoute('/api/users/:id', 'GET', (req, res, params) => {
      this.userController.findOne(params.id)
        .then(result => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });

    // Actualizar un usuario
    this.addRoute('/api/users/:id', 'PATCH', (req, res, params) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const data = JSON.parse(body);
        this.userController.update(params.id, data)
          .then(result => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          })
          .catch(error => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          });
      });
    });

    // Eliminar un usuario
    this.addRoute('/api/users/:id', 'DELETE', (req, res, params) => {
      this.userController.remove(params.id)
        .then(() => {
          res.writeHead(204);
          res.end();
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });
  }
} 