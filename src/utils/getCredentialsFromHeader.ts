export const getCredentialsFromHeader = (auth: string | undefined) => {
    if (auth) {
      const splitHeader = auth.split(' ');
      if (splitHeader.length === 2 && splitHeader[0].includes('Bearer')) {
        return splitHeader[1]
      }
      else if (splitHeader.length === 1) {
        return splitHeader[0]
      }
      else{
        return 
      }
    }
    else{
      return 
    }
  }