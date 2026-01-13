import { DataSource } from 'typeorm';

export abstract class BaseSeed {
  constructor(protected readonly dataSource: DataSource) {}

  abstract run(): Promise<void>;

  protected async truncate(tableNames: string[]): Promise<void> {
    const promises = tableNames.map((tableName) =>
      this.dataSource.query(
        `SET FOREIGN_KEY_CHECKS = 0; TRUNCATE TABLE ${tableName}; SET FOREIGN_KEY_CHECKS = 1;`,
      ),
    );
    await Promise.all(promises);
  }
}
