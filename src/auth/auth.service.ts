import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async getAllUsers() {
    const users = await this.userModel.find().select('-password');
    const total = await this.userModel.countDocuments();

    return { list: users, total };
  }

  async singUp(
    singUpDto: SignUpDto,
  ): Promise<{ message: string; token?: string }> {
    const { name, email, password, isActive } = singUpDto;

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
      isActive,
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
      '_id name email password role isActive',
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
        role: user.role,
        isActive: user.isActive,
      },
      token,
    };
  }

  async updateById(id: string, userUpdates: Partial<User>): Promise<User> {
    try {
      const user = await this.userModel.findById(id).select('-password');

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      Object.assign(user, userUpdates);

      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user with ID ${id}: ${error.message}`);
    }
  }
}
