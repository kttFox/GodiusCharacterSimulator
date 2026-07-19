//	共通定数定義
//	初期パラメータ（全職業共通、すべて6から開始）
var INITIAL_STATS = { str: 6, int: 6, agr: 6, dex: 6, vit: 6, men: 6 };

//	初期化時にもらえる力の玉（全職業共通）
var INITIAL_TAMA = 36;

//	スキルアップテーブル（レベルi→i+1の成功率[%]と固定上げ玉数）
//	添字0がレベル1→2。レベル30以降は暫定値（成功率5%、固定20玉）。
var SKILL_UP_TABLE = [
	{ per: 90, fix:  2 },	//	 1→ 2
	{ per: 90, fix:  2 },	//	 2→ 3
	{ per: 85, fix:  2 },	//	 3→ 4
	{ per: 80, fix:  2 },	//	 4→ 5
	{ per: 75, fix:  3 },	//	 5→ 6
	{ per: 70, fix:  3 },	//	 6→ 7
	{ per: 65, fix:  3 },	//	 7→ 8
	{ per: 60, fix:  3 },	//	 8→ 9
	{ per: 55, fix:  3 },	//	 9→10
	{ per: 50, fix:  4 },	//	10→11
	{ per: 50, fix:  4 },	//	11→12
	{ per: 45, fix:  4 },	//	12→13
	{ per: 40, fix:  4 },	//	13→14
	{ per: 35, fix:  4 },	//	14→15
	{ per: 30, fix:  5 },	//	15→16
	{ per: 25, fix:  5 },	//	16→17
	{ per: 20, fix:  5 },	//	17→18
	{ per: 15, fix:  5 },	//	18→19
	{ per: 12, fix:  5 },	//	19→20
	{ per: 10, fix: 10 },	//	20→21
	{ per: 10, fix: 10 },	//	21→22
	{ per: 10, fix: 10 },	//	22→23
	{ per: 10, fix: 10 },	//	23→24
	{ per: 10, fix: 10 },	//	24→25
	{ per:  6, fix: 15 },	//	25→26
	{ per:  6, fix: 15 },	//	26→27
	{ per:  6, fix: 15 },	//	27→28
	{ per:  6, fix: 15 },	//	28→29
	{ per:  6, fix: 15 }	//	29→30
];

//	スキル上限
var SKILL_MAX = 30;

//	スキル１から３０までの固定スキルアップに必要な力の玉（累計）
//	および確率スキルアップの期待玉数（累計、1回1玉消費・期待値=100/成功率）
var SKILL_BASE_TAMA = new Array( SKILL_MAX );
var SKILL_EXPECT_TAMA = new Array( SKILL_MAX );
SKILL_BASE_TAMA[0] = 0;
SKILL_EXPECT_TAMA[0] = 0;
for( var _k = 1; _k <= SKILL_MAX - 1; _k++ ) {
	SKILL_BASE_TAMA[ _k ] = SKILL_BASE_TAMA[ _k - 1 ] + SKILL_UP_TABLE[ _k - 1 ].fix;
	SKILL_EXPECT_TAMA[ _k ] = SKILL_EXPECT_TAMA[ _k - 1 ] + 100 / SKILL_UP_TABLE[ _k - 1 ].per;
}

//	スキル必要玉数（併用方式：レベル17までは確率(期待値)、18以降は固定で上げる）
//	添字＝レベル-1、値＝レベル1からの累計玉数
var SKILL_HYBRID_BORDER = 17;
var SKILL_HYBRID_TAMA = new Array( SKILL_MAX );
for( var _n = 0; _n <= SKILL_MAX - 1; _n++ ) {
	if( _n <= SKILL_HYBRID_BORDER - 1 ) {
		//	レベル17以下：確率期待値
		SKILL_HYBRID_TAMA[ _n ] = SKILL_EXPECT_TAMA[ _n ];
	} else {
		//	レベル18以上：17まで期待値＋以降固定
		SKILL_HYBRID_TAMA[ _n ] = SKILL_EXPECT_TAMA[ SKILL_HYBRID_BORDER - 1 ]
			+ SKILL_BASE_TAMA[ _n ] - SKILL_BASE_TAMA[ SKILL_HYBRID_BORDER - 1 ];
	}
}

//	フォーム要素配列化処理
//	機能説明	：	同名フォーム要素が1つの場合は単一要素、複数の場合はリストとなるため、
//				常に配列として扱えるよう変換する。
//	戻り値		：	要素の配列
function ToElementArray( Obj )
{
	if( !Obj ) {
		return [];
	}
	if( Obj.length === undefined ) {
		return [ Obj ];
	}
	return Obj;
}

//	初期パラメータ取得処理
//	戻り値：初期パラメータオブジェクト（職業によらず共通）
function GetInitialStats( Job )
{
	return INITIAL_STATS;
}
