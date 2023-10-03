import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async geoAdd(
    key: string,
    positionName: string,
    positionLocation: [number, number],
  ) {
    return this.redisClient.geoAdd(key, {
      longitude: positionLocation[0],
      latitude: positionLocation[1],
      member: positionName,
    });
  }
  async geoPos(key: string, posName: string) {
    const res = await this.redisClient.geoPos(key, posName);

    return {
      name: posName,
      longitude: res[0].longitude,
      latitude: res[0].latitude,
    };
  }

  async geoList(key: string) {
    const positionNames = await this.redisClient.zRange(key, 0, -1);

    const list = [];
    for (let i = 0; i < positionNames.length; i++) {
      const pos = positionNames[i];
      const res = await this.geoPos(key, pos);
      list.push(res);
    }
    return list;
  }
}
