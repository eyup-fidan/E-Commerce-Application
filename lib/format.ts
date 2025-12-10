/**
 * Bir sayıyı Türk Lirası formatına çevirir ancak ₺ sembolü olmadan.
 * @param {number} value // Formatlanacak sayı.
 * @returns {string} - Formatlanmış sayı string'i 
 */
export const formatPriceWithoutSymbol = (value: number): string => {
    // 'tr-TR' (Türkiye) lokasyonunu kullanarak formatlama yapıyoruz.
    const formatted = new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    
    return formatted; 
};