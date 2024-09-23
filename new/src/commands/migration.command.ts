import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as dayjs from 'dayjs';

@Injectable()
export class MigrationCommand {
  constructor(private readonly dataSource: DataSource) {}

  @Command({
    command: 'update:migration',
    describe: 'Update migration files from the database (date-wise and change detection)',
    autoExit: true,
  })
  async updateMigration() {
    const connection = this.dataSource.createQueryRunner();
    const date = dayjs().format('YYYY-MM-DD');

    const tables = await connection.query('SHOW TABLES');
    for (const table of tables) {
      const tableName = table[`Tables_in_${process.env.DB_NAME}`];
      const createTableQuery = await connection.query(`SHOW CREATE TABLE ${tableName}`);
      this.createMigrationFile('tables', tableName, createTableQuery[0]['Create Table'], date);
    }

    const procedures = await connection.query('SHOW PROCEDURE STATUS WHERE Db = ?', [process.env.DB_NAME]);
    for (const procedure of procedures) {
      const procedureName = procedure['Name'];
      const createProcedureQuery = await connection.query(`SHOW CREATE PROCEDURE ${procedureName}`);
      this.createMigrationFile('procedures', procedureName, createProcedureQuery[0]['Create Procedure'], date);
    }

    const views = await connection.query('SHOW FULL TABLES WHERE Table_type = "VIEW"');
    for (const view of views) {
      const viewName = view[`Tables_in_${process.env.DB_NAME}`];
      const createViewQuery = await connection.query(`SHOW CREATE VIEW ${viewName}`);
      this.createMigrationFile('views', viewName, createViewQuery[0]['Create View'], date);
    }

    console.log('Migration files updated successfully!');
    await connection.release();
  }

  @Command({
    command: 'migrate',
    describe: 'Restore the database from migration files',
    autoExit: true,
  })
  async migrate() {
    const connection = this.dataSource.createQueryRunner();
    try {
      const directories = ['tables', 'procedures', 'views'];
      for (const dir of directories) {
        const files = fs.readdirSync(`./src/migrate/${dir}`).sort();
        for (const file of files) {
          const sql = fs.readFileSync(`./src/migrate/${dir}/${file}`).toString();
          await connection.query(sql);
        }
      }
      console.log('Database restored successfully from migration files!');
    } catch (error) {
      console.error('Failed to restore database:', error.message);
    } finally {
      await connection.release();
    }
  }

  createMigrationFile(folder: string, name: string, currentContent: string, date: string) {
    const migrationFolder = `./src/migrate/${folder}`;
    const fileName = `${date}_${name}.sql`;
    const filePath = path.join(migrationFolder, fileName);
    if (!fs.existsSync(migrationFolder)) {
      fs.mkdirSync(migrationFolder, { recursive: true });
    }
    const lastMigrationFile = this.getLastMigrationFile(migrationFolder, name);
    if (lastMigrationFile) {
      const lastContent = fs.readFileSync(lastMigrationFile).toString();
      if (lastContent === currentContent) {
        console.log(`No changes detected for ${name}, skipping migration.`);
        return;
      }
    }
    fs.writeFileSync(filePath, currentContent);
    console.log(`Migration file created for ${name}: ${filePath}`);
  }

  getLastMigrationFile(folder: string, name: string) {
    const files = fs.readdirSync(folder).filter(file => file.includes(name)).sort();
    if (files.length === 0) return null;
    return path.join(folder, files[files.length - 1]);
  }
}
