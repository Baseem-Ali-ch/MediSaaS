import { PrismaClient } from "@prisma/client";

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  constructor(
    protected readonly prisma: PrismaClient,
    private readonly modelName: keyof PrismaClient,
  ) {}

  private get model() {
    return this.prisma[this.modelName] as any;
  }

  async create(data: CreateInput): Promise<T> {
    return this.model.create({ data });
  }

  async findById(id: number | string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async update(id: number | string, data: UpdateInput): Promise<T | null> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: number | string): Promise<void> {
    await this.model.delete({ where: { id } });
  }

}
