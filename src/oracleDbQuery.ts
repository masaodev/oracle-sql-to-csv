import oracledb from 'oracledb';
import fs from 'fs';

/**
 * OracleDBに接続し、指定されたSQLクエリを実行して結果をCSVファイルに出力する関数
 * @param {string} user - データベースのユーザーID
 * @param {string} password - データベースのパスワード
 * @param {string} connectString - データベースの接続文字列
 * @param {string} sqlQuery - 実行するSQLクエリ
 * @param {Object} bindParams - SQLクエリのバインド変数
 * @param {string} outputFileName - 出力するCSVファイルの名前
 */
export async function executeOracleDbQuery(user:string, password:string, connectString:string, sqlQuery:string, bindParams:any = {}, outputFileName:string) {
  let connection;

  try {
    // OracleDBに接続
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectString
    });

    // SQLクエリを実行
    const result = await connection.execute(sqlQuery, bindParams);

    // 列名を抽出
    const columnNames = result.metaData?.map(column => column.name) ?? [];

    // 行をオブジェクトに変換
    const records = result.rows?.map(row => {
      let obj :Record<string,string> = {};
      const typedRow = row as any[];
      
      typedRow.forEach((value, index) => {
        // 日付データの場合、指定した形式に変換
        if (value instanceof Date) {
          value = value.toLocaleString('ja-JP');
        }
        if (value === null) {
          value = "";
        } else if((typeof value) === 'number') {
          obj[columnNames[index]] = `${value}`;
        } else {
          obj[columnNames[index]] = `"${value}"`;
        }
      });
      return obj;
    });

    // 列名とデータをCSV形式に変換
    const csvContent = [columnNames.join(','), ...(records?.map(record => columnNames.map(name => record[name]).join(',')) ?? [])].join('\n');

    // BOMを追加してファイルに書き込み
    const BOM = "\ufeff";
    fs.writeFileSync(outputFileName, BOM + csvContent);

    console.log('CSVファイルにデータを書き込みました');
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        // 接続を閉じる
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
