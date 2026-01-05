import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatsService {
  create(createCatDto: CreateCatDto) {
    console.log('Creating cat:', createCatDto);
    return 'This action adds a new cat';
  }

  findAll() {
    return `This action returns all cats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cat`;
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    console.log('Updating cat:', id, updateCatDto);
    return `This action updates a #${id} cat with data: ${JSON.stringify(updateCatDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }
}
