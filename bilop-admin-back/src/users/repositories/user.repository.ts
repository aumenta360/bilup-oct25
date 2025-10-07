import { Repository } from 'typeorm';
import { User } from '../entities/user.entity/user.entity';

export class UserRepository {
  private repository: Repository<User>;

  constructor(repository: Repository<User>) {
    this.repository = repository;
  }

  public async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  public async findOne(id: number): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  public async create(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }

  public async update(id: number, user: Partial<User>): Promise<User> {
    await this.repository.update(id, user);
    return this.findOne(id);
  }

  public async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.repository.remove(user);
  }
} 