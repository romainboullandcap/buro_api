import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "bookings";

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(["desktopId", "date"]);
      table.unique(["userId", "date"]);
    });
  }

  async down() {}
}
