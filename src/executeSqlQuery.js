const fs = require('fs');
const path = require('path');
const executeOracleDbQuery = require('./oracleDbQuery');

function executeSqlQuery(sqlFilePath, params, DB_USER, DB_PASSWORD, DB_CONNECT_STRING) {
  // SQLファイルからSQL文字列を読み込む
  const sqlQuery = trimSqlStatement(fs.readFileSync(sqlFilePath, 'utf8'));

  // パラメータをバインド変数のオブジェクトにマッピング
  const bindParams = params.reduce((obj, param, index) => {
    obj[`parm${index + 1}`] = param;
    return obj;
  }, {});

  // SQLファイル名から出力ファイル名を作成
  const outputFileName = path.basename(sqlFilePath, '.sql') + '.output.csv';

  // 関数を呼び出し、接続情報とSQLクエリ、パラメータを引数として渡す
  executeOracleDbQuery(DB_USER, DB_PASSWORD, DB_CONNECT_STRING, sqlQuery, bindParams, outputFileName);
}

function trimSqlStatement(sql) {
  // 末尾のセミコロンやスペースを削除する正規表現パターン
  const pattern = /[;\s]+$/;

  // 文字列の末尾から不要な文字を削除
  return sql.replace(pattern, '');
}

module.exports = executeSqlQuery;
