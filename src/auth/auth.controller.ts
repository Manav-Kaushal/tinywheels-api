import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { UpdateDto } from './dto/update.dto';
import { RolesEnum, User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Get All Users
  @Get('all')
  @UseGuards(AuthGuard())
  GetAllUsers(
    @Req()
    req,
  ): Promise<{ list: User[]; total: number }> {
    const user = req.user;
    if (user.role === RolesEnum.ADMIN) {
      return this.authService.getAllUsers();
    } else {
      throw new ForbiddenException('Only admin allowed!');
    }
  }

  // Create User
  @Post('signup')
  SignUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ message: string; token?: string }> {
    return this.authService.singUp(signUpDto);
  }

  // Login User
  @Post('login')
  Login(
    @Body() loginDto: LoginDto,
  ): Promise<{ user: Partial<User>; token: string }> {
    return this.authService.login(loginDto);
  }

  // Edit a User
  @Put(':id')
  @UseGuards(AuthGuard())
  async updateUser(
    @Param('id')
    id: string,
    @Body()
    user: UpdateDto,
    @Req()
    req,
  ): Promise<User> {
    const requestingUser = req.user;

    if (requestingUser.role === RolesEnum.ADMIN) {
      return this.authService.updateById(id, user);
    } else {
      throw new ForbiddenException('Only admin allowed!');
    }
  }
}
