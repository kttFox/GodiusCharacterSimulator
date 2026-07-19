//	必要玉数シミュレーター リアルタイム表示処理
//	機能説明	：	パラメータ・スキル・取得魔法・職業・Lvの変更を監視し、
//				必要玉数の内訳・合計、到達可能Lv、現在Lvとの過不足を
//				needtama領域へリアルタイムに表示する。

//	必要玉数算出処理
//	戻り値：算出結果オブジェクト（入力不正時はnull）
function CalcNeedTama()
{
	var f = document.chara;
	var Job = f.job.value;
	var SideJob = f.sidejob.value;
	var Lv = parseInt( f.lv.value, 10 );

	//	パラメータ取得
	var Str = parseInt( f.str.value, 10 );
	var Int = parseInt( f.int.value, 10 );
	var Agr = parseInt( f.agr.value, 10 );
	var Dex = parseInt( f.dex.value, 10 );
	var Vit = parseInt( f.vit.value, 10 );
	var Men = parseInt( f.men.value, 10 );

	//	入力不正チェック
	if( isNaN( Lv ) || isNaN( Str ) || isNaN( Int ) || isNaN( Agr ) || isNaN( Dex ) || isNaN( Vit ) || isNaN( Men ) ) {
		return null;
	}

	//	パラメータ必要玉数
	var ParaNeedTama = GetUseParaTama( Job, Str, Int, Agr, Dex, Vit, Men, 0 );

	//	スキル必要玉数（併用方式：17まで確率(期待値)・18以降固定、無効スキルは値1＝0玉）
	//	あわせて最大スキルLvを取得（スキルLvはキャラLvの半分までのため、到達可能Lv判定に使用）
	var SkillNeedTama = 0;
	var MaxSkill = 1;
	for( var i = 1; i <= 10; i++ ) {
		var SkillVal = parseInt( f[ "skill" + i ].value, 10 );
		if( isNaN( SkillVal ) || SkillVal < 1 || SkillVal > SKILL_MAX ) {
			SkillVal = 1;
		}
		if( !f[ "skill" + i ].disabled && SkillVal > MaxSkill ) {
			MaxSkill = SkillVal;
		}
		SkillNeedTama += SKILL_HYBRID_TAMA[ SkillVal - 1 ];
	}
	SkillNeedTama = Math.ceil( SkillNeedTama );

	//	魔法必要玉数（職業ルールはキャラ診断と同一）
	var MagicNeedTama = 0;
	var k;
	if( Job == "魔" ) {
		for( k = 0; k < f.fire.length; k++ ) {
			if( f.fire[k].checked ) {
				MagicNeedTama += Number( f.fire[k].value );
			}
		}
		for( k = 0; k < f.ice.length; k++ ) {
			if( f.ice[k].checked ) {
				MagicNeedTama += Number( f.ice[k].value );
			}
		}
	}
	if( Job == "聖" || SideJob == "聖" || Job == "魔" ) {
		for( k = 0; k < f.magical.length; k++ ) {
			if( f.magical[k].checked ) {
				MagicNeedTama += Number( f.magical[k].value );
			}
		}
	}
	if( Job == "聖" || SideJob == "聖" ) {
		for( k = 0; k < f.holy.length; k++ ) {
			if( f.holy[k].checked ) {
				MagicNeedTama += Number( f.holy[k].value );
			}
		}
	}
	if( Job == "戦" ) {
		var aWarrior = ToElementArray( f.warrior );
		for( k = 0; k < aWarrior.length; k++ ) {
			if( aWarrior[k].checked ) {
				MagicNeedTama += Number( aWarrior[k].value );
			}
		}
	}
	if( Job == "剣" ) {
		var aGladiator = ToElementArray( f.gladiator );
		for( k = 0; k < aGladiator.length; k++ ) {
			if( aGladiator[k].checked ) {
				MagicNeedTama += Number( aGladiator[k].value );
			}
		}
	}

	//	合計・到達可能Lv・過不足
	var MAX_LV = 255;
	var NeedTotal = ParaNeedTama + SkillNeedTama + MagicNeedTama;
	var JobBonus = GetJobBonusTama( Job );

	//	スキルLvはキャラLvの半分までのため、最大スキルLv×2以上のLvが必要
	var MinLvBySkill = MaxSkill * 2;
	var ReachLv = 0;
	for( i = MinLvBySkill > 1 ? MinLvBySkill : 1; i <= MAX_LV; i++ ) {
		if( JobBonus + GetTotalTama( i ) >= NeedTotal ) {
			ReachLv = i;
			break;
		}
	}
	var Diff = ( JobBonus + GetTotalTama( Lv ) ) - NeedTotal;

	return {
		para: ParaNeedTama,
		skill: SkillNeedTama,
		magic: MagicNeedTama,
		total: NeedTotal,
		reachLv: ReachLv,
		lv: Lv,
		diff: Diff,
		maxLv: MAX_LV
	};
}

//	必要玉数表示更新処理
//	戻り値：なし
function UpdateNeedTama()
{
	var Area = document.getElementById( "needtama" );
	if( !Area ) {
		return;
	}

	var ExpectBalance = document.getElementById( "expectbalance" );

	var r = CalcNeedTama();
	if( r == null ) {
		Area.innerHTML = "★必要玉数シミュレーター：入力値を確認してください。";
		if( ExpectBalance ) {
			ExpectBalance.innerHTML = "";
		}
		return;
	}

	//	現在保有しているはずの玉数（現在Lvまでの獲得玉＋職業ボーナス－現構成の必要玉数）
	if( ExpectBalance ) {
		ExpectBalance.innerHTML = "（保有想定：約" + r.diff + "玉）";
	}

	var ReachMsg = ( r.reachLv > 0 )
		? "Lv" + r.reachLv + "以上で実現可能"
		: "Lv" + r.maxLv + "まででは実現不可";

	var DiffMsg = ( r.diff >= 0 )
		? "現在Lv" + r.lv + "では" + r.diff + "玉余ります"
		: "現在Lv" + r.lv + "では" + ( r.diff * -1 ) + "玉不足しています";

	Area.innerHTML =
		"★必要玉数シミュレーター<br>" +
		"必要合計：<b>約" + r.total + "玉</b>" +
		"（パラ" + r.para + "玉／スキル約" + r.skill + "玉［17まで確率・18以降固定］／魔法" + r.magic + "玉）<br>" +
		ReachMsg + "、" + DiffMsg;
}

//	コンボボックス増減処理
//	機能説明	：	指定した名前のセレクトの選択位置を1つ増減し、change相当の更新を行う。
//	パラメータ	：	Name	フォーム項目名　Dir	+1／-1
//	戻り値		：	なし
function StepSelect( Name, Dir )
{
	var Obj = document.chara[ Name ];
	if( !Obj || Obj.disabled ) {
		return;
	}

	var Index = Obj.selectedIndex + Dir;
	if( Index < 0 || Index >= Obj.options.length ) {
		return;
	}
	Obj.selectedIndex = Index;

	//	既存のonchange処理・リアルタイム更新を発火させる
	Obj.dispatchEvent( new Event( "change" ) );
}

//	テキストボックス数値増減処理
//	機能説明	：	指定した名前のテキストボックスの数値を1増減し、change相当の更新を行う。
//	パラメータ	：	Name	フォーム項目名　Dir	+1／-1
//	戻り値		：	なし
function StepNumber( Name, Dir )
{
	var Obj = document.chara[ Name ];
	if( !Obj || Obj.disabled ) {
		return;
	}

	var Value = parseInt( Obj.value, 10 );
	if( isNaN( Value ) ) {
		Value = 0;
	}

	Value += Dir;
	if( Value < 0 ) {
		Value = 0;
	}
	Obj.value = Value;

	//	リアルタイム更新を発火させる
	Obj.dispatchEvent( new Event( "change" ) );
}

//	HP/MP/SP平均値表示更新処理
//	機能説明	：	現在の職業・Lvにおける平均HP/MP/SPをテキストボックス右側に表示する。
//	戻り値		：	なし
function UpdateAverageHpMpSp()
{
	var f = document.chara;
	var Job = f.job.value;
	var Lv = parseInt( f.lv.value, 10 );

	var AvgHp = document.getElementById( "avghp" );
	var AvgMp = document.getElementById( "avgmp" );
	var AvgSp = document.getElementById( "avgsp" );
	if( !AvgHp || !AvgMp || !AvgSp ) {
		return;
	}

	if( isNaN( Lv ) ) {
		AvgHp.innerHTML = "";
		AvgMp.innerHTML = "";
		AvgSp.innerHTML = "";
		return;
	}

	AvgHp.innerHTML = "（平均" + GetAverageHp( Job, Lv ) + "）";
	AvgMp.innerHTML = "（平均" + GetAverageMp( Job, Lv ) + "）";
	AvgSp.innerHTML = "（平均" + GetAverageSp( Job, Lv ) + "）";
}

//	リアルタイム一括更新処理
//	機能説明	：	必要玉数表示、キャラ診断（サイレント）、装備試算、平均値表示を更新する。
//	戻り値		：	なし
function UpdateRealtimeAll()
{
	UpdateNeedTama();
	UpdateAverageHpMpSp();
	CharaMain( true );
	CalcMain();
}

//	リアルタイム監視初期化処理
//	戻り値：なし
function InitNeedTamaWatcher()
{
	var f = document.chara;

	//	キャラ診断系入力項目
	var Targets = [ "job", "sidejob", "lv", "hp", "mp", "sp", "balance",
		"str", "int", "agr", "dex", "vit", "men",
		"skill1", "skill2", "skill3", "skill4", "skill5", "skill6",
		"skill7", "skill8", "skill9", "skill10" ];

	//	装備シミュレーター系入力項目
	var EquipTargets = [ "weapon", "weaponp", "armor", "armorp",
		"shoes", "shoesp", "shield", "ring1", "ring2", "necklace" ];
	Targets = Targets.concat( EquipTargets );

	for( var i = 0; i < Targets.length; i++ ) {
		f[ Targets[i] ].addEventListener( "change", UpdateRealtimeAll );
	}

	//	チェックボックス・ラジオ系（取得魔法、戦士・剣闘士スキル、ドーピング、スキルアイコン選択）
	var Groups = [ f.fire, f.ice, f.magical, f.holy, f.warrior, f.gladiator, f.doping, f.skill ];
	for( i = 0; i < Groups.length; i++ ) {
		var Group = ToElementArray( Groups[i] );
		for( var k = 0; k < Group.length; k++ ) {
			Group[k].addEventListener( "change", UpdateRealtimeAll );
		}
	}

	//	プログラムから値を書き換える既存関数をラップし、実行後に表示を更新する
	//	（初期化、一括変更、リセット、ロード、魔法クリック、セット装備）
	var WrapFuncs = [ "CharaSub", "ChangeParameterAll", "FormReset", "GetCookie", "ClickMagic",
		"SelectBaronSet", "SelectDiamondSet", "SelectFightingGodSet", "SelectLightPrince",
		"SelectOnslaughtSet", "SelectRaydanSet", "SelectSkandaSet", "SelectSolidSet", "SelectSteelSet" ];
	for( i = 0; i < WrapFuncs.length; i++ ) {
		( function( Name ) {
			var Org = window[ Name ];
			if( typeof Org != "function" ) {
				return;
			}
			window[ Name ] = function() {
				var Ret = Org.apply( this, arguments );
				UpdateRealtimeAll();
				return Ret;
			};
		} )( WrapFuncs[i] );
	}

	//	取得魔法・戦士・剣闘士スキルのアイコンクリックで直前のチェックボックスをON/OFFする
	var MagicChecks = [ f.fire, f.ice, f.magical, f.holy, f.warrior, f.gladiator ];
	for( i = 0; i < MagicChecks.length; i++ ) {
		var Checks = ToElementArray( MagicChecks[i] );
		for( k = 0; k < Checks.length; k++ ) {
			var Img = Checks[k].nextElementSibling;
			if( Img && Img.tagName == "IMG" ) {
				Img.style.cursor = "pointer";
				( function( CheckBox ) {
					Img.addEventListener( "click", function() {
						if( !CheckBox.disabled ) {
							CheckBox.click();
						}
					} );
				} )( Checks[k] );
			}
		}
	}

	//	初期表示（スキルアイコン・名称を現在の職業に合わせてから更新）
	ChangeSkillMenuByJob();
	UpdateRealtimeAll();
}

window.addEventListener( "load", InitNeedTamaWatcher );
