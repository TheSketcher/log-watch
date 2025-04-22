// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<any>) {}

  async createUser(username, email) {
    const newUser = new this.userModel({ username, email });
    return await newUser.save();
  }

  async getAllUsers() {
    return await this.userModel.find().exec();
  }

  async getUserById(id) {
    return await this.userModel.findById(id).exec();
  }
}
