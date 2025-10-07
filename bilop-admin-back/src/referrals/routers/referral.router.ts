import * as http from 'http';
import { BaseRouter } from '../../common/base.router';
import { ReferralController } from '../controllers/referral.controller';
import { FilterReferralDto } from '../dto/filter-referral.dto';
import { parse as parseUrl } from 'url';
import { parse as parseQuery } from 'querystring';

export class ReferralRouter extends BaseRouter {
  constructor(private referralController: ReferralController) {
    super();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Obtener todos los referidos
    this.addRoute('/api/referrals', 'GET', (req, res) => {
      const { query } = parseUrl(req.url || '', true);
      const filterDto: FilterReferralDto = {
        search: query.search as string,
        page: query.page ? parseInt(query.page as string) : undefined,
        limit: query.limit ? parseInt(query.limit as string) : undefined,
        status: query.status as any,
        referrerId: query.referrerId ? parseInt(query.referrerId as string) : undefined
      };

      this.referralController.findAll(filterDto)
        .then(result => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        })
        .catch(error => {
          res.writeHead(error.status || 500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });

    // Crear un nuevo referido
    this.addRoute('/api/referrals', 'POST', (req, res) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const data = JSON.parse(body);
        this.referralController.create(data)
          .then(result => {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          })
          .catch(error => {
            res.writeHead(error.status || 500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          });
      });
    });

    // Obtener un referido específico
    this.addRoute('/api/referrals/:id', 'GET', (req, res, params) => {
      this.referralController.findOne(parseInt(params.id))
        .then(result => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        })
        .catch(error => {
          res.writeHead(error.status || 500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });

    // Actualizar un referido
    this.addRoute('/api/referrals/:id', 'PATCH', (req, res, params) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const data = JSON.parse(body);
        this.referralController.update(parseInt(params.id), data)
          .then(result => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          })
          .catch(error => {
            res.writeHead(error.status || 500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          });
      });
    });

    // Eliminar un referido
    this.addRoute('/api/referrals/:id', 'DELETE', (req, res, params) => {
      this.referralController.remove(parseInt(params.id))
        .then(() => {
          res.writeHead(204);
          res.end();
        })
        .catch(error => {
          res.writeHead(error.status || 500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });

    // Obtener referidos por referidor
    this.addRoute('/api/referrals/referrer/:referrerId', 'GET', (req, res, params) => {
      const { query } = parseUrl(req.url || '', true);
      const filterDto: FilterReferralDto = {
        search: query.search as string,
        page: query.page ? parseInt(query.page as string) : undefined,
        limit: query.limit ? parseInt(query.limit as string) : undefined,
        status: query.status as any
      };

      this.referralController.findByReferrer(parseInt(params.referrerId), filterDto)
        .then(result => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        })
        .catch(error => {
          res.writeHead(error.status || 500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    });

    // Obtener referido por email
    this.addRoute('/api/referrals/email/:email', 'GET', (req, res, params) => {
      this.referralController.findByEmail(params.email)
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