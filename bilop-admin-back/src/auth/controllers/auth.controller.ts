import { Controller, Post, Body, UnauthorizedException, Headers } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      // console.log('Iniciando proceso de login con:', loginDto.email);
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      const result = await this.authService.login(user);
      // console.log('Login exitoso para:', loginDto.email);
      return result;
    } catch (error) {
      console.error('Error en login:', error.message);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.register(createUserDto);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader: string): Promise<void> {
    try {
      if (!authHeader) {
        throw new UnauthorizedException('No authorization token provided');
      }
      const token = authHeader.split(' ')[1];
      // Aquí podrías invalidar el token en una lista negra si lo deseas
      // Por ahora, simplemente retornamos éxito ya que el frontend se encarga de limpiar el token
      return Promise.resolve();
    } catch (error) {
      throw new UnauthorizedException('Error during logout');
    }
  }
} 