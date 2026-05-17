using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketingApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class horariosyprecios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1
                    FROM sys.indexes
                    WHERE name = 'IX_Reservation_SeatId_Status'
                )
                DROP INDEX IX_Reservation_SeatId_Status ON Reservation;
            ");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Reservation",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Reservation",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);
        }
    }
}