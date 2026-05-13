import api from './client';

export const reservationService = {
  createReservation: async (seatIds, userId) => {
    const response = await api.post('/reservations', {
      SeatIds: seatIds,
      UserId: userId,
    });
    return response.data;
  },

  confirmReservation: async (reservationId, userId) => {
    const response = await api.post(`/reservations/${reservationId}/confirm`, {
      reservationId,
      userId,
    });
    return response.data;
  },

  getUserReservations: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/reservations`);
      return response.data || [];
    } catch (error) {
      console.warn('Error fetching user reservations:', error);
      return [];
    }
  },
};
