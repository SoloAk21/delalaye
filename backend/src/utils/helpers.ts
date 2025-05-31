import crypto from 'crypto'

export const generateResetToken = ():{otp:string,expirationDate:Date} => {
  const otp = Math.floor(1000 + Math.random() * 9000);

  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 4); // Token expires in 1 hour

  return { otp:otp.toString(), expirationDate };
};

export function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Uppercase letters and digits
  let randomString = '';
  for (let i = 0; i < 12; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

// Function to calculate the difference between two dates in days
export function dateDifferenceInDays(date1: Date, date2: Date): number {
  const diffInTime = date2.getTime() - date1.getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);
  return Math.round(diffInDays);
}