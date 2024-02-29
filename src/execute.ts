import * as fs from 'fs';
import executeSqlQuery from './executeSqlQuery';

// コマンドライン引数から設定ファイルのパスとSQLファイルのパスとパラメータを取得
const configFilePath = process.argv[2];
const sqlFilePath = process.argv[3];
const params = process.argv.slice(4);

// JSONファイルからデータベース接続情報を読み込む
const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
const DB_USER = config.DB_USER;
const DB_PASSWORD = config.DB_PASSWORD;
const DB_CONNECT_STRING = config.DB_CONNECT_STRING;

// 関数を呼び出し、接続情報とSQLクエリ、パラメータを引数として渡す
executeSqlQuery(sqlFilePath, params, DB_USER, DB_PASSWORD, DB_CONNECT_STRING);
