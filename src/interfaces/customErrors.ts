export class ErrorWithStatus extends Error {
    status: number
    constructor(message:string, status?:number) {
      super(message); 
      this.name = "ErrorWithStatus"; 
      this.status = status? status : 500
    }
  }
  
  export class Error403 extends Error {
    status: number
    message: string;
    constructor() {
      super()
      this.message = 'Access denied'
      this.name = "ErrorWithStatus"; // (2)
      this.status = 403
    }
  }