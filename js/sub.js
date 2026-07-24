//	残玉連動判定処理
//	機能説明	：	残玉が空欄以外（値が入力されている）の場合に連動ONと判定する。
//	戻り値		：	連動ONならtrue、それ以外はfalse
function IsTamaLink()
{
	//	残玉
	var Balance = document.chara.balance.value;
	//	空欄の場合は連動しない
	if( Balance === "" ) {
		return false;
	}
	//	非数値の場合は連動しない
	if( isNaN( Balance - 0 ) ) {
		return false;
	}
	//	空欄以外（値が入力されている）とき連動
	return true;
}

//	力の玉初期化処理
//	戻り値：なし
function CharaSub()
{
	//	変数へフォームから取得した値を設定
	Job = document.chara.job.value;
	Lv = document.chara.lv.value;
	Skill1 = 1;
	Skill2 = 1;
	Skill3 = 1;
	Skill4 = 1;
	Skill5 = 1;
	Skill6 = 1;
	Skill7 = 1;
	Skill8 = 1;
	Skill9 = 1;
	Skill10 = 1;

	//	取得魔法の設定
	aFire = document.chara.fire;
	aIce = document.chara.ice;
	aMagical = document.chara.magical;
	aHoly = document.chara.holy;

	//	現在のLvまでに獲得した力の玉を取得
	Result_TotalTama = GetTotalTama(Lv);

	//	初期化の際に取得できる力の玉（全職業共通）
	Balance = INITIAL_TAMA + Result_TotalTama;

	//	職業別初期パラメータ取得（const.js）
	var InitStats = GetInitialStats( Job );
	var FirstStr = InitStats.str;
	var FirstInt = InitStats.int;
	var FirstAgr = InitStats.agr;
	var FirstDex = InitStats.dex;
	var FirstVit = InitStats.vit;
	var FirstMen = InitStats.men;

	//	初期パラメータの設定
	document.chara.str.value = FirstStr;
	document.chara.int.value = FirstInt;
	document.chara.agr.value = FirstAgr;
	document.chara.dex.value = FirstDex;
	document.chara.vit.value = FirstVit;
	document.chara.men.value = FirstMen;

	//	スキル１～１０の設定
	document.chara.skill1.value = Skill1;
	document.chara.skill2.value = Skill2;
	document.chara.skill3.value = Skill3;
	document.chara.skill4.value = Skill4;
	document.chara.skill5.value = Skill5;
	document.chara.skill6.value = Skill6;
	document.chara.skill7.value = Skill7;
	document.chara.skill8.value = Skill8;
	document.chara.skill9.value = Skill9;
	document.chara.skill10.value = Skill10;

	//	残玉の設定
	document.chara.balance.value = Balance;

	//	取得魔法のチェックをはずす
	aFire = document.chara.fire;
	aIce = document.chara.ice;
	aMagical = document.chara.magical;
	aHoly = document.chara.holy;

	for( i = 0; i < aFire.length; i++ ) {
		document.chara.fire[i].checked = false;
	}
	for( i = 0; i < aIce.length; i++ ) {
		document.chara.ice[i].checked = false;
	}
	for( i = 0; i < aMagical.length; i++ ) {
		document.chara.magical[i].checked = false;
	}
	for( i = 0; i < aHoly.length; i++ ) {
		document.chara.holy[i].checked = false;
	}

	//	戦士・剣闘士スキルのチェックをはずす
	var aWarrior = ToElementArray( document.chara.warrior );
	for( i = 0; i < aWarrior.length; i++ ) {
		aWarrior[i].checked = false;
	}
	var aGladiator = ToElementArray( document.chara.gladiator );
	for( i = 0; i < aGladiator.length; i++ ) {
		aGladiator[i].checked = false;
	}
}

//	レベル差による力の玉増減処理（フォーカス時）
//	戻り値：なし
function FocusLv()
{
	//	残玉連動ONの場合のみ処理を行う
	if( IsTamaLink() ) {
		//	フォーカス時のレベルを前回レベルに設定
		BeforeLv = document.chara.lv.value;
	}
}

//	レベル差による力の玉増減処理（値変更時）
//	戻り値：なし
function ChangeLv()
{
	//	残玉連動ONの場合のみ処理を行う
	if( IsTamaLink() ) {

		//	Lvの設定
		var Lv = eval( document.chara.lv.value );

		//	力の玉の設定
		var Tama = eval( document.chara.balance.value );

		//	力の玉の差
		var DifTama = 0;

		//	現在のレベルまでに取得できる玉－前回のレベルまでに取得できる玉
		DifTama = GetTotalTama(Lv) - GetTotalTama(BeforeLv);

		//	残玉＋差分の玉
		Tama = Tama + DifTama

		//	テキストボックスに残玉を設定
		document.chara.balance.value = Tama;

		//	前回レベルに現在レベルを設定
		BeforeLv = Lv;
	}
}

//	パラメータ差による力の玉増減処理（フォーカス時）
//	戻り値：なし
function FocusParameter( Obj )
{
	//	残玉連動ONの場合のみ処理を行う
	if( IsTamaLink() ) {
		//	フォーカス時のレベルを前回レベルに設定
		BeforeParameter = Obj.value;
	}
}

//	パラメータ差による力の玉増減処理（値変更時）
//	戻り値：なし
function ChangeParameter( Obj )
{
	//	残玉連動ONの場合のみ処理を行う
	if( IsTamaLink() ) {

		//	パラメータの設定
		var Parameter =  eval( Obj.value );

		//	力の玉の設定
		var Tama = eval( document.chara.balance.value );

		//	力の玉の差
		var DifTama = 0;

		//	パラメータ増加時
		if( Parameter > BeforeParameter ) {
			var MAX = Parameter;
			var MIN = BeforeParameter;

			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama -= 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama -= 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama -= 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama -= 4;
				} else {
					DifTama -= 5;
				}
			}

		//	パラメータ減少時
		} else if( Parameter < BeforeParameter ) {
			var MAX = BeforeParameter;
			var MIN = Parameter;
		
			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama += 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama += 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama += 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama += 4;
				} else {
					DifTama += 5;
				}
			}
		}

		//	残玉＋差分の玉
		Tama += DifTama;

		//	テキストボックスに残玉を設定
		document.chara.balance.value = Tama;

		//	前回パラメータに現在パラメータを設定
		BeforeParameter = Parameter;
	}
}
//	スキル差による力の玉増減処理（フォーカス時）
//	戻り値：なし
function FocusSkill( Obj )
{
	//	残玉連動ONの場合のみ処理を行う
	if( IsTamaLink() ) {
		//	フォーカス時のレベルを前回レベルに設定
		BeforeSkill = Obj.value;
	}
}

//	スキル差による力の玉増減処理（値変更時）
//	戻り値：なし
function ChangeSkill( Obj )
{
	//	残玉連動ONの場合のみ処理を行う
	if( IsTamaLink() ) {

		//	スキルの設定
		var Skill =  eval( Obj.value );

		//	力の玉の設定
		var Tama = eval( document.chara.balance.value );

		//	力の玉の差
		var DifTama = 0;

		//	スキルアップは併用方式（レベル17までは確率期待値、18以降は固定）で
		//	消費する力の玉を算出する。（const.js の SKILL_HYBRID_TAMA を使用）
		var Before = eval( BeforeSkill );

		//	範囲補正（1～SKILL_MAX）
		if( Skill  < 1 ) { Skill  = 1; }
		if( Skill  > SKILL_MAX ) { Skill  = SKILL_MAX; }
		if( Before < 1 ) { Before = 1; }
		if( Before > SKILL_MAX ) { Before = SKILL_MAX; }

		//	変更前後の累計必要玉数（レベル1からの累計）
		var NeedBefore = SKILL_HYBRID_TAMA[ Before - 1 ];
		var NeedAfter  = SKILL_HYBRID_TAMA[ Skill  - 1 ];

		//	増加なら消費（マイナス）、減少なら返却（プラス）
		DifTama = Math.round( NeedBefore - NeedAfter );

		//	残玉＋差分の玉
		Tama += DifTama;

		//	テキストボックスに残玉を設定
		document.chara.balance.value = Tama;

		//	前回パラメータに現在パラメータを設定
		BeforeSkill = Skill;
	}
}
//	取得魔法による力の玉増減処理（チェックボックス）
//	戻り値：なし
function ClickMagic( Obj )
{
	//	残玉連動ONの場合のみ処理を行う
	if( IsTamaLink() ) {

		//	力の玉の設定
		var Tama = eval( document.chara.balance.value );

		//	チェックを入れた場合
		if( Obj.checked ) {
			//	力の玉を減少
			Tama -= eval( Obj.value );
		}

		//	チェックを外した場合
		else {
			//	力の玉を増加
			Tama += eval( Obj.value );
		}

		//	テキストボックスに残玉を設定
		document.chara.balance.value = Tama;
	}
}
//	残玉連動時スキルアップラジオボタン可変処理
//	戻り値：なし
function CheckLink()
{
	var aMode = document.chara.mode;

	//	残玉連動UI削除済みの場合は処理しない
	if( !aMode ) {
		return;
	}

	if( IsTamaLink() ) {
		for( i = 0; i < aMode.length; i++ ) {
			aMode[i].disabled = false;
		}

	} else {
		for( i = 0; i < aMode.length; i++ ) {
			aMode[i].disabled = true;
		}
	}
}

//	全パラメータ一括変更処理
function ChangeParameterAll( Value )
{

	//	残玉連動ONの場合のみ処理を行う
	if( IsTamaLink() ) {

		//	現在パラメータ取得
		var Str = document.chara.str.value;
		var Int = document.chara.int.value;
		var Dex = document.chara.dex.value;
		var Agr = document.chara.agr.value;
		var Vit = document.chara.vit.value;
		var Men = document.chara.men.value;

		//	力の玉の設定
		var Tama = eval( document.chara.balance.value );

		//	力の玉の差
		var DifTama = 0;

		//	STR増加時
		if( Value > Str ) {
			var MAX = Value;
			var MIN = Str;

			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama -= 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama -= 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama -= 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama -= 4;
				} else {
					DifTama -= 5;
				}
			}

		//	STR減少時
		} else if( Value < Str ) {
			var MAX = Str;
			var MIN = Value;
		
			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama += 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama += 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama += 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama += 4;
				} else {
					DifTama += 5;
				}
			}
		}

		//	INT増加時
		if( Value > Int ) {
			var MAX = Value;
			var MIN = Int;

			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama -= 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama -= 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama -= 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama -= 4;
				} else {
					DifTama -= 5;
				}
			}

		//	INT減少時
		} else if( Value < Int ) {
			var MAX = Int;
			var MIN = Value;
		
			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama += 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama += 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama += 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama += 4;
				} else {
					DifTama += 5;
				}
			}
		}

		//	DEX増加時
		if( Value > Dex ) {
			var MAX = Value;
			var MIN = Dex;

			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama -= 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama -= 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama -= 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama -= 4;
				} else {
					DifTama -= 5;
				}
			}

		//	DEX減少時
		} else if( Value < Dex ) {
			var MAX = Dex;
			var MIN = Value;
		
			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama += 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama += 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama += 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama += 4;
				} else {
					DifTama += 5;
				}
			}
		}

		//	AGR増加時
		if( Value > Agr ) {
			var MAX = Value;
			var MIN = Agr;

			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama -= 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama -= 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama -= 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama -= 4;
				} else {
					DifTama -= 5;
				}
			}

		//	AGR減少時
		} else if( Value < Agr ) {
			var MAX = Agr;
			var MIN = Value;
		
			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama += 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama += 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama += 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama += 4;
				} else {
					DifTama += 5;
				}
			}
		}

		//	VIT増加時
		if( Value > Vit ) {
			var MAX = Value;
			var MIN = Vit;

			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama -= 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama -= 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama -= 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama -= 4;
				} else {
					DifTama -= 5;
				}
			}

		//	VIT減少時
		} else if( Value < Vit ) {
			var MAX = Vit;
			var MIN = Value;
		
			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama += 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama += 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama += 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama += 4;
				} else {
					DifTama += 5;
				}
			}
		}

		//	MEN増加時
		if( Value > Men ) {
			var MAX = Value;
			var MIN = Men;

			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama -= 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama -= 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama -= 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama -= 4;
				} else {
					DifTama -= 5;
				}
			}

		//	MEN減少時
		} else if( Value < Men ) {
			var MAX = Men;
			var MIN = Value;
		
			//	差分取得ループ
			for( i = MIN; i < MAX; i++ ) {
				if( i >= 6 && i <= 14 ) {
					DifTama += 1;
				} else if( i >= 15 && i <= 19 ) {
					DifTama += 3;
				} else if( i >= 20 && i <= 24 ) {
					DifTama += 4;
				} else if( i >= 25 && i <= 29 ) {
					DifTama += 4;
				} else {
					DifTama += 5;
				}
			}
		}

		//	残玉＋差分の玉
		Tama += DifTama;

		//	テキストボックスに残玉を設定
		document.chara.balance.value = Tama;

	}

	//	パラメータ一括変更
	document.chara.str.value = Value;
	document.chara.int.value = Value;
	document.chara.dex.value = Value;
	document.chara.agr.value = Value;
	document.chara.vit.value = Value;
	document.chara.men.value = Value;
}
//------------------------------------------------------------------------------
