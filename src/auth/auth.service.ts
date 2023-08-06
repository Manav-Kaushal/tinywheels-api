import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async singUp(
    singUpDto: SignUpDto,
  ): Promise<{ message: string; token?: string }> {
    const { name, email, password, isAdmin } = singUpDto;

    const emailExists = await this.userModel.findOne({ email });

    if (emailExists) {
      return {
        message: 'Email already in use. Please sign in or use a different one.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { message: 'Welcome! Your account has been created', token };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: Partial<User>; token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne(
      { email },
      '_id name email password isAdmin',
    );

    if (!user) {
      throw new UnauthorizedException(
        'User not found for this email. Sign up instead.',
      );
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    };
  }
}
