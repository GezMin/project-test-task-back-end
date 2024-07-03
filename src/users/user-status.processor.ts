import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { UsersService } from './users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Processor('user-status')
export class UserStatusProcessor {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Process('update-status')
  async handleUpdateStatus(job: Job<{ userId: number }>) {
    const { userId } = job.data;
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (user) {
      user.status = true;
      await this.usersRepository.save(user);
      await this.usersService.updateCache(userId, user);
    }
  }
}
