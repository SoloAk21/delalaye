export default function validatePhoneNumber(phoneNumber: string): boolean {
    // Regular expression to match "+251" followed by 9 digits
    const regex: RegExp = /^\+251\d{9}$/;
    return regex.test(phoneNumber);
  }