declare function runMigrations(): Promise<void>;
declare function rollbackMigrations(): Promise<void>;
export { runMigrations, rollbackMigrations };
