export const isValidateEmail = (Email: string): boolean => {
    const allowedDomains = [
      "gmail.com",
      "outlook.com",
      "icloud.com",
      "yahoo.com",
    ];
    const emailRegex = /^[a-zA-Z0-9]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(Email)) {
      return false;
    }
    const domain = Email.split("@")[1];
    return allowedDomains.includes(domain);
  };
  
  export const isValidatePassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };