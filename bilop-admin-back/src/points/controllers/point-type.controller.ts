import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PointTypeService } from '../services/point-type.service';
import { CreatePointTypeDto } from '../dto/create-point-type.dto';
import { UpdatePointTypeDto } from '../dto/update-point-type.dto';

@Controller('point-types')
export class PointTypeController {
  constructor(private readonly pointTypeService: PointTypeService) {}

  @Post()
  create(@Body() createPointTypeDto: CreatePointTypeDto) {
    return this.pointTypeService.create(createPointTypeDto);
  }

  @Get()
  findAll() {
    return this.pointTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePointTypeDto: UpdatePointTypeDto) {
    return this.pointTypeService.update(+id, updatePointTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointTypeService.remove(+id);
  }
}