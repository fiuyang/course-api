import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PageService } from 'src/utils/service/page/page.service';
import { PasswordReset } from './entities/password-reset.entity';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';

@Injectable()
export class UserService extends PageService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(PasswordReset)
    private passwordResetRepo: Repository<PasswordReset>,
  ) {
    super();
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await this.hashPassword(createUserDto.password);
    return await this.userRepo.save(createUserDto);
  }

  async findAll(filter) {
    return await this.generatePaging(filter, this.userRepo);
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    updateUserDto.id = id;
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    return this.userRepo.save(updateUserDto);
  }

  async updateByEmail(email: string, newPassword: string) {
    const hashedPassword = await this.hashPassword(newPassword);
    await this.userRepo.update({ email: email }, { password: hashedPassword });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepo.remove(user);
  }

  async count() {
    await this.userRepo.count();
  }

  async createOtp(forgotPasswordDto: ForgotPasswordDto) {
    const passwordReset = await this.passwordResetRepo.findOneBy({
      email: forgotPasswordDto.email,
    });

    const otp = this.generateOtp();

    if (!passwordReset) {
      const newPasswordReset = new PasswordReset();
      newPasswordReset.email = forgotPasswordDto.email;
      newPasswordReset.otp = otp;
      newPasswordReset.created_at = new Date();
      return this.passwordResetRepo.save(newPasswordReset);
    } else {
      passwordReset.otp = otp;
      passwordReset.created_at = new Date();
      return this.passwordResetRepo.save(passwordReset);
    }
  }

  async checkOtp(otp: number) {
    const checkOtp = await this.passwordResetRepo.findOneBy({ otp: otp });

    if (!checkOtp) {
      throw new NotFoundException('OTP Not Found');
    }

    const currentTime = new Date();

    const timeDifference =
      currentTime.getTime() - (await checkOtp).created_at.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60)); // Menghitung selisih waktu dalam menit

    if (minutesDifference > 5) {
      throw new NotFoundException('OTP expired');
    }

    return checkOtp;
  }

  async updateOtp(resetPasswordDto: ResetPasswordDto, otp: number) {
    const checkOtp = this.passwordResetRepo.findOneBy({ otp: otp });

    if (!checkOtp) {
      throw new NotFoundException('OTP Not Found');
    }

    if (resetPasswordDto.password) {
      await this.updateByEmail(
        (await checkOtp).email,
        resetPasswordDto.password,
      );
    }
    await this.passwordResetRepo.delete({ email: (await checkOtp).email });
  }

  generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async hashPassword(plainTextPassword: string): Promise<string> {
    return await bcrypt.hash(plainTextPassword, 10);
  }

  async compare(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
