'use strict';
  //------------------
  //「2010 年から 2015 年にかけて 15〜19 歳の人が増えた割合の都道府県ランキング」を作成
  //------------------


//ファイルを扱うモジュールの呼び出し
const fs = require('fs');
//ファイルを一行ずつ読み込むモジュールの呼び出し
const readline = require('readline');
//csvファイルから、読み込みを行うStreamを生成
const rs = fs.ReadStream('./popu-pref.csv');
//rsをreadlineオブジェクトのinputとして設定
const rl = readline.createInterface({ 'input': rs, 'output': {} });
//集計されたデータを格納する連想配列
const map = new Map();// key: 都道府県 value: 集計データのオブジェクト

//lineというイベントが発生したら、この無名関数を呼ぶ
//lineSrringには、読み込んだ１行の文字列が入る
rl.on('line', (lineString) => {
  // console.log(lineString);

  //カンマで分割して配列にする
  const columns = lineString.split(',');
  //集計年（数字に変換）
  const year = parseInt(columns[0]);
  //都道府県（文字列のまま）
  const proFevture = columns[2];
  //人口（数字に変換）
  const popu = parseInt(columns[7]);
  
  //集計年が、2010または2015である時のみ（数字で比較）
  if (year === 2010 || year === 2015) {
    // console.log(year);
    // console.log(proFevture);
    // console.log(popu);
    
    //mapから県名をkeyにしたデータを取得
    let value = map.get(proFevture);
    //valueがFalsyだった場合=その県のデータを処理するのが初めて（undefined）である場合
    if (!value) {
      //初期値になる値をvalueに代入
      value = {
        p10: 0,//2010年の人口
        p15: 0,//2015年の人口
        change: null//人口の変化率
      };
    }
    //各年代の人口を代入
    if (year === 2010) {
      value.p10 += popu;
    }
    if (year === 2015) {
      value.p15 += popu;
    }
    //県名をketにして人口をMapにセット
    map.set(proFevture, value);

  }
});

//resumeメソッドは、ストリームに情報を流し始める処理
rl.resume();

//'close' イベントは、全ての行を読み込み終わったときに呼び出し
rl.on('close', () => {
  // console.log(map);

  //都道府県ごとの変化率を計算
  //for-of 構文（mapの中身をループ）
  for (let pair of map) {
    //pair[0] でkeyである都道府県名、
    //pair[1] で値である集計オブジェクトを 変数valueに参照渡し？
    const value = pair[1];
    //変化率を計算
    value.change = value.p15 / value.p10;
  }
  // console.log(map);

  //変化率ごとに並べ替え
  const rankingArray = Array.from(map).sort((p1, p2) => {
    //Array.from(map)で連想配列を普通の配列に変換
    //sort() で渡す関数 → 比較関数（並び替えをするルール）
    //returnが正か負で並び替えをする（昇順、降順を決める）
    return p1[1].change - p2[1].change;
  });
  //  console.log(rankingArray);
  const rankingStrings = rankingArray.map((p,i) => {
    //map関数
     return '\n 第' + (i+1) + '位 ' + p[0] + ': ' + p[1].p10 + '人 => ' + p[1].p15 + '人 変化率: ' + p[1].change;
  });
   console.log('人が減った割合のランキング\n'+rankingStrings);



});
