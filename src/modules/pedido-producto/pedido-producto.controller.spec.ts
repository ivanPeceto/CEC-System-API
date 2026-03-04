import { Test, TestingModule } from '@nestjs/testing';
import { PedidoProductoController } from './pedido-producto.controller';
import { PedidoProductoService } from './pedido-producto.service';

describe('PedidoProductoController', () => {
  let controller: PedidoProductoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoProductoController],
      providers: [PedidoProductoService],
    }).compile();

    controller = module.get<PedidoProductoController>(PedidoProductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
