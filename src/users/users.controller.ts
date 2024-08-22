// users/users.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll() {
    const users = await this.usersService.getAll();
    return { statusCode: 200, message: 'SUCCESS', users };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return { statusCode: 201, message: 'User created successfully', user };
    } catch (error) {
      if (error.response && error.response.statusCode === 400) {
        throw new BadRequestException(error.response.message);
      }
      throw error;
    }
  }

  @Get('get-user-by-id')
  async findOne(@Query('id') id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('ERR_USER_NOT_FOUND');
    }
    return { statusCode: 200, message: 'SUCCESS', user };
  }
}
