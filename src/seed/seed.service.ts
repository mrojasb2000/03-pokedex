import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  findAll() {
    return `This action returns all seed`;
  }
}
