import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { IsNull, Not, Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}
  async create(createCategoriaDto: CreateCategoriaDto) {
    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async findAll() {
    const categorias = await this.categoriaRepository.find();
    return categorias;
  }

  async findOne(id: string) {
    const categoria = await this.categoriaRepository.findOneBy({ id });
    if (!categoria) {
      throw new NotFoundException(`Categoria con id ${id} no encontrada.`);
    }
    return categoria;
  }

  async findOneByName(name: string) {
    const categoria = await this.categoriaRepository.findOneBy({
      nombre: name,
    });
    if (!categoria) {
      throw new NotFoundException(
        `Categoria con nombre ${name} no encontrada.`,
      );
    }
    return categoria;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);
    this.categoriaRepository.merge(categoria, updateCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async delete(id: string): Promise<void> {
    const deletedCategoria = await this.categoriaRepository.delete(id);
    if (deletedCategoria.affected === 0) {
      throw new NotFoundException(`Categoria con id ${id} no encontrada.`);
    }
  }

  async softDelete(id: string): Promise<void> {
    const deletedCategoria = await this.categoriaRepository.softDelete(id);
    if (deletedCategoria.affected === 0) {
      throw new NotFoundException(`Categoria con id ${id} no encontrada.`);
    }
  }

  async restore(id: string): Promise<void> {
    const restored = await this.categoriaRepository.restore(id);
    if (restored.affected === 0) {
      throw new NotFoundException(`Categoria con id ${id} no encontrada.`);
    }
  }

  async findSoftDeleted(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()), 
      },
    });
  }
}
