/**
 * Format date to dd-mm-yyyy format
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {string} Formatted date in dd-mm-yyyy
 */
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

/**
 * Format datetime to dd-mm-yyyy HH:ii format
 * @param {string|Date} dateString - ISO datetime string or Date object
 * @returns {string} Formatted datetime in dd-mm-yyyy HH:ii
 */
export const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
};
