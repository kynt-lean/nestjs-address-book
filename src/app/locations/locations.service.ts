import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, TreeRepository } from 'typeorm';
import { CreateLocationDto } from './dtos/create-location.dto';
import { UpdateLocationDto } from './dtos/update-location.dto';
import { Location } from './entities/location';
@Injectable()
export class LocationsService {
  private repository: TreeRepository<Location>;

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
    this.repository = this.entityManager.getTreeRepository(Location);
  }

  create(createLocationDto: CreateLocationDto) {
    throw new Error('Not implemented');
  }

  findAll() {
    throw new Error('Not implemented');
  }

  findOne(id: string) {
    throw new Error('Not implemented');
  }

  update(id: string, updateLocationDto: UpdateLocationDto) {
    throw new Error('Not implemented');
  }

  remove(id: string) {
    throw new Error('Not implemented');
  }
}
