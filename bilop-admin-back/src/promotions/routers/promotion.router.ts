import * as http from 'http';
import { BaseRouter } from '../../common/base.router';
import { PromotionController } from '../controllers/promotion.controller';

export class PromotionRouter extends BaseRouter {
  constructor(private promotionController: PromotionController) {
    super();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Obtener todas las promociones
    this.addRoute('/api/promotions', 'GET', (req, res) => {
      this.promotionController.findAll()
        .then(result => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });

    // Crear una nueva promoción
    this.addRoute('/api/promotions', 'POST', (req, res) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const data = JSON.parse(body);
        this.promotionController.create(data)
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

    // Obtener una promoción específica
    this.addRoute('/api/promotions/:id', 'GET', (req, res, params) => {
      this.promotionController.findOne(params.id)
        .then(result => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });

    // Actualizar una promoción
    this.addRoute('/api/promotions/:id', 'PATCH', (req, res, params) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const data = JSON.parse(body);
        this.promotionController.update(params.id, data)
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

    // Eliminar una promoción
    this.addRoute('/api/promotions/:id', 'DELETE', (req, res, params) => {
      this.promotionController.remove(params.id)
        .then(() => {
          res.writeHead(204);
          res.end();
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });

    // Obtener promociones activas
    this.addRoute('/api/promotions/active', 'GET', (req, res) => {
      this.promotionController.findActive()
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