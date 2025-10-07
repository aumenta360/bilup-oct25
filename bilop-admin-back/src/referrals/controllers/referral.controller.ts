import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query,
  HttpStatus,
  HttpException,
  ParseIntPipe
} from '@nestjs/common';
import { ReferralService } from '../services/referral.service';
import { CreateReferralDto } from '../dto/create-referral.dto';
import { UpdateReferralDto } from '../dto/update-referral.dto';
import { FilterReferralDto } from '../dto/filter-referral.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users/entities/user.entity/user.entity';

@Controller('referrals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post()
  @Roles(Role.USER, Role.ADMIN)
  async create(@Body() createReferralDto: CreateReferralDto) {
    try {
      const referral = await this.referralService.create(createReferralDto);
      return {
        status: HttpStatus.CREATED,
        message: 'Referral created successfully',
        data: referral
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error creating referral',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() filterDto: FilterReferralDto) {
    try {
      const referrals = await this.referralService.findAll(filterDto);
      return {
        status: HttpStatus.OK,
        message: 'Referrals retrieved successfully',
        data: referrals
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error retrieving referrals',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const referral = await this.referralService.findOne(id);
      if (!referral) {
        throw new HttpException('Referral not found', HttpStatus.NOT_FOUND);
      }
      return {
        status: HttpStatus.OK,
        message: 'Referral retrieved successfully',
        data: referral
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error retrieving referral',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('referrer/:referrerId')
  @Roles(Role.USER, Role.ADMIN)
  async findByReferrer(
    @Param('referrerId', ParseIntPipe) referrerId: number,
    @Query() filterDto: FilterReferralDto
  ) {
    try {
      const referrals = await this.referralService.findByReferrer(referrerId, filterDto);
      return {
        status: HttpStatus.OK,
        message: 'Referrals retrieved successfully',
        data: referrals
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error retrieving referrals',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('email/:email')
  @Roles(Role.USER, Role.ADMIN)
  async findByEmail(@Param('email') email: string) {
    try {
      const referral = await this.referralService.findByEmail(email);
      if (!referral) {
        throw new HttpException('Referral not found', HttpStatus.NOT_FOUND);
      }
      return {
        status: HttpStatus.OK,
        message: 'Referral retrieved successfully',
        data: referral
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error retrieving referral',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReferralDto: UpdateReferralDto
  ) {
    try {
      const referral = await this.referralService.update(id, updateReferralDto);
      if (!referral) {
        throw new HttpException('Referral not found', HttpStatus.NOT_FOUND);
      }
      return {
        status: HttpStatus.OK,
        message: 'Referral updated successfully',
        data: referral
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating referral',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.referralService.remove(id);
      return {
        status: HttpStatus.OK,
        message: 'Referral deleted successfully'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error deleting referral',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 