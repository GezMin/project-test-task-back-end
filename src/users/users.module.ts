import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { UserStatusProcessor } from './user-status.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Регистрация сущности User
    BullModule.registerQueue({
      name: 'user-status',
    }),
    CacheModule.register(),
  ],
  providers: [UsersService, UserStatusProcessor],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
