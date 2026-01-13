import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  ObjectLiteral,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  async createMany(entities: DeepPartial<T>[]): Promise<T[]> {
    return this.repository.save(entities);
  }

  async findOne(options: FindManyOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async findOneById(id: string | number): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async findMany(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findManyBy(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.find({ where });
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async update(
    id: string | number,
    entity: QueryDeepPartialEntity<T>,
  ): Promise<void> {
    await this.repository.update(id, entity);
  }

  async updateMany(
    where: FindOptionsWhere<T>,
    entity: QueryDeepPartialEntity<T>,
  ): Promise<void> {
    await this.repository.update(where, entity);
  }

  async delete(id: string | number): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteMany(where: FindOptionsWhere<T>): Promise<void> {
    await this.repository.delete(where);
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  async countBy(where: FindOptionsWhere<T>): Promise<number> {
    return this.repository.countBy(where);
  }

  async exists(options: FindManyOptions<T>): Promise<boolean> {
    const count = await this.repository.count(options);
    return count > 0;
  }

  getRepository(): Repository<T> {
    return this.repository;
  }
}
