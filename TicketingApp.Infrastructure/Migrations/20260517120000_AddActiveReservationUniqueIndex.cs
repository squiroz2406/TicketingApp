using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketingApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddActiveReservationUniqueIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reservation_SeatId",
                table: "Reservation");

            migrationBuilder.CreateIndex(
                name: "UX_Reservation_SeatId_Active",
                table: "Reservation",
                column: "SeatId",
                unique: true,
                filter: "[Status] IN ('Pending', 'Confirmed')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UX_Reservation_SeatId_Active",
                table: "Reservation");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_SeatId",
                table: "Reservation",
                column: "SeatId");
        }
    }
}
