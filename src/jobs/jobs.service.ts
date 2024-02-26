import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { Repository } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { CreateJobDto } from './dtos/create-job.dto';
import { User } from '../users/user.entity';
import { getEffectiveHours } from '../util/function';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createJobDto: CreateJobDto,
  ): Promise<{ job: Job; taskPercentageUsed: number }> {
    const { taskId, userId, startTime, endTime } = createJobDto;
    const task = await this.tasksRepository.findOne({ where: { id: taskId } });
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!task || !user) {
      throw new HttpException('Task or user not found', HttpStatus.NOT_FOUND);
    }

    let taskTotalCost = await this.calculateTaskTotalCost(taskId);
    taskTotalCost += user.rate * getEffectiveHours(startTime, endTime);
    const taskPercentageUsed = (taskTotalCost / task.cost) * 100;

    if (taskPercentageUsed >= 100) {
      throw new HttpException(
        'Budget limit for the task has been exceeded',
        HttpStatus.BAD_REQUEST,
      );
    }

    const job = this.jobsRepository.create(createJobDto);
    await this.jobsRepository.save(job);

    task.amountSpent += taskTotalCost;
    await this.tasksRepository.save(task);

    return { job, taskPercentageUsed };
  }

  async calculateTaskTotalCost(taskId: number): Promise<number> {
    const jobs = await this.jobsRepository.find({
      where: { taskId: taskId },
      relations: ['user'],
    });

    let totalCost = 0;
    jobs.forEach((job) => {
      const effectiveHours = getEffectiveHours(job.startTime, job.endTime);
      totalCost += effectiveHours * job.user.rate;
    });

    return totalCost;
  }
}
