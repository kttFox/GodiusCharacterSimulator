//------------------------------------------------------------------------------
//	関数名		：	メニュー展開処理
//	機能説明	：	引数で指定したidの表示／非表示を管理する。
//	パラメータ	：	Id		表示／非表示を行うid名
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function OpenMenu(Id)
{
	var Style = document.getElementById(Id).style;

	if( Style.display == "none" ) {
		Style.display = "block";
	} else {
		Style.display = "none";
	}
}
//------------------------------------------------------------------------------
//	関数名		：	副業メニュー切り替え処理
//	機能説明	：	副業メニューの切り替えを行う
//	パラメータ	：	Job		主職業
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function DispSideJob(Job)
{
	//	変数宣言
	var SideJob = document.chara.sidejob;		//	副業オブジェクト
	var SideJobIndex = new Array();				//	副業位置定義テーブル

	//	副業定義テーブル1（テキスト）
	SideTable1 = [
		["盗賊　　　",	"錬金術士",	"聖職者",	"裁縫士",	"鍛治屋",	"バード"			],	//	戦士
		["戦士　　　",	"盗賊",		"裁縫士",	"鍛治屋",	"バード"						],	//	剣闘士
		["戦士　　　",	"盗賊",		"錬金術士",	"裁縫士",	"鍛治屋",	"バード"			],	//	聖職者
		["戦士　　　",	"錬金術士",	"聖職者",	"裁縫士",	"鍛治屋",	"バード"			],	//	盗賊
		["戦士　　　",	"盗賊",		"錬金術士",	"聖職者",	"裁縫士",	"鍛治屋",	"バード"]	//	魔法使い
	];
	//	副業定義テーブル2（値）
	SideTable2 = [
		["盗",			"錬",		"聖",		"裁",		"鍛",		"鳥"				],	//	戦士
		["戦",			"盗",		"裁",		"鍛",		"鳥"							],	//	剣闘士
		["戦",			"盗",		"錬",		"裁",		"鍛",		"鳥"				],	//	聖職者
		["戦",			"錬",		"聖",		"裁",		"鍛",		"鳥"				],	//	盗賊
		["戦",			"盗",		"錬",		"聖",		"裁",		"鍛",		"鳥"	]	//	魔法使い
	];

	//	副業位置取得処理
	GetSideJobPosition( SideJobIndex );

	//	副業の数を考慮し、０を設定
	SideJob.options.length = 0;

	//	副業メニュー作成
	//	戦士
	if( Job == "戦" ){
		for( var i = 0; i < SideTable1[0].length; ++i ){
			//	副業インデックスとループカウンタが一致する場合
			if( SideJobIndex[0] == i ){
				//	副業選択位置の復元
				SideJob.options[i] = new Option( SideTable1[0][i], SideTable2[0][i], false, true );
			}
			else{
				SideJob.options[i] = new Option( SideTable1[0][i], SideTable2[0][i] );
			}
		}
		return;
	}
	//	剣闘士
	if( Job == "剣" ){
		for( var i = 0; i < SideTable1[1].length; ++i ){
			//	副業インデックスとループカウンタが一致する場合
			if( SideJobIndex[1] == i ){
				//	副業選択位置の復元
				SideJob.options[i] = new Option( SideTable1[1][i], SideTable2[1][i], false, true );
			}
			else{
				SideJob.options[i] = new Option( SideTable1[1][i], SideTable2[1][i] );
			}
		}
		return;
	}
	//	聖職者
	if( Job == "聖" ){
		for( var i = 0; i < SideTable1[2].length; ++i ){
			//	副業インデックスとループカウンタが一致する場合
			if( SideJobIndex[2] == i ){
				//	副業選択位置の復元
				SideJob.options[i] = new Option( SideTable1[2][i], SideTable2[2][i], false, true );
			}
			else{
				SideJob.options[i] = new Option( SideTable1[2][i], SideTable2[2][i] );
			}
		}
		return;
	}
	//	盗賊
	if( Job == "盗" ){
		for( var i = 0; i < SideTable1[3].length; ++i ){
			//	副業インデックスとループカウンタが一致する場合
			if( SideJobIndex[3] == i ){
				//	副業選択位置の復元
				SideJob.options[i] = new Option( SideTable1[3][i], SideTable2[3][i], false, true );
			}
			else{
				SideJob.options[i] = new Option( SideTable1[3][i], SideTable2[3][i] );
			}
		}
		return;
	}
	//	魔法使い
	if( Job == "魔" ){
		for( var i = 0; i < SideTable1[4].length; ++i ){
			//	副業インデックスとループカウンタが一致する場合
			if( SideJobIndex[4] == i ){
				//	副業選択位置の復元
				SideJob.options[i] = new Option( SideTable1[4][i], SideTable2[4][i], false, true );
			}
			else{
				SideJob.options[i] = new Option( SideTable1[4][i], SideTable2[4][i] );
			}
		}
		return;
	}
}
//------------------------------------------------------------------------------
//	関数名		：	職業別スキルメニュー切り替え処理
//	機能説明	：	主職業／副業からスキルメニューの切り替えを行う
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	主職業／副業が切り替わるたびに呼び出すものとする
//------------------------------------------------------------------------------
function ChangeSkillMenuByJob()
{
	var Job = document.chara.job.value;			//	主職業
	var SideJob = document.chara.sidejob.value;	//	副業
	var JobPair = "";							//	主職業＋副業
	var SkillTable = new Array();				//	スキルテーブル
	var StrInner = "" ;

	//	セレクトメニュー取得
	var Skill1 = document.chara.skill1;
	var Skill2 = document.chara.skill2;
	var Skill3 = document.chara.skill3;
	var Skill4 = document.chara.skill4;
	var Skill5 = document.chara.skill5;
	var Skill6 = document.chara.skill6;
	var Skill7 = document.chara.skill7;
	var Skill8 = document.chara.skill8;
	var Skill9 = document.chara.skill9;
	var Skill10 = document.chara.skill10;
	var Skill11 = document.chara.skill11;
	var StrDisabled = "";

	//	主職業＋副業設定
	JobPair = Job + SideJob;

	//	セレクトメニュー有効化
	Skill1.disabled = false;
	Skill2.disabled = false;
	Skill3.disabled = false;
	Skill4.disabled = false;
	Skill5.disabled = false;
	Skill6.disabled = false;
	Skill7.disabled = false;
	Skill8.disabled = false;
	Skill9.disabled = false;
	Skill10.disabled = false;
	Skill11.disabled = false;

	//	スキルテーブル読み込み
	GetSkillTable( SkillTable );

	//	職業分ループ
	for( var i = 0; i <= 29; ++i ){

		//	選択した職業とテーブルの職業が一致する場合
		if( JobPair == SkillTable[i][0] ){

			//	スキル分ループ
			for( var j = 1; j <= 11; ++j ){

				//	スキルなしの場合
				if( SkillTable[i][j] == "　　　　" ){
					//	該当メニューを無効化
					StrDisabled = eval( "Skill" + j );
					StrDisabled.disabled = true;
				}

				//	スキルアイコン画像変換処理
				SkillTable[i][j] = ConvertSkillStringToImage( SkillTable[i][j] );
				if( SkillTable[i][j] != -1 ){

					//	スキル文言変更
					StrInner = document.getElementById("id_skill" + j);
					StrInner.innerHTML = "<img src=\"./img/skill" + SkillTable[i][j] + ".gif\" />";
				}
			}
			break;
		}
	}

	//	副業位置設定
	SetSideJobPosition( Job );

	//	取得魔法無効化切替処理
	ChangeMagicCheckBox( Job, SideJob );
}

//------------------------------------------------------------------------------
//	関数名		：	スキルテーブル読み込み処理
//	機能説明	：	スキルテーブルの読み込みを行う
//	パラメータ	：	SkillTable	スキルテーブル
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetSkillTable(SkillTable)
{
	SkillTable[0] = new Array( "戦盗", "剣　　　", "斧　　　", "メイス　", "素手　　", "回避　　", "暗殺　　", "罠発見　", "罠除去　", "煙幕　　", "プッシュ", "　　　　", "　　　　" );	//	戦盗
	SkillTable[1] = new Array( "戦錬", "剣　　　", "斧　　　", "メイス　", "素手　　", "回避　　", "錬金　　", "応急　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	戦錬
	SkillTable[2] = new Array( "戦聖", "剣　　　", "斧　　　", "メイス　", "素手　　", "回避　　", "援護　　", "聖　　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	戦聖
	SkillTable[3] = new Array( "戦裁", "剣　　　", "斧　　　", "メイス　", "素手　　", "回避　　", "裁縫　　", "修繕　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	戦裁
	SkillTable[4] = new Array( "戦鍛", "剣　　　", "斧　　　", "メイス　", "素手　　", "回避　　", "鍛治　　", "修理　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	戦鍛
	SkillTable[5] = new Array( "戦鳥", "剣　　　", "斧　　　", "メイス　", "素手　　", "回避　　", "槍　　　", "呪文　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	戦鳥
	SkillTable[6] = new Array( "剣戦", "剣　　　", "斧　　　", "メイス　", "素手　　", "回避　　", "暗殺　　", "槍　　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	剣戦
	SkillTable[7] = new Array( "剣盗", "斧　　　", "メイス　", "素手　　", "回避　　", "暗殺　　", "槍　　　", "罠発見　", "罠除去　", "煙幕　　", "プッシュ", "　　　　", "　　　　" );	//	剣盗
	SkillTable[8] = new Array( "剣裁", "剣　　　", "斧　　　", "メイス　", "素手　　", "回避　　", "暗殺　　", "槍　　　", "裁縫　　", "修繕　　", "　　　　", "　　　　", "　　　　" );	//	剣裁
	SkillTable[9] = new Array( "剣鍛", "斧　　　", "メイス　", "素手　　", "回避　　", "暗殺　　", "槍　　　", "鍛治　　", "修理　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	剣鍛
	SkillTable[10] = new Array( "剣鳥", "斧　　　", "メイス　", "素手　　", "回避　　", "暗殺　　", "槍　　　", "呪文　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	剣鳥
	SkillTable[11] = new Array( "盗戦", "剣　　　", "斧　　　", "メイス　", "素手　　", "回避　　", "暗殺　　", "罠発見　", "罠除去　", "煙幕　　", "プッシュ", "　　　　", "　　　　" );	//	盗戦
	SkillTable[12] = new Array( "盗錬", "斧　　　", "回避　　", "暗殺　　", "罠発見　", "罠除去　", "煙幕　　", "プッシュ", "錬金　　", "応急　　", "　　　　", "　　　　", "　　　　" );	//	盗錬
	SkillTable[13] = new Array( "盗聖", "斧　　　", "メイス　", "回避　　", "暗殺　　", "罠発見　", "罠除去　", "煙幕　　", "プッシュ", "援護　　", "聖　　　", "　　　　", "　　　　" );	//	盗聖
	SkillTable[14] = new Array( "盗裁", "剣　　　", "斧　　　", "回避　　", "暗殺　　", "罠発見　", "罠除去　", "煙幕　　", "プッシュ", "裁縫　　", "修繕　　", "　　　　", "　　　　" );	//	盗裁
	SkillTable[15] = new Array( "盗鍛", "斧　　　", "メイス　", "回避　　", "暗殺　　", "罠発見　", "罠除去　", "煙幕　　", "プッシュ", "鍛治　　", "修理　　", "　　　　", "　　　　" );	//	盗鍛
	SkillTable[16] = new Array( "盗鳥", "斧　　　", "回避　　", "暗殺　　", "槍　　　", "罠発見　", "罠除去　", "煙幕　　", "プッシュ", "呪文　　", "　　　　", "　　　　", "　　　　" );	//	盗鳥
	SkillTable[17] = new Array( "魔戦", "剣　　　", "斧　　　", "メイス　", "素手　　", "回避　　", "火　　　", "氷　　　", "援護　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	魔戦
	SkillTable[18] = new Array( "魔盗", "斧　　　", "素手　　", "回避　　", "暗殺　　", "罠発見　", "罠除去　", "煙幕　　", "プッシュ", "火　　　", "氷　　　", "援護　　", "　　　　" );	//	魔盗
	SkillTable[19] = new Array( "魔錬", "斧　　　", "素手　　", "火　　　", "氷　　　", "援護　　", "錬金　　", "応急　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	魔錬
	SkillTable[20] = new Array( "魔聖", "メイス　", "素手　　", "火　　　", "氷　　　", "援護　　", "聖　　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	魔聖
	SkillTable[21] = new Array( "魔裁", "剣　　　", "素手　　", "火　　　", "氷　　　", "援護　　", "裁縫　　", "修繕　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	魔裁
	SkillTable[22] = new Array( "魔鍛", "メイス　", "素手　　", "火　　　", "氷　　　", "援護　　", "裁縫　　", "修繕　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	魔鍛
	SkillTable[23] = new Array( "魔鳥", "素手　　", "槍　　　", "火　　　", "氷　　　", "援護　　", "呪文　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	魔鳥
	SkillTable[24] = new Array( "聖戦", "剣　　　", "斧　　　", "メイス　", "素手　　", "回避　　", "援護　　", "聖　　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	聖戦
	SkillTable[25] = new Array( "聖盗", "斧　　　", "メイス　", "回避　　", "暗殺　　", "罠発見　", "罠除去　", "煙幕　　", "プッシュ", "援護　　", "聖　　　", "　　　　", "　　　　" );	//	聖盗
	SkillTable[26] = new Array( "聖錬", "斧　　　", "メイス　", "援護　　", "聖　　　", "錬金　　", "応急　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	聖錬
	SkillTable[27] = new Array( "聖裁", "剣　　　", "メイス　", "援護　　", "聖　　　", "裁縫　　", "修繕　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	聖裁
	SkillTable[28] = new Array( "聖鍛", "メイス　", "援護　　", "聖　　　", "鍛治　　", "修理　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	聖鍛
	SkillTable[29] = new Array( "聖鳥", "メイス　", "槍　　　", "援護　　", "聖　　　", "呪文　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　", "　　　　" );	//	聖鳥

	return SkillTable;
}
//------------------------------------------------------------------------------
//	関数名		：	フォームリセット処理
//	機能説明	：	フォームのリセットを行う。
//					副業メニューを戦士のものへ変更する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function FormReset()
{
	//	魔法チェックボックスオブジェクト設定
	var Fire = document.chara.fire;						//	火
	var Ice = document.chara.ice;						//	氷
	var Magical = document.chara.magical;				//	援護
	var Holy = document.chara.holy;						//	聖

	//	副業オブジェクト設定
	var SideJob = document.chara.sidejob;

	//	副業定義テーブル1（テキスト）
	SideTable1 = [
		["盗賊　　　",	"錬金術士",	"聖職者",	"裁縫士",	"鍛治屋",	"バード"			]	//	戦士
	];
	//	副業定義テーブル2（値）
	SideTable2 = [
		["盗",			"錬",		"聖",		"裁",		"鍛",		"鳥"				]	//	戦士
	];

	//	フォームの値をリセット
	document.chara.reset();

	//	副業のリセット
	SideJob.options.length = 0;

	//	副業メニュー生成
	for( var i = 0; i < SideTable1[0].length; ++i ){
		SideJob.options[i] = new Option( SideTable1[0][i], SideTable2[0][i] );
	}

	//	スキルラべルリセット
	SkillLabelReset();

	//	配列サイズ最大値設定
	var MaxLength = 0;
	MaxLength = Math.max( Fire.length, Ice.length );	//	火と氷の比較
	MaxLength = Math.max( MaxLength, Magical.length );	//	援護との比較
	MaxLength = Math.max( MaxLength, Holy.length );		//	聖との比較

	//	取得魔法チェックボックスリセット
	for( var i = 0; i < MaxLength; ++i ){
		if( i < Fire.length ){
			//	火ボタン、およびチェックボックス無効化
			document.chara.firebutton.disabled = true;
			Fire[i].disabled = true;
		}
		if( i < Ice.length ){
			//	氷ボタン、およびチェックボックス無効化
			document.chara.icebutton.disabled = true;
			Ice[i].disabled = true;
		}
		if( i < Magical.length ){
			//	援護ボタン、およびチェックボックス無効化
			document.chara.magicalbutton.disabled = true;
			Magical[i].disabled = true;
		}
		if( i < Holy.length ){
			//	聖ボタン、およびチェックボックス無効化
			document.chara.holybutton.disabled = true;
			Holy[i].disabled = true;
		}
	}
}
//------------------------------------------------------------------------------
//	関数名		：	スキルラベルリセット処理
//	機能説明	：	フォームのスキルラベルのリセットを行う。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	フォームリセット処理内で呼び出すものとする。
//------------------------------------------------------------------------------
function SkillLabelReset()
{
	var SkillTable = new Array();
	var StrInner = "" ;

	//	スキルテーブル取得
	GetSkillTable( SkillTable );

	//	スキル数分ループ
	for( var i = 1; SkillTable[0][i] != "　　　　"; ++i ){

		//	スキルアイコン画像変換処理
		SkillTable[0][i] = ConvertSkillStringToImage( SkillTable[0][i] );

		//	変換成功の場合
		if( SkillTable[0][i] != -1 ){
			//	該当ラベルへ戦士／盗賊のスキルを設定
			StrInner = document.getElementById("id_skill" + i);
			StrInner.innerHTML = "<img src=\"./img/skill" + SkillTable[0][i] + ".gif\" />";
		}
	}
}
//------------------------------------------------------------------------------
//	関数名		：	魔法チェックボックス無効化処理
//	機能説明	：	職業により魔法チェックボックス無効化設定の切り替えを行う。
//	パラメータ	：	Job		主職業
//					SideJob	副業
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function ChangeMagicCheckBox( Job, SideJob )
{
	//	魔法チェックボックスオブジェクト設定
	var Fire = document.chara.fire;						//	火
	var Ice = document.chara.ice;						//	氷
	var Magical = document.chara.magical;				//	援護
	var Holy = document.chara.holy;						//	聖

	//	残玉
	var Balance = document.chara.balance.value - 0;

	//	配列サイズ最大値設定
	var MaxLength = 0;
	MaxLength = Math.max( Fire.length, Ice.length );	//	火と氷の比較
	MaxLength = Math.max( MaxLength, Magical.length );	//	援護との比較
	MaxLength = Math.max( MaxLength, Holy.length );		//	聖との比較

	//	配列サイズ最大値分ループ
	for( var i = 0; i < MaxLength; ++i ){
		if( i < Fire.length ){
			//	火ボタン、およびチェックボックス無効化
			document.chara.firebutton.disabled = true;
			Fire[i].disabled = true;
		}
		if( i < Ice.length ){
			//	氷ボタン、およびチェックボックス無効化
			document.chara.icebutton.disabled = true;
			Ice[i].disabled = true;
		}
		if( i < Magical.length ){
			//	援護ボタン、およびチェックボックス無効化
			document.chara.magicalbutton.disabled = true;
			Magical[i].disabled = true;
		}
		if( i < Holy.length ){
			//	聖ボタン、およびチェックボックス無効化
			document.chara.holybutton.disabled = true;
			Holy[i].disabled = true;
		}
	}

	//	魔法使いの場合
	if( Job == "魔" ){
		//	火ボタン、およびチェックボックス有効化
		document.chara.firebutton.disabled = false;
		for( var i = 0; i < Fire.length; ++i ){
			Fire[i].disabled = false;
		}
		//	氷ボタン、およびチェックボックス有効化
		document.chara.icebutton.disabled = false;
		for( var i = 0; i < Ice.length; ++i ){
			Ice[i].disabled = false;
		}
	}

	//	魔法使い以外の場合
	else{
		//	火チェックボックスOFF
		for( var i = 0; i < Fire.length; ++i ){
			//	残玉連動ONの場合のみ処理を行う
			if( document.chara.link.checked ) {
				//	チェックボックス無効の場合
				if( Fire[i].disabled == true ){
					if( Fire[i].checked == true ){
						//	チェックボックスOFF
						Fire[i].checked = false;
						Balance += Fire[i].value - 0;
					}
				}
			}
		}
		//	氷チェックボックスOFF
		for( var i = 0; i < Ice.length; ++i ){
			//	残玉連動ONの場合のみ処理を行う
			if( document.chara.link.checked ) {
				//	チェックボックス無効の場合
				if( Ice[i].disabled == true ){
					if( Ice[i].checked == true ){
						//	チェックボックスOFF
						Ice[i].checked = false;
						Balance += Ice[i].value - 0;
					}
				}
			}
		}
	}

	//	聖職者の場合
	if( Job == "聖" || SideJob == "聖" ){
		//	聖ボタン、およびチェックボックス有効化
		document.chara.holybutton.disabled = false;
		for( var i = 0; i < Holy.length; ++i ){
			Holy[i].disabled = false;
		}
	}

	//	聖職者以外の場合
	else{
		for( var i = 0; i < Holy.length; ++i ){
			//	残玉連動ONの場合のみ処理を行う
			if( document.chara.link.checked ) {
				//	チェックボックス無効の場合
				if( Holy[i].disabled == true ){
					if( Holy[i].checked == true ){
						//	チェックボックスOFF
						Holy[i].checked = false;
						Balance += Holy[i].value - 0;
					}
				}
			}
		}
	}

	//	魔法使い、または聖職者の場合
	if( Job == "魔" || Job == "聖" || SideJob == "聖" ){
		//	援護ボタン、およびチェックボックス有効化
		document.chara.magicalbutton.disabled = false;
		for( var i = 0; i < Magical.length; ++i ){
			Magical[i].disabled = false;
		}
	}

	//	魔法使い以外、かつ聖職者以外の場合
	else{
		//	援護チェックボックスOFF
		for( var i = 0; i < Magical.length; ++i ){
			//	残玉連動ONの場合のみ処理を行う
			if( document.chara.link.checked ) {
				//	チェックボックス無効の場合
				if( Magical[i].disabled == true ){
					if( Magical[i].checked == true ){
						//	チェックボックスOFF
						Magical[i].checked = false;
						Balance += Magical[i].value - 0;
					}
				}
			}
		}
	}

	//	残玉連動ONの場合のみ処理を行う
	if( document.chara.link.checked ) {
		//	残玉設定
		document.chara.balance.value = Balance;
	}
}
//------------------------------------------------------------------------------
//	関数名		：	スキルアイコン画像変換処理
//	機能説明	：	スキル名から画像パスの変換を行う。
//	パラメータ	：	Skill	スキル名
//	戻り値		：	ConvTable[i][1]	画像ファイルインデックス
//					-1				変換失敗
//	備考		：	なし
//------------------------------------------------------------------------------
function ConvertSkillStringToImage( Skill )
{
	//	変換テーブル
	var	ConvTable = [
			["剣　　　", "01"],
			["斧　　　", "02"],
			["メイス　", "03"],
			["素手　　", "04"],
			["回避　　", "05"],
			["暗殺　　", "06"],
			["槍　　　", "07"],
			["罠発見　", "08"],
			["罠除去　", "09"],
			["煙幕　　", "10"],
			["プッシュ", "11"],
			["火　　　", "12"],
			["氷　　　", "13"],
			["援護　　", "14"],
			["錬金　　", "15"],
			["応急　　", "16"],
			["聖　　　", "17"],
			["裁縫　　", "18"],
			["修繕　　", "19"],
			["鍛治　　", "20"],
			["修理　　", "21"],
			["呪文　　", "22"],
			["　　　　", "99"]
		];

	for( var i = 0; i < 23; ++i ){
		if( Skill == ConvTable[i][0] ){
			return ConvTable[i][1];
		}
	}
	return -1;
}
//------------------------------------------------------------------------------
//	関数名		：	残玉設定値判定処理
//	機能説明	：	残玉の値に対する数値判定を行い、不正な場合0を設定する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function CheckBalanceValue()
{
	//	残玉
	var Balance = document.chara.balance.value;

	//	空欄の場合
	if( Balance == "" ){
		document.chara.balance.value = 0;
		return;
	}

	//	数値でない場合
	if( isNaN( Balance ) == true ){
		document.chara.balance.value = 0;
		return;
	}
}
//------------------------------------------------------------------------------
//	関数名		：	副業位置取得処理
//	機能説明	：	各種職業における副業の位置を設定する。
//					本処理はページ読み込み時における副業の位置とは無関係である。
//					（上記についてはchara.htmにて定義する）
//	パラメータ	：	SideJobIndex	副業位置定義テーブル
//	戻り値		：	なし
//	備考		：	副業の位置はフォーム上に隠しフィールドとして保持する。
//------------------------------------------------------------------------------
function GetSideJobPosition( SideJobIndex )
{
	//	副業位置設定
	SideJobIndex[0] = document.chara.senpos.value;
	SideJobIndex[1] = document.chara.kenpos.value;
	SideJobIndex[2] = document.chara.seipos.value;
	SideJobIndex[3] = document.chara.toupos.value;
	SideJobIndex[4] = document.chara.mapos.value;
}
//------------------------------------------------------------------------------
//	関数名		：	副業位置設定処理
//	機能説明	：	各種職業における副業の位置を隠しフィールドへ設定する。
//					本処理はページ読み込み時における副業の位置とは無関係である。
//					（上記についてはchara.htmにて定義する）
//	パラメータ	：	Job		主職業
//	戻り値		：	なし
//	備考		：	副業の位置はフォーム上に隠しフィールドとして保持する。
//------------------------------------------------------------------------------
function SetSideJobPosition( Job )
{
	//	変数宣言
	var Index = document.chara.sidejob.selectedIndex;	//	副業選択インデックス

	//	主職業判定
	switch ( Job ){

		//	戦士
		case	"戦"	:
			document.chara.senpos.value = Index;
			break;

		//	剣闘士
		case	"剣"	:
			document.chara.kenpos.value = Index;
			break;

		//	聖職者
		case	"聖"	:
			document.chara.seipos.value = Index;
			break;

		//	盗賊
		case	"盗"	:
			document.chara.toupos.value = Index;
			break;

		//	魔法使い
		case	"魔"	:
			document.chara.mapos.value = Index;
			break;

		//	上記以外
		default			:
			break;
	}
}
