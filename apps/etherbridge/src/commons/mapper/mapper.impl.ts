export interface IMapper {
  toDomain(entity: unknown): unknown;
}
