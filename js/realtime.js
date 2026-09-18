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
	var MaxSkill = 0;
	for( var i = 1; i <= 10; i++ ) {
		var SkillVal = parseInt( f[ "skill" + i ].value, 10 );
		if( isNaN( SkillVal ) || SkillVal < 1 || SkillVal > SKILL_MAX ) {
			SkillVal = 1;
		}
		//	値1＝スキル未設定（無効）のため、Lv制約の対象外とする
		if( !f[ "skill" + i ].disabled && SkillVal > 1 && SkillVal > MaxSkill ) {
			MaxSkill = SkillVal;
		}
		SkillNeedTama += SKILL_HYBRID_TAMA[ SkillVal - 1 ];
	}
	//	期待値のため小数のまま保持する（表示時に小数第1位へ丸める）

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

	//	スキルLvごとの必要キャラLv（Lv26までは×2、27以降は別テーブル）
	var MinLvBySkill = ( MaxSkill > 0 ) ? GetNeedCharaLvBySkill( MaxSkill ) : 1;

	//	ステータス26以上はLv75以上が必要
	var MaxPara = Math.max( Str, Int, Agr, Dex, Vit, Men );
	var MinLv = Math.max( MinLvBySkill, ( MaxPara >= 26 ) ? 75 : 1 );

	var ReachLv = 0;
	for( i = MinLv > 1 ? MinLv : 1; i <= MAX_LV; i++ ) {
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

//	不足玉数からの必要Lv算出処理
//	機能説明	：	現在Lvから何Lvまで上げれば不足玉数を補えるかを算出する。
//	パラメータ	：	Lv	現在Lv　Shortage	不足玉数（正の値）　MaxLv	最大Lv
//	戻り値		：	必要Lv（最大Lvまでで補えない場合は0）
function GetNeedLvByShortage( Lv, Shortage, MaxLv )
{
	var BaseTama = GetTotalTama( Lv );

	for( var i = Lv + 1; i <= MaxLv; i++ ) {
		if( GetTotalTama( i ) - BaseTama >= Shortage ) {
			return i;
		}
	}

	return 0;
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
		ExpectBalance.innerHTML = "(保有想定：約" + r.diff.toFixed( 1 ) + "玉)";
	}

	//	残玉の入力値（前後の空白を除去）
	var BalanceVal = ( document.chara && document.chara.balance ) ? String( document.chara.balance.value ).replace( /^\s+|\s+$/g, "" ) : "";
	//	残玉が入力済みかどうか（入力済みの場合は損得の文章が続く）
	var BalanceInputed = ( BalanceVal != "" && !isNaN( BalanceVal ) );

	//	到達可能Lv（最大Lvまででも必要玉数に届かない場合は0）
	var DiffMsg;
	if( r.reachLv <= 0 ) {
		DiffMsg = "平均的には実現できません。";
	} else if( BalanceInputed ) {
		DiffMsg = "平均的にLv" + r.reachLv + "以上で実現可能で、";
	} else {
		DiffMsg = "平均的にLv" + r.reachLv + "以上で実現可能です。";
	}

	//	残玉が入力されている場合は、保有想定との差分で損得を表示する
	if( BalanceInputed ) {
		var SonToku = Number( BalanceVal ) - r.diff;
		if( SonToku >= 0 ) {
			DiffMsg += "現在の状態では" + SonToku.toFixed( 1 ) + "玉得をしています";
		} else {
			DiffMsg += "現在の状態では" + ( SonToku * -1 ).toFixed( 1 ) + "玉損をしています";
		}

		//	残玉がマイナスの場合は、不足分を補うのに必要なLvを追記する
		var Balance = Number( BalanceVal );
		if( Balance < 0 ) {
			var Shortage = Balance * -1;
			var NeedLv = GetNeedLvByShortage( r.lv, Shortage, r.maxLv );
			if( NeedLv > 0 ) {
				DiffMsg += "<br>残玉が" + Shortage.toFixed( 1 ) + "玉不足しています。<b>Lv" + NeedLv + "</b>が必要です";
			} else {
				DiffMsg += "<br>残玉が" + Shortage.toFixed( 1 ) + "玉不足しています。Lv" + r.maxLv + "まで上げても不足は解消されません";
			}
		}
	}

	Area.innerHTML =
		"必要合計：<b>約" + r.total.toFixed( 1 ) + "玉</b>" +
		"（パラ" + r.para + "玉／スキル約" + r.skill.toFixed( 1 ) + "玉［17まで確率・18以降固定］／魔法" + r.magic + "玉）<br>" +
		DiffMsg;
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

	//	変更前の値を連動処理へ通知（onfocus相当）
	Obj.dispatchEvent( new Event( "focus" ) );

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
		//	HP/MP/SP・残玉が空欄の場合は基準値（平均値／保有想定）を基準とする
		Value = GetStepBaseValue( Name );
	}

	Value += Dir;
	if( "balance" != Name && Value < 0 ) {
		Value = 0;
	}
	Obj.value = Value;

	//	リアルタイム更新を発火させる
	Obj.dispatchEvent( new Event( "change" ) );
}

//	増減基準値取得処理
//	機能説明	：	テキストボックスが空欄の場合の増減基準値を返す。
//				HP/MP/SPは現在の職業・Lvの平均値、残玉は保有想定の玉数を基準とする。
//	パラメータ	：	Name	フォーム項目名
//	戻り値		：	基準値（対象外・算出不可の場合は0）
function GetStepBaseValue( Name )
{
	var f = document.chara;
	var Job = f.job.value;
	var Lv = parseInt( f.lv.value, 10 );

	//	残玉は保有想定（現在Lvまでの獲得玉＋職業ボーナス－現構成の必要玉数）を基準とする
	if( "balance" == Name ) {
		var r = CalcNeedTama();
		//	保有想定は期待値のため小数となる。入力欄には整数を設定する
		return ( r != null ) ? Math.round( r.diff ) : 0;
	}

	if( isNaN( Lv ) ) {
		return 0;
	}

	var Average = 0;
	if( "hp" == Name ) {
		Average = GetAverageHp( Job, Lv );
	} else if( "mp" == Name ) {
		Average = GetAverageMp( Job, Lv );
	} else if( "sp" == Name ) {
		Average = GetAverageSp( Job, Lv );
	} else {
		return 0;
	}

	return TruncateStatus( ApplyCostumeBonus( Average ) );
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

	//	（課金衣装がONの場合、平均値にも＋５％を反映する）
	AvgHp.innerHTML = "(平均" + TruncateStatus( ApplyCostumeBonus( GetAverageHp( Job, Lv ) ) ) + ")";
	AvgMp.innerHTML = "(平均" + TruncateStatus( ApplyCostumeBonus( GetAverageMp( Job, Lv ) ) ) + ")";
	AvgSp.innerHTML = "(平均" + TruncateStatus( ApplyCostumeBonus( GetAverageSp( Job, Lv ) ) ) + ")";
}

//	課金衣装ON/OFF時のHP/MP/SP増減処理
//	機能説明	：	HP/MP/SPが入力済みの場合、課金衣装のON/OFFに合わせて
//					その値を＋５％／－５％する。
//	戻り値		：	なし
function ApplyCostumeToHpMpSp()
{
	var f = document.chara;
	var Costume = f.costume;
	if( !Costume ) {
		return;
	}

	var Targets = [ f.hp, f.mp, f.sp ];
	for( var i = 0; i < Targets.length; i++ ) {
		var Target = Targets[i];
		if( !Target || Target.value == "" ) {
			continue;
		}

		var Value = Number( Target.value );
		if( isNaN( Value ) ) {
			continue;
		}

		//	ONの場合は＋５％、OFFの場合は元の値へ戻す
		//	（ステータスは切り捨て。逆算は切り上げとなるため、ON/OFFを繰り返しても値はずれない）
		if( Costume.checked ) {
			Target.value = Math.floor( Value * COSTUME_RATE );
		} else {
			Target.value = Math.ceil( Value / COSTUME_RATE );
		}
	}
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

	//	共有URLリアルタイム更新
	if( typeof UpdateShareUrl == "function" ) {
		UpdateShareUrl();
	}
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
	//	課金衣装はHP/MP/SPの値自体を増減させてから再計算する
	if( f.costume ) {
		f.costume.addEventListener( "change", ApplyCostumeToHpMpSp );
	}

	var Groups = [ f.fire, f.ice, f.magical, f.holy, f.warrior, f.gladiator, f.doping, f.skill, f.costume ];
	for( i = 0; i < Groups.length; i++ ) {
		var Group = ToElementArray( Groups[i] );
		for( var k = 0; k < Group.length; k++ ) {
			Group[k].addEventListener( "change", UpdateRealtimeAll );
		}
	}

	//	プログラムから値を書き換える既存関数をラップし、実行後に表示を更新する
	//	（初期化、一括変更、リセット、ロード、魔法クリック、セット装備）
	var WrapFuncs = [ "CharaSub", "FormReset", "LoadChara", "ClickMagic",
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

	//	取得魔法・戦士・剣闘士スキルのチェックボックスとアイコンをlabelでひとまとめにし、
	//	アイコンや隙間を含めてどこをクリックしてもON/OFFできるようにする
	var MagicChecks = [ f.fire, f.ice, f.magical, f.holy, f.warrior, f.gladiator ];
	for( i = 0; i < MagicChecks.length; i++ ) {
		var Checks = ToElementArray( MagicChecks[i] );
		for( k = 0; k < Checks.length; k++ ) {
			var Img = Checks[k].nextElementSibling;
			if( Img && Img.tagName == "IMG" ) {
				var Label = document.createElement( "label" );
				Label.className = "magiclabel";
				Checks[k].parentNode.insertBefore( Label, Checks[k] );
				Label.appendChild( Checks[k] );
				Label.appendChild( Img );
			}
		}
	}

	//	初期表示（スキルアイコン・名称を現在の職業に合わせてから更新）
	ChangeSkillMenuByJob();
	UpdateRealtimeAll();
}

window.addEventListener( "load", InitNeedTamaWatcher );
