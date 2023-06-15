export function formatPhoneNumber(phoneNumber: string): string {
  // Remove non-digit characters from the input phone number
  const cleanedNumber = phoneNumber.replace(/\D/g, "");

  // Check if the cleaned number has a valid length
  if (cleanedNumber.length === 10) {
    // Format as (XXX) XXX-XXXX
    return `(${cleanedNumber.slice(0, 3)}) ${cleanedNumber.slice(3, 6)}-${cleanedNumber.slice(6)}`;
  } else if (cleanedNumber.length > 10) {
    // If the number has more than 10 digits, assume a global code is present
    const globalCode = cleanedNumber.slice(0, cleanedNumber.length - 10);
    const localNumber = cleanedNumber.slice(cleanedNumber.length - 10);

    // Format as +XX (XXX) XXX-XXXX
    return `+${globalCode} (${localNumber.slice(0, 3)}) ${localNumber.slice(3, 6)}-${localNumber.slice(6)}`;
  }

  // If the number doesn't have a valid length, return the original input
  return phoneNumber;
}