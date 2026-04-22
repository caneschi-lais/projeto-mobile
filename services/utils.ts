export const formatPhone = (text: string) => {
    // Remove non-digits
    const cleaned = text.replace(/\D/g, '');

    // Apply mask (XX) XXXXX-XXXX
    let formatted = cleaned;
    if (cleaned.length > 0) {
        formatted = '(' + cleaned;
    }
    if (cleaned.length > 2) {
        formatted = '(' + cleaned.substring(0, 2) + ') ' + cleaned.substring(2);
    }
    if (cleaned.length > 7) {
        formatted = '(' + cleaned.substring(0, 2) + ') ' + cleaned.substring(2, 7) + '-' + cleaned.substring(7, 11);
    }

    return formatted.substring(0, 15); // Max length for (XX) XXXXX-XXXX
};