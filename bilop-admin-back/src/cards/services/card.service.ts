import { CardRepository } from '../repositories/card.repository';
import { ICreateCard, IUpdateCard } from '../interfaces/card.interface';

export class CardService {
  private repository: CardRepository;

  constructor(repository: CardRepository) {
    this.repository = repository;
  }

  public async create(createCardDto: ICreateCard) {
    return this.repository.create(createCardDto);
  }

  public async findAll() {
    return this.repository.findAll();
  }

  public async findOne(id: number) {
    return this.repository.findOne(id);
  }

  public async findByUser(userId: number) {
    return this.repository.findByUser(userId);
  }

  public async update(id: number, updateCardDto: IUpdateCard) {
    return this.repository.update(id, updateCardDto);
  }

  public async remove(id: number) {
    return this.repository.remove(id);
  }
} 