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
	Skill11 = 1;

	//	スキル２０・２０カウンタ
	//	フォーム初期値０とし、初期化ボタン押下時、Lv60以上であれば２を設定する。
	//	スキル２０するたびに減算する。
	var Count2020 = document.chara.count2020;

	//	取得魔法の設定
	aFire = document.chara.fire;
	aIce = document.chara.ice;
	aMagical = document.chara.magical;
	aHoly = document.chara.holy;

	//	現在のLvまでに獲得した力の玉を取得
	Result_TotalTama = GetTotalTama(Lv);

	//	初期化の際に取得できる力の玉
	//	戦士、聖職者、魔法使いの場合
	if( Job == "戦" || Job == "聖" || Job == "魔" ) {
		Balance = 26 + Result_TotalTama;

	//	剣闘士の場合
	} else if( Job == "剣" ) {
		Balance = 24 + Result_TotalTama;

	//	盗賊の場合
	} else {
		Balance = 36 + Result_TotalTama;
	}

	//	職業別初期パラメータ
	//	STR,INT,AGR,DEX,VIT,MEN
	var aSen = new Array( 12,6,6,10,6,6 );	//	戦士
	var aKen = new Array( 12,6,6,6,12,6 );	//	剣闘士
	var aSei = new Array( 6,10,6,6,6,12 );	//	聖職者
	var aTou = new Array( 6,6,6,6,6,6 );	//	盗賊
	var aMa = new Array( 6,12,6,6,6,10 );	//	魔法使い

	//	初期パラメータ
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

	//	初期パラメータの設定
	document.chara.str.value = FirstStr;
	document.chara.int.value = FirstInt;
	document.chara.agr.value = FirstAgr;
	document.chara.dex.value = FirstDex;
	document.chara.vit.value = FirstVit;
	document.chara.men.value = FirstMen;

	//	スキル１～１１の設定
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
	document.chara.skill11.value = Skill11;

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

	//	Lv60以上の場合、玉90個でスキル20-20
	if( Lv >= 60 ) {
		Ret = confirm( "玉90個を使用してスキル2つを20にしますか？\n" );

		//	YESの場合
		if( Ret == true ) {
			Count2020.value = 2;
			alert( "スキル20にするスキルアイコンを2つ選択してください。\n" );
			return;
		}
	}
}

//	レベル差による力の玉増減処理（フォーカス時）
//	戻り値：なし
function FocusLv()
{
	//	残玉連動ONの場合のみ処理を行う
	if( document.chara.link.checked ) {
		//	フォーカス時のレベルを前回レベルに設定
		BeforeLv = document.chara.lv.value;
	}
}

//	レベル差による力の玉増減処理（値変更時）
//	戻り値：なし
function ChangeLv()
{
	//	残玉連動ONの場合のみ処理を行う
	if( document.chara.link.checked ) {

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
	if( document.chara.link.checked ) {
		//	フォーカス時のレベルを前回レベルに設定
		BeforeParameter = Obj.value;
	}
}

//	パラメータ差による力の玉増減処理（値変更時）
//	戻り値：なし
function ChangeParameter( Obj )
{
	//	残玉連動ONの場合のみ処理を行う
	if( document.chara.link.checked ) {

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
	if( document.chara.link.checked ) {
		//	フォーカス時のレベルを前回レベルに設定
		BeforeSkill = Obj.value;
	}
}

//	スキル差による力の玉増減処理（値変更時）
//	戻り値：なし
function ChangeSkill( Obj )
{
	//	残玉連動ONの場合のみ処理を行う
	if( document.chara.link.checked ) {

		//	スキルの設定
		var Skill =  eval( Obj.value );

		//	力の玉の設定
		var Tama = eval( document.chara.balance.value );

		//	力の玉の差
		var DifTama = 0;

		//	スキルアップ
		var Mode = document.chara.mode;

		//	固定制スキルアップの場合
		if( Mode[0].checked ) {

			//	スキル増加時
			if( Skill > BeforeSkill ) {
				var MAX = Skill;
				var MIN = BeforeSkill;

				//	差分取得ループ
				for( i = MIN; i < MAX; i++ ) {
					if( i >= 1 && i <= 9 ) {
						DifTama -= 2;
					} else if( i >= 10 && i <= 14 ) {
						DifTama -= 3;
					} else if( i >= 15 && i <= 19 ) {
						DifTama -= 5;
					} else if( i >= 20 && i <= 24 ) {
						DifTama -= 10;
					} else if( i >= 25 && i <= 29 ) {
						DifTama -= 15;
					} else {
						DifTama -= 20;
					}
				}

			//	スキル減少時
			} else if( Skill < BeforeSkill ) {
				var MAX = BeforeSkill;
				var MIN = Skill;
			
				//	差分取得ループ
				for( i = MIN; i < MAX; i++ ) {
					if( i >= 1 && i <= 9 ) {
						DifTama += 2;
					} else if( i >= 10 && i <= 14 ) {
						DifTama += 3;
					} else if( i >= 15 && i <= 19 ) {
						DifTama += 5;
					} else if( i >= 20 && i <= 24 ) {
						DifTama += 10;
					} else if( i >= 25 && i <= 29 ) {
						DifTama += 15;
					} else {
						DifTama += 20;
					}
				}
			}
		}

		//	確率制スキルアップの場合
		else if( Mode[1].checked ) {

			var Per01 = document.chara.per01.value;
			var Per05 = document.chara.per05.value;
			var Per10 = document.chara.per10.value;
			var Per15 = document.chara.per15.value;
			var Per20 = document.chara.per20.value;
			var Per26 = document.chara.per26.value;
			var Per31 = document.chara.per31.value;

			//	スキル増加時
			if( Skill > BeforeSkill ) {
				var MAX = Skill;
				var MIN = BeforeSkill;

				//	差分取得ループ
				for( i = MIN; i < MAX; i++ ) {
					var Flg = 0;			//	成功フラグ

					while( Flg == 0 ) {
						//	力の玉消費
						DifTama--;

						if( i >= 1 && i <= 4 ) {
							//	スキルアップ成功
							if( Math.random()*100 < Per01 ) {
								Flg = 1;
							}
						} else if( i >= 5 && i <= 9 ) {
							if( Math.random()*100 < Per05 ) {
								Flg = 1;
							}
						} else if( i >= 10 && i <= 14 ) {
							if( Math.random()*100 < Per10 ) {
								Flg = 1;
							}
						} else if( i >= 15 && i <= 19 ) {
							if( Math.random()*100 < Per15 ) {
								Flg = 1;
							}
						} else if( i >= 20 && i <= 25 ) {
							if( Math.random()*100 < Per20 ) {
								Flg = 1;
							}
						} else if( i >= 26 && i <= 29 ) {
							if( Math.random()*100 < Per26 ) {
								Flg = 1;
							}
						} else {
							if( Math.random()*100 < Per31 ) {
								Flg = 1;
							}
						}
					}
				}

			//	スキル減少時
			} else if( Skill < BeforeSkill ) {
				var MAX = BeforeSkill;
				var MIN = Skill;

				//	差分取得ループ
				for( i = MIN; i < MAX; i++ ) {
					var Flg = 0;			//	成功フラグ

					while( Flg == 0 ) {
						//	力の玉消費
						DifTama++;

						if( i >= 1 && i <= 4 ) {

							//	スキルアップ成功
							if( Math.random()*100 < Per01 ) {
								Flg = 1;
							}
						} else if( i >= 5 && i <= 9 ) {
							if( Math.random()*100 < Per05 ) {
								Flg = 1;
							}
						} else if( i >= 10 && i <= 14 ) {
							if( Math.random()*100 < Per10 ) {
								Flg = 1;
							}
						} else if( i >= 15 && i <= 19 ) {
							if( Math.random()*100 < Per15 ) {
								Flg = 1;
							}
						} else if( i >= 20 && i <= 25 ) {
							if( Math.random()*100 < Per20 ) {
								Flg = 1;
							}
						} else if( i >= 26 && i <= 29 ) {
							if( Math.random()*100 < Per26 ) {
								Flg = 1;
							}
						} else {
							if( Math.random()*100 < Per31 ) {
								Flg = 1;
							}
						}
					}
				}
			}
		} else {
			//	差分取得
			DifTama = BeforeSkill - Skill;
		}

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
	if( document.chara.link.checked ) {

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

	if( document.chara.link.checked ) {
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
	if( document.chara.link.checked ) {

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
//	関数名		：	力の玉初期化時スキル２０・２０設定処理
//	機能説明	：	初期化機能において、Ｌｖ６０以上かつスキル２０、２０適用時、
//					選択した２つのスキルを２０とする。
//	パラメータ	：	Obj		選択したオブジェクト
//	戻り値		：	なし
//	備考		：	スキルメニューにフォーカスがあたった場合のみ呼び出すこと
//------------------------------------------------------------------------------
function CharaSubSkill2020( Obj )
{
	var Lv = document.chara.lv.value;
	var Balance = document.chara.balance;

	//	スキル２０・２０カウンタ
	var Count2020 = document.chara.count2020;

	//	Lv60未満は処理しない
	if( Lv < 60 ){
		return;
	}

	//	スキル２０・２０カウンタが０以下の場合処理しない
	if( Count2020.value <= 0 ){
		return;
	}

	//	コントロール無効の場合処理しない
	if( Obj.disabled == true ){
		return;
	}

	//	スキルが１以外の場合処理しない
	if( Obj.value != 1 ){
		return;
	}

	//	スキルを２０とする
	Obj.value = 20;

	//	スキル２０・２０カウンタの回数を１つ減らす
	--Count2020.value;

	//	スキル２つを２０にした場合
	if( Count2020.value == 0 ){

		//	残玉を90使用する
		Balance.value -= 90;
	}
	return;
}
