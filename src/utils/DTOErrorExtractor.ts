import { ValidationError } from "class-validator"

export const DTOerrExtractor = (DTOerr: ValidationError[]) => {

  if (DTOerr && DTOerr.length > 0) {
    const returnMessage = []
    for (let i of DTOerr) {
      const constraints: string[] = []
      if (i.constraints){
        for (let key in i.constraints){
          constraints.push(i.constraints[key])
        }
      } 
      const newElem =
      {
        fieldName: i.property,
        constraints: constraints
      }
      returnMessage.push(newElem)
    }
    return returnMessage;
  }
  else {
    return 'Unknown error while validation'
  }
}