//	フォーム初期値（デフォルト）連想配列
//	※共有URLへ出力するか否かの判定基準となる固定値。
//	　現在のフォーム状態に依存させないため定数として保持する。
//	　値を変更した場合は既存の共有URLの解釈が変わる点に注意すること。
var ShareDefaultValue = {
	"lv"		: "1",
	"hp"		: "",
	"mp"		: "",
	"sp"		: "",
	"str"		: "15",
	"int"		: "6",
	"dex"		: "6",
	"agr"		: "6",
	"vit"		: "15",
	"men"		: "15",
	"balance"	: "",
	"weapon"	: "0",
	"weaponp"	: "0",
	"armor"		: "0",
	"armorp"	: "0",
	"shoes"		: "0",
	"shoesp"	: "0",
	"shield"	: "0",
	"ring1"		: "0",
	"ring2"		: "0",
	"necklace"	: "0"
};

//	共有機能初期化済みフラグ
//	※初期化前のURL書き換えを抑止するために使用する。
var ShareInitialized = false;

//	共有対象スカラー項目定義（キー名：フォーム項目名）
var SHARE_SCALAR_KEYS = [
	"lv", "hp", "mp", "sp",
	"str", "int", "dex", "agr", "vit", "men",
	"balance",
	"weapon", "weaponp", "armor", "armorp", "shoes", "shoesp",
	"shield", "ring1", "ring2", "necklace"
];

//	共有対象チェックボックス群定義（キー名：フォーム項目名）
var SHARE_GROUP_KEYS = {
	"火炎"	: "fire",
	"冷凍"	: "ice",
	"援護"	: "magical",
	"聖"	: "holy",
	"戦技"	: "warrior",
	"剣技"	: "gladiator",
	"強化"	: "doping",
	"課金衣装"	: "costume"
};

//------------------------------------------------------------------------------
//	関数名		：	共有機能初期化処理
//	機能説明	：	フォームの初期値を保持し、URLからの復元を行う。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	body onload から FormReset() の後に呼び出すこと
//------------------------------------------------------------------------------
function InitShare()
{
	//	URLからの復元
	LoadFromUrl();

	//	初期化完了（以降のURL書き換えを許可）
	ShareInitialized = true;
}
//------------------------------------------------------------------------------
//	関数名		：	現職業スキル名取得処理
//	機能説明	：	現在の主職業／副業のスキル名一覧を取得する。
//	パラメータ	：	なし
//	戻り値		：	スキル名配列（[0]がskill1に対応）
//	備考		：	なし
//------------------------------------------------------------------------------
function GetShareSkillNames()
{
	var Names = new Array();
	var JobPair = document.chara.job.value + document.chara.sidejob.value;
	var SkillTable = new Array();

	//	スキルテーブル取得
	GetSkillTable( SkillTable );

	//	職業分ループ
	for( var i = 0; i < SkillTable.length; ++i ){
		if( JobPair == SkillTable[i][0] ){
			//	スキル分ループ（空白パディングを削除して設定）
			for( var j = 1; SkillTable[i][j] != "　　　　"; ++j ){
				Names.push( SkillTable[i][j].split( "　" )[0] );
			}
			break;
		}
	}
	return Names;
}
//------------------------------------------------------------------------------
//	関数名		：	チェックボックス群１０進数化処理
//	機能説明	：	チェックボックス群のチェック状態を１０進数値へ変換する。
//	パラメータ	：	Elements	チェックボックス群
//	戻り値		：	１０進数値
//	備考		：	左（[0]番目）の項目からビット値1、2、4、…を割り当てる。
//------------------------------------------------------------------------------
function GroupToDecimal( Elements )
{
	var Decimal = 0;
	var aElements = ToElementArray( Elements );
	for( var i = 0; i < aElements.length; ++i ){
		if( aElements[i].checked ){
			Decimal += ( 1 << i );
		}
	}
	return Decimal;
}
//------------------------------------------------------------------------------
//	関数名		：	共有パラメータ作成処理
//	機能説明	：	フォームの値のうち初期値と異なる項目のみを
//					キー:値 形式の配列として作成する。
//	パラメータ	：	なし
//	戻り値		：	キー:値 文字列の配列
//	備考		：	形式：キー:値,キー:値,...
//					例　：戦錬,lv:50,str:15,暗殺:25,火炎:1011
//					先頭に職業＋副業（例：戦錬）を常に出力する。
//					スキルはスキル名をキーとし、魔法等は２進数で表す。
//------------------------------------------------------------------------------
function BuildSharePairs()
{
	var Pairs = new Array();
	var i;

	//	職業＋副業（常に出力、例：戦錬）
	Pairs.push( document.chara.job.value + document.chara.sidejob.value );

	//	スカラー項目（初期値と異なる場合のみ）
	for( i = 0; i < SHARE_SCALAR_KEYS.length; ++i ){
		var Name = SHARE_SCALAR_KEYS[i];
		if( !document.chara[ Name ] ){
			continue;
		}
		var Value = String( document.chara[ Name ].value );
		if( Value != ShareDefaultValue[ Name ] ){
			Pairs.push( Name + ":" + Value );
		}
	}

	//	スキル項目（スキル名をキーとし、Lv1（初期値）以外のみ）
	var SkillNames = GetShareSkillNames();
	for( i = 0; i < SkillNames.length; ++i ){
		var Skill = document.chara[ "skill" + ( i + 1 ) ];
		if( Skill && !Skill.disabled && String( Skill.value ) != "1" ){
			Pairs.push( SkillNames[i] + ":" + Skill.value );
		}
	}

	//	チェックボックス群（１つでもチェックがある場合のみ設定）
	//	左の項目からビット値1、2、4、…とし、１０進数で出力する
	for( var Key in SHARE_GROUP_KEYS ){
		var Elements = document.chara[ SHARE_GROUP_KEYS[ Key ] ];
		if( !Elements ){
			continue;
		}
		var Decimal = GroupToDecimal( Elements );
		if( Decimal > 0 ){
			Pairs.push( Key + ":" + Decimal );
		}
	}

	return Pairs;
}
//------------------------------------------------------------------------------
//	関数名		：	共有URLリアルタイム更新処理
//	機能説明	：	フォームの現在値をアドレスバーのURL（ハッシュ部）へ反映する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	履歴を汚さないよう replaceState を使用する。
//					UpdateRealtimeAll から呼び出される。
//------------------------------------------------------------------------------
function UpdateShareUrl()
{
	//	初期化前は処理しない
	//	※URLからの復元前にハッシュ部を上書きしないようにするため。
	if( !ShareInitialized ){
		return;
	}

	var Hash = "#d=" + BuildSharePairs().join( "," );
	if( history.replaceState ){
		history.replaceState( null, "", location.pathname + location.search + Hash );
	} else {
		location.hash = Hash.substr( 1 );
	}
}
//------------------------------------------------------------------------------
//	関数名		：	共有URL発行処理
//	機能説明	：	フォームの現在値から共有URLを生成し、クリップボードへコピーする。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function CreateShareUrl()
{
	//	共有URL生成（ハッシュ部へ格納）
	var Url = location.href.split( "#" )[0] + "#d=" + BuildSharePairs().join( "," );

	//	クリップボードへコピー
	if( navigator.clipboard && navigator.clipboard.writeText ){
		navigator.clipboard.writeText( Url ).then(
			function(){ alert( "共有URLをクリップボードにコピーしました。\n" ); },
			function(){ prompt( "共有URLをコピーしてください。", Url ); }
		);
	} else {
		prompt( "共有URLをコピーしてください。", Url );
	}

	//	アドレスバーにも反映
	UpdateShareUrl();
}
//------------------------------------------------------------------------------
//	関数名		：	共有URL読み込み処理
//	機能説明	：	URL（ハッシュ部）の値を解析し、フォームへ設定する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function LoadFromUrl()
{
	//	共有URL文字列読み込み処理（現在のURL）
	LoadFromUrlText( location.href );
}
//------------------------------------------------------------------------------
//	関数名		：	共有URL入力読み込み処理
//	機能説明	：	入力ダイアログで共有URLを受け取り、フォームへ設定する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	「URLからロード」ボタンから呼び出す。
//------------------------------------------------------------------------------
function LoadFromUrlInput()
{
	var Text = prompt( "共有URLを入力してください。\n", "" );

	//	キャンセル・空文字の場合
	if( Text == null || Text.replace( /^\s+|\s+$/g, "" ) == "" ){
		return;
	}

	//	共有URL文字列読み込み処理
	if( LoadFromUrlText( Text ) == false ){
		alert( "共有URLの形式が正しくありません。\n" );
	}
}
//------------------------------------------------------------------------------
//	関数名		：	共有URL文字列読み込み処理
//	機能説明	：	共有URL文字列のハッシュ部を解析し、フォームへ設定する。
//	パラメータ	：	Text	共有URL文字列（ハッシュ部のみでも可）
//	戻り値		：	true：設定した／false：ハッシュ部なし
//	備考		：	なし
//------------------------------------------------------------------------------
function LoadFromUrlText( Text )
{
	//	ハッシュ部の抽出・検査
	var Pos = String( Text ).indexOf( "#d=" );
	if( Pos < 0 ){
		return false;
	}
	var Hash = String( Text ).substr( Pos ).replace( /^\s+|\s+$/g, "" );

	try {
		//	キー:値 の組を連想配列へ解析（ブラウザによる%エンコードを考慮）
		var Map = {};
		var JobPair = "";
		var Pairs = Hash.substr( 3 ).split( "," );
		for( var i = 0; i < Pairs.length; ++i ){
			var Item = decodeURIComponent( Pairs[i] );
			var Pos = Item.indexOf( ":" );

			//	コロンなしの項目は職業＋副業（例：戦錬）
			if( Pos <= 0 ){
				JobPair = Item;
				continue;
			}
			Map[ Item.substr( 0, Pos ) ] = Item.substr( Pos + 1 );
		}

		//	職業・副業を先に設定し、スキルメニュー等を切り替える
		if( JobPair.length == 2 ){
			document.chara.job.value = JobPair.charAt( 0 );
			document.chara.sidejob.value = JobPair.charAt( 1 );
		}
		ChangeSkillMenuByJob();

		//	スカラー項目の設定
		for( var i = 0; i < SHARE_SCALAR_KEYS.length; ++i ){
			var Name = SHARE_SCALAR_KEYS[i];
			if( Map[ Name ] != undefined && document.chara[ Name ] ){
				document.chara[ Name ].value = Map[ Name ];
			}
		}

		//	スキル項目の設定（スキル名からskill番号を特定）
		//	※旧データは「歌」を「呪文」で保持しているため読み替える
		var SkillNames = GetShareSkillNames();
		for( var i = 0; i < SkillNames.length; ++i ){
			var SkillValue = Map[ SkillNames[i] ];
			if( SkillValue == undefined && SkillNames[i] == "歌" ){
				SkillValue = Map[ "呪文" ];
			}
			if( SkillValue != undefined ){
				document.chara[ "skill" + ( i + 1 ) ].value = SkillValue;
			}
		}

		//	チェックボックス群の設定（１０進数から復元）
		//	左の項目からビット値1、2、4、…に対応する
		for( var Key in SHARE_GROUP_KEYS ){
			if( Map[ Key ] == undefined ){
				continue;
			}
			var aElements = ToElementArray( document.chara[ SHARE_GROUP_KEYS[ Key ] ] );

			var Decimal = Number( Map[ Key ] );
			if( isNaN( Decimal ) ){
				continue;
			}

			for( var i = 0; i < aElements.length; ++i ){
				aElements[i].checked = ( ( Decimal >> i ) & 1 ) == 1;
			}
		}

		//	リアルタイム表示更新
		if( typeof UpdateRealtimeAll == "function" ){
			UpdateRealtimeAll();
		}
	} catch( e ) {
		alert( "共有URLの読み込みに失敗しました。\n" );
		return false;
	}
	return true;
}
