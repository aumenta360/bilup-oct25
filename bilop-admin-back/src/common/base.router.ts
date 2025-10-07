import * as http from 'http';
import * as url from 'url';

export class BaseRouter {
  protected routes: Map<string, Map<string, (req: http.IncomingMessage, res: http.ServerResponse, params?: any) => void>> = new Map();

  public addRoute(path: string, method: string, handler: (req: http.IncomingMessage, res: http.ServerResponse, params?: any) => void): void {
    if (!this.routes.has(path)) {
      this.routes.set(path, new Map());
    }
    this.routes.get(path)?.set(method, handler);
  }

  public handleRequest(req: http.IncomingMessage, res: http.ServerResponse): boolean {
    const parsedUrl = url.parse(req.url || '', true);
    const path = parsedUrl.pathname || '';
    const method = req.method || 'GET';

    // Buscar la ruta exacta
    let handler = this.routes.get(path)?.get(method);

    // Si no se encuentra la ruta exacta, buscar rutas con parámetros
    if (!handler) {
      for (const [routePath, methods] of this.routes.entries()) {
        const pattern = new RegExp('^' + routePath.replace(/:[^/]+/g, '([^/]+)') + '$');
        const match = path.match(pattern);
        
        if (match) {
          handler = methods.get(method);
          if (handler) {
            const params = {};
            const paramNames = routePath.match(/:[^/]+/g) || [];
            paramNames.forEach((param, index) => {
              params[param.slice(1)] = match[index + 1];
            });
            handler(req, res, params);
            return true;
          }
        }
      }
    }

    if (handler) {
      handler(req, res);
      return true;
    }

    return false;
  }

  public getRoutes(): Map<string, Map<string, (req: http.IncomingMessage, res: http.ServerResponse, params?: any) => void>> {
    return this.routes;
  }
} 