import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "bookings";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("desktopId")
        .unsigned()
        .references("desktops.id")
        .onDelete("CASCADE"); // delete booking when buro is deleted
      table.date("date");
      table.timestamp("created_at");
      table.timestamp("updated_at");
      table
        .integer("userId")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE");
      table.unique(["desktopId", "date"]);
      table.unique(["userId", "date"]);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
