import { RedisService } from './redis/redis.service';
import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Inject(RedisService)
  private redisService: RedisService;
  constructor(private readonly appService: AppService) {}

  @Get('addPosition')
  async addPosition(
    @Query('name') name: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
  ) {
    if (!name || !longitude || !latitude) {
      throw new BadRequestException('Wrong param');
    }
    try {
      await this.redisService.geoAdd('positions', name, [longitude, latitude]);
      return {
        message: 'add position successfully',
        statusCode: 200,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('allPositions')
  async getAllPositions() {
    return this.redisService.geoList('positions');
  }

  @Get('position')
  async getPosition(@Query('name') name: string) {
    return this.redisService.geoPos('positions', name);
  }
}
