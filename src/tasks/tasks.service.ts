import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepo: Repository<Task>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const user = await this.usersRepo.findOneBy({ id: createTaskDto.userId });
    if (!user) throw new NotFoundException('User not found');
    const task = this.tasksRepo.create({ title: createTaskDto.title, user });
    return this.tasksRepo.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepo.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepo.findOne({ where: { id }, relations: ['user'] });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    if (updateTaskDto.userId) {
      const user = await this.usersRepo.findOneBy({ id: updateTaskDto.userId });
      if (!user) throw new NotFoundException('User not found');
      task.user = user;
    }
    Object.assign(task, updateTaskDto);
    return this.tasksRepo.save(task);
  }

  async remove(id: number): Promise<void> {
    await this.tasksRepo.delete(id);
  }
}
