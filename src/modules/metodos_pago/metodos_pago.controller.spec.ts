import { Test, TestingModule } from '@nestjs/testing';
import { MetodosPagoController } from './metodos_pago.controller';
import { MetodosPagoService } from './metodos_pago.service';

describe('MetodosPagoController', () => {
  let controller: MetodosPagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetodosPagoController],
      providers: [MetodosPagoService],
    }).compile();

    controller = module.get<MetodosPagoController>(MetodosPagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
