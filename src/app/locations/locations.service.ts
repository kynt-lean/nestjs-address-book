import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { EntityManager, TreeRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  DataQueryException,
  ResourceNotFoundException,
} from '../../core/exception-handlers/common-exceptions';
import { InjectLogger } from '../../core/loggers/decorator';
import { CreateLocationDto } from './dtos/create-location.dto';
import { LocationDto } from './dtos/location.dto';
import { UpdateLocationDto } from './dtos/update-location.dto';
import { Location } from './entities/location';
import { LocationNumberNotUniqueException } from './exceptions/location-number-not-unique.exception';
import { ParentIdNotValidException } from './exceptions/parent-id-not-valid.exception';

@Injectable()
export class LocationsService {
  private repository: TreeRepository<Location>;

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    @InjectLogger('LocationsService')
    private logger: Logger,
  ) {
    this.repository = this.entityManager.getTreeRepository(Location);
  }

  public async create(
    createLocationDto: CreateLocationDto,
  ): Promise<LocationDto> {
    const { parentId, locationNumber } = createLocationDto;

    await this.checkLocationNumberUnique(locationNumber);

    const parentLocation = parentId
      ? await this.validateParentId(parentId)
      : undefined;

    const level = parentLocation ? parentLocation.level + 1 : 0;
    const location = Location.create({
      id: uuidv4(),
      building: createLocationDto.building,
      name: createLocationDto.name,
      locationNumber: locationNumber,
      level: level,
      area: createLocationDto.area,
      parent: parentLocation,
    });

    try {
      await this.repository.insert(location);
    } catch (error: any) {
      this.logger.error(error.stack);
      throw new DataQueryException(
        'Failed to create location due to a data query error.',
      );
    }

    const locationDto = plainToInstance(LocationDto, location, {
      excludeExtraneousValues: true,
    });

    return locationDto;
  }

  public async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<LocationDto> {
    const { locationNumber } = updateLocationDto;

    const location = await this.repository.findOne({ where: { id } });

    if (!location) {
      throw new ResourceNotFoundException({
        resource: `Location with ID ${id}`,
      });
    }

    if (locationNumber) {
      await this.checkLocationNumberUnique(locationNumber, id);
    }

    Object.assign(location, updateLocationDto);

    const updatedLocation = await this.repository.save(location);

    const locationDto = plainToInstance(LocationDto, updatedLocation, {
      excludeExtraneousValues: true,
    });

    return locationDto;
  }

  public async remove(id: string): Promise<void> {
    const location = await this.getOne(id);
    await this.repository.softRemove(location);
  }

  public async findAll(): Promise<LocationDto[]> {
    const locations = await this.repository.find({
      relations: ['parent'],
    });
    const locationDtos = plainToInstance(LocationDto, locations, {
      excludeExtraneousValues: true,
    });
    return locationDtos;
  }

  public async findOne(id: string): Promise<LocationDto> {
    const location = await this.getOne(id);

    const locationDto = plainToInstance(LocationDto, location, {
      excludeExtraneousValues: true,
    });

    locationDto.parentId = location.parent?.id;

    return locationDto;
  }

  public async getOne(id: string): Promise<Location> {
    const location = await this.repository.findOne({
      where: { id },
      relations: ['parent'],
    });

    if (!location) {
      throw new ResourceNotFoundException({
        resource: `Location with ID ${id}`,
      });
    }

    return location;
  }

  private async checkLocationNumberUnique(
    locationNumber: string,
    id?: string,
  ): Promise<void> {
    const existingLocation = await this.repository.findOne({
      where: { locationNumber },
    });

    if (existingLocation && existingLocation.id !== id) {
      throw new LocationNumberNotUniqueException(locationNumber);
    }
  }

  private async validateParentId(parentId: string): Promise<Location> {
    const parentLocation = await this.repository.findOne({
      where: { id: parentId },
    });
    if (!parentLocation) {
      throw new ParentIdNotValidException(parentId);
    }
    return parentLocation;
  }
}
