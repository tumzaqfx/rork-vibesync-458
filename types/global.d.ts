// Ambient types to satisfy optional environments
declare var Bun: any;

declare module 'better-sqlite3' {
  const BetterSqlite3: any;
  export default BetterSqlite3;
}

// Expo Notifications minimal typings shim
declare namespace Notifications {}


