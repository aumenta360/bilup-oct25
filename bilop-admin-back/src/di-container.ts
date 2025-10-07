// Contenedor de inyección de dependencias
export class DIContainer {
  private static instance: DIContainer;
  private providers: Map<string, any> = new Map();

  private constructor() {
    // Inicialización privada
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  public register<T>(token: string, provider: T): void {
    this.providers.set(token, provider);
  }

  public get<T>(token: string): T {
    const provider = this.providers.get(token);
    if (!provider) {
      throw new Error(`Provider not found for token: ${token}`);
    }
    return provider as T;
  }

  public has(token: string): boolean {
    return this.providers.has(token);
  }
} 