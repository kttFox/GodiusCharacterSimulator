//	フォーム初期値セーブ文字列（初期値セーブ判定用）
var DefaultSaveString = null;

//------------------------------------------------------------------------------
//	関数名		：	ストレージ機能初期化処理
//	機能説明	：	フォームの初期値からセーブ文字列を作成し保持する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	body onload から FormReset() の後に呼び出すこと
//------------------------------------------------------------------------------
function InitStorage()
{
	DefaultSaveString = BuildSaveString();
}
//------------------------------------------------------------------------------
//	関数名		：	セーブ文字列作成処理
//	機能説明	：	フォームの現在値からセーブデータ文字列を作成する。
//	パラメータ	：	なし
//	戻り値		：	セーブデータ文字列（キャラ名は含まない）
//	備考		：	なし
//------------------------------------------------------------------------------
function BuildSaveString()
{
	var SaveValue = new Array();

	//	フォーム情報取得処理
	GetFormValue( SaveValue );

	//	先頭配列エスケープ
	var SaveString = escape( SaveValue[0] );

	//	配列内容ループ
	for( var i = 1 ; i < SaveValue.length; ++i ){
		SaveString += "%00" + escape( SaveValue[i] );
	}
	return SaveString;
}
//------------------------------------------------------------------------------
//	関数名		：	セーブデータ読み込み処理
//	機能説明	：	localStorageからセーブデータ文字列を取得する。
//	パラメータ	：	Key		セーブデータキー名
//	戻り値		：	セーブデータ文字列（存在しない場合はnull）
//	備考		：	なし
//------------------------------------------------------------------------------
function ReadSaveData( Key )
{
	try {
		var Value = localStorage.getItem( Key );
		if( Value != null && Value != "" ){
			return Value;
		}
	} catch( e ) {
		;
	}
	return null;
}
//------------------------------------------------------------------------------
//	関数名		：	セーブ情報設定処理
//	機能説明	：	フォームの値を取得し、localStorageへ値を設定する。
//	パラメータ	：	SaveKey	セーブデータキー名
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function SaveChara( SaveKey )
{
	//	変数宣言
	var SaveString = "";				//	セーブデータ設定文字列

	//	キャラ名取得
	var CharaName = document.chara.charaname ? document.chara.charaname.value : "";

	//	セーブ文字列作成処理（キャラ名なし）
	SaveString = BuildSaveString();

	//	初期値セーブの場合、セーブ情報を削除する
	if( SaveString == DefaultSaveString && CharaName == "" ){

		//	セーブデータがない場合は何もしない
		if( ReadSaveData( SaveKey ) == null ){
			alert( "初期値のためセーブしませんでした。\n" );
			return;
		}

		//	確認メッセージ
		if( confirm( "初期値のため、このスロットのセーブ情報を削除します。よろしいですか？\n" ) == false ){
			return;
		}

		//	セーブデータ削除
		try {
			localStorage.removeItem( SaveKey );
		} catch( e ) {
			;
		}

		//	ロードボタン有効化状態更新処理
		UpdateLoadButtons();
		return;
	}

	//	確認メッセージ
	var ConfirmMsg = ( CharaName != "" ) ? "「" + CharaName + "」をセーブします。よろしいですか？\n" : "セーブします。よろしいですか？\n";
	var ReturnValue = confirm( ConfirmMsg );

	//	NOの場合
	if( ReturnValue == false ) {
		return;
	}

	//	キャラ名設定（インデックス111）
	SaveString += "%00" + escape( CharaName );

	//	localStorageへの書き込み
	try {
		localStorage.setItem( SaveKey, SaveString );
	} catch( e ) {
		alert( "セーブに失敗しました。\n" );
		return;
	}

	//	ロードボタン有効化状態更新処理
	UpdateLoadButtons();
}
//------------------------------------------------------------------------------
//	関数名		：	ロードボタン有効化状態更新処理
//	機能説明	：	各スロットのセーブデータ有無を確認し、
//					データがないスロットのロードボタンを無効化する。
//					また、スロットラベルへセーブ済みキャラ名を表示する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	ページ読み込み時、およびセーブ後に呼び出す。
//------------------------------------------------------------------------------
function UpdateLoadButtons()
{
	//	ロードボタン群（DOM順にスロット1～3へ対応）
	var aLoad = ToElementArray( document.chara.load );

	for( var Slot = 1; Slot <= 3; ++Slot ){
		if( aLoad[ Slot - 1 ] ){
			//	セーブデータの有無で有効・無効を切り替え
			aLoad[ Slot - 1 ].disabled = ( ReadSaveData( "godichara" + Slot ) == null );
		}

		//	スロットラベルへセーブ済みキャラ名を表示
		var Label = document.getElementById( "slotname" + Slot );
		if( Label ){
			var CharaName = GetSavedCharaName( Slot );
			Label.innerText = ( CharaName != "" ) ? CharaName : "キャラ" + Slot;
		}
	}
}
//------------------------------------------------------------------------------
//	関数名		：	セーブ済みキャラ名取得処理
//	機能説明	：	指定スロットのセーブデータからキャラ名を取得する。
//	パラメータ	：	Slot	スロット番号（1～3）
//	戻り値		：	キャラ名（データなし・未入力は空文字）
//	備考		：	なし
//------------------------------------------------------------------------------
function GetSavedCharaName( Slot )
{
	var SaveData = ReadSaveData( "godichara" + Slot );

	if( SaveData != null ){
		var SaveValue = SaveData.split( "%00" );
		if( SaveValue[111] != undefined ){
			return unescape( SaveValue[111] );
		}
	}
	return "";
}
//------------------------------------------------------------------------------
//	関数名		：	セーブ情報取得処理
//	機能説明	：	localStorageから値を取得し、フォームへ値を設定する。
//	パラメータ	：	SaveKey	セーブデータキー名
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function LoadChara( SaveKey )
{
	//	セーブデータ読み込み処理
	var SaveString = ReadSaveData( SaveKey );

	//	データなしの場合
	if( SaveString == null ){
		alert( "データが存在しません。\n" );
		return;
	}

	//	分割して配列へ設定
	var SaveValue = SaveString.split( "%00" );

	//	フォーム情報設定処理
	SetFormValue( SaveValue )

	//	キャラ名復元（旧データはキャラ名なしのため空欄とする）
	if( document.chara.charaname ){
		document.chara.charaname.value = ( SaveValue[111] != undefined ) ? unescape( SaveValue[111] ) : "";
	}
}
//------------------------------------------------------------------------------
//	関数名		：	フォーム情報設定処理
//	機能説明	：	フォームへ値を設定する。
//	パラメータ	：	CookieValue		クッキー取得配列
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function SetFormValue( CookieValue )
{
	//	フォームへ値を設定
	document.chara.lv.value					= unescape( CookieValue[0] );

	//	クッキー構成変更による旧バージョンクッキーデータ考慮
	var Job = unescape( CookieValue[1] );
	if( Job != "戦" && Job != "剣" && Job != "盗" && Job != "魔" && Job != "聖" && Job != "錬" && Job != "裁" && Job != "鍛" && Job != "鳥" ){
		Job = ConvJobValue( Job );
		if( Job == -1 ){
			return;
		}
	}
	document.chara.job.value = Job;


	//	クッキー構成変更による旧バージョンクッキーデータ考慮
	var SideJob = unescape( CookieValue[2] );
	if( SideJob != "戦" && SideJob != "剣" && SideJob != "盗" && SideJob != "魔" && SideJob != "聖" && SideJob != "錬" && SideJob != "裁" && SideJob != "鍛" && SideJob != "鳥" ){
		SideJob = ConvJobValue( SideJob );
		if( SideJob == -1 ){
			return;
		}
	}
	document.chara.sidejob.value = SideJob;

	//	職業別スキルメニュー切り替え処理
	ChangeSkillMenuByJob();

	document.chara.hp.value					= unescape( CookieValue[3] );
	document.chara.mp.value					= unescape( CookieValue[4] );
	document.chara.sp.value					= unescape( CookieValue[5] );
	document.chara.str.value				= unescape( CookieValue[6] );
	document.chara.int.value				= unescape( CookieValue[7] );
	document.chara.dex.value				= unescape( CookieValue[8] );
	document.chara.agr.value				= unescape( CookieValue[9] );
	document.chara.vit.value				= unescape( CookieValue[10] );
	document.chara.men.value				= unescape( CookieValue[11] );
	document.chara.skill1.value				= unescape( CookieValue[12] );
	document.chara.skill2.value				= unescape( CookieValue[13] );
	document.chara.skill3.value				= unescape( CookieValue[14] );
	document.chara.skill4.value				= unescape( CookieValue[15] );
	document.chara.skill5.value				= unescape( CookieValue[16] );
	document.chara.skill6.value				= unescape( CookieValue[17] );
	document.chara.skill7.value				= unescape( CookieValue[18] );
	document.chara.skill8.value				= unescape( CookieValue[19] );
	document.chara.skill9.value				= unescape( CookieValue[20] );
	document.chara.skill10.value			= unescape( CookieValue[21] );
	document.chara.balance.value			= unescape( CookieValue[23] );
	document.chara.weapon.value				= unescape( CookieValue[24] );
	document.chara.weaponp.value			= unescape( CookieValue[25] );
	document.chara.armor.value				= unescape( CookieValue[26] );
	document.chara.armorp.value				= unescape( CookieValue[27] );
	document.chara.shoes.value				= unescape( CookieValue[28] );
	document.chara.shoesp.value				= unescape( CookieValue[29] );
	document.chara.shield.value				= unescape( CookieValue[30] );
	document.chara.ring1.value				= unescape( CookieValue[31] );
	document.chara.ring2.value				= unescape( CookieValue[32] );
	document.chara.necklace.value			= unescape( CookieValue[33] );
	document.chara.wc.value					= unescape( CookieValue[34] );
	document.chara.hc.value					= unescape( CookieValue[35] );
	document.chara.ac.value					= unescape( CookieValue[36] );
	document.chara.dc.value					= unescape( CookieValue[37] );
	document.chara.weight.value				= unescape( CookieValue[38] );
	document.chara.firebutton.disabled		= eval( unescape( CookieValue[39] ) );
	document.chara.fire[0].checked			= eval( unescape( CookieValue[40] ) );
	document.chara.fire[1].checked			= eval( unescape( CookieValue[41] ) );
	document.chara.fire[2].checked			= eval( unescape( CookieValue[42] ) );
	document.chara.fire[3].checked			= eval( unescape( CookieValue[43] ) );
	document.chara.fire[0].disabled			= eval( unescape( CookieValue[44] ) );
	document.chara.fire[1].disabled			= eval( unescape( CookieValue[45] ) );
	document.chara.fire[2].disabled			= eval( unescape( CookieValue[46] ) );
	document.chara.fire[3].disabled			= eval( unescape( CookieValue[47] ) );
	document.chara.icebutton.disabled		= eval( unescape( CookieValue[48] ) );
	document.chara.ice[0].checked			= eval( unescape( CookieValue[49] ) );
	document.chara.ice[1].checked			= eval( unescape( CookieValue[50] ) );
	document.chara.ice[2].checked			= eval( unescape( CookieValue[51] ) );
	document.chara.ice[3].checked			= eval( unescape( CookieValue[52] ) );
	document.chara.ice[0].disabled			= eval( unescape( CookieValue[53] ) );
	document.chara.ice[1].disabled			= eval( unescape( CookieValue[54] ) );
	document.chara.ice[2].disabled			= eval( unescape( CookieValue[55] ) );
	document.chara.ice[3].disabled			= eval( unescape( CookieValue[56] ) );
	document.chara.magicalbutton.disabled	= eval( unescape( CookieValue[57] ) );
	document.chara.magical[0].checked		= eval( unescape( CookieValue[58] ) );
	document.chara.magical[1].checked		= eval( unescape( CookieValue[59] ) );
	document.chara.magical[2].checked		= eval( unescape( CookieValue[60] ) );
	document.chara.magical[3].checked		= eval( unescape( CookieValue[61] ) );
	document.chara.magical[4].checked		= eval( unescape( CookieValue[62] ) );
	document.chara.magical[5].checked		= eval( unescape( CookieValue[63] ) );
	document.chara.magical[0].disabled		= eval( unescape( CookieValue[64] ) );
	document.chara.magical[1].disabled		= eval( unescape( CookieValue[65] ) );
	document.chara.magical[2].disabled		= eval( unescape( CookieValue[66] ) );
	document.chara.magical[3].disabled		= eval( unescape( CookieValue[67] ) );
	document.chara.magical[4].disabled		= eval( unescape( CookieValue[68] ) );
	document.chara.magical[5].disabled		= eval( unescape( CookieValue[69] ) );
	document.chara.holybutton.disabled		= eval( unescape( CookieValue[70] ) );
	document.chara.holy[0].checked			= eval( unescape( CookieValue[71] ) );
	document.chara.holy[1].checked			= eval( unescape( CookieValue[72] ) );
	document.chara.holy[2].checked			= eval( unescape( CookieValue[73] ) );
	document.chara.holy[3].checked			= eval( unescape( CookieValue[74] ) );
	document.chara.holy[4].checked			= eval( unescape( CookieValue[75] ) );
	document.chara.holy[5].checked			= eval( unescape( CookieValue[76] ) );
	document.chara.holy[6].checked			= eval( unescape( CookieValue[77] ) );
	document.chara.holy[0].disabled			= eval( unescape( CookieValue[78] ) );
	document.chara.holy[1].disabled			= eval( unescape( CookieValue[79] ) );
	document.chara.holy[2].disabled			= eval( unescape( CookieValue[80] ) );
	document.chara.holy[3].disabled			= eval( unescape( CookieValue[81] ) );
	document.chara.holy[4].disabled			= eval( unescape( CookieValue[82] ) );
	document.chara.holy[5].disabled			= eval( unescape( CookieValue[83] ) );
	document.chara.holy[6].disabled			= eval( unescape( CookieValue[84] ) );
	document.chara.taiseif.value			= unescape( CookieValue[96] );
	document.chara.taiseii.value			= unescape( CookieValue[97] );
	document.chara.taiseih.value			= unescape( CookieValue[98] );
	document.chara.taiseim.value			= unescape( CookieValue[99] );
	document.chara.taiseis.value			= unescape( CookieValue[100] );
	document.chara.taiseip.value			= unescape( CookieValue[101] );
	document.chara.taiseigenf.value			= unescape( CookieValue[102] );
	document.chara.taiseigeni.value			= unescape( CookieValue[103] );
	document.chara.taiseigenh.value			= unescape( CookieValue[104] );
	document.chara.taiseigenm.value			= unescape( CookieValue[105] );
	document.chara.doping[0].checked		= eval(unescape(CookieValue[106]));
	document.chara.doping[1].checked		= eval(unescape(CookieValue[107]));
	document.chara.doping[2].checked		= eval(unescape(CookieValue[108]));
	document.chara.doping[3].checked		= eval(unescape(CookieValue[109]));
	document.chara.doping[4].checked		= eval(unescape(CookieValue[110]));
}
//------------------------------------------------------------------------------
//	関数名		：	フォーム情報取得処理
//	機能説明	：	フォームの値を取得する。
//	パラメータ	：	CookieValue		フォーム取得配列
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetFormValue( CookieValue )
{
	//	フォームの値を取得
	CookieValue[0] = document.chara.lv.value;
	CookieValue[1] = document.chara.job.value;
	CookieValue[2] = document.chara.sidejob.value;
	CookieValue[3] = document.chara.hp.value;
	CookieValue[4] = document.chara.mp.value;
	CookieValue[5] = document.chara.sp.value;
	CookieValue[6] = document.chara.str.value;
	CookieValue[7] = document.chara.int.value;
	CookieValue[8] = document.chara.dex.value;
	CookieValue[9] = document.chara.agr.value;
	CookieValue[10] = document.chara.vit.value;
	CookieValue[11] = document.chara.men.value;
	CookieValue[12] = document.chara.skill1.value;
	CookieValue[13] = document.chara.skill2.value;
	CookieValue[14] = document.chara.skill3.value;
	CookieValue[15] = document.chara.skill4.value;
	CookieValue[16] = document.chara.skill5.value;
	CookieValue[17] = document.chara.skill6.value;
	CookieValue[18] = document.chara.skill7.value;
	CookieValue[19] = document.chara.skill8.value;
	CookieValue[20] = document.chara.skill9.value;
	CookieValue[21] = document.chara.skill10.value;
	CookieValue[22] = "1";
	CookieValue[23] = document.chara.balance.value;
	CookieValue[24] = document.chara.weapon.value;
	CookieValue[25] = document.chara.weaponp.value;
	CookieValue[26] = document.chara.armor.value;
	CookieValue[27] = document.chara.armorp.value;
	CookieValue[28] = document.chara.shoes.value;
	CookieValue[29] = document.chara.shoesp.value;
	CookieValue[30] = document.chara.shield.value;
	CookieValue[31] = document.chara.ring1.value;
	CookieValue[32] = document.chara.ring2.value;
	CookieValue[33] = document.chara.necklace.value;
	CookieValue[34] = document.chara.wc.value;
	CookieValue[35] = document.chara.hc.value;
	CookieValue[36] = document.chara.ac.value;
	CookieValue[37] = document.chara.dc.value;
	CookieValue[38] = document.chara.weight.value;
	CookieValue[39] = document.chara.firebutton.disabled;
	CookieValue[40] = document.chara.fire[0].checked;
	CookieValue[41] = document.chara.fire[1].checked;
	CookieValue[42] = document.chara.fire[2].checked;
	CookieValue[43] = document.chara.fire[3].checked;
	CookieValue[44] = document.chara.fire[0].disabled;
	CookieValue[45] = document.chara.fire[1].disabled;
	CookieValue[46] = document.chara.fire[2].disabled;
	CookieValue[47] = document.chara.fire[3].disabled;
	CookieValue[48] = document.chara.icebutton.disabled;
	CookieValue[49] = document.chara.ice[0].checked;
	CookieValue[50] = document.chara.ice[1].checked;
	CookieValue[51] = document.chara.ice[2].checked;
	CookieValue[52] = document.chara.ice[3].checked;
	CookieValue[53] = document.chara.ice[0].disabled;
	CookieValue[54] = document.chara.ice[1].disabled;
	CookieValue[55] = document.chara.ice[2].disabled;
	CookieValue[56] = document.chara.ice[3].disabled;
	CookieValue[57] = document.chara.magicalbutton.disabled;
	CookieValue[58] = document.chara.magical[0].checked;
	CookieValue[59] = document.chara.magical[1].checked;
	CookieValue[60] = document.chara.magical[2].checked;
	CookieValue[61] = document.chara.magical[3].checked;
	CookieValue[62] = document.chara.magical[4].checked;
	CookieValue[63] = document.chara.magical[5].checked;
	CookieValue[64] = document.chara.magical[0].disabled;
	CookieValue[65] = document.chara.magical[1].disabled;
	CookieValue[66] = document.chara.magical[2].disabled;
	CookieValue[67] = document.chara.magical[3].disabled;
	CookieValue[68] = document.chara.magical[4].disabled;
	CookieValue[69] = document.chara.magical[5].disabled;
	CookieValue[70] = document.chara.holybutton.disabled;
	CookieValue[71] = document.chara.holy[0].checked;
	CookieValue[72] = document.chara.holy[1].checked;
	CookieValue[73] = document.chara.holy[2].checked;
	CookieValue[74] = document.chara.holy[3].checked;
	CookieValue[75] = document.chara.holy[4].checked;
	CookieValue[76] = document.chara.holy[5].checked;
	CookieValue[77] = document.chara.holy[6].checked;
	CookieValue[78] = document.chara.holy[0].disabled;
	CookieValue[79] = document.chara.holy[1].disabled;
	CookieValue[80] = document.chara.holy[2].disabled;
	CookieValue[81] = document.chara.holy[3].disabled;
	CookieValue[82] = document.chara.holy[4].disabled;
	CookieValue[83] = document.chara.holy[5].disabled;
	CookieValue[84] = document.chara.holy[6].disabled;
	CookieValue[85] = false;
	CookieValue[86] = false;
	CookieValue[87] = true;
	CookieValue[88] = false;
	CookieValue[89] = true;
	CookieValue[90] = "90";
	CookieValue[91] = "80";
	CookieValue[92] = "50";
	CookieValue[93] = "20";
	CookieValue[94] = "10";
	CookieValue[95] = "5";
	CookieValue[96] = document.chara.taiseif.value;
	CookieValue[97] = document.chara.taiseii.value;
	CookieValue[98] = document.chara.taiseih.value;
	CookieValue[99] = document.chara.taiseim.value;
	CookieValue[100]= document.chara.taiseis.value;
	CookieValue[101]= document.chara.taiseip.value;
	CookieValue[102]= document.chara.taiseigenf.value;
	CookieValue[103]= document.chara.taiseigeni.value;
	CookieValue[104]= document.chara.taiseigenh.value;
	CookieValue[105]= document.chara.taiseigenm.value;
	CookieValue[106]= document.chara.doping[0].checked;
	CookieValue[107]= document.chara.doping[1].checked;
	CookieValue[108]= document.chara.doping[2].checked;
	CookieValue[109]= document.chara.doping[3].checked;
	CookieValue[110]= document.chara.doping[4].checked;
}
//------------------------------------------------------------------------------
//	関数名		：	職業文言変換処理
//	機能説明	：	フォームへ設定する職業の値の変換を行う。
//	パラメータ	：	String	変換対象
//	戻り値		：	戦～鳥	変換後職業
//					-1		変換失敗
//	備考		：	ver1.74以前の形式をver1.75の形式へ変換する
//------------------------------------------------------------------------------
function ConvJobValue( String )
{
	if( String == "sen" ){
		return	"戦";
	}
	if( String == "ken" ){
		return	"剣";
	}
	if( String == "tou" ){
		return	"盗";
	}
	if( String == "ma" ){
		return	"魔";
	}
	if( String == "sei" ){
		return	"聖";
	}
	if( String == "ren" ){
		return	"錬";
	}
	if( String == "sai" ){
		return	"裁";
	}
	if( String == "kaji" ){
		return	"鍛";
	}
	if( String == "tori" ){
		return	"鳥";
	}

	return -1;
}
