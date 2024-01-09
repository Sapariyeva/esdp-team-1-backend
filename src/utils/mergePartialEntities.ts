export const mergePartialEntities = <T extends object>(entity: T, updEntity: T) => {
    for (let k in entity) {
        if ((k in updEntity) && (k !== 'id')
            && (updEntity[k] || (k === 'isActive' && updEntity[k] === false))) {
            (entity[k] as any) = updEntity[k]
        }
        else {
            (entity[k] as any) = entity[k]
        }
    }
    return entity
}