//	キャラ診断関数メイン
//	引数	：	Silent	true時はエラーアラートを出さず、フォームへの書き戻しも行わない（リアルタイム更新用）
//	戻り値：なし
function CharaMain( Silent )
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
	var Balance = document.chara.balance.value;

	//	取得魔法の設定
	var aFire = document.chara.fire;
	var aIce = document.chara.ice;
	var aMagical = document.chara.magical;
	var aHoly = document.chara.holy;

	//	入力項目検査
	//	１．空欄チェック
	Err = CheckInputItemBlank( Lv, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, Balance );

	//	エラー表示
	if( Err != "" ) {
		if( Silent ) {
			document.chara.result.value = Err + "を入力してください。";
			return;
		}
		Err += "を入力してください。";
		alert( Err );
		return;
	}

	//	２．数値チェック
	Err = CheckInputItemNaN( Lv, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, Balance );

	//	エラー表示
	if( Err != "" ) {
		if( Silent ) {
			document.chara.result.value = Err + "を確認してください。";
			return;
		}
		Err += "を確認してください。";
		alert( Err );
		return;
	}

	//	HP、MP、SPが空欄の場合
	//	職業ごとの平均値を設定する
	if( Hp == "" ) {
		Hp = GetAverageHp( Job, Lv );
		if( !Silent ) {
			document.chara.hp.value = Hp;
		}
	}
	if( Mp == "" ) {
		Mp = GetAverageMp( Job, Lv );
		if( !Silent ) {
			document.chara.mp.value = Mp;
		}
	}
	if( Sp == "" ) {
		Sp = GetAverageSp( Job, Lv );
		if( !Silent ) {
			document.chara.sp.value = Sp;
		}
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

	//	初期化の際に取得できる力の玉（全職業共通）
	Result_FormatTama = INITIAL_TAMA + Result_TotalTama;

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

	//	戦士の場合、戦士スキルに使用した玉を設定
	var JobSkillTama = 0;
	if( Job == "戦" ){
		var aWarrior = ToElementArray( document.chara.warrior );
		for( i = 0; i < aWarrior.length; i++ ) {
			if( aWarrior[i].checked ) {
				JobSkillTama += Number( aWarrior[i].value );
			}
		}
	}

	//	剣闘士の場合、剣闘士スキルに使用した玉を設定
	if( Job == "剣" ){
		var aGladiator = ToElementArray( document.chara.gladiator );
		for( i = 0; i < aGladiator.length; i++ ) {
			if( aGladiator[i].checked ) {
				JobSkillTama += Number( aGladiator[i].value );
			}
		}
	}

	//	魔法に使用した力の玉を設定
	MagicUseTama = FireTama + IceTama + MagicalTama + HolyTama + JobSkillTama;

	//	スキルに使用した力の玉を設定（パラに使用した玉－魔法に使用した玉－余りの玉＋初期ボーナス）
	SkillUseTama = Result_TotalTama - ParaUseTama - MagicUseTama - Balance + INITIAL_TAMA;

	//	所持スキル数設定
	SkillNum = GetSkillNum( Job, SideJob );

	//	スキル成功率の設定
	if( SkillUseTama > 0 ){
		SkillSuccess = ( ( Number( Skill1 ) + Number( Skill2 ) + Number( Skill3 ) + Number( Skill4 )+ Number( Skill5 ) + Number( Skill6 ) + Number( Skill7 ) + Number( Skill8 ) + Number( Skill9 ) + Number( Skill10 ) - SkillNum ) / SkillUseTama * 100 ).toFixed( 5 );
	}
	//	スキルに玉を使っていない場合、スキル成功率を０％とする
	else{
		SkillSuccess = 0;
	}

	//	力の玉損得勘定
	//	スキル必要玉数（併用方式：レベル17まで確率(期待値)・18以降固定）
	var SkillHybridTama = 0;
	SkillHybridTama += SKILL_HYBRID_TAMA[ ( Skill1 - 1 ) ];
	SkillHybridTama += SKILL_HYBRID_TAMA[ ( Skill2 - 1 ) ];
	SkillHybridTama += SKILL_HYBRID_TAMA[ ( Skill3 - 1 ) ];
	SkillHybridTama += SKILL_HYBRID_TAMA[ ( Skill4 - 1 ) ];
	SkillHybridTama += SKILL_HYBRID_TAMA[ ( Skill5 - 1 ) ];
	SkillHybridTama += SKILL_HYBRID_TAMA[ ( Skill6 - 1 ) ];
	SkillHybridTama += SKILL_HYBRID_TAMA[ ( Skill7 - 1 ) ];
	SkillHybridTama += SKILL_HYBRID_TAMA[ ( Skill8 - 1 ) ];
	SkillHybridTama += SKILL_HYBRID_TAMA[ ( Skill9 - 1 ) ];
	SkillHybridTama += SKILL_HYBRID_TAMA[ ( Skill10 - 1 ) ];

	//	本人消費量－基準消費量（併用方式：レベル17まで確率(期待値)・18以降固定）
	SonToku = SkillUseTama - SkillHybridTama;

	//	損得判定
	//	損
	if( SonToku < 0 ) {
		SonToku *= -1;
		InitSontoku += "尚、このキャラを初期化すると" + SonToku.toFixed( 1 ) + "玉程度「損」するっぽいです。\n";

	//	得
	} else if( SonToku > 0 ) {
		InitSontoku += "尚、このキャラを初期化すると" + SonToku.toFixed( 1 ) + "玉程度「得」するっぽいです。\n";

	//	損得なし
	} else {
		InitSontoku += "尚、このキャラを初期化しても、玉は変動しないっぽいです。\n";
	}

	//	診断結果出力
	CharaResultMsg = GetResultMessage( Job, Result_Hp, Result_Mp, Result_Sp, Result_TotalTama, Result_FormatTama, ParaUseTama, MagicUseTama, SkillUseTama, SkillSuccess, InitSontoku, Lv );
	document.chara.result.value = CharaResultMsg;

	//	最大スキルLv（無効スキルは1のため影響しない）
	var MaxSkill = Math.max( Number( Skill1 ), Number( Skill2 ), Number( Skill3 ), Number( Skill4 ), Number( Skill5 ),
		Number( Skill6 ), Number( Skill7 ), Number( Skill8 ), Number( Skill9 ), Number( Skill10 ) );

	//	キャラ情報メッセージ出力
	CharaDataMsg = GetCharaDataMessage( Lv, Job, SideJob, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, Balance, SkillNum );
	document.chara.result.value += CharaDataMsg;

	//	おまけ情報取得処理
	GetExtraInformation( Lv, Job, SideJob, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men );
}

//	初期化ボーナス玉数取得処理（全職業共通）
//	戻り値：初期化時に加算される玉数
function GetJobBonusTama( Job )
{
	return INITIAL_TAMA;
}



//	職業別パラメータ使用玉数取得処理
//	戻り値：使用玉数
function GetUseParaTama( Job, Str, Int, Agr, Dex, Vit, Men, ParaUseTama )
{
	//	職業別初期パラメータ取得（const.js）
	var InitStats = GetInitialStats( Job );
	var FirstStr = InitStats.str;
	var FirstInt = InitStats.int;
	var FirstAgr = InitStats.agr;
	var FirstDex = InitStats.dex;
	var FirstVit = InitStats.vit;
	var FirstMen = InitStats.men;

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
	for( var i = 0; i < SkillTable.length; ++i ){

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
//				：	Skill1～Skill10		スキル1～スキル10
//				：	SkillNum			スキル数
//	戻り値		：	キャラ情報スキルメッセージ
//	備考		：	なし
//------------------------------------------------------------------------------
function GetCharaDataSkillMessage( Job, SideJob, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, SkillNum )
{
	var Message = "";
	var StrInner = "";
	var JobPair = Job + SideJob;
	var SkillTable = new Array();
	var StrSplit = "";

	//	スキルテーブル取得
	GetSkillTable( SkillTable );

	//	職業分ループ
	for( var i = 0; i < SkillTable.length; ++i ){

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
function GetCharaDataMessage( Lv, Job, SideJob, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, Balance, SkillNum )
{
	var CharaDataMsg = "";			//	キャラ情報出力メッセージ
	var JobPair = Job + SideJob;	//	主職業／副業

	//	キャラ情報スキルメッセージ作成処理
	var CharaDataSkillMsg = GetCharaDataSkillMessage( Job, SideJob, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, SkillNum )

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

	CharaResultMessage =
		"あなたがこれまでにLVUPで取得した力の玉の総数は" + Result_TotalTama + "玉です。\n"+
		"（このLVで初期化すると" + Result_FormatTama + "玉を取得する事が出来ます。）\n"+
		"その内訳としてパラメータに使った玉が" + ParaUseTama + "玉で、\n"+
		"魔法に使った玉が" + MagicUseTama + "玉、\n"+
		"スキルにつぎ込んだ玉が" + SkillUseTama + "玉っぽいです。\n"+
		"よって現時点でスキル成功率を単純計算すると" + SkillSuccess + "%です。\n\n"+
		InitSontoku+
		"\n"+
		"--------------------------------------------------------\n";
	return CharaResultMessage;
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
