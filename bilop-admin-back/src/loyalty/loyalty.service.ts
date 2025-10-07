import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreatePushMessageDto } from './dto/create-push-message.dto';
import { CreateShareLinkDto } from './dto/create-share-link.dto';
import { Customer } from './entities/customer.entity';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan } from 'typeorm';
import { Not } from 'typeorm';
import { Program } from './entities/program.entity';
import { PushMessage, PushMessageSend } from './entities/push-message.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { ShareLink } from './entities/share-link.entity';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { UpdatePushMessageDto } from './dto/update-push-message.dto';
import { UpdateShareLinkDto } from './dto/update-share-link.dto';
import { User } from '../users/entities/user.entity/user.entity';
import * as QRCode from 'qrcode';
import { CriticalAction } from './entities/critical-action.entity';
import { IsNull } from 'typeorm';
import { Reward } from './entities/reward.entity';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class LoyaltyService {
  constructor(
    @InjectRepository(Program)
    private programRepository: Repository<Program>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ShareLink)
    private shareLinkRepository: Repository<ShareLink>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(PushMessage)
    private pushMessageRepository: Repository<PushMessage>,
    @InjectRepository(PushMessageSend)
    private pushMessageSendRepository: Repository<PushMessageSend>,
    @InjectRepository(CriticalAction)
    private criticalActionRepository: Repository<CriticalAction>,
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
  ) {}

  async createProgram(programData: CreateProgramDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const existingProgram = await this.programRepository.findOne({ where: { name: programData.name, user: { id: userId }, deletedAt: IsNull() } });
    if (existingProgram) throw new BadRequestException('Ya existe un programa con este nombre');
    const program = this.programRepository.create({ ...programData, user });
    return this.programRepository.save(program);
  }

  async getPrograms() {
    const programs = await this.programRepository.find();
    return { data: programs };
  }

  async getProgramById(id: number, userId: number) {
    const program = await this.programRepository.findOne({
      where: { id, user: { id: userId }, deletedAt: IsNull() },
      relations: ['user']
    });
    if (!program) {
      throw new NotFoundException('Programa no encontrado o eliminado');
    }
    return program;
  }

  async updateProgram(id: number, programData: UpdateProgramDto, userId: number) {
    const program = await this.getProgramById(id, userId);

    // Si se está actualizando el nombre, validar unicidad
    if (programData.name && programData.name !== program.name) {
      const existingProgram = await this.programRepository.findOne({
        where: { 
          name: programData.name, 
          user: { id: program.user.id },
          id: Not(id)
        }
      });

      if (existingProgram) {
        throw new BadRequestException('Ya existe un programa con este nombre');
      }
    }

    Object.assign(program, programData);
    return this.programRepository.save(program);
  }

  async deleteProgram(id: number, userId: number) {
    const program = await this.getProgramById(id, userId);
    const result = await this.programRepository.softRemove(program);
    // Registrar acción crítica
    await this.criticalActionRepository.save({
      user: { id: userId },
      program: { id },
      actionType: 'soft_delete',
      details: null,
    });
    return result;
  }

  async updateProgramStatus(id: number, active: boolean, userId: number) {
    const program = await this.getProgramById(id, userId);
    program.active = active;
    return this.programRepository.save(program);
  }

  async updateProgramDesign(
    id: number,
    designData: {
      primaryColor?: string;
      textColor?: string;
      secondaryColor?: string;
      stampImage?: string;
    },
    userId: number
  ) {
    const program = await this.getProgramById(id, userId);
    Object.assign(program, designData);
    return this.programRepository.save(program);
  }

  async getProgramStats(id: number) {
    const program = await this.getProgramById(id, 0);
    return {
      totalCustomers: program.totalCustomers,
      totalPoints: program.totalPoints,
      totalRedemptions: program.totalRedemptions,
      active: program.active,
      createdAt: program.createdAt,
      updatedAt: program.updatedAt
    };
  }

  async getProgramsByUser(userId: number) {
    const programs = await this.programRepository.find({
      where: { user: { id: userId }, deletedAt: IsNull() },
      order: { createdAt: 'DESC' }
    });
    return programs;
  }

  // SHARE LINKS SERVICE METHODS
  async getShareLinks(programId: number, userId: number) {
    const program = await this.programRepository.findOne({ where: { id: programId, user: { id: userId }, deletedAt: IsNull() } });
    if (!program) throw new NotFoundException('Programa no encontrado o eliminado');
    const links = await this.shareLinkRepository.find({ where: { program: { id: programId }, deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
    return links;
  }

  async createShareLink(programId: number, dto: CreateShareLinkDto, userId: number) {
    const program = await this.programRepository.findOne({ where: { id: programId, user: { id: userId }, deletedAt: IsNull() }, relations: ['shareLinks'] });
    if (!program) throw new NotFoundException('Programa no encontrado o eliminado');
    if (program.shareLinks && program.shareLinks.length >= 50) throw new BadRequestException('Has alcanzado el máximo de 50 enlaces para este programa');
    if (program.shareLinks && program.shareLinks.some(l => l.name.toLowerCase() === dto.name.trim().toLowerCase())) throw new BadRequestException('Ya existe un enlace con ese nombre');
    // Generar código único
    let code;
    do {
      code = Math.random().toString(36).substring(2, 10);
    } while (await this.shareLinkRepository.findOne({ where: { code } }));
    const shareLink = this.shareLinkRepository.create({
      name: dto.name.trim(),
      code,
      active: true,
      visits: 0,
      registrations: 0,
      actions: 0,
      program,
      createdBy: userId,
    });
    return this.shareLinkRepository.save(shareLink);
  }

  async updateShareLink(linkId: number, dto: UpdateShareLinkDto, userId: number) {
    const link = await this.shareLinkRepository.findOne({ where: { id: linkId }, relations: ['program'] });
    if (!link) throw new NotFoundException('Enlace no encontrado');
    if (link.program.user.id !== userId) throw new BadRequestException('No autorizado');
    if (dto.name && dto.name.trim() !== link.name) {
      const exists = await this.shareLinkRepository.findOne({ where: { name: dto.name.trim(), program: { id: link.program.id } } });
      if (exists && exists.id !== link.id) throw new BadRequestException('Ya existe un enlace con ese nombre');
    }
    Object.assign(link, dto);
    return this.shareLinkRepository.save(link);
  }

  async toggleShareLinkActive(linkId: number, active: boolean, userId: number) {
    const link = await this.shareLinkRepository.findOne({ where: { id: linkId }, relations: ['program'] });
    if (!link) throw new NotFoundException('Enlace no encontrado');
    if (link.program.user.id !== userId) throw new BadRequestException('No autorizado');
    link.active = active;
    return this.shareLinkRepository.save(link);
  }

  async deleteShareLink(programId: number, linkId: number, userId: number) {
    const link = await this.shareLinkRepository.findOne({ where: { id: linkId, program: { id: programId } }, relations: ['program', 'program.user'] });
    if (!link) {
      throw new NotFoundException('Enlace no encontrado');
    }
    if (link.program.user.id !== userId) {
      throw new BadRequestException('No autorizado');
    }
    const result = await this.shareLinkRepository.softRemove(link);
    return result;
  }

  async handleLinkRedirect(code: string, res: Response) {
    const link = await this.shareLinkRepository.findOne({ where: { code }, relations: ['program'] });
    if (!link) return res.status(404).send('Enlace no encontrado');
    if (!link.active) {
      // Mostrar landing de enlace desactivado
      return res.status(200).send('<h1>Enlace desactivado</h1><p>Este enlace ya no está disponible.</p>');
    }
    // Registrar visita
    link.visits += 1;
    await this.shareLinkRepository.save(link);
    // Redirigir a la URL del programa o landing (ajusta según tu lógica)
    return res.redirect(`https://bilup.com/program/${link.program.id}`);
  }

  async getShareLinkQr(linkId: number, format: 'png' | 'svg', res: Response) {
    const link = await this.shareLinkRepository.findOne({ where: { id: linkId } });
    if (!link) return res.status(404).send('Enlace no encontrado');
    const url = `https://bilup.com/r/${link.code}`;
    if (format === 'png') {
      res.setHeader('Content-Type', 'image/png');
      return QRCode.toFileStream(res, url, { type: 'png', width: 512, margin: 1 });
    } else {
      res.setHeader('Content-Type', 'image/svg+xml');
      const svg = await QRCode.toString(url, { type: 'svg', width: 512, margin: 1 });
      return res.send(svg);
    }
  }

  // CUSTOMERS SERVICE METHODS
  async getCustomers(programId: number, userId: number, { page = 1, limit = 10, month, birthdays }: any) {
    const program = await this.programRepository.findOne({ where: { id: programId, user: { id: userId }, deletedAt: IsNull() } });
    if (!program) throw new NotFoundException('Programa no encontrado o eliminado');
    const qb = this.customerRepository.createQueryBuilder('customer')
      .where('customer.programId = :programId', { programId })
      .andWhere('customer.deletedAt IS NULL');
    if (month) {
      qb.andWhere('EXTRACT(MONTH FROM customer.birthdate) = :month', { month });
    }
    if (birthdays) {
      const today = new Date();
      const next30 = new Date();
      next30.setDate(today.getDate() + 30);
      qb.andWhere('customer.birthdate IS NOT NULL')
        .andWhere(`
          (EXTRACT(MONTH FROM customer.birthdate) = :month1 AND EXTRACT(DAY FROM customer.birthdate) >= :day1)
          OR (EXTRACT(MONTH FROM customer.birthdate) = :month2 AND EXTRACT(DAY FROM customer.birthdate) <= :day2)
        `, {
          month1: today.getMonth() + 1,
          day1: today.getDate(),
          month2: next30.getMonth() + 1,
          day2: next30.getDate(),
        });
    }
    qb.orderBy('customer.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async createCustomer(programId: number, dto: CreateCustomerDto, userId: number) {
    const program = await this.programRepository.findOne({ where: { id: programId, user: { id: userId }, deletedAt: IsNull() }, relations: ['customers'] });
    if (!program) throw new NotFoundException('Programa no encontrado o eliminado');
    if (program.customers && program.customers.some(c => c.email === dto.email)) throw new BadRequestException('Este correo ya está registrado');
    if (program.customers && program.customers.some(c => c.phone === dto.phone)) throw new BadRequestException('Este teléfono ya está registrado');
    const customer = this.customerRepository.create({ ...dto, program });
    return this.customerRepository.save(customer);
  }

  async updateCustomer(customerId: number, dto: UpdateCustomerDto, userId: number) {
    const customer = await this.customerRepository.findOne({ where: { id: customerId }, relations: ['program'] });
    if (!customer) throw new NotFoundException('Cliente no encontrado');
    if (customer.program.user.id !== userId) throw new BadRequestException('No autorizado');
    if (dto.email && dto.email !== customer.email) {
      const exists = await this.customerRepository.findOne({ where: { email: dto.email, program: { id: customer.program.id } } });
      if (exists && exists.id !== customer.id) throw new BadRequestException('Este correo ya está registrado');
    }
    if (dto.phone && dto.phone !== customer.phone) {
      const exists = await this.customerRepository.findOne({ where: { phone: dto.phone, program: { id: customer.program.id } } });
      if (exists && exists.id !== customer.id) throw new BadRequestException('Este teléfono ya está registrado');
    }
    Object.assign(customer, dto);
    return this.customerRepository.save(customer);
  }

  async deleteCustomer(customerId: number, userId: number) {
    const customer = await this.customerRepository.findOne({ where: { id: customerId }, relations: ['program'] });
    if (!customer) throw new NotFoundException('Cliente no encontrado');
    if (customer.program.user.id !== userId) throw new BadRequestException('No autorizado');
    return this.customerRepository.softRemove(customer);
  }

  async adjustCustomerStamps(customerId: number, delta: number, userId: number) {
    const customer = await this.customerRepository.findOne({ where: { id: customerId }, relations: ['program'] });
    if (!customer) throw new NotFoundException('Cliente no encontrado');
    if (customer.program.user.id !== userId) throw new BadRequestException('No autorizado');
    customer.stamps = Math.max(0, (customer.stamps || 0) + delta);
    return this.customerRepository.save(customer);
  }

  // PUSH MESSAGES SERVICE METHODS
  async getPushMessages(programId: number, userId: number) {
    const program = await this.programRepository.findOne({ where: { id: programId, user: { id: userId }, deletedAt: IsNull() } });
    if (!program) throw new NotFoundException('Programa no encontrado o eliminado');
    return this.pushMessageRepository.find({ where: { program: { id: programId }, deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
  }

  async createPushMessage(programId: number, dto: CreatePushMessageDto, userId: number) {
    const program = await this.programRepository.findOne({ where: { id: programId, user: { id: userId }, deletedAt: IsNull() }, relations: ['pushMessages'] });
    if (!program) throw new NotFoundException('Programa no encontrado o eliminado');
    if (program.pushMessages && program.pushMessages.length >= 20) throw new BadRequestException('Límite de 20 mensajes alcanzado');
    if (!dto.title || !dto.message) throw new BadRequestException('Título y mensaje son obligatorios');
    if (dto.scheduledAt) {
      const now = new Date();
      const scheduled = new Date(dto.scheduledAt);
      if (scheduled.getTime() - now.getTime() > 30 * 24 * 60 * 60 * 1000) throw new BadRequestException('Sólo se puede programar hasta 30 días');
    }
    // Asegurar que origins sea siempre un array
    if (dto.origins && !Array.isArray(dto.origins)) {
      dto.origins = [dto.origins];
    }
    const pushMessage = this.pushMessageRepository.create({
      ...dto,
      status: dto.scheduledAt ? 'scheduled' : 'draft',
      program,
    });
    return this.pushMessageRepository.save(pushMessage);
  }

  async updatePushMessage(messageId: number, dto: UpdatePushMessageDto, userId: number) {
    const message = await this.pushMessageRepository.findOne({ where: { id: messageId }, relations: ['program'] });
    if (!message) throw new NotFoundException('Mensaje no encontrado');
    if (message.program.user.id !== userId) throw new BadRequestException('No autorizado');
    if (message.status !== 'draft') throw new BadRequestException('Sólo se puede editar mensajes en estado Borrador');
    if (dto.scheduledAt) {
      const now = new Date();
      const scheduled = new Date(dto.scheduledAt);
      if (scheduled.getTime() - now.getTime() > 30 * 24 * 60 * 60 * 1000) throw new BadRequestException('Sólo se puede programar hasta 30 días');
    }
    // Asegurar que origins sea siempre un array
    if (dto.origins && !Array.isArray(dto.origins)) {
      dto.origins = [dto.origins];
    }
    Object.assign(message, dto);
    return this.pushMessageRepository.save(message);
  }

  async deletePushMessage(programId: number, messageId: number, userId: number) {
    const message = await this.pushMessageRepository.findOne({ where: { id: messageId, program: { id: programId } }, relations: ['program', 'program.user'] });
    if (!message) throw new NotFoundException('Mensaje no encontrado');
    if (message.program.user.id !== userId) throw new BadRequestException('No autorizado');
    return this.pushMessageRepository.softRemove(message);
  }

  async sendPushMessage(messageId: number, userId: number) {
    const message = await this.pushMessageRepository.findOne({ where: { id: messageId }, relations: ['program', 'program.customers'] });
    if (!message) throw new NotFoundException('Mensaje no encontrado');
    if (message.program.user.id !== userId) throw new BadRequestException('No autorizado');
    if (message.status !== 'draft' && message.status !== 'scheduled') throw new BadRequestException('Sólo se puede enviar mensajes en estado Borrador o Programado');
    // Filtros: origen y sellos exactos
    let customers = message.program.customers || [];
    if (message.origins && message.origins.length && !message.origins.includes('Todos')) {
      customers = customers.filter(c => c.origin && message.origins.includes(c.origin));
    }
    if (message.exactStamps && message.exactStamps > 0) {
      customers = customers.filter(c => c.stamps === message.exactStamps);
    }
    // Anti-spam: 1 push cada 24h por cliente
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    for (const customer of customers) {
      const lastSend = await this.pushMessageSendRepository.findOne({
        where: { customerEmail: customer.email, sentAt: MoreThan(last24h) },
        order: { sentAt: 'DESC' }
      });
      if (lastSend) {
        // Registrar salto anti-spam
        await this.pushMessageSendRepository.save(this.pushMessageSendRepository.create({
          pushMessage: message,
          customerEmail: customer.email,
          sentAt: now,
          status: 'error',
          errorMessage: 'Saltado – límite 24 h',
        }));
        continue;
      }
      // Simular envío push (aquí deberías integrar con tu proveedor real)
      await this.pushMessageSendRepository.save(this.pushMessageSendRepository.create({
        pushMessage: message,
        customerEmail: customer.email,
        sentAt: now,
        status: 'sent',
      }));
    }
    message.status = 'sent';
    return this.pushMessageRepository.save(message);
  }

  async duplicatePushMessage(messageId: number, userId: number) {
    const message = await this.pushMessageRepository.findOne({ where: { id: messageId }, relations: ['program'] });
    if (!message) throw new NotFoundException('Mensaje no encontrado');
    if (message.program.user.id !== userId) throw new BadRequestException('No autorizado');
    const { id, createdAt, updatedAt, scheduledAt, ...rest } = message;
    const copy = this.pushMessageRepository.create({
      ...rest,
      status: 'draft',
    });
    return this.pushMessageRepository.save(copy);
  }

  async getPushMessageHistory(messageId: number, userId: number) {
    const message = await this.pushMessageRepository.findOne({ where: { id: messageId }, relations: ['program'] });
    if (!message) throw new NotFoundException('Mensaje no encontrado');
    if (message.program.user.id !== userId) throw new BadRequestException('No autorizado');
    return this.pushMessageSendRepository.find({ where: { pushMessage: { id: messageId } }, order: { sentAt: 'DESC' } });
  }

  // Obtener rewards de un programa (solo si el usuario es dueño)
  async getRewards(programId: number, userId: number) {
    const program = await this.programRepository.findOne({ where: { id: programId, user: { id: userId } } });
    if (!program) throw new NotFoundException('Programa no encontrado o no autorizado');
    return this.rewardRepository.find({ where: { program: { id: programId } }, order: { createdAt: 'DESC' } });
  }

  // Crear reward para un programa
  async createReward(programId: number, dto: CreateRewardDto, userId: number) {
    const program = await this.programRepository.findOne({ where: { id: programId, user: { id: userId } }, relations: ['rewards'] });
    if (!program) throw new NotFoundException('Programa no encontrado o no autorizado');
    // Validaciones básicas (máximo 20, unicidad, etc.)
    if (program.rewards.length >= 20) throw new BadRequestException('Máximo 20 recompensas por programa');
    if (program.rewards.some(r => r.title.toLowerCase() === dto.title.toLowerCase())) throw new BadRequestException('Ya existe una recompensa con ese título');
    if (dto.requiredStamps > program.requiredStamps) throw new BadRequestException('Las estampillas requeridas no pueden exceder el total del programa');
    // Al crear la reward, solo asigna redemptionNote si es un objeto válido
    const rewardData: any = { ...dto, program };
    if (typeof dto.redemptionNote === 'string') {
      // Ignorar redemptionNote si es string (o puedes parsear si lo necesitas)
      delete rewardData.redemptionNote;
    }
    const reward = this.rewardRepository.create(rewardData);
    return this.rewardRepository.save(reward);
  }

  // Actualizar reward
  async updateReward(programId: number, rewardId: number, dto: UpdateRewardDto, userId: number) {
    const program = await this.programRepository.findOne({ where: { id: programId, user: { id: userId } } });
    if (!program) throw new NotFoundException('Programa no encontrado o no autorizado');
    const reward = await this.rewardRepository.findOne({ where: { id: rewardId, program: { id: programId } } });
    if (!reward) throw new NotFoundException('Recompensa no encontrada');
    // Validar unicidad de título si se actualiza
    if (dto.title) {
      const exists = await this.rewardRepository.findOne({ where: { program: { id: programId }, title: dto.title, id: Not(rewardId) } });
      if (exists) throw new BadRequestException('Ya existe una recompensa con ese título');
    }
    // Validar requiredStamps si se actualiza
    if (dto.requiredStamps && dto.requiredStamps > program.requiredStamps) throw new BadRequestException('Las estampillas requeridas no pueden exceder el total del programa');
    Object.assign(reward, dto);
    return this.rewardRepository.save(reward);
  }

  // Eliminar reward
  async deleteReward(programId: number, rewardId: number, userId: number) {
    const program = await this.programRepository.findOne({ where: { id: programId, user: { id: userId } } });
    if (!program) throw new NotFoundException('Programa no encontrado o no autorizado');
    const reward = await this.rewardRepository.findOne({ where: { id: rewardId, program: { id: programId } } });
    if (!reward) throw new NotFoundException('Recompensa no encontrada');
    await this.rewardRepository.softDelete(rewardId);
  }
} 