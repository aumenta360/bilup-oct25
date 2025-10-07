import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards, Res, Query } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateShareLinkDto } from './dto/create-share-link.dto';
import { UpdateShareLinkDto } from './dto/update-share-link.dto';
import { Response } from 'express';
import * as QRCode from 'qrcode';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreatePushMessageDto } from './dto/create-push-message.dto';
import { UpdatePushMessageDto } from './dto/update-push-message.dto';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Post('programs')
  @UseGuards(AuthGuard('jwt'))
  async createProgram(@Body() createProgramDto: CreateProgramDto, @Req() req) {
    const userId = req.user.sub || req.user.id;
    const program = await this.loyaltyService.createProgram(createProgramDto, userId);
    return { data: program };
  }

  @Get('programs')
  @UseGuards(AuthGuard('jwt'))
  async getPrograms(@Req() req) {
    const userId = req.user.sub || req.user.id;
    const programs = await this.loyaltyService.getProgramsByUser(userId);
    return { data: programs };
  }

  @Get('programs/:id')
  @UseGuards(AuthGuard('jwt'))
  async getProgram(@Param('id') id: number, @Req() req) {
    const userId = req.user.sub || req.user.id;
    const program = await this.loyaltyService.getProgramById(id, userId);
    return { data: program };
  }

  @Patch('programs/:id')
  @UseGuards(AuthGuard('jwt'))
  updateProgram(@Param('id') id: number, @Body() programData: UpdateProgramDto, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.updateProgram(id, programData, userId);
  }

  @Delete('programs/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteProgram(@Param('id') id: number, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.deleteProgram(id, userId);
  }

  @Patch('programs/:id/status')
  @UseGuards(AuthGuard('jwt'))
  updateProgramStatus(@Param('id') id: number, @Body('active') active: boolean, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.updateProgramStatus(id, active, userId);
  }

  @Patch('programs/:id/design')
  @UseGuards(AuthGuard('jwt'))
  updateProgramDesign(
    @Param('id') id: number,
    @Body() designData: {
      primaryColor?: string;
      textColor?: string;
      secondaryColor?: string;
      stampImage?: string;
    },
    @Req() req
  ) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.updateProgramDesign(id, designData, userId);
  }

  @Get('programs/:id/stats')
  @UseGuards(AuthGuard('jwt'))
  getProgramStats(@Param('id') id: number) {
    return this.loyaltyService.getProgramStats(id);
  }

  // SHARE LINKS ENDPOINTS
  @Get('programs/:programId/share-links')
  @UseGuards(AuthGuard('jwt'))
  async getShareLinks(@Param('programId') programId: number, @Req() req) {
    const userId = req.user.sub || req.user.id;
    const links = await this.loyaltyService.getShareLinks(programId, userId);
    return { data: links };
  }

  @Post('programs/:programId/share-links')
  @UseGuards(AuthGuard('jwt'))
  createShareLink(@Param('programId') programId: number, @Body() dto: CreateShareLinkDto, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.createShareLink(programId, dto, userId);
  }

  @Patch('share-links/:linkId')
  @UseGuards(AuthGuard('jwt'))
  updateShareLink(@Param('linkId') linkId: number, @Body() dto: UpdateShareLinkDto, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.updateShareLink(linkId, dto, userId);
  }

  @Patch('share-links/:linkId/active')
  @UseGuards(AuthGuard('jwt'))
  toggleShareLinkActive(@Param('linkId') linkId: number, @Body('active') active: boolean, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.toggleShareLinkActive(linkId, active, userId);
  }

  @Delete('programs/:programId/share-links/:linkId')
  @UseGuards(AuthGuard('jwt'))
  deleteShareLink(@Param('programId') programId: number, @Param('linkId') linkId: number, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.deleteShareLink(programId, linkId, userId);
  }

  // ENDPOINT PÚBLICO: Redirección y registro de métricas
  @Get('r/:code')
  async redirectByCode(@Param('code') code: string, @Res() res: Response) {
    // Lógica: buscar enlace, registrar visita, redirigir o mostrar landing inactivo
    return this.loyaltyService.handleLinkRedirect(code, res);
  }

  // ENDPOINT: Obtener QR PNG
  @Get('share-links/:linkId/qr.png')
  async getShareLinkQrPng(@Param('linkId') linkId: number, @Res() res: Response) {
    return this.loyaltyService.getShareLinkQr(linkId, 'png', res);
  }

  // ENDPOINT: Obtener QR SVG
  @Get('share-links/:linkId/qr.svg')
  async getShareLinkQrSvg(@Param('linkId') linkId: number, @Res() res: Response) {
    return this.loyaltyService.getShareLinkQr(linkId, 'svg', res);
  }

  // CUSTOMERS ENDPOINTS
  @Get('programs/:programId/customers')
  @UseGuards(AuthGuard('jwt'))
  getCustomers(
    @Param('programId') programId: number,
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('month') month?: number,
    @Query('birthdays') birthdays?: boolean
  ) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.getCustomers(programId, userId, { page, limit, month, birthdays });
  }

  @Post('programs/:programId/customers')
  @UseGuards(AuthGuard('jwt'))
  createCustomer(@Param('programId') programId: number, @Body() dto: CreateCustomerDto, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.createCustomer(programId, dto, userId);
  }

  @Patch('customers/:customerId')
  @UseGuards(AuthGuard('jwt'))
  updateCustomer(@Param('customerId') customerId: number, @Body() dto: UpdateCustomerDto, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.updateCustomer(customerId, dto, userId);
  }

  @Delete('customers/:customerId')
  @UseGuards(AuthGuard('jwt'))
  deleteCustomer(@Param('customerId') customerId: number, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.deleteCustomer(customerId, userId);
  }

  @Patch('customers/:customerId/stamps')
  @UseGuards(AuthGuard('jwt'))
  adjustCustomerStamps(@Param('customerId') customerId: number, @Body('delta') delta: number, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.adjustCustomerStamps(customerId, delta, userId);
  }

  // PUSH MESSAGES ENDPOINTS
  @Get('programs/:programId/push-messages')
  @UseGuards(AuthGuard('jwt'))
  getPushMessages(@Param('programId') programId: number, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.getPushMessages(programId, userId).then(data => ({ data }));
  }

  @Post('programs/:programId/push-messages')
  @UseGuards(AuthGuard('jwt'))
  createPushMessage(@Param('programId') programId: number, @Body() dto: CreatePushMessageDto, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.createPushMessage(programId, dto, userId);
  }

  @Patch('push-messages/:messageId')
  @UseGuards(AuthGuard('jwt'))
  updatePushMessage(@Param('messageId') messageId: number, @Body() dto: UpdatePushMessageDto, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.updatePushMessage(messageId, dto, userId);
  }

  @Delete('programs/:programId/push-messages/:messageId')
  @UseGuards(AuthGuard('jwt'))
  deletePushMessage(@Param('programId') programId: number, @Param('messageId') messageId: number, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.deletePushMessage(programId, messageId, userId);
  }

  @Post('push-messages/:messageId/send')
  @UseGuards(AuthGuard('jwt'))
  sendPushMessage(@Param('messageId') messageId: number, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.sendPushMessage(messageId, userId);
  }

  @Post('push-messages/:messageId/duplicate')
  @UseGuards(AuthGuard('jwt'))
  duplicatePushMessage(@Param('messageId') messageId: number, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.duplicatePushMessage(messageId, userId);
  }

  @Get('push-messages/:messageId/history')
  @UseGuards(AuthGuard('jwt'))
  getPushMessageHistory(@Param('messageId') messageId: number, @Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.loyaltyService.getPushMessageHistory(messageId, userId);
  }

  // REWARDS ENDPOINTS
  @Get('programs/:programId/rewards')
  @UseGuards(AuthGuard('jwt'))
  async getRewards(@Param('programId') programId: number, @Req() req) {
    const userId = req.user.sub || req.user.id;
    const rewards = await this.loyaltyService.getRewards(programId, userId);
    return { data: rewards };
  }

  @Post('programs/:programId/rewards')
  @UseGuards(AuthGuard('jwt'))
  async createReward(@Param('programId') programId: number, @Body() dto: CreateRewardDto, @Req() req) {
    const userId = req.user.sub || req.user.id;
    const reward = await this.loyaltyService.createReward(programId, dto, userId);
    return { data: reward };
  }

  @Patch('programs/:programId/rewards/:rewardId')
  @UseGuards(AuthGuard('jwt'))
  async updateReward(
    @Param('programId') programId: number,
    @Param('rewardId') rewardId: number,
    @Body() dto: UpdateRewardDto,
    @Req() req
  ) {
    const userId = req.user.sub || req.user.id;
    const reward = await this.loyaltyService.updateReward(programId, rewardId, dto, userId);
    return { data: reward };
  }

  @Delete('programs/:programId/rewards/:rewardId')
  @UseGuards(AuthGuard('jwt'))
  async deleteReward(
    @Param('programId') programId: number,
    @Param('rewardId') rewardId: number,
    @Req() req
  ) {
    const userId = req.user.sub || req.user.id;
    await this.loyaltyService.deleteReward(programId, rewardId, userId);
    return { message: 'Reward deleted' };
  }
} 