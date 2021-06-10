import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  //   HttpCode,
  HttpStatus,
  HttpException,
  Param,
  //   Query,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';
import { isValidObjectId } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    this.validateParamId(id);

    const userFound = await this.userService.findOneById(id);
    return userFound
      ? userFound
      : this.sendException(HttpStatus.NOT_FOUND, 'Document not found');
  }

  @Post()
  async addOne(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.userService.create(createUserDto);
    return createdUser;
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    this.validateParamId(id);

    return this.userService.update(id, payload);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    this.validateParamId(id);

    const deleted = await this.userService.delete(id);
    return deleted
      ? deleted
      : this.sendException(HttpStatus.NOT_FOUND, 'Document not found.');
  }

  validateParamId(id: string) {
    if (!isValidObjectId(id))
      this.sendException(HttpStatus.BAD_REQUEST, 'Invalid id format.');
  }

  sendException(status: number, error: string) {
    throw new HttpException({ status, error }, status);
  }
}
