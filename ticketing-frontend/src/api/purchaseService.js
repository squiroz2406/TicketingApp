// Service to manage purchase history in localStorage
export const purchaseService = {
  // Get all purchases for a user
  getUserPurchases: (userId) => {
    try {
      const purchases = localStorage.getItem(`purchases_${userId}`);
      return purchases ? JSON.parse(purchases) : [];
    } catch (error) {
      console.error('Error getting purchases:', error);
      return [];
    }
  },

  // Save a new purchase
  savePurchase: (userId, purchase) => {
    try {
      const purchases = purchaseService.getUserPurchases(userId);
      const newPurchase = {
        id: purchase.id || Date.now(),
        movie: purchase.movie || 'Unknown Movie',
        time: purchase.time || 'Sin horario',
        date: purchase.date || new Date().toISOString().split('T')[0],
        seats: purchase.seats || '',
        price: purchase.price || 0,
        timestamp: Date.now(),
      };
      purchases.unshift(newPurchase); // Add to beginning (latest first)
      localStorage.setItem(`purchases_${userId}`, JSON.stringify(purchases));
      return newPurchase;
    } catch (error) {
      console.error('Error saving purchase:', error);
      return null;
    }
  },

  // Get latest N purchases
  getLatestPurchases: (userId, limit = 3) => {
    const purchases = purchaseService.getUserPurchases(userId);
    return purchases.slice(0, limit);
  },

  // Clear all purchases for a user (for testing)
  clearUserPurchases: (userId) => {
    try {
      localStorage.removeItem(`purchases_${userId}`);
      return true;
    } catch (error) {
      console.error('Error clearing purchases:', error);
      return false;
    }
  },

  // Debug: log all purchases to console
  debugPurchases: (userId) => {
    const purchases = purchaseService.getUserPurchases(userId);
    console.log('Purchases for user', userId, ':', purchases);
    return purchases;
  },
};
