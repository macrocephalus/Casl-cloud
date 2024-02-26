import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Job } from '../jobs/job.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { QueryTasksDto } from './dtos/query-tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async findAllFiltered(
    query: QueryTasksDto,
  ): Promise<TaskWithPercentageUsed[]> {
    const minPercentage = query.minPercentageUsed ? query.minPercentageUsed : 0;
    const maxPercentage = query.maxPercentageUsed
      ? query.maxPercentageUsed
      : 100;

    const tasks: TaskWithPercentageUsed[] = await this.taskRepository
      .createQueryBuilder('task')
      .select([
        'task.id',
        'task.cost',
        'task.startTime',
        'task.endTime',
        'task.amountSpent',
        '((task.amountSpent / task.cost) * 100) AS percentageUsed',
      ])
      .where(
        '((task.amountSpent / task.cost) * 100) >= :minPercentage AND ((task.amountSpent / task.cost) * 100) <= :maxPercentage',
        {
          minPercentage,
          maxPercentage,
        },
      )
      .getRawMany();

    return tasks;
  }

  async create(createTaskDto: CreateTaskDto) {
    const newTask = this.taskRepository.create(createTaskDto);
    await this.taskRepository.save(newTask);

    return newTask;
  }
}
