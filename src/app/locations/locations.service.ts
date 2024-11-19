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

  async create(createLocationDto: CreateLocationDto): Promise<LocationDto> {
    const { parentId } = createLocationDto;
    const parentLocation = parentId
      ? await this.validateParentId(parentId)
      : undefined;

    const level = parentLocation ? parentLocation.level + 1 : 0;

    try {
      const location = Location.create({
        id: uuidv4(),
        building: createLocationDto.building,
        name: createLocationDto.name,
        locationNumber: createLocationDto.locationNumber,
        level: level,
        area: createLocationDto.area,
        parent: parentLocation,
      });

      await this.repository.insert(location);

      const locationDto = plainToInstance(LocationDto, location, {
        excludeExtraneousValues: true,
      });

      return locationDto;
    } catch (error: any) {
      this.logger.error(error.stack);
      throw new DataQueryException(
        'Failed to create location due to a data query error.',
      );
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

  async findAll(): Promise<LocationDto[]> {
    try {
      const locations = await this.repository.find({
        relations: ['parent'],
      });
      const locationDtos = plainToInstance(LocationDto, locations, {
        excludeExtraneousValues: true,
      });
      return locationDtos;
    } catch (error: any) {
      this.logger.error(error.stack);
      throw new DataQueryException(
        'Failed to retrieve locations due to a data query error.',
      );
    }
  }

  async findOne(id: string): Promise<LocationDto> {
    try {
      const location = await this.repository.findOne({
        where: { id },
        relations: ['parent'],
      });

      if (!location) {
        throw new ResourceNotFoundException({
          resource: `Location with ID ${id}`,
        });
      }

      const locationDto = plainToInstance(LocationDto, location, {
        excludeExtraneousValues: true,
      });

      locationDto.parentId = location.parent?.id;

      return locationDto;
    } catch (error: any) {
      this.logger.error(error.stack);
      throw new DataQueryException(
        'Failed to retrieve location due to a data query error.',
      );
    }
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<LocationDto> {
    try {
      const location = await this.repository.findOne({ where: { id } });

      if (!location) {
        throw new ResourceNotFoundException({
          resource: `Location with ID ${id}`,
        });
      }

      Object.assign(location, updateLocationDto);

      const updatedLocation = await this.repository.save(location);

      const locationDto = plainToInstance(LocationDto, updatedLocation, {
        excludeExtraneousValues: true,
      });

      return locationDto;
    } catch (error: any) {
      this.logger.error(error.stack);
      throw new DataQueryException(
        'Failed to update location due to a data query error.',
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.repository.softDelete(id);
    } catch (error: any) {
      this.logger.error(error.stack);
      throw new DataQueryException(
        'Failed to remove location due to a data query error.',
      );
    }
  }
}
