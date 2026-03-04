import { Test, TestingModule } from '@nestjs/testing';
import { PedidoProductoService } from './pedido-producto.service';

describe('PedidoProductoService', () => {
  let service: PedidoProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PedidoProductoService],
    }).compile();

    service = module.get<PedidoProductoService>(PedidoProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
