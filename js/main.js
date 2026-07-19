//	キャラ診断関数メイン
//	戻り値：なし
function CharaMain()
{
	//	変数宣言
	var ParaUseTama = 0;		//	パラメータに使用した力の玉
	var MagicUseTama = 0;		//	魔法購入に使用した力の玉
	var SkillUseTama = 0;		//	スキルアップに使用した力の玉
	var SkillSuccess = 0;		//	スキル成功率
	var FireTama = 0;			//	火
	var IceTama = 0;			//	氷
	var MagicalTama = 0;		//	援護
	var HolyTama = 0;			//	聖
	var SkillBaseTama = 0;		//	基準消費量
	var SonToku = 0;			//	損得計算用
	var InitSontoku = "";		//	判定メッセージ
	var Err = 0;				//	エラーアラート
	var SideJob = "";			//	副業
	var SkillNum = 0;			//	所持スキル数
	var CharaResultMsg = "";	//	キャラ診断結果出力メッセージ
	var CharaDataMsg = "";		//	キャラ情報出力メッセージ

	//	無効化スキル初期化処理
	ChangeSkillMenuByDisabled();

	//	変数へフォームから取得した値を設定
	var Job = document.chara.job.value;
	var SideJob = document.chara.sidejob.value;
	var Lv = document.chara.lv.value;
	var Hp = document.chara.hp.value;
	var Mp = document.chara.mp.value;
	var Sp = document.chara.sp.value;
	var Str = document.chara.str.value;
	var Int = document.chara.int.value;
	var Dex = document.chara.dex.value;
	var Agr = document.chara.agr.value;
	var Vit = document.chara.vit.value;
	var Men = document.chara.men.value;
	var Skill1 = document.chara.skill1.value;
	var Skill2 = document.chara.skill2.value;
	var Skill3 = document.chara.skill3.value;
	var Skill4 = document.chara.skill4.value;
	var Skill5 = document.chara.skill5.value;
	var Skill6 = document.chara.skill6.value;
	var Skill7 = document.chara.skill7.value;
	var Skill8 = document.chara.skill8.value;
	var Skill9 = document.chara.skill9.value;
	var Skill10 = document.chara.skill10.value;
	var Skill11 = document.chara.skill11.value;
	var Balance = document.chara.balance.value;

	//	取得魔法の設定
	var aFire = document.chara.fire;
	var aIce = document.chara.ice;
	var aMagical = document.chara.magical;
	var aHoly = document.chara.holy;

	//	入力項目検査
	//	１．空欄チェック
	Err = CheckInputItemBlank( Lv, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, Skill11, Balance );

	//	エラー表示
	if( Err != "" ) {
		Err += "を入力してください。";
		alert( Err );
		return;
	}

	//	２．数値チェック
	Err = CheckInputItemNaN( Lv, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, Skill11, Balance );

	//	エラー表示
	if( Err != "" ) {
		Err += "を確認してください。";
		alert( Err );
		return;
	}

	//	HP、MP、SPが空欄の場合
	//	職業ごとの平均値を設定する
	if( Hp == "" ) {
		Hp = GetAverageHp( Job, Lv );
		document.chara.hp.value = Hp;
	}
	if( Mp == "" ) {
		Mp = GetAverageMp( Job, Lv );
		document.chara.mp.value = Mp;
	}
	if( Sp == "" ) {
		Sp = GetAverageSp( Job, Lv );
		document.chara.sp.value = Sp;
	}

	//	HP、MP、SP上昇率の設定
	//	Lv1以下の場合、職業ごとの平均上昇率を設定
	if( Lv <= 1 ) {

		if( Job == "戦" || Job == "剣" ) {
			Result_Hp = 2.5;
			Result_Mp = 1.5;
			Result_Sp = 2.0;
		} else if( Job == "盗" || Job == "聖" ) {
			Result_Hp = 2.0;
			Result_Mp = 2.0;
			Result_Sp = 2.0;
		} else {
			Result_Hp = 1.5;
			Result_Mp = 2.5;
			Result_Sp = 1.5;
		}

	//	Lv2以上の場合
	} else {
		//	HP、MP、SPの上昇率設定
		Result_Hp = ( Hp - 30 ) / ( Lv - 1 );
		Result_Mp = ( Mp - 30 ) / ( Lv - 1 );
		Result_Sp = ( Sp - 30 ) / ( Lv - 1 );

		//	小数点以下補正処理（小数点第６位以降まである場合、表示を第６位までとする）
		Result_Hp = AdjustDecimalPoint( Result_Hp );
		Result_Mp = AdjustDecimalPoint( Result_Mp );
		Result_Sp = AdjustDecimalPoint( Result_Sp );
	}

	//	現在のLvまでに獲得した力の玉を取得
	Result_TotalTama = GetTotalTama(Lv);

	//	初期化の際に取得できる力の玉
	//	戦士、聖職者、魔法使いの場合
	if( Job == "戦" || Job == "聖" || Job == "魔" ) {
		Result_FormatTama = 26 + Result_TotalTama;

	//	剣闘士の場合
	} else if( Job == "剣" ) {
		Result_FormatTama = 24 + Result_TotalTama;

	//	盗賊の場合
	} else {
		Result_FormatTama = 36 + Result_TotalTama;
	}

	//	パラメータに使用した力の玉を算出
	ParaUseTama = GetUseParaTama( Job, Str, Int, Agr, Dex, Vit, Men, ParaUseTama );

	//	魔法に使用した力の玉を算出
	//	魔法使いの場合、火と氷に使用した玉を設定
	if( Job == "魔" ) {
		for( i = 0; i < aFire.length; i++ ) {
			if( aFire[i].checked ) {
				FireTama += eval( aFire[i].value );
			}
		}

		for( i = 0; i < aIce.length; i++ ) {
			if( aIce[i].checked ) {
				IceTama += eval( aIce[i].value );
			}
		}
	}

	//	聖職者、または魔法使いの場合、援護に使用した玉を設定
	if( Job == "聖" || SideJob == "聖" || Job == "魔" ){
		for( i = 0; i < aMagical.length; i++ ) {
			if( aMagical[i].checked ) {
				MagicalTama += eval( aMagical[i].value );
			}
		}
	}

	//	聖職者の場合、聖に使用した玉を設定
	if( Job == "聖" || SideJob == "聖" ){
		for( i = 0; i < aHoly.length; i++ ) {
			if( aHoly[i].checked ) {
				HolyTama += eval( aHoly[i].value );
			}
		}
	}

	//	魔法に使用した力の玉を設定
	MagicUseTama = FireTama + IceTama + MagicalTama + HolyTama;

	//	スキルに使用した力の玉を設定（パラに使用した玉－魔法に使用した玉－余りの玉＋職業ごとのボーナス値）

	//	戦士、聖職者、魔法使いの場合
	if( Job == "戦" || Job == "聖" || Job == "魔" ) {
		SkillUseTama = Result_TotalTama - ParaUseTama - MagicUseTama - Balance + 26;

	//	剣闘士の場合
	} else if( Job == "剣" ) {
		SkillUseTama = Result_TotalTama - ParaUseTama - MagicUseTama - Balance + 24;

	//	盗賊の場合
	} else {
		SkillUseTama = Result_TotalTama - ParaUseTama - MagicUseTama - Balance + 36;
	}

	//	所持スキル数設定
	SkillNum = GetSkillNum( Job, SideJob );

	//	スキル成功率の設定
	if( SkillUseTama > 0 ){
		SkillSuccess = ( ( Number( Skill1 ) + Number( Skill2 ) + Number( Skill3 ) + Number( Skill4 )+ Number( Skill5 ) + Number( Skill6 ) + Number( Skill7 ) + Number( Skill8 ) + Number( Skill9 ) + Number( Skill10 ) + Number( Skill11 ) - SkillNum ) / SkillUseTama * 100 ).toFixed( 5 );
	}
	//	スキルに玉を使っていない場合、スキル成功率を０％とする
	else{
		SkillSuccess = 0;
	}

	//	力の玉損得勘定
	//	スキル１から４４までの固定スキルアップに必要な力の玉
	var aSkillBase = new Array(0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 21, 24, 27, 30, 33, 38, 43, 48, 53, 58, 68, 78, 88, 98, 108, 123, 138, 153, 168, 183, 203, 223, 243, 263, 283, 303, 323, 343, 363, 383, 403, 423, 443, 463);

	SkillBaseTama += aSkillBase[ ( Skill1 - 1 ) ];
	SkillBaseTama += aSkillBase[ ( Skill2 - 1 ) ];
	SkillBaseTama += aSkillBase[ ( Skill3 - 1 ) ];
	SkillBaseTama += aSkillBase[ ( Skill4 - 1 ) ];
	SkillBaseTama += aSkillBase[ ( Skill5 - 1 ) ];
	SkillBaseTama += aSkillBase[ ( Skill6 - 1 ) ];
	SkillBaseTama += aSkillBase[ ( Skill7 - 1 ) ];
	SkillBaseTama += aSkillBase[ ( Skill8 - 1 ) ];
	SkillBaseTama += aSkillBase[ ( Skill9 - 1 ) ];
	SkillBaseTama += aSkillBase[ ( Skill10 - 1 ) ];
	SkillBaseTama += aSkillBase[ ( Skill11 - 1 ) ];

	//	本人消費量＋２６－基準消費量
	//	全固定スキル20・20(116個) - スキル20・20機能使用(90個) = 26個となるが、
	//	スキル20・20が使用できないLv60未満の場合、26を減算すべきではないと思われる。
	SonToku = SkillUseTama + 26 - SkillBaseTama;

	//	損得判定
	//	損
	if( SonToku < 0 ) {
		SonToku *= -1;
		InitSontoku += "尚、このキャラを初期化すると" + SonToku + "玉程度「損」するっぽいです。\n";

	//	得
	} else if( SonToku > 0 ) {
		InitSontoku += "尚、このキャラを初期化すると" + SonToku + "玉程度「得」するっぽいです。\n";

	//	損得なし
	} else {
		InitSontoku += "尚、このキャラを初期化しても、玉は変動しないっぽいです。\n";
	}

	//	診断結果出力
	CharaResultMsg = GetResultMessage( Job, Result_Hp, Result_Mp, Result_Sp, Result_TotalTama, Result_FormatTama, ParaUseTama, MagicUseTama, SkillUseTama, SkillSuccess, InitSontoku, Lv );
	document.chara.result.value = CharaResultMsg;

	//	キャラ情報メッセージ出力
	CharaDataMsg = GetCharaDataMessage( Lv, Job, SideJob, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, Skill11, Balance, SkillNum );
	document.chara.result.value += CharaDataMsg;

	//	おまけ情報取得処理
	GetExtraInformation( Lv, Job, SideJob, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men );
}

//	職業別パラメータ使用玉数取得処理
//	戻り値：使用玉数
function GetUseParaTama( Job, Str, Int, Agr, Dex, Vit, Men, ParaUseTama )
{
	//	職業別初期パラメータ
	//	STR,INT,AGR,DEX,VIT,MEN
	var aSen = new Array( 12,6,6,10,6,6 )	//	戦士
	var aKen = new Array( 12,6,6,6,12,6 )	//	剣闘士
	var aSei = new Array( 6,10,6,6,6,12 )	//	聖職者
	var aTou = new Array( 6,6,6,6,6,6 )		//	盗賊
	var aMa = new Array( 6,12,6,6,6,10 )	//	魔法使い

	//	ループ初期値設定
	var FirstStr = 6;
	var FirstInt = 6;
	var FirstAgr = 6;
	var FirstDex = 6;
	var FirstVit = 6;
	var FirstMen = 6;

	//	該当する職業の初期パラメータを設定する
	//	盗賊は処理しない
	if( Job == "戦" ) {
		FirstStr = aSen[0];		//	STR
		FirstDex = aSen[3];		//	DEX
	} else if( Job == "剣" ) {
		FirstStr = aKen[0];		//	STR
		FirstVit = aKen[4];		//	VIT
	} else if( Job == "聖" ) {
		FirstInt = aSei[1];		//	INT
		FirstMen = aSei[5];		//	MEN
	} else if( Job == "魔" ) {
		FirstInt = aMa[1];		//	INT
		FirstMen = aMa[5];		//	MEN
	}

	//	パラメータ使用玉数取得処理
	//	STR
	for( i = FirstStr; i <= Str; i++ ) {
		if( i > FirstStr && i <= 15 ) {
			ParaUseTama += 1;
		} else if( i >= 16 && i <= 20 ) {
			ParaUseTama += 3;
		} else if( i >= 21 && i <= 25 ) {
			ParaUseTama += 4;
		} else if( i >= 26 && i <= 30 ) {
			ParaUseTama += 4;
		} else if( i >= 31 && i <= 99 ) {
			ParaUseTama += 5;
		}
	}

	//	INT
	for( i = FirstInt; i <= Int; i++ ) {
		if( i > FirstInt && i <= 15 ) {
			ParaUseTama += 1;
		} else if( i >= 16 && i <= 20 ) {
			ParaUseTama += 3;
		} else if( i >= 21 && i <= 25 ) {
			ParaUseTama += 4;
		} else if( i >= 26 && i <= 30 ) {
			ParaUseTama += 4;
		} else if( i >= 31 && i <= 99 ) {
			ParaUseTama += 5;
		}
	}

	//	AGR
	for( i = FirstAgr; i <= Agr; i++ ) {
		if( i > FirstAgr && i <= 15 ) {
			ParaUseTama += 1;
		} else if( i >= 16 && i <= 20 ) {
			ParaUseTama += 3;
		} else if( i >= 21 && i <= 25 ) {
			ParaUseTama += 4;
		} else if( i >= 26 && i <= 30 ) {
			ParaUseTama += 4;
		} else if( i >= 31 && i <= 99 ) {
			ParaUseTama += 5;
		}
	}

	//	DEX
	for( i = FirstDex; i <= Dex; i++ ) {
		if( i > FirstDex && i <= 15 ) {
			ParaUseTama += 1;
		} else if( i >= 16 && i <= 20 ) {
			ParaUseTama += 3;
		} else if( i >= 21 && i <= 25 ) {
			ParaUseTama += 4;
		} else if( i >= 26 && i <= 30 ) {
			ParaUseTama += 4;
		} else if( i >= 31 && i <= 99 ) {
			ParaUseTama += 5;
		}
	}

	//	VIT
	for( i = FirstVit; i <= Vit; i++ ) {
		if( i > FirstVit && i <= 15 ) {
			ParaUseTama += 1;
		} else if( i >= 16 && i <= 20 ) {
			ParaUseTama += 3;
		} else if( i >= 21 && i <= 25 ) {
			ParaUseTama += 4;
		} else if( i >= 26 && i <= 30 ) {
			ParaUseTama += 4;
		} else if( i >= 31 && i <= 99 ) {
			ParaUseTama += 5;
		}
	}

	//	MEN
	for( i = FirstMen; i <= Men; i++ ) {
		if( i > FirstMen && i <= 15 ) {
			ParaUseTama += 1;
		} else if( i >= 16 && i <= 20 ) {
			ParaUseTama += 3;
		} else if( i >= 21 && i <= 25 ) {
			ParaUseTama += 4;
		} else if( i >= 26 && i <= 30 ) {
			ParaUseTama += 4;
		} else if( i >= 31 && i <= 99 ) {
			ParaUseTama += 5;
		}
	}

	return ParaUseTama;
}
//------------------------------------------------------------------------------
//	関数名		：	所持スキル数取得処理
//	機能説明	：	主職業／副業から所持スキル数の取得を行う
//	パラメータ	：	Job		主職業
//				：	SideJob	副業
//	戻り値		：	スキル数
//	備考		：	なし
//------------------------------------------------------------------------------
function GetSkillNum( Job, SideJob )
{
	var Num = 0;
	var JobPair = Job + SideJob;
	var SkillTable = new Array();

	//	スキルテーブル取得
	GetSkillTable( SkillTable );

	//	職業分ループ
	for( var i = 0; i <= 29; ++i ){

		//	テーブルと一致する場合
		if( JobPair == SkillTable[i][0] ){

			//	スキル分ループ
			for( var k = 1; SkillTable[i][k] != "　　　　"; ++k ){
				;
			}

			//	所持スキル数取得
			Num = k - 1;
			break;
		}
	}
	return Num;
}
//------------------------------------------------------------------------------
//	関数名		：	キャラ情報スキルメッセージ作成処理
//	機能説明	：	キャラ情報出力用のスキルメッセージの作成行う
//					スキル取得は所持スキル数分行う
//	パラメータ	：	Job					主職業
//				：	SideJob				副業
//				：	Skill1～Skill11		スキル1～スキル11
//				：	SkillNum			スキル数
//	戻り値		：	キャラ情報スキルメッセージ
//	備考		：	なし
//------------------------------------------------------------------------------
function GetCharaDataSkillMessage( Job, SideJob, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, Skill11, SkillNum )
{
	var Message = "";
	var StrInner = "";
	var JobPair = Job + SideJob;
	var SkillTable = new Array();
	var StrSplit = "";

	//	スキルテーブル取得
	GetSkillTable( SkillTable );

	//	職業分ループ
	for( var i = 0; i <= 29; ++i ){

		//	テーブルと一致する場合
		if( JobPair == SkillTable[i][0] ){

			//	スキル数分ループ
			for( var j = 1; j <= SkillNum; ++j ){

				//	スキル文言空白削除
				StrSplit = SkillTable[i][j].split( "　" );

				//	スキル文言設定
				Message += StrSplit[0];

				//	スキル値設定
				StrInner = eval( "Skill" + j );
				Message += StrInner;
				Message += " ";
			}
			Message += "\n";
		}
	}

	return Message;
}
//------------------------------------------------------------------------------
//	関数名		：	無効化スキルメニュー初期化処理
//	機能説明	：	コントロール無効となっているスキルの値を１へ変更する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function ChangeSkillMenuByDisabled()
{
	var Skill1  = document.chara.skill1;
	var Skill2  = document.chara.skill2;
	var Skill3  = document.chara.skill3;
	var Skill4  = document.chara.skill4;
	var Skill5  = document.chara.skill5;
	var Skill6  = document.chara.skill6;
	var Skill7  = document.chara.skill7;
	var Skill8  = document.chara.skill8;
	var Skill9  = document.chara.skill9;
	var Skill10 = document.chara.skill10;
	var Skill11 = document.chara.skill11;

	if( Skill1.disabled == true ){
		Skill1.value = 1;
	}
	if( Skill2.disabled == true ){
		Skill2.value = 1;
	}
	if( Skill3.disabled == true ){
		Skill3.value = 1;
	}
	if( Skill4.disabled == true ){
		Skill4.value = 1;
	}
	if( Skill5.disabled == true ){
		Skill5.value = 1;
	}
	if( Skill6.disabled == true ){
		Skill6.value = 1;
	}
	if( Skill7.disabled == true ){
		Skill7.value = 1;
	}
	if( Skill8.disabled == true ){
		Skill8.value = 1;
	}
	if( Skill9.disabled == true ){
		Skill9.value = 1;
	}
	if( Skill10.disabled == true ){
		Skill10.value = 1;
	}
	if( Skill11.disabled == true ){
		Skill11.value = 1;
	}
}
//------------------------------------------------------------------------------
//	関数名		：	キャラ情報出力メッセージ作成処理
//	機能説明	：	キャラ情報出力メッセージの作成を行う
//	パラメータ	：	Job			主職業
//					SideJob		副業
//					Hp～Sp		HP、MP、SP
//					Str～Men	STR、INT、DEX、AGR、VIT、MEN
//					Skill1～11	スキル1～11
//					Balance		残玉
//					SkillNum	スキル数
//	戻り値		：	キャラ情報出力メッセージ
//	備考		：	なし
//------------------------------------------------------------------------------
function GetCharaDataMessage( Lv, Job, SideJob, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, Skill11, Balance, SkillNum )
{
	var CharaDataMsg = "";			//	キャラ情報出力メッセージ
	var JobPair = Job + SideJob;	//	主職業／副業

	//	キャラ情報スキルメッセージ作成処理
	var CharaDataSkillMsg = GetCharaDataSkillMessage( Job, SideJob, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, Skill11, SkillNum )

	CharaDataMsg = 
		"Lv" + Lv + "　" +
		JobPair + "\n" +
		"HP" + Hp + "　" +
		"MP" + Mp + "　" +
		"SP" + Sp + "\n" +
		"STR" + Str + "　" +
		"INT" + Int + "　" +
		"DEX" + Dex + "　" +
		"AGR" + Agr + "　" +
		"VIT" + Vit + "　" +
		"MEN" + Men + "\n" +
		CharaDataSkillMsg +
		"残玉" + Balance + "\n";

	return CharaDataMsg;
}
//------------------------------------------------------------------------------
//	関数名		：	キャラ診断結果出力メッセージ作成処理
//	機能説明	：	キャラ診断結果出力メッセージの作成を行う
//	パラメータ	：	Job					主職業
//					Result_Hp			HP上がり率
//					Result_Mp			MP上がり率
//					Result_Sp			SP上がり率
//					Result_TotalTama	生涯獲得玉数
//					Result_FormatTam	初期化時獲得玉数
//					ParaUseTama			パラ使用玉数
//					MagicUseTama		魔法購入玉数
//					SkillUseTama		スキル使用玉数
//					SkillSuccess		スキル成功率
//					InitSontoku			初期化時損得メッセージ
//					Lv					レベル
//	戻り値		：	キャラ診断結果出力メッセージ
//	備考		：	なし
//------------------------------------------------------------------------------
function GetResultMessage( Job, Result_Hp, Result_Mp, Result_Sp, Result_TotalTama, Result_FormatTama, ParaUseTama, MagicUseTama, SkillUseTama, SkillSuccess, InitSontoku, Lv )
{
	var CharaResultMessage = "";
	var UpDownComment = new Array( "", "", "" );	//	HP,MP,SP上昇率コメント
	var AvgHp = 0;									//	平均HP
	var AvgMp = 0;									//	平均MP
	var AvgSp = 0;									//	平均SP

	//	上昇率コメント取得
	GetUpDownComment( Job, Result_Hp, Result_Mp, Result_Sp, UpDownComment );

	//	平均HP、MP、SP取得処理
	AvgHp = GetAverageHp( Job, Lv );
	AvgMp = GetAverageMp( Job, Lv );
	AvgSp = GetAverageSp( Job, Lv );

	CharaResultMessage = 
		"あなたのHP上がり率は「" + Result_Hp + "」です。（このLVでの平均HPは" + AvgHp + "です）\n"+
		"あなたのMP上がり率は「" + Result_Mp + "」です。（このLVでの平均MPは" + AvgMp + "です）\n"+
		"あなたのSP上がり率は「" + Result_Sp + "」です。（このLVでの平均SPは" + AvgSp + "です）\n"+
		"☆見たままのコメント\n"+
		"このHP上がり率は｢" + UpDownComment[0] + "｣かもしれません。\n"+
		"このMP上がり率は｢" + UpDownComment[1] + "｣かもしれません。\n"+
		"このSP上がり率は｢" + UpDownComment[2] + "｣かもしれません。\n"+
		"\n"+

		"あなたがこれまでにLVUPで取得した力の玉の総数は" + Result_TotalTama + "玉です。\n"+
		"（このLVで初期化すると" + Result_FormatTama + "玉を取得する事が出来ます。）\n"+
		"その内訳としてパラメータに使った玉が" + ParaUseTama + "玉で、\n"+
		"魔法に使った玉が" + MagicUseTama + "玉、\n"+
		"スキルにつぎ込んだ玉が" + SkillUseTama + "玉っぽいです。\n"+
		"よって現時点でスキル成功率を単純計算すると" + SkillSuccess + "%です。\n\n"+
		InitSontoku+
		"以上！\n"+
		"--------------------------------------------------------\n";
	return CharaResultMessage;
}
//------------------------------------------------------------------------------
//	関数名		：	上昇率コメント取得処理
//	機能説明	：	上昇率コメントの取得を行う
//	パラメータ	：	Job					主職業
//					Result_Hp			HP上がり率
//					Result_Mp			MP上がり率
//					Result_Sp			SP上がり率
//					UpDownComment		HP,MP,SP上昇率コメント
//						[0]HP,[1]MP,[2]SP
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetUpDownComment( Job, Result_Hp, Result_Mp, Result_Sp, UpDownComment )
{

	//	コメントテーブル
	var CommentTable = 					//	上がり範囲1～2			上がり範囲1～3			上がり範囲2～3			判定方法
		[								//	[][1]最小	[][2]最大	[][3]最小	[][4]最大	[][5]最小	[][6]最大
			["確認が必要",					0,			1.00,		0,			1.50,		0,			2.00],		//	[0] 最大値未満
			["低さを極めている",			1.00,		1.30,		1.50,		1.80,		2.00,		2.30],		//	[1] 最小値以上、最大値未満
			["そうとうな感じで低め",		1.30,		1.35,		1.80,		1.85,		2.30,		2.35],		//	[2] 最小値以上、最大値未満
			["結構低め",					1.35,		1.38,		1.85,		1.88,		2.35,		2.38],		//	[3] 最小値以上、最大値未満
			["すこし低め",					1.38,		1.41,		1.88,		1.91,		2.38,		2.41],		//	[4] 最小値以上、最大値未満
			["ほんのり低め",				1.41,		1.44,		1.91,		1.94,		2.41,		2.44],		//	[5] 最小値以上、最大値未満
			["普通ですが、ほんのり低め",	1.44,		1.47,		1.94,		1.97,		2.44,		2.47],		//	[6] 最小値以上、最大値未満
			["普通",						1.47,		1.50,		1.97,		2.00,		2.47,		2.50],		//	[7] 最小値以上、最大値未満
			["かなりの普通",				1.50,		1.50,		2.00,		2.00,		2.50,		2.50],		//	[8] 最小値と一致
			["普通っぽい",					1.50,		1.52,		2.00,		2.02,		2.50,		2.52],		//	[9] 最小値以上、最大値未満
			["普通ですが少し高め",			1.52,		1.54,		2.02,		2.04,		2.52,		2.54],		//	[10]最小値以上、最大値未満
			["ほんのり高め",				1.54,		1.56,		2.04,		2.06,		2.54,		2.56],		//	[11]最小値以上、最大値未満
			["ほどよく高め",				1.56,		1.58,		2.06,		2.08,		2.56,		2.58],		//	[12]最小値以上、最大値未満
			["いい感じに高い",				1.58,		1.60,		2.08,		2.10,		2.58,		2.60],		//	[13]最小値以上、最大値未満
			["かなり高め",					1.60,		1.62,		2.10,		2.12,		2.60,		2.62],		//	[14]最小値以上、最大値未満
			["相当な感じに高め",			1.62,		1.70,		2.12,		2.20,		2.62,		2.70],		//	[15]最小値以上、最大値未満
			["最強クラスに入る",			1.70,		2.00,		2.20,		2.50,		2.70,		3.00],		//	[16]最小値以上、最大値以下
			["確認が必要",					2.00,		0,			2.50,		0,			3.00,		0	]		//	[17]最小値より大きい
		];

	//	コメントテーブル上がり範囲最小使用位置設定フラグ
	var Hp = 0;
	var Mp = 0;
	var Sp = 0;

	//	コメントテーブル上がり範囲最小使用位置設定
	if( Job == "戦" || Job == "剣" ){
		Hp = 5;
		Mp = 1;
		Sp = 3;
	}
	if( Job == "聖" || Job == "盗" ){
		Hp = 3;
		Mp = 3;
		Sp = 3;
	}
	if( Job == "魔" ){
		Hp = 1;
		Mp = 5;
		Sp = 1;
	}

	//	テーブル分ループ
	for( var i = 0; i <= 17; ++i ){
		//	HPの設定
		if( UpDownComment[0] == "" ){

			//	確認が必要レコード判定（小）
			if( i == 0 ){
				//	最大値未満の場合
				if( Result_Hp < CommentTable[i][Hp+1] ){
					UpDownComment[0] = CommentTable[i][0];
				}
			}

			//	かなりの普通レコード判定
			else if( i == 8 ){
				//	値が一致する場合
				if( Result_Hp == CommentTable[i][Hp] ){
					UpDownComment[0] = CommentTable[i][0];
				}
			}

			//	最強クラスに入るレコード判定
			else if( i == 16 ){
				//	最小値以上、最大値以下
				if( Result_Hp >= CommentTable[i][Hp] && Result_Hp <= CommentTable[i][Hp+1] ){
					UpDownComment[0] = CommentTable[i][0];
				}
			}

			//	確認が必要レコード判定（大）
			else if( i == 17 ){
				//	最小値より大きい場合
				if( Result_Hp > CommentTable[i][Hp] ){
					UpDownComment[0] = CommentTable[i][0];
				}
			}

			//	上記以外
			else{
				//	最小値以上、最大値未満
				if( Result_Hp >= CommentTable[i][Hp] && Result_Hp < CommentTable[i][Hp+1] ){
					UpDownComment[0] = CommentTable[i][0];
				}
			}
		}
		//	MPの設定
		if( UpDownComment[1] == "" ){

			//	確認が必要レコード判定（小）
			if( i == 0 ){
				//	最大値未満の場合
				if( Result_Mp < CommentTable[i][Mp+1] ){
					UpDownComment[1] = CommentTable[i][0];
				}
			}

			//	かなりの普通レコード判定
			else if( i == 8 ){
				//	値が一致する場合
				if( Result_Mp == CommentTable[i][Mp] ){
					UpDownComment[1] = CommentTable[i][0];
				}
			}

			//	最強クラスに入るレコード判定
			else if( i == 16 ){
				//	最小値以上、最大値以下
				if( Result_Mp >= CommentTable[i][Mp] && Result_Mp <= CommentTable[i][Mp+1] ){
					UpDownComment[1] = CommentTable[i][0];
				}
			}

			//	確認が必要レコード判定（大）
			else if( i == 17 ){
				//	最小値より大きい場合
				if( Result_Mp > CommentTable[i][Mp] ){
					UpDownComment[1] = CommentTable[i][0];
				}
			}

			//	上記以外
			else{
				//	最小値以上、最大値未満
				if( Result_Mp >= CommentTable[i][Mp] && Result_Mp < CommentTable[i][Mp+1] ){
					UpDownComment[1] = CommentTable[i][0];
				}
			}
		}
		//	SPの設定
		if( UpDownComment[2] == "" ){

			//	確認が必要レコード判定（小）
			if( i == 0 ){
				//	最大値未満の場合
				if( Result_Sp < CommentTable[i][Sp+1] ){
					UpDownComment[2] = CommentTable[i][0];
				}
			}

			//	かなりの普通レコード判定
			else if( i == 8 ){
				//	値が一致する場合
				if( Result_Sp == CommentTable[i][Sp] ){
					UpDownComment[2] = CommentTable[i][0];
				}
			}

			//	最強クラスに入るレコード判定
			else if( i == 16 ){
				//	最小値以上、最大値以下
				if( Result_Sp >= CommentTable[i][Sp] && Result_Sp <= CommentTable[i][Sp+1] ){
					UpDownComment[2] = CommentTable[i][0];
				}
			}

			//	確認が必要レコード判定（大）
			else if( i == 17 ){
				//	最小値より大きい場合
				if( Result_Sp > CommentTable[i][Sp] ){
					UpDownComment[2] = CommentTable[i][0];
				}
			}

			//	上記以外
			else{
				//	最小値以上、最大値未満
				if( Result_Sp >= CommentTable[i][Sp] && Result_Sp < CommentTable[i][Sp+1] ){
					UpDownComment[2] = CommentTable[i][0];
				}
			}
		}
	}
}
//------------------------------------------------------------------------------
//	関数名		：	小数点以下補正処理
//	機能説明	：	HP、MP、SP上がり率が小数点第６位より大きい場合、
//					小数点第６位となるよう補正した値を返す。
//	パラメータ	：	InValue		上がり率
//	戻り値		：	OutValue	補正済み上がり率
//	備考		：	なし
//------------------------------------------------------------------------------
function AdjustDecimalPoint( InValue )
{
	var OutValue = InValue;			//	補正済み上がり率
	var OutStr = OutValue + "";		//	判定用文字列
	var SplitStr = "";				//	小数点分割後文字列	[0]整数部	[1]小数部
	var Return = 0;					//	文字検索関数戻り値
	var Length = 0;					//	小数部長

	//	小数点検索
	Return = OutStr.indexOf( ".", 0 );

	//	小数点なしの場合
	if( Return == -1 ){
		//	補正の必要なし
		return InValue;
	}

	//	小数点分割
	SplitStr = OutStr.split( "." );

	//	長さ取得
	Length = SplitStr[1].length;

	//	小数点第６位以降の場合
	if( Length >= 6 ){
		//	第６位までとする
		OutValue = OutValue.toFixed(6);
	}
	return OutValue;
}
//------------------------------------------------------------------------------
//	関数名		：	平均HP取得処理
//	機能説明	：	平均HPを取得する。
//	パラメータ	：	Job		主職業
//					Lv		レベル
//	戻り値		：	Hp		平均値
//	備考		：	なし
//------------------------------------------------------------------------------
function GetAverageHp( Job, Lv )
{
	//	変数宣言
	var Hp = 0;

	if( Job == "戦" || Job == "剣" ) {
		Hp = ( ( Lv - 1 ) * 2.5 + 30 ).toFixed( 0 );
	} else if( Job == "盗" || Job == "聖" ) {
		Hp = ( ( Lv - 1 ) * 2.0 + 30 ).toFixed( 0 );
	} else if( Job == "魔" ) {
		Hp = ( ( Lv - 1 ) * 1.5 + 30 ).toFixed( 0 );
	}

	return Hp;
}
//------------------------------------------------------------------------------
//	関数名		：	平均MP取得処理
//	機能説明	：	平均MPを取得する。
//	パラメータ	：	Job		主職業
//					Lv		レベル
//	戻り値		：	Mp		平均値
//	備考		：	なし
//------------------------------------------------------------------------------
function GetAverageMp( Job, Lv )
{
	//	変数宣言
	var Mp = 0;

	if( Job == "戦" || Job == "剣" ) {
		Mp = ( ( Lv - 1 ) * 1.5 + 30 ).toFixed( 0 );
	} else if( Job == "盗" || Job == "聖" ) {
		Mp = ( ( Lv - 1 ) * 2.0 + 30 ).toFixed( 0 );
	} else if( Job == "魔" ) {
		Mp = ( ( Lv - 1 ) * 2.5 + 30 ).toFixed( 0 );
	}

	return Mp;
}
//------------------------------------------------------------------------------
//	関数名		：	平均SP取得処理
//	機能説明	：	平均SPを取得する。
//	パラメータ	：	Job		主職業
//					Lv		レベル
//	戻り値		：	Sp		平均値
//	備考		：	なし
//------------------------------------------------------------------------------
function GetAverageSp( Job, Lv )
{
	//	変数宣言
	var Sp = 0;

	if( Job == "戦" || Job == "剣" ||  Job == "盗" || Job == "聖" ) {
		Sp = ( ( Lv - 1 ) * 2.0 + 30 ).toFixed( 0 );
	} else if( Job == "魔" ) {
		Sp = ( ( Lv - 1 ) * 1.5 + 30 ).toFixed( 0 );
	}

	return Sp;
}

function GetTotalTama(Lv)
{
	var TotalTama = 0;

	// 現在のレベルまでループ
	for (var i = 0; i <= Lv; ++i) {
		TotalTama -= 0;
		if (i >= 100) {
			TotalTama += 9;
		}
		else if (i >= 91) {
			TotalTama += 8;
		}
		else if (i >= 81) {
			TotalTama += 7;
		}
		else if (i >= 71) {
			TotalTama += 6;
		}
		else if (i >= 51) {
			TotalTama += 5;
		}
		else if (i >= 31) {
			TotalTama += 4;
		}
		else if (i >= 11) {
			TotalTama += 2;
		}
		else if (i >= 2) {
			TotalTama += 3;
		}
	}

	return TotalTama;
}
