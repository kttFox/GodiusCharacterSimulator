//	フォーム初期値セーブ文字列（初期値セーブ判定用）
var DefaultSaveString = null;

//------------------------------------------------------------------------------
//	スロット管理用定数・変数
//------------------------------------------------------------------------------
var SlotCountKey	= "godichara_slotcount";	//	スロット数保存キー
var MinSlotCount	= 3;						//	最小（基本）スロット数
var SlotKeyPrefix	= "godichara";				//	スロットデータキー接頭辞

//------------------------------------------------------------------------------
//	関数名		：	スロット数取得処理
//	機能説明	：	localStorageから現在のスロット数を取得する。
//	戻り値		：	スロット数（最小 MinSlotCount 以上）
//------------------------------------------------------------------------------
function GetSlotCount()
{
	var Count = MinSlotCount;
	try {
		var Value = parseInt( localStorage.getItem( SlotCountKey ), 10 );
		if( !isNaN( Value ) && Value > MinSlotCount ){
			Count = Value;
		}
	} catch( e ) {
		;
	}
	return Count;
}
//------------------------------------------------------------------------------
//	関数名		：	スロット数保存処理
//	パラメータ	：	Count	スロット数
//------------------------------------------------------------------------------
function SetSlotCount( Count )
{
	try {
		if( Count <= MinSlotCount ){
			localStorage.removeItem( SlotCountKey );
		} else {
			localStorage.setItem( SlotCountKey, String( Count ) );
		}
	} catch( e ) {
		;
	}
}
//------------------------------------------------------------------------------
//	関数名		：	スロット初期化処理
//	機能説明	：	保存済みスロット数に応じてスロットUIを描画する。
//	備考		：	body onload から呼び出すこと。
//------------------------------------------------------------------------------
function InitSlots()
{
	RenderSlots();
}
//------------------------------------------------------------------------------
//	関数名		：	スロット描画処理
//	機能説明	：	現在のスロット数ぶんのセーブ／ロードUIを生成する。
//	備考		：	#slotcontainer 要素へ描画する。
//------------------------------------------------------------------------------
function RenderSlots()
{
	var Container = document.getElementById( "slotcontainer" );
	if( !Container ){
		return;
	}

	var Count = GetSlotCount();
	var Html = "";

	for( var Slot = 1; Slot <= Count; ++Slot ){
		var Key = SlotKeyPrefix + Slot;
		Html += ""
			+ "<span class=\"slotgroup\">"
			+ "<span id=\"slotname" + Slot + "\">キャラ" + Slot + "</span>"
			+ "<input type=\"button\" value=\"セーブ\" onclick=\"SaveChara('" + Key + "')\">"
			+ "<input type=\"button\" id=\"loadbtn" + Slot + "\" value=\"ロード\" onclick=\"LoadChara('" + Key + "')\">"
			+ "</span> ";
	}

	Container.innerHTML = Html;

	//	ロードボタン有効化状態・ラベル更新
	UpdateLoadButtons();
}
//------------------------------------------------------------------------------
//	関数名		：	スロット追加処理
//	機能説明	：	スロット数を1つ増やして再描画する。
//------------------------------------------------------------------------------
function AddSlot()
{
	var Count = GetSlotCount();
	SetSlotCount( Count + 1 );
	RenderSlots();
}

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

	//	キャラ名スロット（インデックス111）はプレースホルダとして空文字を設定
	//	（実際のキャラ名は SaveChara() で設定する）
	if( SaveValue[111] == undefined ){
		SaveValue[111] = "";
	}

	//	配列をセーブ文字列へ結合
	return JoinSaveValue( SaveValue );
}
//------------------------------------------------------------------------------
//	関数名		：	セーブ配列結合処理
//	機能説明	：	セーブ配列を "%00" 区切りのセーブ文字列へ結合する。
//	パラメータ	：	SaveValue	セーブ配列
//	戻り値		：	セーブデータ文字列
//	備考		：	未設定（undefined）の要素は空文字として扱う。
//------------------------------------------------------------------------------
function JoinSaveValue( SaveValue )
{
	//	先頭配列エスケープ
	var SaveString = escape( SaveValue[0] == undefined ? "" : SaveValue[0] );

	//	配列内容ループ
	for( var i = 1 ; i < SaveValue.length; ++i ){
		SaveString += "%00" + escape( SaveValue[i] == undefined ? "" : SaveValue[i] );
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

		//	スロット番号取得（"godichara3" → 3）
		var Slot = parseInt( SaveKey.replace( SlotKeyPrefix, "" ), 10 );
		var IsAddedSlot = ( !isNaN( Slot ) && Slot > MinSlotCount );

		//	基本スロットでデータがない場合は何もしない
		if( !IsAddedSlot && ReadSaveData( SaveKey ) == null ){
			alert( "初期値のためセーブしませんでした。\n" );
			return;
		}

		if( IsAddedSlot ){
			//	追加スロットの場合はスロット自体を削除する
			if( confirm( "初期値のため、この追加スロットを削除します。よろしいですか？\n" ) == false ){
				return;
			}
			RemoveSlot( Slot );
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
	//	セーブ配列を再取得し、キャラ名を格納したうえで結合し直す
	//	（後続インデックス112以降の追加取得魔法を維持するため、
	//	　文字列末尾への単純追記ではなく配列へ設定する）
	var SaveValue = new Array();
	GetFormValue( SaveValue );
	SaveValue[111] = CharaName;
	SaveString = JoinSaveValue( SaveValue );

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
	var Count = GetSlotCount();

	for( var Slot = 1; Slot <= Count; ++Slot ){
		//	ロードボタンの有効・無効をセーブデータ有無で切り替え
		var LoadBtn = document.getElementById( "loadbtn" + Slot );
		if( LoadBtn ){
			LoadBtn.disabled = ( ReadSaveData( SlotKeyPrefix + Slot ) == null );
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
//	関数名		：	スロット削除処理
//	機能説明	：	指定した追加スロットを削除し、後続スロットのデータを
//					前へ詰めて連番を維持する。基本スロットは削除しない。
//	パラメータ	：	Slot	削除するスロット番号
//------------------------------------------------------------------------------
function RemoveSlot( Slot )
{
	var Count = GetSlotCount();

	//	基本スロット、範囲外は削除しない
	if( Slot <= MinSlotCount || Slot > Count ){
		return;
	}

	try {
		//	後続スロットのデータを1つ前へ詰める
		for( var i = Slot; i < Count; ++i ){
			var Next = localStorage.getItem( SlotKeyPrefix + ( i + 1 ) );
			if( Next != null ){
				localStorage.setItem( SlotKeyPrefix + i, Next );
			} else {
				localStorage.removeItem( SlotKeyPrefix + i );
			}
		}
		//	末尾スロットのデータを削除
		localStorage.removeItem( SlotKeyPrefix + Count );
	} catch( e ) {
		;
	}

	//	スロット数を1つ減らして再描画
	SetSlotCount( Count - 1 );
	RenderSlots();
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
		//	F5更新後も維持できるよう自動保存を更新
		SaveCharaName();
	}
}
//------------------------------------------------------------------------------
//	関数名		：	フォーム情報設定処理
//	機能説明	：	フォームへ値を設定する。
//	パラメータ	：	SaveValue		セーブデータ取得配列
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function SetFormValue( SaveValue )
{
	//	フォームへ値を設定
	document.chara.lv.value					= unescape( SaveValue[0] );

	document.chara.job.value = unescape( SaveValue[1] );
	document.chara.sidejob.value = unescape( SaveValue[2] );

	//	職業別スキルメニュー切り替え処理
	ChangeSkillMenuByJob();

	document.chara.hp.value					= unescape( SaveValue[3] );
	document.chara.mp.value					= unescape( SaveValue[4] );
	document.chara.sp.value					= unescape( SaveValue[5] );
	document.chara.str.value				= unescape( SaveValue[6] );
	document.chara.int.value				= unescape( SaveValue[7] );
	document.chara.dex.value				= unescape( SaveValue[8] );
	document.chara.agr.value				= unescape( SaveValue[9] );
	document.chara.vit.value				= unescape( SaveValue[10] );
	document.chara.men.value				= unescape( SaveValue[11] );
	document.chara.skill1.value				= unescape( SaveValue[12] );
	document.chara.skill2.value				= unescape( SaveValue[13] );
	document.chara.skill3.value				= unescape( SaveValue[14] );
	document.chara.skill4.value				= unescape( SaveValue[15] );
	document.chara.skill5.value				= unescape( SaveValue[16] );
	document.chara.skill6.value				= unescape( SaveValue[17] );
	document.chara.skill7.value				= unescape( SaveValue[18] );
	document.chara.skill8.value				= unescape( SaveValue[19] );
	document.chara.skill9.value				= unescape( SaveValue[20] );
	document.chara.skill10.value			= unescape( SaveValue[21] );
	document.chara.balance.value			= unescape( SaveValue[23] );
	document.chara.weapon.value				= unescape( SaveValue[24] );
	document.chara.weaponp.value			= unescape( SaveValue[25] );
	document.chara.armor.value				= unescape( SaveValue[26] );
	document.chara.armorp.value				= unescape( SaveValue[27] );
	document.chara.shoes.value				= unescape( SaveValue[28] );
	document.chara.shoesp.value				= unescape( SaveValue[29] );
	document.chara.shield.value				= unescape( SaveValue[30] );
	document.chara.ring1.value				= unescape( SaveValue[31] );
	document.chara.ring2.value				= unescape( SaveValue[32] );
	document.chara.necklace.value			= unescape( SaveValue[33] );
	document.chara.wc.value					= unescape( SaveValue[34] );
	document.chara.hc.value					= unescape( SaveValue[35] );
	document.chara.ac.value					= unescape( SaveValue[36] );
	document.chara.dc.value					= unescape( SaveValue[37] );
	document.chara.weight.value				= unescape( SaveValue[38] );
	document.chara.firebutton.disabled		= eval( unescape( SaveValue[39] ) );
	document.chara.fire[0].checked			= eval( unescape( SaveValue[40] ) );
	document.chara.fire[1].checked			= eval( unescape( SaveValue[41] ) );
	document.chara.fire[2].checked			= eval( unescape( SaveValue[42] ) );
	document.chara.fire[3].checked			= eval( unescape( SaveValue[43] ) );
	document.chara.fire[0].disabled			= eval( unescape( SaveValue[44] ) );
	document.chara.fire[1].disabled			= eval( unescape( SaveValue[45] ) );
	document.chara.fire[2].disabled			= eval( unescape( SaveValue[46] ) );
	document.chara.fire[3].disabled			= eval( unescape( SaveValue[47] ) );
	document.chara.icebutton.disabled		= eval( unescape( SaveValue[48] ) );
	document.chara.ice[0].checked			= eval( unescape( SaveValue[49] ) );
	document.chara.ice[1].checked			= eval( unescape( SaveValue[50] ) );
	document.chara.ice[2].checked			= eval( unescape( SaveValue[51] ) );
	document.chara.ice[3].checked			= eval( unescape( SaveValue[52] ) );
	document.chara.ice[0].disabled			= eval( unescape( SaveValue[53] ) );
	document.chara.ice[1].disabled			= eval( unescape( SaveValue[54] ) );
	document.chara.ice[2].disabled			= eval( unescape( SaveValue[55] ) );
	document.chara.ice[3].disabled			= eval( unescape( SaveValue[56] ) );
	document.chara.magicalbutton.disabled	= eval( unescape( SaveValue[57] ) );
	document.chara.magical[0].checked		= eval( unescape( SaveValue[58] ) );
	document.chara.magical[1].checked		= eval( unescape( SaveValue[59] ) );
	document.chara.magical[2].checked		= eval( unescape( SaveValue[60] ) );
	document.chara.magical[3].checked		= eval( unescape( SaveValue[61] ) );
	document.chara.magical[4].checked		= eval( unescape( SaveValue[62] ) );
	document.chara.magical[5].checked		= eval( unescape( SaveValue[63] ) );
	document.chara.magical[0].disabled		= eval( unescape( SaveValue[64] ) );
	document.chara.magical[1].disabled		= eval( unescape( SaveValue[65] ) );
	document.chara.magical[2].disabled		= eval( unescape( SaveValue[66] ) );
	document.chara.magical[3].disabled		= eval( unescape( SaveValue[67] ) );
	document.chara.magical[4].disabled		= eval( unescape( SaveValue[68] ) );
	document.chara.magical[5].disabled		= eval( unescape( SaveValue[69] ) );
	document.chara.holybutton.disabled		= eval( unescape( SaveValue[70] ) );
	document.chara.holy[0].checked			= eval( unescape( SaveValue[71] ) );
	document.chara.holy[1].checked			= eval( unescape( SaveValue[72] ) );
	document.chara.holy[2].checked			= eval( unescape( SaveValue[73] ) );
	document.chara.holy[3].checked			= eval( unescape( SaveValue[74] ) );
	document.chara.holy[4].checked			= eval( unescape( SaveValue[75] ) );
	document.chara.holy[5].checked			= eval( unescape( SaveValue[76] ) );
	document.chara.holy[6].checked			= eval( unescape( SaveValue[77] ) );
	document.chara.holy[0].disabled			= eval( unescape( SaveValue[78] ) );
	document.chara.holy[1].disabled			= eval( unescape( SaveValue[79] ) );
	document.chara.holy[2].disabled			= eval( unescape( SaveValue[80] ) );
	document.chara.holy[3].disabled			= eval( unescape( SaveValue[81] ) );
	document.chara.holy[4].disabled			= eval( unescape( SaveValue[82] ) );
	document.chara.holy[5].disabled			= eval( unescape( SaveValue[83] ) );
	document.chara.holy[6].disabled			= eval( unescape( SaveValue[84] ) );
	document.chara.taiseif.value			= unescape( SaveValue[96] );
	document.chara.taiseii.value			= unescape( SaveValue[97] );
	document.chara.taiseih.value			= unescape( SaveValue[98] );
	document.chara.taiseim.value			= unescape( SaveValue[99] );
	document.chara.taiseis.value			= unescape( SaveValue[100] );
	document.chara.taiseip.value			= unescape( SaveValue[101] );
	document.chara.taiseigenf.value			= unescape( SaveValue[102] );
	document.chara.taiseigeni.value			= unescape( SaveValue[103] );
	document.chara.taiseigenh.value			= unescape( SaveValue[104] );
	document.chara.taiseigenm.value			= unescape( SaveValue[105] );
	document.chara.doping[0].checked		= eval(unescape(SaveValue[106]));
	document.chara.doping[1].checked		= eval(unescape(SaveValue[107]));
	document.chara.doping[2].checked		= eval(unescape(SaveValue[108]));
	document.chara.doping[3].checked		= eval(unescape(SaveValue[109]));
	document.chara.doping[4].checked		= eval(unescape(SaveValue[110]));

	//	後から追加された取得魔法・スキルの復元（インデックス112以降）
	//	旧セーブデータには存在しないため、undefinedの場合は無効・未選択とする
	var aFire		= ToElementArray( document.chara.fire );
	var aMagical	= ToElementArray( document.chara.magical );
	var aHoly		= ToElementArray( document.chara.holy );
	var aWarrior	= ToElementArray( document.chara.warrior );
	var aGladiator	= ToElementArray( document.chara.gladiator );

	SetExtraMagic( aFire[4],      SaveValue[112], SaveValue[113] );	//	ファイアストーム
	SetExtraMagic( aMagical[6],   SaveValue[114], SaveValue[115] );	//	メイジアーマー
	SetExtraMagic( aHoly[7],      SaveValue[116], SaveValue[117] );	//	キュアパルス
	SetExtraMagic( aHoly[8],      SaveValue[118], SaveValue[119] );	//	パワーシールド
	SetExtraMagic( aWarrior[0],   SaveValue[120], SaveValue[121] );	//	戦士スキル
	SetExtraMagic( aGladiator[0], SaveValue[122], SaveValue[123] );	//	剣闘士スキル
}
//------------------------------------------------------------------------------
//	関数名		：	追加取得魔法復元処理
//	機能説明	：	後から追加された取得魔法チェックボックスへ、
//					セーブ値（チェック状態・無効状態）を復元する。
//	パラメータ	：	Element		対象チェックボックス（存在しない場合は何もしない）
//					Checked		チェック状態のセーブ値（undefined可）
//					Disabled	無効状態のセーブ値（undefined可）
//	戻り値		：	なし
//	備考		：	旧セーブデータ（該当値なし）は未選択・無効として扱う。
//------------------------------------------------------------------------------
function SetExtraMagic( Element, Checked, Disabled )
{
	if( !Element ){
		return;
	}
	Element.checked  = ( Checked  != undefined ) ? eval( unescape( Checked ) )  : false;
	Element.disabled = ( Disabled != undefined ) ? eval( unescape( Disabled ) ) : true;
}
//------------------------------------------------------------------------------
//	関数名		：	フォーム情報取得処理
//	機能説明	：	フォームの値を取得する。
//	パラメータ	：	SaveValue		フォーム取得配列
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetFormValue( SaveValue )
{
	//	フォームの値を取得
	SaveValue[0] = document.chara.lv.value;
	SaveValue[1] = document.chara.job.value;
	SaveValue[2] = document.chara.sidejob.value;
	SaveValue[3] = document.chara.hp.value;
	SaveValue[4] = document.chara.mp.value;
	SaveValue[5] = document.chara.sp.value;
	SaveValue[6] = document.chara.str.value;
	SaveValue[7] = document.chara.int.value;
	SaveValue[8] = document.chara.dex.value;
	SaveValue[9] = document.chara.agr.value;
	SaveValue[10] = document.chara.vit.value;
	SaveValue[11] = document.chara.men.value;
	SaveValue[12] = document.chara.skill1.value;
	SaveValue[13] = document.chara.skill2.value;
	SaveValue[14] = document.chara.skill3.value;
	SaveValue[15] = document.chara.skill4.value;
	SaveValue[16] = document.chara.skill5.value;
	SaveValue[17] = document.chara.skill6.value;
	SaveValue[18] = document.chara.skill7.value;
	SaveValue[19] = document.chara.skill8.value;
	SaveValue[20] = document.chara.skill9.value;
	SaveValue[21] = document.chara.skill10.value;
	SaveValue[22] = "1";
	SaveValue[23] = document.chara.balance.value;
	SaveValue[24] = document.chara.weapon.value;
	SaveValue[25] = document.chara.weaponp.value;
	SaveValue[26] = document.chara.armor.value;
	SaveValue[27] = document.chara.armorp.value;
	SaveValue[28] = document.chara.shoes.value;
	SaveValue[29] = document.chara.shoesp.value;
	SaveValue[30] = document.chara.shield.value;
	SaveValue[31] = document.chara.ring1.value;
	SaveValue[32] = document.chara.ring2.value;
	SaveValue[33] = document.chara.necklace.value;
	SaveValue[34] = document.chara.wc.value;
	SaveValue[35] = document.chara.hc.value;
	SaveValue[36] = document.chara.ac.value;
	SaveValue[37] = document.chara.dc.value;
	SaveValue[38] = document.chara.weight.value;
	SaveValue[39] = document.chara.firebutton.disabled;
	SaveValue[40] = document.chara.fire[0].checked;
	SaveValue[41] = document.chara.fire[1].checked;
	SaveValue[42] = document.chara.fire[2].checked;
	SaveValue[43] = document.chara.fire[3].checked;
	SaveValue[44] = document.chara.fire[0].disabled;
	SaveValue[45] = document.chara.fire[1].disabled;
	SaveValue[46] = document.chara.fire[2].disabled;
	SaveValue[47] = document.chara.fire[3].disabled;
	SaveValue[48] = document.chara.icebutton.disabled;
	SaveValue[49] = document.chara.ice[0].checked;
	SaveValue[50] = document.chara.ice[1].checked;
	SaveValue[51] = document.chara.ice[2].checked;
	SaveValue[52] = document.chara.ice[3].checked;
	SaveValue[53] = document.chara.ice[0].disabled;
	SaveValue[54] = document.chara.ice[1].disabled;
	SaveValue[55] = document.chara.ice[2].disabled;
	SaveValue[56] = document.chara.ice[3].disabled;
	SaveValue[57] = document.chara.magicalbutton.disabled;
	SaveValue[58] = document.chara.magical[0].checked;
	SaveValue[59] = document.chara.magical[1].checked;
	SaveValue[60] = document.chara.magical[2].checked;
	SaveValue[61] = document.chara.magical[3].checked;
	SaveValue[62] = document.chara.magical[4].checked;
	SaveValue[63] = document.chara.magical[5].checked;
	SaveValue[64] = document.chara.magical[0].disabled;
	SaveValue[65] = document.chara.magical[1].disabled;
	SaveValue[66] = document.chara.magical[2].disabled;
	SaveValue[67] = document.chara.magical[3].disabled;
	SaveValue[68] = document.chara.magical[4].disabled;
	SaveValue[69] = document.chara.magical[5].disabled;
	SaveValue[70] = document.chara.holybutton.disabled;
	SaveValue[71] = document.chara.holy[0].checked;
	SaveValue[72] = document.chara.holy[1].checked;
	SaveValue[73] = document.chara.holy[2].checked;
	SaveValue[74] = document.chara.holy[3].checked;
	SaveValue[75] = document.chara.holy[4].checked;
	SaveValue[76] = document.chara.holy[5].checked;
	SaveValue[77] = document.chara.holy[6].checked;
	SaveValue[78] = document.chara.holy[0].disabled;
	SaveValue[79] = document.chara.holy[1].disabled;
	SaveValue[80] = document.chara.holy[2].disabled;
	SaveValue[81] = document.chara.holy[3].disabled;
	SaveValue[82] = document.chara.holy[4].disabled;
	SaveValue[83] = document.chara.holy[5].disabled;
	SaveValue[84] = document.chara.holy[6].disabled;
	SaveValue[85] = false;
	SaveValue[86] = false;
	SaveValue[87] = true;
	SaveValue[88] = false;
	SaveValue[89] = true;
	SaveValue[90] = "90";
	SaveValue[91] = "80";
	SaveValue[92] = "50";
	SaveValue[93] = "20";
	SaveValue[94] = "10";
	SaveValue[95] = "5";
	SaveValue[96] = document.chara.taiseif.value;
	SaveValue[97] = document.chara.taiseii.value;
	SaveValue[98] = document.chara.taiseih.value;
	SaveValue[99] = document.chara.taiseim.value;
	SaveValue[100]= document.chara.taiseis.value;
	SaveValue[101]= document.chara.taiseip.value;
	SaveValue[102]= document.chara.taiseigenf.value;
	SaveValue[103]= document.chara.taiseigeni.value;
	SaveValue[104]= document.chara.taiseigenh.value;
	SaveValue[105]= document.chara.taiseigenm.value;
	SaveValue[106]= document.chara.doping[0].checked;
	SaveValue[107]= document.chara.doping[1].checked;
	SaveValue[108]= document.chara.doping[2].checked;
	SaveValue[109]= document.chara.doping[3].checked;
	SaveValue[110]= document.chara.doping[4].checked;

	//	インデックス111はキャラ名スロット（SaveChara/BuildSaveStringで設定）

	//	後から追加された取得魔法・スキル（インデックス112以降）
	//	※旧セーブデータには存在しないため、SetFormValue側でundefined考慮すること
	var aFire		= ToElementArray( document.chara.fire );
	var aMagical	= ToElementArray( document.chara.magical );
	var aHoly		= ToElementArray( document.chara.holy );
	var aWarrior	= ToElementArray( document.chara.warrior );
	var aGladiator	= ToElementArray( document.chara.gladiator );

	SaveValue[112]= aFire[4]      ? aFire[4].checked       : false;	//	ファイアストーム
	SaveValue[113]= aFire[4]      ? aFire[4].disabled      : true;
	SaveValue[114]= aMagical[6]   ? aMagical[6].checked    : false;	//	メイジアーマー
	SaveValue[115]= aMagical[6]   ? aMagical[6].disabled   : true;
	SaveValue[116]= aHoly[7]      ? aHoly[7].checked       : false;	//	キュアパルス
	SaveValue[117]= aHoly[7]      ? aHoly[7].disabled      : true;
	SaveValue[118]= aHoly[8]      ? aHoly[8].checked       : false;	//	パワーシールド
	SaveValue[119]= aHoly[8]      ? aHoly[8].disabled      : true;
	SaveValue[120]= aWarrior[0]   ? aWarrior[0].checked    : false;	//	戦士スキル
	SaveValue[121]= aWarrior[0]   ? aWarrior[0].disabled   : true;
	SaveValue[122]= aGladiator[0] ? aGladiator[0].checked  : false;	//	剣闘士スキル
	SaveValue[123]= aGladiator[0] ? aGladiator[0].disabled : true;
}
//------------------------------------------------------------------------------
//	キャラ名自動保存用キー
//------------------------------------------------------------------------------
var CharaNameKey = "godiuscharaname";

//------------------------------------------------------------------------------
//	関数名		：	キャラ名自動保存処理
//	機能説明	：	キャラ名入力欄の値をlocalStorageへ保存する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	キャラ名入力欄の oninput から呼び出す。
//------------------------------------------------------------------------------
function SaveCharaName()
{
	if( !document.chara.charaname ){
		return;
	}
	try {
		localStorage.setItem( CharaNameKey, document.chara.charaname.value );
	} catch( e ) {
		;
	}
}
//------------------------------------------------------------------------------
//	関数名		：	キャラ名復元処理
//	機能説明	：	localStorageに保存されたキャラ名を入力欄へ復元する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	body onload から FormReset() の後に呼び出すこと。
//------------------------------------------------------------------------------
function RestoreCharaName()
{
	if( !document.chara.charaname ){
		return;
	}
	try {
		var Value = localStorage.getItem( CharaNameKey );
		if( Value != null ){
			document.chara.charaname.value = Value;
		}
	} catch( e ) {
		;
	}
}
