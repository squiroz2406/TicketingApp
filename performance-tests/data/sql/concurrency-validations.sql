SELECT
    SeatId,
    COUNT(*) AS ActiveReservations
FROM [Reservation]
WHERE [Status] IN ('Pending', 'Confirmed')
GROUP BY SeatId
HAVING COUNT(*) > 1;

SELECT
    s.Id AS SeatId,
    s.RowIdentifier,
    s.SeatNumber,
    s.Status AS SeatStatus,
    r.Status AS ReservationStatus,
    COUNT(*) OVER (PARTITION BY s.Id) AS ActiveReservationCount
FROM Seat s
JOIN [Reservation] r ON r.SeatId = s.Id
WHERE r.Status IN ('Pending', 'Confirmed')
ORDER BY s.Id;
