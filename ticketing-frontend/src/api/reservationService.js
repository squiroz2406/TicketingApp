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
};
