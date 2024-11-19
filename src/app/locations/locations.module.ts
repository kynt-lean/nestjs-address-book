import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { LocationSchema } from './schemas/location.schema';

@Module({
  imports: [TypeOrmModule.forFeature([LocationSchema])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
