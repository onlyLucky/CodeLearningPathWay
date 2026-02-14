import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { getCacheModuleOptions } from '../config/redis.config';
import { RedisService } from './services/redis.service';

@Module({
  imports: [CacheModule.registerAsync(getCacheModuleOptions())],
  providers: [RedisService],
  exports: [RedisService],
})
export class CommonModule {}
