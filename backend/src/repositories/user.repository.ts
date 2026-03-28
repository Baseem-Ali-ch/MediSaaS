import { PrismaClient, User, Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import bcrypt from 'bcrypt'

export class UserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "user");
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: { gt: new Date() },
      },
    });
  }

  async comparePassword(userId: number, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return false;
    }
    return await bcrypt.compare(password, user.password);
  }

}
