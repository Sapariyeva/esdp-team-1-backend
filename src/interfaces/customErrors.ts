export class ErrorWithStatus extends Error {
    status: number
    constructor(message:string, status?:number) {
      super(message); // (1)
      this.name = "ErrorWithStatus"; // (2)
      this.status = status? status : 500
    }
  }