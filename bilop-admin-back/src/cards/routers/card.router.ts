import * as http from 'http';
import { BaseRouter } from '../../common/base.router';
import { CardController } from '../controllers/card.controller';

export class CardRouter extends BaseRouter {
  constructor(private cardController: CardController) {
    super();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Obtener todas las tarjetas
    this.addRoute('/api/cards', 'GET', (req, res) => {
      this.cardController.findAll()
        .then(result => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });

    // Crear una nueva tarjeta
    this.addRoute('/api/cards', 'POST', (req, res) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const data = JSON.parse(body);
        this.cardController.create(data)
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

    // Obtener una tarjeta específica
    this.addRoute('/api/cards/:id', 'GET', (req, res, params) => {
      this.cardController.findOne(params.id)
        .then(result => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });

    // Actualizar una tarjeta
    this.addRoute('/api/cards/:id', 'PATCH', (req, res, params) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const data = JSON.parse(body);
        this.cardController.update(params.id, data)
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

    // Eliminar una tarjeta
    this.addRoute('/api/cards/:id', 'DELETE', (req, res, params) => {
      this.cardController.remove(params.id)
        .then(() => {
          res.writeHead(204);
          res.end();
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });

    // Obtener tarjetas por usuario
    this.addRoute('/api/cards/user/:userId', 'GET', (req, res, params) => {
      this.cardController.findByUser(params.userId)
        .then(result => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });
  }
} 