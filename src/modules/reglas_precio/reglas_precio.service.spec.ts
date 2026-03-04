import { Test, TestingModule } from '@nestjs/testing';
import { ReglasPrecioService } from './reglas_precio.service';

describe('ReglasPrecioService', () => {
  let service: ReglasPrecioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReglasPrecioService],
    }).compile();

    service = module.get<ReglasPrecioService>(ReglasPrecioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
