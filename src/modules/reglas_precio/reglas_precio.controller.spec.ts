import { Test, TestingModule } from '@nestjs/testing';
import { ReglasPrecioController } from './reglas_precio.controller';
import { ReglasPrecioService } from './reglas_precio.service';

describe('ReglasPrecioController', () => {
  let controller: ReglasPrecioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReglasPrecioController],
      providers: [ReglasPrecioService],
    }).compile();

    controller = module.get<ReglasPrecioController>(ReglasPrecioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
