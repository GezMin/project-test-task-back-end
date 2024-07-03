import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectQueue('user-status')
    private userStatusQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    const existingUser = await this.usersRepository.findOneBy({ email });

    if (existingUser) {
      throw new BadRequestException('ERR_USER_EMAIL_EXISTS');
    }

    const user = this.usersRepository.create({ name, email, password });
    await this.usersRepository.save(user);

    await this.userStatusQueue.add(
      'update-status',
      { userId: user.id },
      { delay: 10000 },
    );

    return user;
  }

  async findOne(id: number): Promise<User> {
    const cachedUser = await this.cacheManager.get(`user-${id}`);
    if (cachedUser) {
      return cachedUser as User;
    }

    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('ERR_USER_NOT_FOUND');
    }

    await this.cacheManager.set(`user-${id}`, user, { ttl: 1800 });

    return user;
  }
}
