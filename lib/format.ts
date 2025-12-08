/**
 * Bir sayıyı Türk Lirası (virgül ile) formatına çevirir, ancak ₺ sembolü olmadan.
 * @param {number} value - Formatlanacak sayı.
 * @returns {string} Formatlanmış sayı string'i (örn: "8.499,99").
 */
export const formatPriceWithoutSymbol = (value: number): string => {
    // 'tr-TR' (Türkiye) lokasyonunu kullanarak formatlama yapıyoruz.
    const formatted = new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    
    return formatted; // örn: "8.499,99"
};