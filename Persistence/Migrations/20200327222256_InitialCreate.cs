using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
  public partial class InitialCreate : Migration
  {
    //Up() creates table 
    //this table has two columns (Id and Name)
    //Id is our primary key and autoincrements
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
          name: "Values",
          columns: table => new
          {
            //Id edited so migration can be used for different db types
            Id = table.Column<int>(nullable: false)
                  .Annotation("MySql:ValueGenerationStrategy",
                  MySqlValueGenerationStrategy.IdentityColumn)
                  .Annotation("SqlServer:ValueGenerationStrategy",
                  SqlServerValueGenerationStrategy.IdentityColumn)
                  .Annotation("Sqlite:Autoincrement", true),
            Name = table.Column<string>(nullable: true)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_Values", x => x.Id);
          });
    }

    //Down() drops table
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(
          name: "Values");
    }
  }
}
