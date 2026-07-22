//------------------------------------------------------------------------------
//	関数名		：	装備シミュレーター
//	機能説明	：	装備品およびパラメータからWC、HC、AC、DC、重さを算出する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function CalcMain()
{
	//	変数宣言
	var Wc = 0;				//	WC
	var Ac = 0;				//	AC
	var Hc = 0;				//	HC
	var Dc = 0;				//	DC
	var Weight = 0;			//	重さ
	var SideJob = "";		//	副業
	var SkillList = [		//	スキルリスト
			0,				//	[0]剣
			0,				//	[1]斧
			0,				//	[2]メイス
			0,				//	[3]素手
			0,				//	[4]回避
			0,				//	[5]暗殺
			0,				//	[6]槍
			0,				//	[7]火
			0,				//	[8]氷
			0,				//	[9]援護
			0,				//	[10]聖
			0,				//	[11]呪文
			0,				//	[12]錬金
			0,				//	[13]応急
			0				//	[14]EOR
		];
	var SpiritName = "剣";	//	適用スキル名（精霊剣利用時のみ設定）
	var SpiritValue = 0;	//	スキル最大値（精霊剣利用時のみ設定）
	var SetAccessoryNo = 0;	//	セットアクセサリ番号

	//	アイテムリスト
	var WeaponList = new Array();							//	武器リスト
	var ArmorList = new Array();							//	鎧/服リスト
	var ShoesList = new Array();							//	靴リスト
	var ShieldList = new Array();							//	盾リスト
	var Ring1List = new Array();							//	指輪１リスト
	var Ring2List = new Array();							//	指輪２リスト
	var NecklaceList = new Array();							//	ネクレリスト

	//	アイテムリスト取得
	GetWeaponList(WeaponList);								//	武器リスト
	GetArmorList(ArmorList);								//	鎧/服リスト
	GetShoesList(ShoesList);								//	靴リスト
	GetShieldList(ShieldList);								//	盾リスト
	GetAccessoryList(Ring1List);							//	指輪１リスト
	GetAccessoryList(Ring2List);							//	指輪２リスト
	GetAccessoryList(NecklaceList);							//	ネクレリスト

	//	装備組み合わせ検査処理
	CheckEquipment( WeaponList );

	//	変数へフォームから取得した値を設定
	var Lv = document.chara.lv.value - 0;					//	LV
	var Str = document.chara.str.value - 0;					//	STR
	var Vit = document.chara.vit.value - 0;					//	VIT
	var Dex = document.chara.dex.value - 0;					//	DEX
	var Agr = document.chara.agr.value - 0;					//	AGR
	var Int = document.chara.int.value - 0;					//	INT
	var Men = document.chara.men.value - 0;					//	MEN
	var Job = document.chara.job.value;						//	主職業
	var SideJob = document.chara.sidejob.value;				//	副業
	var Weapon = document.chara.weapon.value - 0;			//	武器
	var WeaponP = document.chara.weaponp.value - 0;			//	武器改造値
	var Armor = document.chara.armor.value - 0;				//	鎧/服
	var ArmorP = document.chara.armorp.value - 0;			//	鎧/服改造値
	var Shoes = document.chara.shoes.value - 0;				//	靴
	var ShoesP = document.chara.shoesp.value - 0;			//	靴改造値
	var Shield = document.chara.shield.value - 0;			//	盾
	var Ring1 = document.chara.ring1.value - 0;				//	指輪１
	var Ring2 = document.chara.ring2.value - 0;				//	指輪２
	var Necklace = document.chara.necklace.value - 0;		//	ネクレ

	var StrDiv5 = Str / 5;									//	STR / 5
	var MenDiv5 = Men / 5;									//	MEN / 5
	var VitDiv5 = Vit / 5;									//	VIT / 5
	var DexDiv5 = Dex / 5;									//	DEX / 5
	var AgrDiv5 = Agr / 5;									//	AGR / 5
	var IntDiv5 = Int / 5;									//	ITN / 5

	StrDiv5 = Math.floor(StrDiv5);							//	STR小数点以下切り捨て
	MenDiv5 = Math.floor(MenDiv5);							//	MEN小数点以下切り捨て
	VitDiv5 = Math.floor(VitDiv5);							//	VIT小数点以下切り捨て
	DexDiv5 = Math.floor(DexDiv5);							//	DEX小数点以下切り捨て
	AgrDiv5 = Math.floor(AgrDiv5);							//	AGR小数点以下切り捨て
	IntDiv5 = Math.floor(IntDiv5);							//	INT小数点以下切り捨て

	//	スキル取得
	GetSkillValue( Job, SideJob, SkillList );

	//	暗殺ボーナス付加処理
	var AssasinBonusFlag = AdjustAssasinBonus(Weapon, WeaponList, Armor, ArmorList, Shoes, ShoesList, SkillList[5]);

	//	セット装備ボーナス補正処理
	AdjustSetBonus(Armor, Shoes, ShoesList);

	//	セット装備ボーナス補正処理：アクセサリー
	SetAccessoryNo = AdjustSetBonusAccessory(Ring1, Ring2, Necklace, Ring1List, Ring2List, NecklaceList);

	//	素手以外の場合
	if( Weapon != 0 ){
		//	武器改造処理
		AdjustWeaponList(Weapon, WeaponP, WeaponList);
	}

	//	一体化鎧/服判定処理
	var UnitArmor = GetUnitArmor(Armor);

	//	服あり、かつ一体化服/鎧でない場合
	if( Armor != 0 && UnitArmor == 0 ){
		//	鎧/服改造処理
		AdjustArmorList(Armor, ArmorP, ArmorList);
	}

	//	一体化服/鎧の場合
	if (UnitArmor == 1 || UnitArmor == 2) {
		//	鎧/服改造処理(マシーヴ)
		AdjustArmorListMassive(Armor, ArmorP, ArmorList);
	}

	//	靴なし以外の場合
	if( Shoes != 0 ){
		//	靴改造処理
		AdjustShoesList(Shoes, ShoesP, ShoesList);
	}

	//	暗黒守護指輪の場合
	if( Ring1 >= 36 && Ring1 <= 40 || Ring2 >= 36 && Ring2 <= 40 ){
		//	暗黒守護指輪判定処理
		AdjustDarkProtectionRing(Ring1, Ring2, Ring1List, Ring2List);
	}

	//	HC、DCへレベルを設定
	Hc = Lv;
	Dc = Lv;

	//	武器種別設定
	var WeaponKind = WeaponList[Weapon][5];

	//	該当武器種別
	//	初期値：EOR
	var WeaponKindIndex = 14;

	if( WeaponKind == "剣" )		{	WeaponKindIndex = 0;	}
	if( WeaponKind == "斧" )		{	WeaponKindIndex = 1;	}
	if( WeaponKind == "メイス" )	{	WeaponKindIndex = 2;	}
	if( WeaponKind == "素手" )		{	WeaponKindIndex = 3;	}
	if( WeaponKind == "暗殺" )		{	WeaponKindIndex = 5;	}
	if( WeaponKind == "槍" )		{	WeaponKindIndex = 6;	}
	if( WeaponKind == "火" )		{	WeaponKindIndex = 7;	}
	if( WeaponKind == "氷" )		{	WeaponKindIndex = 8;	}

	//	シャム、大根、通販、バグキャッチャー装備時、暗殺スキルなしの場合、剣スキルを適用する
	if( Weapon == 14 ||		//	シャムシェール
		Weapon == 15 ||		//	クレイモア
		Weapon == 16 ||		//	ツーハンドソード
		Weapon == 80 ||		//	モールツーハンドソード
		Weapon == 109 ||	//	ライトシャムシェール
		Weapon == 163) {	// バグキャッチャー
		//	暗殺スキルなしの場合
		if( SkillList[5] == 0 ){

			//	剣スキルありの場合
			if( SkillList[0] != 0 ){

				//	スキル加算
				SkillList[0] -= 0;
				SkillList[0] += WeaponList[Weapon][6];

				//	剣スキル加算
				Wc += SkillList[0];
				Hc += SkillList[0];

				//	適用スキル設定
				WeaponList[Weapon][5] = "剣";
				WeaponKindIndex = 0;
			}
		}

		//	暗殺ありの場合
		else{
			//	暗殺スキル加算
			Wc += SkillList[WeaponKindIndex];
			Hc += SkillList[WeaponKindIndex];
		}
	}

	//	精霊剣の場合
	else if( WeaponKind == "精霊剣" ){

		//	最初の比較対象を剣スキルとする
		SpiritValue = SkillList[0];

		//	最大スキル取得ループ
		for( var i = 0; i <= 6; ++i ){
			//	回避スキルは精霊剣適用スキル対象外
			if( i == 4 ){
				continue;
			}

			if( SpiritValue < SkillList[i] ){
				SpiritValue = SkillList[i];

				//	精霊剣適用スキル設定
				if( i == 1 ){
					SpiritName = "斧";
				}
				if( i == 2 ){
					SpiritName = "メイス";
				}
				if( i == 3 ){
					SpiritName = "素手";
				}
				if( i == 5 ){
					SpiritName = "暗殺";
				}
				if( i == 6 ){
					SpiritName = "槍";
				}
			}
		}

		//	最高武器スキル加算
		Wc += SpiritValue;
		Hc += SpiritValue;
		WeaponList[Weapon][5] = SpiritName;
	}

	//	シャム、大根、通販、精霊剣以外の場合
	else{
		//	モール武器を考慮し、スキルを加算する
		//	スキルありの場合
		if( SkillList[WeaponKindIndex] != 0 ){
			//	スキル加算
			SkillList[WeaponKindIndex] -= 0;
			SkillList[WeaponKindIndex] += WeaponList[Weapon][6];
		}

		//	該当武器スキル加算
		Wc += SkillList[WeaponKindIndex];
		Hc += SkillList[WeaponKindIndex];
	}

	//	回避なし職の場合
	if( SkillList[4] == 0 ){

		//	HCを0.75倍する
		Hc *= 0.75;
		Hc = Math.floor(Hc);

		//	DCを0.75倍する
		Dc *= 0.75;
		Dc = Math.floor(Dc);
	}

	//	回避あり職の場合
	else{
		//	モール防具を考慮し、スキルを加算する
		SkillList[4] += ArmorList[Armor][4];

		//	DCへ回避スキル加算
		Dc += SkillList[4];
	}

	// ドーピング適用
	var DopingParameter = [0, 0, 0, 0];
	var DopingList = new Array();
	SetDopingValue(DopingParameter, DopingList);

	//	WC設定
	Wc += StrDiv5;						//	STR / 5
	Wc += MenDiv5;						//	MEN / 5
	Wc += WeaponList[Weapon][1];		//	武器
	Wc += Ring1List[Ring1][1];			//	指輪１
	Wc += Ring2List[Ring2][1];			//	指輪２
	Wc += NecklaceList[Necklace][1];	//	ネクレ
	Wc += DopingParameter[0];			//	ドーピング

	//	AC設定
	Ac += VitDiv5;						//	VIT / 5
	Ac += ArmorList[Armor][1];			//	鎧/服
	Ac += ShoesList[Shoes][1];			//	靴
	Ac += ShieldList[Shield][1];		//	盾
	Ac += Ring1List[Ring1][3];			//	指輪１
	Ac += Ring2List[Ring2][3];			//	指輪２
	Ac += NecklaceList[Necklace][3];	//	ネクレ
	Ac += DopingParameter[1];			//	ドーピング

	//	HC設定
	Hc += DexDiv5;						//	DEX / 5
	Hc += WeaponList[Weapon][2];		//	武器
	Hc += Ring1List[Ring1][2];			//	指輪１
	Hc += Ring2List[Ring2][2];			//	指輪２
	Hc += NecklaceList[Necklace][2];	//	ネクレ
	Hc += DopingParameter[2];			//	ドーピング

	//	DC設定
	Dc += AgrDiv5;						//	AGR / 5
	Dc += ArmorList[Armor][2];			//	鎧/服
	Dc += ShoesList[Shoes][2];			//	靴
	Dc += ShieldList[Shield][2];		//	盾
	Dc += Ring1List[Ring1][4];			//	指輪１
	Dc += Ring2List[Ring2][4];			//	指輪２
	Dc += NecklaceList[Necklace][4];	//	ネクレ
	Dc += DopingParameter[3];			//	ドーピング

	//	重さ設定
	Weight += WeaponList[Weapon][4];	//	武器
	Weight += ArmorList[Armor][3];		//	鎧/服
	Weight += ShoesList[Shoes][3];		//	靴
	Weight += ShieldList[Shield][3];	//	盾

	// フォーム設定
	document.chara.wc.value = Wc;
	document.chara.ac.value = Ac;
	document.chara.hc.value = Hc;
	document.chara.dc.value = Dc;
	document.chara.weight.value = Weight;

	//	耐性設定処理
	SetTaisei(StrDiv5, VitDiv5, DexDiv5, AgrDiv5, IntDiv5, MenDiv5, Ring1, Ring1List, Ring2, Ring2List, Necklace, NecklaceList);

	//	耐性減設定処理
	SetTaiseiGen(Weapon, WeaponList, Ring1, Ring1List, Ring2, Ring2List, Necklace, NecklaceList);

	//	ステータス内訳設定処理
	SetStatusDetail( Lv, StrDiv5, DexDiv5, AgrDiv5, VitDiv5, MenDiv5, IntDiv5, Wc, Hc, Ac, Dc, Weight, SkillList, WeaponList, Weapon, WeaponP, WeaponKind, WeaponKindIndex, ArmorList, Armor, ArmorP, ShieldList, Shield, ShoesList, Shoes, ShoesP, Ring1List, Ring1, Ring2List, Ring2, NecklaceList, Necklace, AssasinBonusFlag, SpiritName, SpiritValue, DopingList, SetAccessoryNo);
}
//------------------------------------------------------------------------------
//	関数名		：	装備組み合わせ検査処理
//	機能説明	：	装備の組み合わせに対するフェールセーフ処理。
//	パラメータ	：	WeaopnList	武器リスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function CheckEquipment(WeaponList)
{
	//	武器種別
	var Weapon = document.chara.weapon.value - 0;

	//	両手武器の場合、盾なしとする
	if( WeaponList[Weapon][3] == "両手" ){
		document.chara.shield.value = 0;
	}

	//	一体化鎧/服判定処理
	var UnitArmor = GetUnitArmor(document.chara.armor.value);

	//	一体化鎧/服の場合、靴なしとする
	if (UnitArmor == 1){
		document.chara.shoes.value = 0;
	}

	//	指輪１と指輪２が同一の場合、指輪２をなしとする
	if( document.chara.ring1.value == document.chara.ring2.value ){
		document.chara.ring2.value = 0;
	}

	//	暗黒の指輪の場合、炎、氷、魔、聖、撃を同一の装備品として判定する
	else if( (document.chara.ring1.value >= 31 && document.chara.ring1.value <= 35) &&
		(document.chara.ring2.value >= 31 && document.chara.ring2.value <= 35) ){
		document.chara.ring2.value = 0;
	}

	//	暗黒守護指輪の場合、炎、氷、魔、聖、撃を同一の装備品として判定する
	else if( (document.chara.ring1.value >= 36 && document.chara.ring1.value <= 40) &&
		(document.chara.ring2.value >= 36 && document.chara.ring2.value <= 40) ){
		document.chara.ring2.value = 0;
	}
}
//------------------------------------------------------------------------------
//	関数名		：	武器リスト取得処理
//	機能説明	：	武器リストを取得する。
//	パラメータ	：	WeaponList	武器リスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetWeaponList(WeaponList)
{
	//	武器リスト					名称							WC		HC		タイプ		重さ	スキル	スキル増加(モール)	耐性減火	耐性減氷	消費MP減少(%)
	WeaponList[0]	=	new Array(	"なし",							0,		0,		"片手",		0,		"素手",		0,				0,			0,			0	);		//	なし
	WeaponList[1]	=	new Array(	"ダガー",						15,		0,		"片手",		3,		"剣",		0,				0,			0,			0	);		//	ダガー
	WeaponList[2]	=	new Array(	"ショートソード",				17,		0,		"片手",		5,		"剣",		0,				0,			0,			0	);		//	ショートソード
	WeaponList[3]	=	new Array(	"レイピア",						20,		0,		"片手",		5,		"剣",		0,				0,			0,			0	);		//	レイピア
	WeaponList[4]	=	new Array(	"プレードソード",				20,		0,		"片手",		7,		"剣",		0,				0,			0,			0	);		//	プレードソード
	WeaponList[5]	=	new Array(	"ファルシオン",					22,		0,		"片手",		8,		"剣",		0,				0,			0,			0	);		//	ファルシオン
	WeaponList[6]	=	new Array(	"ロングソード",					22,		0,		"片手",		7,		"剣",		0,				0,			0,			0	);		//	ロングソード
	WeaponList[7]	=	new Array(	"ブロードソード",				22,		0,		"片手",		8,		"剣",		0,				0,			0,			0	);		//	ブロードソード
	WeaponList[8]	=	new Array(	"バスタードソード",				24,		0,		"片手",		11,		"剣",		0,				0,			0,			0	);		//	バスタードソード
	WeaponList[9]	=	new Array(	"ナーガブレード",				24,		0,		"片手",		9,		"剣",		0,				0,			0,			0	);		//	ナーガブレード
	WeaponList[10]	=	new Array(	"テラブレード",					25,		0,		"片手",		9,		"剣",		0,				0,			0,			0	);		//	テラブレード
	WeaponList[11]	=	new Array(	"ビスター",						26,		0,		"片手",		9,		"剣",		0,				0,			0,			0	);		//	ビスター
	WeaponList[12]	=	new Array(	"古代ビスター",					28,		0,		"片手",		9,		"剣",		0,				0,			0,			0	);		//	古代ビスター
	WeaponList[13]	=	new Array(	"ティナブレード",				25,		0,		"片手",		1,		"剣",		0,				0,			0,			0	);		//	ティナブレード
	WeaponList[14]	=	new Array(	"シャムシェール",				24,		0,		"両手",		9,		"暗殺",		0,				0,			0,			0	);		//	シャムシェール
	WeaponList[15]	=	new Array(	"クレイモア",					28,		0,		"両手",		10,		"暗殺",		0,				0,			0,			0	);		//	クレイモア
	WeaponList[16]	=	new Array(	"ツーハンドソード",				30,		0,		"両手",		13,		"暗殺",		0,				0,			0,			0	);		//	ツーハンドソード
	WeaponList[17]	=	new Array(	"タイタンソード",				32,		0,		"両手",		12,		"暗殺",		0,				0,			0,			0	);		//	タイタンソード
	WeaponList[18]	=	new Array(	"サージソード",					36,		0,		"両手",		12,		"暗殺",		0,				0,			0,			0	);		//	サージソード
	WeaponList[19]	=	new Array(	"エクスソード",					39,		0,		"両手",		12,		"暗殺",		0,				0,			0,			0	);		//	エクスソード
	WeaponList[20]	=	new Array(	"古代エクスソード",				41,		0,		"両手",		12,		"暗殺",		0,				0,			0,			0	);		//	古代エクスソード
	WeaponList[21]	=	new Array(	"サーメディソード",				33,		0,		"両手",		2,		"暗殺",		0,				0,			0,			0	);		//	サーメディソード
	WeaponList[22]	=	new Array(	"スタッフ",						9,		0,		"両手",		3,		"メイス",	0,				0,			0,			0	);		//	スタッフ
	WeaponList[23]	=	new Array(	"クラブ",						10,		0,		"片手",		6,		"メイス",	0,				0,			0,			0	);		//	クラブ
	WeaponList[24]	=	new Array(	"メイス",						17,		0,		"片手",		7,		"メイス",	0,				0,			0,			0	);		//	メイス
	WeaponList[25]	=	new Array(	"ロングメイス",					20,		0,		"片手",		9,		"メイス",	0,				0,			0,			0	);		//	ロングメイス
	WeaponList[26]	=	new Array(	"ウォーハンマー",				25,		0,		"両手",		10,		"メイス",	0,				0,			0,			0	);		//	ウォーハンマー
	WeaponList[27]	=	new Array(	"フレイル",						27,		0,		"片手",		12,		"メイス",	0,				0,			0,			0	);		//	フレイル
	WeaponList[28]	=	new Array(	"モール",						28,		0,		"両手",		12,		"メイス",	0,				0,			0,			0	);		//	モール
	WeaponList[29]	=	new Array(	"ヘビーモール",					34,		0,		"両手",		14,		"メイス",	0,				0,			0,			0	);		//	ヘビーモール
	WeaponList[30]	=	new Array(	"オークハンマー",				36,		0,		"両手",		13,		"メイス",	0,				0,			0,			0	);		//	オークハンマー
	WeaponList[31]	=	new Array(	"スパイクフレイル",				26,		0,		"片手",		9,		"メイス",	0,				0,			0,			0	);		//	スパイクフレイル
	WeaponList[32]	=	new Array(	"バトルハンマー",				38,		0,		"両手",		12,		"メイス",	0,				0,			0,			0	);		//	バトルハンマー
	WeaponList[33]	=	new Array(	"古代バトルハンマー",			40,		0,		"両手",		12,		"メイス",	0,				0,			0,			0	);		//	古代バトルハンマー
	WeaponList[34]	=	new Array(	"ギィーガーメイス",				26,		0,		"片手",		1,		"メイス",	0,				0,			0,			0	);		//	ギィーガーメイス
	WeaponList[35]	=	new Array(	"魔法の杖",						14,		0,		"両手",		5,		"メイス",	0,				0,			0,			5	);		//	魔法の杖
	WeaponList[36]	=	new Array(	"魂の杖(炎)",					18,		0,		"両手",		5,		"メイス",	0,				-2,			-1,			10	);		//	魂の杖(炎)
	WeaponList[37]	=	new Array(	"魂の杖(氷)",					18,		0,		"両手",		5,		"メイス",	0,				-1,			-2,			10	);		//	魂の杖(氷)
	WeaponList[38]	=	new Array(	"クリスタルスタッフ",			20,		0,		"両手",		5,		"メイス",	0,				-2,			-2,			15	);		//	クリスタルスタッフ
	WeaponList[39]	=	new Array(	"古代クリスタルロッド",			22,		0,		"両手",		5,		"メイス",	0,				-2,			-2,			20	);		//	古代クリスタルロッド
	WeaponList[40]	=	new Array(	"クライズロッド",				15,		0,		"両手",		2,		"メイス",	0,				0,			0,			10	);		//	クライズロッド
	WeaponList[41]	=	new Array(	"ハンドアクス",					16,		0,		"片手",		4,		"斧",		0,				0,			0,			0	);		//	ハンドアクス
	WeaponList[42]	=	new Array(	"スモールアクス",				18,		0,		"片手",		6,		"斧",		0,				0,			0,			0	);		//	スモールアクス
	WeaponList[43]	=	new Array(	"バトルアクス",					21,		0,		"片手",		8,		"斧",		0,				0,			0,			0	);		//	バトルアクス
	WeaponList[44]	=	new Array(	"クレセントアクス",				20,		0,		"片手",		9,		"斧",		0,				0,			0,			0	);		//	クレセントアクス
	WeaponList[45]	=	new Array(	"ラージアクス",					28,		0,		"両手",		12,		"斧",		0,				0,			0,			0	);		//	ラージアクス
	WeaponList[46]	=	new Array(	"グレートアクス",				30,		0,		"両手",		14,		"斧",		0,				0,			0,			0	);		//	グレートアクス
	WeaponList[47]	=	new Array(	"バ―サーカアクス",				24,		0,		"片手",		9,		"斧",		0,				0,			0,			0	);		//	バ―サーカアクス
	WeaponList[48]	=	new Array(	"ウォーアクス",					26,		0,		"片手",		9,		"斧",		0,				0,			0,			0	);		//	ウォーアクス
	WeaponList[49]	=	new Array(	"ジェニックス",					38,		0,		"両手",		12,		"斧",		0,				0,			0,			0	);		//	ジェニックス
	WeaponList[50]	=	new Array(	"古代ジェニックス",				40,		0,		"両手",		12,		"斧",		0,				0,			0,			0	);		//	古代ジェニックス
	WeaponList[51]	=	new Array(	"ディラーアクス",				35,		0,		"両手",		2,		"斧",		0,				0,			0,			0	);		//	ディラーアクス
	WeaponList[52]	=	new Array(	"スピア",						12,		0,		"両手",		8,		"槍",		0,				0,			0,			0	);		//	スピア
	WeaponList[53]	=	new Array(	"トライデント",					14,		0,		"両手",		9,		"槍",		0,				0,			0,			0	);		//	トライデント
	WeaponList[54]	=	new Array(	"ランス",						18,		0,		"両手",		10,		"槍",		0,				0,			0,			0	);		//	ランス
	WeaponList[55]	=	new Array(	"パイク",						22,		0,		"両手",		11,		"槍",		0,				0,			0,			0	);		//	パイク
	WeaponList[56]	=	new Array(	"ハルベルド",					28,		0,		"両手",		12,		"槍",		0,				0,			0,			0	);		//	ハルベルド
	WeaponList[57]	=	new Array(	"サラマンダーパイク",			30,		0,		"両手",		12,		"槍",		0,				0,			0,			0	);		//	サラマンダーパイク
	WeaponList[58]	=	new Array(	"バーブスピア",					36,		0,		"両手",		12,		"槍",		0,				0,			0,			0	);		//	バーブスピア
	WeaponList[59]	=	new Array(	"エックスハルバード",			38,		0,		"両手",		12,		"槍",		0,				0,			0,			0	);		//	エックスハルバード
	WeaponList[60]	=	new Array(	"古代エクスハルバード",			40,		0,		"両手",		12,		"槍",		0,				0,			0,			0	);		//	古代エクスハルバード
	WeaponList[61]	=	new Array(	"アビゴルランス",				34,		0,		"両手",		2,		"槍",		0,				0,			0,			0	);		//	アビゴルランス
	WeaponList[62]	=	new Array(	"グラブ",						15,		0,		"両手",		2,		"素手",		0,				0,			0,			0	);		//	グラブ
	WeaponList[63]	=	new Array(	"フィスト",						21,		0,		"両手",		6,		"素手",		0,				0,			0,			0	);		//	フィスト
	WeaponList[64]	=	new Array(	"ガントレット",					25,		0,		"両手",		8,		"素手",		0,				0,			0,			0	);		//	ガントレット
	WeaponList[65]	=	new Array(	"パタ",							28,		0,		"両手",		10,		"素手",		0,				0,			0,			0	);		//	パタ
	WeaponList[66]	=	new Array(	"ゴーレムフィスト",				32,		0,		"両手",		12,		"素手",		0,				0,			0,			0	);		//	ゴーレムフィスト
	WeaponList[67]	=	new Array(	"ソーンズフィスト",				36,		0,		"両手",		12,		"素手",		0,				0,			0,			0	);		//	ソーンズフィスト
	WeaponList[68]	=	new Array(	"スクリューパタ",				38,		0,		"両手",		12,		"素手",		0,				0,			0,			0	);		//	スクリューパタ
	WeaponList[69]	=	new Array(	"古代スクリューパタ",			40,		0,		"両手",		12,		"素手",		0,				0,			0,			0	);		//	古代スクリューパタ
	WeaponList[70]	=	new Array(	"ゲイモスフィスト",				33,		0,		"両手",		2,		"素手",		0,				0,			0,			0	);		//	ゲイモスフィスト
	WeaponList[71]	=	new Array(	"イフリート",					40,		0,		"両手",		1,		"精霊剣",	0,				0,			0,			0	);		//	イフリート
	WeaponList[72]	=	new Array(	"マーメイド",					40,		0,		"両手",		1,		"精霊剣",	0,				0,			0,			0	);		//	マーメイド
	WeaponList[73]	=	new Array(	"ドラゴンブレス",				25,		0,		"片手",		1,		"精霊剣",	0,				0,			0,			0	);		//	ドラゴンブレス
	WeaponList[74]	=	new Array(	"フレイムタン",					18,		0,		"片手",		0,		"火",		0,				0,			0,			0	);		//	フレイムタン
	WeaponList[75]	=	new Array(	"アイスブラント",				18,		0,		"片手",		0,		"氷",		0,				0,			0,			0	);		//	アイスブラント
	WeaponList[76]	=	new Array(	"モール魔法の杖",				14,		0,		"両手",		5,		"メイス",	0,				0,			0,			5	);		//	モール魔法の杖
	WeaponList[77]	=	new Array(	"モールバスタードソード",		25,		0,		"片手",		11,		"剣",		1,				0,			0,			0	);		//	モールバスタードソード
	WeaponList[78]	=	new Array(	"モールフレイル",				28,		0,		"片手",		12,		"メイス",	1,				0,			0,			0	);		//	モールフレイル
	WeaponList[79]	=	new Array(	"モールクレセントアクス",		21,		0,		"片手",		9,		"斧",		1,				0,			0,			0	);		//	モールクレセントアクス
	WeaponList[80]	=	new Array(	"モールツーハンドソード",		31,		0,		"両手",		13,		"暗殺",		1,				0,			0,			0	);		//	モールツーハンドソード
	WeaponList[81]	=	new Array(	"モールガントレット",			26,		0,		"両手",		8,		"素手",		1,				0,			0,			0	);		//	モールガントレット
	WeaponList[82]	=	new Array(	"モールパイク",					23,		0,		"両手",		11,		"槍",		1,				0,			0,			0	);		//	モールパイク
	WeaponList[83]	=	new Array(	"モールナーガブレード",			25,		0,		"片手",		9,		"剣",		2,				0,			0,			0	);		//	モールナーガブレード
	WeaponList[84]	=	new Array(	"モールオークハンマー",			37,		0,		"両手",		13,		"メイス",	2,				0,			0,			0	);		//	モールオークハンマー
	WeaponList[85]	=	new Array(	"モールバーサーカーアクス",		25,		0,		"片手",		9,		"斧",		2,				0,			0,			0	);		//	モールバーサーカーアクス
	WeaponList[86]	=	new Array(	"モールタイタンソード",			33,		0,		"両手",		12,		"暗殺",		2,				0,			0,			0	);		//	モールタイタンソード
	WeaponList[87]	=	new Array(	"モールゴーレムフィスト",		33,		0,		"両手",		12,		"素手",		2,				0,			0,			0	);		//	モールゴーレムフィスト
	WeaponList[88]	=	new Array(	"モールサラマンダーパイク",		31,		0,		"両手",		12,		"槍",		2,				0,			0,			0	);		//	モールサラマンダーパイク
	WeaponList[89]	=	new Array(	"モール魂の杖(炎)",				18,		0,		"両手",		5,		"メイス",	0,				-2,			-1,			10	);		//	モール魂の杖(炎)
	WeaponList[90]	=	new Array(	"モール魂の杖(氷)",				18,		0,		"両手",		5,		"メイス",	0,				-1,			-2,			10	);		//	モール魂の杖(氷)
	WeaponList[91]	=	new Array(	"モールテラブレード",			26,		0,		"片手",		9,		"剣",		2,				0,			0,			0	);		//	モールテラブレード
	WeaponList[92]	=	new Array(	"モールスパイクフレイル",		27,		0,		"片手",		9,		"メイス",	2,				0,			0,			0	);		//	モールスパイクフレイル
	WeaponList[93]	=	new Array(	"モールウォーアクス",			27,		0,		"片手",		9,		"斧",		2,				0,			0,			0	);		//	モールウォーアクス
	WeaponList[94]	=	new Array(	"モールサージソード",			37,		0,		"両手",		12,		"暗殺",		2,				0,			0,			0	);		//	モールサージソード
	WeaponList[95]	=	new Array(	"モールソーンズフィスト",		37,		0,		"両手",		12,		"素手",		2,				0,			0,			0	);		//	モールソーンズフィスト
	WeaponList[96]	=	new Array(	"モールバーブスピア",			37,		0,		"両手",		12,		"槍",		2,				0,			0,			0	);		//	モールバーブスピア
	WeaponList[97]	=	new Array(	"モール古代ビスター",			29,		0,		"片手",		9,		"剣",		2,				0,			0,			0	);		//	モール古代ビスター
	WeaponList[98]	=	new Array(	"モール古代バトルハンマー",		41,		0,		"両手",		12,		"メイス",	2,				0,			0,			0	);		//	モール古代バトルハンマー
	WeaponList[99]	=	new Array(	"モール古代エクスソード",		42,		0,		"両手",		12,		"暗殺",		2,				0,			0,			0	);		//	モール古代エクスソード
	WeaponList[100]	=	new Array(	"モール古代ジェニックス",		41,		0,		"両手",		12,		"斧",		2,				0,			0,			0	);		//	モール古代ジェニックス
	WeaponList[101]	=	new Array(	"モール古代スクリューパタ",		41,		0,		"両手",		12,		"素手",		2,				0,			0,			0	);		//	モール古代スクリューパタ
	WeaponList[102]	=	new Array(	"モール古代エクスハルバード",	41,		0,		"両手",		12,		"槍",		2,				0,			0,			0	);		//	モール古代エクスハルバード
	WeaponList[103]	=	new Array(	"モール古代クリスタルロッド",	22,		0,		"両手",		5,		"メイス",	0,				-2,			-2,			20	);		//	モール古代クリスタルロッド
	WeaponList[104]	=	new Array(	"ライトレイピア",				21,		0,		"片手",		2,		"剣",		1,				0,			0,			0	);		//	ライトレイピア
	WeaponList[105]	=	new Array(	"ライトバトルアクス",			22,		0,		"片手",		2,		"斧",		1,				0,			0,			0	);		//	ライトバトルアクス
	WeaponList[106]	=	new Array(	"ライトパイク",					23,		0,		"両手",		3,		"槍",		1,				0,			0,			0	);		//	ライトパイク
	WeaponList[107]	=	new Array(	"ライトガントレット",			26,		0,		"両手",		3,		"素手",		1,				0,			0,			0	);		//	ライトガントレット
	WeaponList[108]	=	new Array(	"ライトロングメイス",			21,		0,		"片手",		2,		"メイス",	1,				0,			0,			0	);		//	ライトロングメイス
	WeaponList[109]	=	new Array(	"ライトシャムシェール",			25,		0,		"両手",		3,		"暗殺",		1,				0,			0,			0	);		//	ライトシャムシェール
	WeaponList[110]	=	new Array(	"ティンクルスター",				12,		0,		"両手",		4,		"メイス",	0,				0,			0,			20	);		//	ティンクルスター
	WeaponList[111]	=	new Array(	"シルフィードリング",			30,		0,		"片手",		9,		"精霊剣",	0,				0,			0,			0	);		//	シルフィードリング
	WeaponList[112]	=	new Array(	"シルフィードソード",			28,		0,		"片手",		3,		"剣",		0,				0,			0,			0	);		//	シルフィードソード
	WeaponList[113]	=	new Array(	"シルフィードブレード",			37,		0,		"両手",		5,		"暗殺",		0,				0,			0,			0	);		//	シルフィードブレード
	WeaponList[114]	=	new Array(	"シルフィードランス",			36,		0,		"両手",		5,		"槍",		0,				0,			0,			0	);		//	シルフィードランス
	WeaponList[115]	=	new Array(	"シルフィードメイス",			28,		0,		"片手",		3,		"メイス",	0,				0,			0,			0	);		//	シルフィードメイス
	WeaponList[116]	=	new Array(	"シルフィードアックス",			28,		0,		"片手",		3,		"斧",		0,				0,			0,			0	);		//	シルフィードアックス
	WeaponList[117]	=	new Array(	"シルフィードフィスト",			36,		0,		"両手",		5,		"素手",		0,				0,			0,			0	);		//	シルフィードフィスト
	WeaponList[118]	=	new Array(	"シルフィードスタッフ",			22,		0,		"両手",		5,		"メイス",	0,				-2,			-2,			20	);		//	シルフィードスタッフ
	WeaponList[119]	=	new Array(	"フェンリルの杖",				18,		0,		"両手",		7,		"メイス",	0,				0,			-4,			15	);		//	フェンリルの杖
	WeaponList[120]	=	new Array(	"フェニックスの杖",				18,		0,		"両手",		7,		"メイス",	0,				-4,			0,			15	);		//	フェニックスの杖
	WeaponList[121]	=	new Array(	"大司祭の杖",					20,		0,		"両手",		12,		"メイス",	0,				-4,			-4,			15	);		//	大司祭の杖
	WeaponList[122]	=	new Array(	"ギィーガチェイン",				30,		0,		"片手",		7,		"メイス",	0,				0,			0,			0	);		//	ギィーガチェイン
	WeaponList[123]	=	new Array(	"ティナカトラス",				30,		0,		"片手",		7,		"剣",		0,				0,			0,			0	);		//	ティナカトラス
	WeaponList[124]	=	new Array(	"ディーラーチョップ",			44,		0,		"両手",		14,		"斧",		0,				0,			0,			0	);		//	ディーラーチョップ
	WeaponList[125]	=	new Array(	"ファルスピアー",				43,		0,		"両手",		14,		"槍",		0,				0,			0,			0	);		//	ファルスピアー
	WeaponList[126]	=	new Array(	"ゲイモスクロー",				44,		0,		"両手",		14,		"素手",		0,				0,			0,			0	);		//	ゲイモスクロー
	WeaponList[127]	=	new Array(	"ンゴールファング",				43,		0,		"両手",		14,		"暗殺",		0,				0,			0,			0	);		//	ンゴールファング
	WeaponList[128]	=	new Array(	"クラウンロッド",				20,		0,		"両手",		14,		"メイス",	0,				0,			0,			15	);		//	クラウンロッド
	WeaponList[129]	=	new Array(	"モールフェンリルの杖",			18,		0,		"両手",		7,		"メイス",	0,				0,			-4,			15	);		//	モールフェンリルの杖
	WeaponList[130]	=	new Array(	"モールフェニックスの杖",		18,		0,		"両手",		7,		"メイス",	0,				-4,			0,			15	);		//	モールフェニックスの杖
	WeaponList[131]	=	new Array(	"モール大司祭の杖",				20,		0,		"両手",		12,		"メイス",	0,				-4,			-4,			15	);		//	モール大司祭の杖
	WeaponList[132]	=	new Array(	"ブレイジングダガー",			25,		0,		"片手",		3,		"剣",		0,				0,			0,			0	);		//	ブレイジングダガー
	WeaponList[133]	=	new Array(	"クロスガーディアン",			40,		0,		"両手",		15,		"槍",		0,				0,			0,			0	);		//	クロスガーディアン
	WeaponList[134]	=	new Array(	"グレイブボム",					28,		0,		"両手",		9,		"素手",		0,				0,			0,			0	);		//	グレイブボム
	WeaponList[135]	=	new Array(	"トールハンマー",				38,		0,		"両手",		14,		"メイス",	0,				0,			0,			0	);		//	トールハンマー
	WeaponList[136]	=	new Array(	"デスサイズ",					34,		0,		"両手",		15,		"斧",		0,				0,			0,			0	);		//	デスサイズ
	WeaponList[137]	=	new Array(	"ムラマサ",						40,		0,		"両手",		12,		"暗殺",		0,				0,			0,			0	);		//	ムラマサ
	WeaponList[138]	=	new Array(	"モールブレイジングダガー",		26,		0,		"片手",		3,		"剣",		2,				0,			0,			0	);		//	モールブレイジングダガー
	WeaponList[139]	=	new Array(	"モールクロスガーディアン",		41,		0,		"両手",		15,		"槍",		2,				0,			0,			0	);		//	モールクロスガーディアン
	WeaponList[140]	=	new Array(	"モールグレイブボム",			29,		0,		"両手",		9,		"素手",		2,				0,			0,			0	);		//	モールグレイブボム
	WeaponList[141]	=	new Array(	"モールトールハンマー",			39,		0,		"両手",		14,		"メイス",	2,				0,			0,			0	);		//	モールトールハンマー
	WeaponList[142]	=	new Array(	"モールデスサイズ",				35,		0,		"両手",		15,		"斧",		2,				0,			0,			0	);		//	モールデスサイズ
	WeaponList[143]	=	new Array(	"モールムラマサ",				41,		0,		"両手",		12,		"暗殺",		2,				0,			0,			0	);		//	モールムラマサ
	WeaponList[144]	=	new Array(	"サクラソード",					22,		0,		"片手",		3,		"剣",		0,				0,			0,			0	);		//	サクラソード
	WeaponList[145]	=	new Array(	"スライムリング",				30,		0,		"片手",		2,		"素手",		0,				0,			0,			0	);		//	スライムリング
	WeaponList[146]	=	new Array(	"スネークリング",				40,		0,		"両手",		2,		"槍",		0,				0,			0,			0	);		//	スネークリング
	WeaponList[147]	=	new Array(	"ビーストリング",				32,		0,		"両手",		2,		"斧",		0,				0,			0,			0	);		//	ビーストリング
	WeaponList[148]	=	new Array(	"ドラゴンリング",				35,		0,		"両手",		2,		"メイス",	0,				0,			0,			0	);		//	ドラゴンリング
	WeaponList[149]	=	new Array(	"ミュータントリング",			34,		0,		"両手",		2,		"暗殺",		0,				0,			0,			0	);		//	ミュータントリング
	WeaponList[150]	=	new Array(	"ミミックリング",				20,		0,		"両手",		2,		"素手",		0,				0,			0,			0	);		//	ミミックリング
	WeaponList[151]	=	new Array(	"シビライズリング",				40,		0,		"両手",		2,		"暗殺",		0,				0,			0,			0	);		//	シビライズリング
	WeaponList[152]	=	new Array(	"ストーンリング",				30,		0,		"両手",		2,		"素手",		0,				0,			0,			0	);		//	ストーンリング
	WeaponList[153]	=	new Array(	"カースリング",					30,		0,		"両手",		2,		"メイス",	0,				0,			0,			0	);		//	カースリング
	WeaponList[154]	=	new Array(	"モールスライムリング",			31,		0,		"片手",		2,		"素手",		2,				0,			0,			0	);		//	モールスライムリング
	WeaponList[155]	=	new Array(	"モールスネークリング",			41,		0,		"両手",		2,		"槍",		2,				0,			0,			0	);		//	モールスネークリング
	WeaponList[156]	=	new Array(	"モールビーストリング",			33,		0,		"両手",		2,		"斧",		2,				0,			0,			0	);		//	モールビーストリング
	WeaponList[157]	=	new Array(	"モールドラゴンリング",			36,		0,		"両手",		2,		"メイス",	2,				0,			0,			0	);		//	モールドラゴンリング
	WeaponList[158]	=	new Array(	"モールミュータントリング",		35,		0,		"両手",		2,		"暗殺",		2,				0,			0,			0	);		//	モールミュータントリング
	WeaponList[159]	=	new Array(	"モールミミックリング",			21,		0,		"両手",		2,		"素手",		2,				0,			0,			0	);		//	モールミミックリング
	WeaponList[160]	=	new Array(	"モールシビライズリング",		41,		0,		"両手",		2,		"暗殺",		2,				0,			0,			0	);		//	モールシビライズリング
	WeaponList[161]	=	new Array(	"モールストーンリング",			31,		0,		"両手",		2,		"素手",		2,				0,			0,			0	);		//	モールストーンリング
	WeaponList[162]	=	new Array(	"モールカースリング",			31,		0,		"両手",		2,		"メイス",	2,				0,			0,			0	);		//	モールカースリング
	WeaponList[163]	=	new Array(	"バグキャッチャー",				22,		0,		"両手",		3,		"暗殺",		0,				0,			0,			0	);		//	バグキャッチャー
	//	武器リスト					名称							WC		HC		タイプ		重さ	スキル	スキル増加(モール)	耐性減火	耐性減氷	消費MP減少(%)
}
//------------------------------------------------------------------------------
//	関数名		：	鎧/服リスト取得処理
//	機能説明	：	鎧/服リストを取得する。
//	パラメータ	：	ArmorList	鎧/服リスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetArmorList(ArmorList)
{
	//	鎧/服リスト					名称										AC	DC	重さ	スキル増加(モール)
	ArmorList[0]	=	new	Array(	"なし",										0,	0,	0,		0	);		//	なし
	ArmorList[1]	=	new	Array(	"ノーマルアーマー",							1,	1,	1,		0	);		//	ノーマルアーマー
	ArmorList[2]	=	new	Array(	"レザーアーマー",							4,	0,	4,		0	);		//	レザーアーマー
	ArmorList[3]	=	new	Array(	"リベットアーマー",							6,	1,	6,		0	);		//	リベットアーマー
	ArmorList[4]	=	new	Array(	"スケイルメイル",							7,	0,	7,		0	);		//	スケイルメイル
	ArmorList[5]	=	new	Array(	"チェインメイル",							9,	0,	8,		0	);		//	チェインメイル
	ArmorList[6]	=	new	Array(	"チタンアーマー",							10,	-1,	8,		0	);		//	チタンアーマー
	ArmorList[7]	=	new	Array(	"プレートアーマー",							12,	-3,	8,		0	);		//	プレートアーマー
	ArmorList[8]	=	new	Array(	"テブートアーマー",							11,	-1,	8,		0	);		//	テブートアーマー
	ArmorList[9]	=	new	Array(	"ブリガンディ",								13,	-3,	9,		0	);		//	ブリガンディ
	ArmorList[10]	=	new	Array(	"ミスリルアーマー",							14,	-2,	9,		0	);		//	ミスリルアーマー
	ArmorList[11]	=	new	Array(	"ヘビーアーマー",							16,	-4,	9,		0	);		//	ヘビーアーマー
	ArmorList[12]	=	new	Array(	"タルロスアーマー",							18,	-1,	9,		0	);		//	タルロスアーマー
	ArmorList[13]	=	new	Array(	"レイダンアーマー",							20,	2,	9,		0	);		//	レイダンアーマー
	ArmorList[14]	=	new	Array(	"ローブ",									4,	0,	4,		0	);		//	ローブ
	ArmorList[15]	=	new	Array(	"ヒップホップ",								3,	4,	4,		0	);		//	ヒップホップ
	ArmorList[16]	=	new	Array(	"羽織袴/振袖",								2,	0,	5,		0	);		//	羽織袴/振袖
	ArmorList[17]	=	new	Array(	"パヂチョゴリ/チマチョゴリ",				2,	0,	5,		0	);		//	パヂチョゴリ/チマチョゴリ
	ArmorList[18]	=	new	Array(	"マント",									5,	1,	3,		0	);		//	マント
	ArmorList[19]	=	new	Array(	"タキシード/ドレス",						4,	2,	3,		0	);		//	タキシード/ドレス
	ArmorList[20]	=	new	Array(	"ケープ",									4,	4,	4,		0	);		//	ケープ
	ArmorList[21]	=	new	Array(	"レオタード",								3,	7,	3,		0	);		//	レオタード
	ArmorList[22]	=	new	Array(	"道着",										5,	5,	5,		0	);		//	道着
	ArmorList[23]	=	new	Array(	"パンク/ミニスカート",						7,	5,	6,		0	);		//	パンク/ミニスカート
	ArmorList[24]	=	new	Array(	"ストライプ",								7,	7,	7,		0	);		//	ストライプ
	ArmorList[25]	=	new	Array(	"チョガ",									8,	6,	7,		0	);		//	チョガ
	ArmorList[26]	=	new	Array(	"チーパオ",									6,	8,	7,		0	);		//	チーパオ
	ArmorList[27]	=	new	Array(	"ホイ",										9,	6,	7,		0	);		//	ホイ
	ArmorList[28]	=	new	Array(	"テクノ",									10,	7,	7,		0	);		//	テクノ
	ArmorList[29]	=	new	Array(	"キルト",									12,	8,	7,		0	);		//	キルト
	ArmorList[30]	=	new	Array(	"ロイヤルガード",							12,	9,	5,		0	);		//	ロイヤルガード
	ArmorList[31]	=	new	Array(	"ウィボス",									13,	9,	7,		0	);		//	ウィボス
	ArmorList[32]	=	new	Array(	"エシーロ",									15,	10,	7,		0	);		//	エシーロ
	ArmorList[33]	=	new	Array(	"リフラン",									16,	11,	7,		0	);		//	リフラン
	ArmorList[34]	=	new	Array(	"アイウェス",								17,	12,	7,		0	);		//	アイウェス
	ArmorList[35]	=	new	Array(	"マシーヴ",									25,	15,	7,		0	);		//	マシーヴ
	ArmorList[36]	=	new	Array(	"ユニフォーム",								0,	0,	4,		0	);		//	ユニフォーム
	ArmorList[37]	=	new	Array(	"モールヒップホップ",						3,	6,	4,		1	);		//	モールヒップホップ
	ArmorList[38]	=	new	Array(	"モールケープ",								4,	6,	4,		1	);		//	モールケープ
	ArmorList[39]	=	new	Array(	"モールパンク/ミニスカート",				7,	7,	6,		1	);		//	モールパンク/ミニスカート
	ArmorList[40]	=	new	Array(	"モールチョガ",								8,	8,	7,		1	);		//	モールチョガ
	ArmorList[41]	=	new	Array(	"モールホイ",								9,	8,	7,		1	);		//	モールホイ
	ArmorList[42]	=	new	Array(	"モールテクノ",								10,	9,	7,		1	);		//	モールテクノ
	ArmorList[43]	=	new	Array(	"モールキルト",								12,	10,	7,		1	);		//	モールキルト
	ArmorList[44]	=	new	Array(	"モールウィボス",							13,	11,	7,		1	);		//	モールウィボス
	ArmorList[45]	=	new	Array(	"モールエシーロ",							15,	12,	7,		1	);		//	モールエシーロ
	ArmorList[46]	=	new	Array(	"モールリフラン",							16,	13,	7,		1	);		//	モールリフラン
	ArmorList[47]	=	new	Array(	"モールアイウェス",							17,	14,	7,		1	);		//	モールアイウェス
	ArmorList[48]	=	new	Array(	"モールマシーヴ",							25,	17,	7,		1	);		//	モールマシーヴ
	ArmorList[49]	=	new	Array(	"バロンアーマー",							23,	3,	7,		0	);		//	バロンアーマー
	ArmorList[50]	=	new	Array(	"バロンプレート",							29,	17,	10,		0	);		//	バロンプレート
	ArmorList[51]	=	new	Array(	"モールバロンプレート",						29,	19,	10,		1	);		//	モールバロンプレート
	ArmorList[52]	=	new	Array(	"ライトプリンス/ライトプリンセス",			25,	15,	7,		0	);		//	ライトプリンス/ライトプリンセス
	ArmorList[53]	=	new	Array(	"モールライトプリンス/ライトプリンセス",	25,	17,	7,		1	);		//	モールライトプリンス/ライトプリンセス
	ArmorList[54]	=	new	Array(	"ドラゴンメイル",							33,	18,	10,		0	);		//	ドラゴンメイル
	ArmorList[55]	=	new	Array(	"モールドラゴンメイル",						33,	20,	10,		1	);		//	モールドラゴンメイル
}
//------------------------------------------------------------------------------
//	関数名		：	盾リスト取得処理
//	機能説明	：	盾リストを取得する。
//	パラメータ	：	ShieldList	盾リスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetShieldList(ShieldList)
{
	//	盾リスト					名称					AC	DC	重さ
	ShieldList[0]	=	new	Array(	"なし",					0,	0,	0	);		//	なし
	ShieldList[1]	=	new	Array(	"ウッドシールド",		1,	0,	1	);		//	ウッドシールド
	ShieldList[2]	=	new	Array(	"ラウンドシールド",		2,	0,	2	);		//	ラウンドシールド
	ShieldList[3]	=	new	Array(	"カイトシールド",		3,	0,	3	);		//	カイトシールド
	ShieldList[4]	=	new	Array(	"リーフシールド",		4,	-1,	4	);		//	リーフシールド
	ShieldList[5]	=	new	Array(	"タワーシールド",		4,	-2,	4	);		//	タワーシールド
	ShieldList[6]	=	new	Array(	"ゴシックシールド",		5,	-2,	5	);		//	ゴシックシールド
	ShieldList[7]	=	new	Array(	"アイアンシールド",		4,	2,	3	);		//	アイアンシールド
	ShieldList[8]	=	new	Array(	"アイアンシールド改",	4,	4,	3	);		//	アイアンシールド改
	ShieldList[9]	=	new	Array(	"ホワイトシールド",		5,	2,	5	);		//	ホワイトシールド
	ShieldList[10]	=	new	Array(	"ホワイトシールド改",	6,	5,	5	);		//	ホワイトシールド改
	ShieldList[11]	=	new	Array(	"レッドシールド(軽)",	5,	4,	3	);		//	レッドシールド(軽)
	ShieldList[12]	=	new	Array(	"レッドシールド",		7,	4,	5	);		//	レッドシールド
	ShieldList[13]	=	new	Array(	"レッドシールド改",		8,	7,	5	);		//	レッドシールド改
	ShieldList[14]	=	new	Array(	"ドラゴンテイル",		8,	5,	5	);		//	ドラゴンテイル
	ShieldList[15]	=	new	Array(	"ドラゴンテイル改",		12,	10,	5	);		//	ドラゴンテイル改
	ShieldList[16]	=	new	Array(	"タイタンシールド",		14,	4,	5	);		//	タイタンシールド
	ShieldList[17]	=	new	Array(	"回避の盾",				2,	11,	5	);		//	回避の盾
	ShieldList[18]	=	new	Array(	"ドリームガーダー",		6,	2,	4	);		//	ドリームガーダー
}
//------------------------------------------------------------------------------
//	関数名		：	靴リスト取得処理
//	機能説明	：	靴リストを取得する。
//	パラメータ	：	ShoesList	靴リスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetShoesList(ShoesList)
{
	//	靴リスト					名称				AC	DC	重さ
	ShoesList[0]	=	new	Array(	"なし",				0,	0,	0	);		//	なし
	ShoesList[1]	=	new	Array(	"ビギナーシューズ",	2,	1,	1	);		//	ビギナーシューズ
	ShoesList[2]	=	new	Array(	"レザーブーツ",		2,	1,	1	);		//	レザーブーツ
	ShoesList[3]	=	new	Array(	"ロングブーツ",		2,	2,	1	);		//	ロングブーツ
	ShoesList[4]	=	new	Array(	"チェインブーツ",	3,	2,	2	);		//	チェインブーツ
	ShoesList[5]	=	new	Array(	"スチールブーツ",	7,	1,	3	);		//	スチールブーツ
	ShoesList[6]	=	new	Array(	"グリーブシューズ",	4,	5,	2	);		//	グリーブシューズ
	ShoesList[7]	=	new	Array(	"パワーブーツ",		6,	4,	3	);		//	パワーブーツ
	ShoesList[8]	=	new	Array(	"ウィングブーツ",	6,	3,	3	);		//	ウィングブーツ
	ShoesList[9]	=	new	Array(	"チェインシューズ",	2,	3,	4	);		//	チェインシューズ
	ShoesList[10]	=	new	Array(	"チタンシューズ",	3,	3,	4	);		//	チタンシューズ
	ShoesList[11]	=	new	Array(	"プレートシューズ",	3,	5,	4	);		//	プレートシューズ
	ShoesList[12]	=	new	Array(	"ライトシューズ",	4,	5,	6	);		//	ライトシューズ
	ShoesList[13]	=	new	Array(	"ミスリルシューズ",	4,	5,	6	);		//	ミスリルシューズ
	ShoesList[14]	=	new	Array(	"ヘビーシューズ",	4,	6,	6	);		//	ヘビーシューズ
	ShoesList[15]	=	new	Array(	"タルロスシューズ",	7,	2,	5	);		//	タルロスシューズ
	ShoesList[16]	=	new	Array(	"レイダンシューズ",	7,	3,	5	);		//	レイダンシューズ
	ShoesList[17]	=	new	Array(	"草履",				1,	1,	1	);		//	草履
	ShoesList[18]	=	new	Array(	"サッカー靴",		0,	0,	1	);		//	サッカー靴
	ShoesList[19]	=	new	Array(	"疾風草履",			3,	4,	2	);		//	疾風草履
	ShoesList[20]	=	new	Array(	"バロンシューズ",	5,	4,	5	);		//	バロンシューズ
}
//------------------------------------------------------------------------------
//	関数名		：	アクセリスト取得処理
//	機能説明	：	アクセリストを取得する。
//	パラメータ	：	AccessoryList	指輪１、指輪２、ネクレ
//	戻り値		：	なし
//	備考		：	リスト取得の際は指輪１、２、ネクレともに本関数を呼び出す。
//------------------------------------------------------------------------------
function GetAccessoryList(AccessoryList)
{
	//	アクセリスト				名称				WC	HC	AC	DC		耐火	氷	聖	援護	耐減火	氷	聖	援護
	AccessoryList[0] = new Array(	"なし",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	なし
	AccessoryList[1] = new Array(	"移動",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	移動
	AccessoryList[2] = new Array(	"攻撃",				2,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	攻撃
	AccessoryList[3] = new Array(	"防御",				0,	0,	2,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	防御
	AccessoryList[4] = new Array(	"炎保護",			0,	0,	0,	0,		3,		0,	0,	0,		0,		0,	0,	0	);	//	炎保護
	AccessoryList[5] = new Array(	"氷保護",			0,	0,	0,	0,		0,		3,	0,	0,		0,		0,	0,	0	);	//	氷保護
	AccessoryList[6] = new Array(	"炎",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	炎
	AccessoryList[7] = new Array(	"氷",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	氷
	AccessoryList[8] = new Array(	"幸運",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	幸運
	AccessoryList[9] = new Array(	"信念",				0,	0,	0,	0,		0,		0,	3,	0,		0,		0,	0,	0	);	//	信念
	AccessoryList[10] = new Array(	"手さばき",			0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	手さばき
	AccessoryList[11] = new Array(	"風",				0,	0,	0,	2,		0,		0,	0,	0,		0,		0,	0,	0	);	//	風
	AccessoryList[12] = new Array(	"霧",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	霧
	AccessoryList[13] = new Array(	"援護",				0,	0,	0,	0,		0,		0,	0,	3,		0,		0,	0,	0	);	//	援護
	AccessoryList[14] = new Array(	"警告",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	警告
	AccessoryList[15] = new Array(	"狂乱",				0,	4,	0,	-3,		0,		0,	0,	0,		0,		0,	0,	0	);	//	狂乱
	AccessoryList[16] = new Array(	"必殺",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	必殺
	AccessoryList[17] = new Array(	"破壊",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	破壊
	AccessoryList[18] = new Array(	"回復",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	回復
	AccessoryList[19] = new Array(	"魔法",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	魔法
	AccessoryList[20] = new Array(	"激情",				2,	4,	0,	-2,		0,		0,	0,	0,		0,		0,	0,	0	);	//	激情
	AccessoryList[21] = new Array(	"破砕",				0,	4,	0,	-2,		0,		0,	0,	0,		0,		0,	0,	0	);	//	破砕
	AccessoryList[22] = new Array(	"堅固",				0,	0,	2,	2,		0,		0,	0,	0,		0,		0,	0,	0	);	//	堅固
	AccessoryList[23] = new Array(	"護衛",				0,	0,	2,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	護衛
	AccessoryList[24] = new Array(	"ウェルリン(炎)",	2,	0,	0,	0,		3,		0,	0,	0,		0,		0,	0,	0	);	//	ウェルリン(炎)
	AccessoryList[25] = new Array(	"ウェルリン(氷)",	2,	0,	0,	0,		0,		3,	0,	0,		0,		0,	0,	0	);	//	ウェルリン(氷)
	AccessoryList[26] = new Array(	"カイル(炎)",		0,	0,	2,	0,		3,		0,	0,	0,		0,		0,	0,	0	);	//	カイル(炎)
	AccessoryList[27] = new Array(	"カイル(氷)",		0,	0,	2,	0,		0,		3,	0,	0,		0,		0,	0,	0	);	//	カイル(氷)
	AccessoryList[28] = new Array(	"魔法保護",			0,	0,	0,	0,		3,		3,	0,	3,		0,		0,	0,	0	);	//	魔法保護
	AccessoryList[29] = new Array(	"エチリン",			0,	0,	0,	0,		0,		0,	0,	0,		0,		-2,	0,	0	);	//	エチリン
	AccessoryList[30] = new Array(	"エブリン",			0,	0,	0,	0,		0,		0,	0,	0,		-2,		0,	0,	0	);	//	エブリン
	AccessoryList[31] = new Array(	"暗黒(炎)",			0,	0,	-60,-300,	-8,		-8,	-8,	-8,		-4,		0,	0,	0	);	//	暗黒(炎)
	AccessoryList[32] = new Array(	"暗黒(氷)",			0,	0,	-60,-300,	-8,		-8,	-8,	-8,		0,		-4,	0,	0	);	//	暗黒(氷)
	AccessoryList[33] = new Array(	"暗黒(魔)",			0,	0,	-60,-300,	-8,		-8,	-8,	-8,		0,		0,	0,	-4	);	//	暗黒(魔)
	AccessoryList[34] = new Array(	"暗黒(聖)",			0,	0,	-80,-500,	-8,		-8,	-8,	-8,		0,		0,	-3,	0	);	//	暗黒(聖)
	AccessoryList[35] = new Array(	"暗黒(撃)",			0,	10,	-80,-500,	-8,		-8,	-8,	-8,		0,		0,	0,	0	);	//	暗黒(撃)
	AccessoryList[36] = new Array(	"暗黒守護(炎)",		0,	0,	40,	230,	2,		2,	2,	2,		0,		0,	0,	0	);	//	暗黒守護(炎)
	AccessoryList[37] = new Array(	"暗黒守護(氷)",		0,	0,	40,	230,	2,		2,	2,	2,		0,		0,	0,	0	);	//	暗黒守護(氷)
	AccessoryList[38] = new Array(	"暗黒守護(魔)",		0,	0,	40,	230,	2,		2,	2,	2,		0,		0,	0,	0	);	//	暗黒守護(魔)
	AccessoryList[39] = new Array(	"暗黒守護(聖)",		0,	0,	65,	430,	2,		2,	2,	2,		0,		0,	0,	0	);	//	暗黒守護(聖)
	AccessoryList[40] = new Array(	"暗黒守護(撃)",		0,	0,	42,	430,	2,		2,	2,	2,		0,		0,	0,	0	);	//	暗黒守護(撃)
	AccessoryList[41] = new Array(	"突撃",				10,	1,	0,	-3,		0,		0,	0,	0,		0,		0,	0,	0	);	//	突撃
	AccessoryList[42] = new Array(	"富豪",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	富豪
	AccessoryList[43] = new Array(	"旋風",				-3,	2,	0,	11,		0,		0,	0,	0,		0,		0,	0,	0	);	//	旋風
	AccessoryList[44] = new Array(	"陽炎",				-3,	0,	6,	3,		0,		0,	0,	0,		0,		0,	0,	0	);	//	陽炎
	AccessoryList[45] = new Array(	"狂拳",				15,	-5,	-5,	-5,		0,		0,	0,	0,		0,		0,	0,	0	);	//	狂拳
	AccessoryList[46] = new Array(	"瞬殺",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	瞬殺
	AccessoryList[47] = new Array(	"鋼鉄",				-5,	0,	7,	7,		0,		0,	0,	0,		0,		0,	0,	0	);	//	鋼鉄
	AccessoryList[48] = new Array(	"用心棒",			0,	0,	5,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	用心棒
	AccessoryList[49] = new Array(	"闘神",				20,	0,	-6,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	闘神
	AccessoryList[50] = new Array(	"金剛",				-6,	0,	20,	0,		0,		0,	0,	0,		0,		0,	0,	0	);	//	金剛
	AccessoryList[51] = new Array(	"炎守護",			0,	0,	0,	0,		7,		0,	0,	0,		0,		0,	0,	0	);	//	炎守護
	AccessoryList[52] = new Array(	"氷守護",			0,	0,	0,	0,		0,		7,	0,	0,		0,		0,	0,	0	);	//	氷守護
	AccessoryList[53] = new Array(	"援護守護",			0,	0,	0,	0,		0,		0,	0,	7,		0,		0,	0,	0	);	//	援護守護
	AccessoryList[54] = new Array(	"信仰",				0,	0,	0,	0,		0,		0,	7,	0,		0,		0,	0,	0	);	//	信念
	AccessoryList[55] = new Array(	"韋駄天",			-3,	0,	-3,	15,		0,		0,	0,	0,		0,		0,	0,	0	);	//	韋駄天
	AccessoryList[56] = new Array(	"風林火山",			5,	5,	5,	5,		-2,		-2,	-2,	-2,		0,		0,	0,	0	);	//	風林火山
	AccessoryList[57] = new Array(	"防護",				5,	0,	0,	0,		3,		3,	0,	0,		0,		0,	0,	0	);	//	防護
	AccessoryList[58] = new Array(	"庇護",				5,	0,	0,	0,		0,		0,	3,	3,		0,		0,	0,	0	);	//	庇護
	AccessoryList[59] = new Array(	"大魔法",			0,	0,	0,	0,		1,		1,	1,	1,		-2,		-2,	-2,	-2	);	//	大魔法
	AccessoryList[60] = new Array(	"抗魔",				0,	0,	0,	0,		3,		3,	3,	3,		0,		0,	0,	0	);	//	抗魔
	AccessoryList[61] = new Array(	"白金",				-3,	-3,	10,	10,		0,		0,	0,	0,		0,		0,	0,	0	);	//	白金
	AccessoryList[62] = new Array(	"白銀",				10,	10,	-3,	-3,		0,		0,	0,	0,		0,		0,	0,	0	);	//	白銀
	AccessoryList[63] = new Array(	"炎侵攻",			0,	0,	0,	0,		0,		0,	0,	0,		-5,		0,	0,	0	);	//	炎侵攻
	AccessoryList[64] = new Array(	"氷侵攻",			0,	0,	0,	0,		0,		0,	0,	0,		0,		-5,	0,	0	);	//	氷侵攻
	AccessoryList[65] = new Array(	"援護侵攻",			0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	0	-5	);	//	援護侵攻
	AccessoryList[66] = new Array(	"邪信",				0,	0,	0,	0,		0,		0,	0,	0,		0,		0,	-5,	0	);	//	邪信
	//	アクセリスト				名称				WC	HC	AC	DC		耐火	氷	聖	援護	耐減火	氷	聖	援護
}
//------------------------------------------------------------------------------
//	関数名		：	武器改造処理
//	機能説明	：	武器種別、武器改造値を元に武器リストの値を変更する。
//	パラメータ	：	Weapon		武器種別
//					WeaponP		武器改造値
//					WeaponList	武器リスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function AdjustWeaponList(Weapon, WeaponP, WeaponList)
{
	var Wc = 0;
	var Hc = 0;

	if( WeaponP == 1 ){
		Wc = 1;
	}
	if( WeaponP == 2 ){
		Wc = 2;
		Hc = 1;
	}
	if( WeaponP == 3 ){
		Wc = 3;
		Hc = 1;
	}
	if( WeaponP == 4 ){
		Wc = 4;
		Hc = 2;
	}
	if( WeaponP == 5 ){
		Wc = 5;
		Hc = 3;
	}
	if( WeaponP == 6 ){
		Wc = 6;
		Hc = 4;
	}
	if( WeaponP == 7 ){
		Wc = 7;
		Hc = 5;
	}
	if( WeaponP == 8 ){
		Wc = 8;
		Hc = 6;
	}
	if( WeaponP == 9 ){
		Wc = 9;
		Hc = 7;
	}
	if( WeaponP == 10 ){
		Wc = 10;
		Hc = 8;
	}
	if( WeaponP == 11 ){
		Wc = 11;
		Hc = 9;
	}
	if( WeaponP == 12 ){
		Wc = 12;
		Hc = 10;
	}
	if( WeaponP == 13 ){
		Wc = 13;
		Hc = 11;
	}
	if( WeaponP == 14 ){
		Wc = 14;
		Hc = 12;
	}
	if( WeaponP == 15 ){
		Wc = 15;
		Hc = 13;
	}

	// 精霊剣の場合、HC補正を0とする
	if (WeaponList[Weapon][5] == "精霊剣"){
		Hc = 0;
	}

	WeaponList[Weapon][1] += Wc;
	WeaponList[Weapon][2] += Hc;

}
//------------------------------------------------------------------------------
//	関数名		：	鎧/服改造処理
//	機能説明	：	鎧/服種別、鎧/服改造値を元に鎧/服リストの値を変更する。
//	パラメータ	：	Armor		鎧/服種別
//					ArmorP		鎧/服改造値
//					ArmorList	鎧/服リスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function AdjustArmorList(Armor, ArmorP, ArmorList)
{
	if( ArmorP == 1 ){
		ArmorList[Armor][1] += 1;
	}
	if( ArmorP == 2 ){
		ArmorList[Armor][1] += 2;
		ArmorList[Armor][2] += 1;
	}
	if( ArmorP == 3 ){
		ArmorList[Armor][1] += 3;
		ArmorList[Armor][2] += 1;
	}
	if( ArmorP == 4 ){
		ArmorList[Armor][1] += 4;
		ArmorList[Armor][2] += 2;
	}
	if( ArmorP == 5 ){
		ArmorList[Armor][1] += 5;
		ArmorList[Armor][2] += 3;
	}
	if( ArmorP == 6 ){
		ArmorList[Armor][1] += 6;
		ArmorList[Armor][2] += 4;
	}
	if( ArmorP == 7 ){
		ArmorList[Armor][1] += 7;
		ArmorList[Armor][2] += 5;
	}
	if( ArmorP == 8 ){
		ArmorList[Armor][1] += 8;
		ArmorList[Armor][2] += 6;
	}
	if( ArmorP == 9 ){
		ArmorList[Armor][1] += 9;
		ArmorList[Armor][2] += 7;
	}
	if( ArmorP == 10 ){
		ArmorList[Armor][1] += 10;
		ArmorList[Armor][2] += 8;
	}
	if( ArmorP == 11 ){
		ArmorList[Armor][1] += 11;
		ArmorList[Armor][2] += 9;
	}
	if( ArmorP == 12 ){
		ArmorList[Armor][1] += 12;
		ArmorList[Armor][2] += 10;
	}
	if( ArmorP == 13 ){
		ArmorList[Armor][1] += 13;
		ArmorList[Armor][2] += 11;
	}
	if( ArmorP == 14 ){
		ArmorList[Armor][1] += 14;
		ArmorList[Armor][2] += 12;
	}
	if( ArmorP == 15 ){
		ArmorList[Armor][1] += 15;
		ArmorList[Armor][2] += 13;
	}
}
//------------------------------------------------------------------------------
//	関数名		：	鎧/服改造処理(マシーヴ)
//	機能説明	：	鎧/服種別、鎧/服改造値を元にマシーヴの値を変更する。
//	パラメータ	：	Armor		鎧/服種別
//					ArmorP		鎧/服改造値
//					ArmorList	鎧/服リスト
//	戻り値		：	なし
//	備考		：	バロンプレートについても本処理を行う
//------------------------------------------------------------------------------
function AdjustArmorListMassive(Armor, ArmorP, ArmorList)
{
	if( ArmorP == 1 ){
		ArmorList[Armor][1] += 2;
		ArmorList[Armor][2] += 1;
	}
	if( ArmorP == 2 ){
		ArmorList[Armor][1] += 4;
		ArmorList[Armor][2] += 2;
	}
	if( ArmorP == 3 ){
		ArmorList[Armor][1] += 6;
		ArmorList[Armor][2] += 3;
	}
	if( ArmorP == 4 ){
		ArmorList[Armor][1] += 8;
		ArmorList[Armor][2] += 4;
	}
	if( ArmorP == 5 ){
		ArmorList[Armor][1] += 10;
		ArmorList[Armor][2] += 6;
	}
	if( ArmorP == 6 ){
		ArmorList[Armor][1] += 12;
		ArmorList[Armor][2] += 8;
	}
	if( ArmorP == 7 ){
		ArmorList[Armor][1] += 14;
		ArmorList[Armor][2] += 10;
	}
	if( ArmorP == 8 ){
		ArmorList[Armor][1] += 16;
		ArmorList[Armor][2] += 12;
	}
	if( ArmorP == 9 ){
		ArmorList[Armor][1] += 18;
		ArmorList[Armor][2] += 14;
	}
	if( ArmorP == 10 ){
		ArmorList[Armor][1] += 20;
		ArmorList[Armor][2] += 16;
	}
	if( ArmorP == 11 ){
		ArmorList[Armor][1] += 22;
		ArmorList[Armor][2] += 18;
	}
	if( ArmorP == 12 ){
		ArmorList[Armor][1] += 24;
		ArmorList[Armor][2] += 20;
	}
	if( ArmorP == 13 ){
		ArmorList[Armor][1] += 26;
		ArmorList[Armor][2] += 22;
	}
	if( ArmorP == 14 ){
		ArmorList[Armor][1] += 28;
		ArmorList[Armor][2] += 24;
	}
	if( ArmorP == 15 ){
		ArmorList[Armor][1] += 30;
		ArmorList[Armor][2] += 26;
	}
}
//------------------------------------------------------------------------------
//	関数名		：	靴改造処理
//	機能説明	：	靴種別、靴改造値を元に靴リストの値を変更する。
//	パラメータ	：	Shoes		靴種別
//					ShoesP		靴改造値
//					ShoesList	靴リスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function AdjustShoesList(Shoes, ShoesP, ShoesList)
{
	if( ShoesP >= 1 && ShoesP <= 9 ){
		ShoesList[Shoes][2] += ShoesP;
	}
}
//------------------------------------------------------------------------------
//	関数名		：	暗殺ボーナス付加処理
//	機能説明	：	暗殺ボーナスありの場合、該当武器のWCを2増加する。
//	パラメータ	：	Weapon		武器種別
//					WeaponList	武器リスト
//					Assasin		暗殺スキル
//	戻り値		：	1			ボーナスあり
//					0			ボーナスなし
//	備考		：	なし
//------------------------------------------------------------------------------
function AdjustAssasinBonus(Weapon, WeaponList, Armor, ArmorList, Shoes, ShoesList, Assasin)
{
	//	鎧セット装備判定フラグ
	//	0:鎧セット装備でない
	//	1:鎧セット装備である
	var SetEquipment = 0;

	//	暗殺武器でない場合、処理しない
	if( WeaponList[Weapon][5] != "暗殺" ){
		return 0;
	}

	//	暗殺スキルなしの場合、処理しない
	if( Assasin == 0 ){
		return 0;
	}

	//	プレートアーマー以上レイダンアーマー以下
	//	またはバロンアーマーの場合
	if( (Armor >= 7 && Armor <= 13) || Armor == 49 ){

		//	プレートセット
		if( Armor == 7 && Shoes == 11 ){
			SetEquipment = 1;
		}

		//	ライトセット
		if( Armor == 9 && Shoes == 12 ){
			SetEquipment = 1;
		}

		//	ミスリルセット
		if( Armor == 10 && Shoes == 13 ){
			SetEquipment = 1;
		}

		//	ヘビーセット
		if( Armor == 11 && Shoes == 14 ){
			SetEquipment = 1;
		}

		//	タルロスセット
		if( Armor == 12 && Shoes == 15 ){
			SetEquipment = 1;
		}

		//	レイダンセット
		if( Armor == 13 && Shoes == 16 ){
			SetEquipment = 1;
		}

		//	バロンセット
		if( Armor == 49 && Shoes == 20 ){
			SetEquipment = 1;
		}

		//	鎧セット装備でない場合、処理しない
		if( SetEquipment == 0 ){
			return 0;
		}
	}

	//	暗殺ボーナス付加
	WeaponList[Weapon][1] += 2;

	return 1;
}
//------------------------------------------------------------------------------
//	関数名		：	セット装備ボーナス補正処理
//	機能説明	：	鎧/服種別、靴種別を元にして、セット装備であるかの判定を行い、
//					セット装備であれば靴へボーナスを付加する。
//	パラメータ	：	Armor		鎧/服種別
//					Shoes		靴種別
//					ShoesList	靴リスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function AdjustSetBonus(Armor, Shoes, ShoesList)
{
	//	チェインセット
	if( Armor == 5 && Shoes == 9 ){
		ShoesList[Shoes][2] += 2;
		ShoesList[Shoes][3] -= 4;
	}
	//	チタンセット
	if( Armor == 6 && Shoes == 10 ){
		ShoesList[Shoes][2] += 4;
		ShoesList[Shoes][3] -= 4;
	}
	//	プレートセット
	if( Armor == 7 && Shoes == 11 ){
		ShoesList[Shoes][2] += 6;
		ShoesList[Shoes][3] -= 4;
	}
	//	ライトセット
	if( Armor == 9 && Shoes == 12 ){
		ShoesList[Shoes][2] += 6;
		ShoesList[Shoes][3] -= 5;
	}
	//	ミスリルセット
	if( Armor == 10 && Shoes == 13 ){
		ShoesList[Shoes][2] += 6;
		ShoesList[Shoes][3] -= 5;
	}
	//	ヘビーセット
	if( Armor == 11 && Shoes == 14 ){
		ShoesList[Shoes][2] += 7;
		ShoesList[Shoes][3] -= 5;
	}
	//	タルロスセット
	if( Armor == 12 && Shoes == 15 ){
		ShoesList[Shoes][2] += 7;
		ShoesList[Shoes][3] -= 4;
	}
	//	レイダンセット
	if( Armor == 13 && Shoes == 16 ){
		ShoesList[Shoes][2] += 9;
		ShoesList[Shoes][3] -= 4;
	}
	//	バロンセット
	if( Armor == 49 && Shoes == 20 ){
		ShoesList[Shoes][1] += 1;
		ShoesList[Shoes][2] += 9;
		ShoesList[Shoes][3] -= 4;
	}
}

//------------------------------------------------------------------------------
//	関数名		：	セット装備ボーナス補正処理：アクセサリー
//	機能説明	：	指輪1/指輪2/ネックレス種別を元にして、セット装備であるかの
//					判定を行い、セット装備であればボーナスを付加する。
//	パラメータ	：	Ring1			指輪１種別
//					Ring2			指輪２種別
//					Necklace		ネクレ種別
//					Ring1List		指輪１リスト
//					Ring2List		指輪２リスト
//					NecklaceList	ネクレリスト
//	戻り値		：	セットアクセ番号
//	備考		：	なし
//------------------------------------------------------------------------------
function AdjustSetBonusAccessory(Ring1, Ring2, Necklace, Ring1List, Ring2List, NecklaceList)
{
	// 闘神セット
	if (Necklace == 49) {
		if (Ring1 == 49) {
			// AC0設定
			Ring1List[Ring1][3] = 0;
			NecklaceList[Necklace][3] = 0;
			return Necklace;
		} else if (Ring2 == 49) {
			// AC0設定
			Ring2List[Ring2][3] = 0;
			NecklaceList[Necklace][3] = 0;
			return Necklace;
		}
	}
	// 金剛セット
	if (Necklace == 50) {
		if (Ring1 == 50) {
			// WC0設定
			Ring1List[Ring1][1] = 0;
			NecklaceList[Necklace][1] = 0;
			return Necklace;
		} else if (Ring2 == 50) {
			// WC0設定
			Ring2List[Ring2][1] = 0;
			NecklaceList[Necklace][1] = 0;
			return Necklace;
		}
	}
	// 韋駄天セット
	if (Necklace == 55) {
		if (Ring1 == 55) {
			// WC・AC0設定
			Ring1List[Ring1][1] = 0;
			Ring1List[Ring1][3] = 0;
			NecklaceList[Necklace][1] = 0;
			NecklaceList[Necklace][3] = 0;
			return Necklace;
		} else if (Ring2 == 55) {
			// WC・AC0設定
			Ring2List[Ring2][1] = 0;
			Ring2List[Ring2][3] = 0;
			NecklaceList[Necklace][1] = 0;
			NecklaceList[Necklace][3] = 0;
			return Necklace;
		}
	}
	// 風林火山セット
	if (Necklace == 56) {
		// セットの場合、火、氷、聖、援護耐性＋１となるが、
		// ここでは便宜上、ネックレスの耐性を＋１とする
		if (Ring1 == 56) {
			// 耐性0設定
			Ring1List[Ring1][5] = 0;
			Ring1List[Ring1][6] = 0;
			Ring1List[Ring1][7] = 0;
			Ring1List[Ring1][8] = 0;
			NecklaceList[Necklace][5] = 1;
			NecklaceList[Necklace][6] = 1;
			NecklaceList[Necklace][7] = 1;
			NecklaceList[Necklace][8] = 1;
			return Necklace;
		} else if (Ring2 == 56) {
			// 耐性0設定
			Ring2List[Ring2][5] = 0;
			Ring2List[Ring2][6] = 0;
			Ring2List[Ring2][7] = 0;
			Ring2List[Ring2][8] = 0;
			NecklaceList[Necklace][5] = 1;
			NecklaceList[Necklace][6] = 1;
			NecklaceList[Necklace][7] = 1;
			NecklaceList[Necklace][8] = 1;
			return Necklace;
		}
	}
	// 白金セット
	if (Necklace == 61) {
		if (Ring1 == 61) {
			// WC0、HC0設定
			Ring1List[Ring1][1] = 0;
			Ring1List[Ring1][2] = 0;
			NecklaceList[Necklace][1] = 0;
			NecklaceList[Necklace][2] = 0;
			return Necklace;
		} else if (Ring2 == 61) {
			// WC0、HC0設定
			Ring2List[Ring2][1] = 0;
			Ring2List[Ring2][2] = 0;
			NecklaceList[Necklace][1] = 0;
			NecklaceList[Necklace][2] = 0;
			return Necklace;
		}
	}
	// 白銀セット
	if (Necklace == 62) {
		if (Ring1 == 62) {
			// AC0、DC0設定
			Ring1List[Ring1][3] = 0;
			Ring1List[Ring1][4] = 0;
			NecklaceList[Necklace][3] = 0;
			NecklaceList[Necklace][4] = 0;
			return Necklace;
		} else if (Ring2 == 62) {
			// AC0、DC0設定
			Ring2List[Ring2][3] = 0;
			Ring2List[Ring2][4] = 0;
			NecklaceList[Necklace][3] = 0;
			NecklaceList[Necklace][4] = 0;
			return Necklace;
		}
	}
	return -1;
}
//------------------------------------------------------------------------------
//	関数名		：	物乞いセット選択処理
//	機能説明	：	全装備をなしとする。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function SelectNakedSet()
{
	document.chara.weapon.value = 0;		//	武器
	document.chara.armor.value = 0;			//	鎧/服
	document.chara.armor.value = 0;			//	鎧/服
	document.chara.shoes.value = 0;			//	靴
	document.chara.shield.value = 0;		//	盾
	document.chara.ring1.value = 0;			//	指輪１
	document.chara.ring2.value = 0;			//	指輪２
	document.chara.necklace.value = 0;		//	ネクレ
}
//------------------------------------------------------------------------------
//	関数名		：	レイダンセット選択処理
//	機能説明	：	レイダン鎧、レイダン靴を選択する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	すでに選択している場合はなしとする。
//------------------------------------------------------------------------------
function SelectRaydanSet()
{
	var Armor = document.chara.armor;		//	鎧/服
	var Shoes = document.chara.shoes;		//	靴

	if( Armor.value == 13 && Shoes.value == 16 ){
		Armor.value = 0;
		Shoes.value = 0;
	}
	else{
		Armor.value = 13;					//	レイダンアーマー
		Shoes.value = 16;					//	レイダンシューズ
	}
}
//------------------------------------------------------------------------------
//	関数名		：	バロンセット選択処理
//	機能説明	：	バロン鎧、バロン靴を選択する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	すでに選択している場合はなしとする。
//------------------------------------------------------------------------------
function SelectBaronSet()
{
	var Armor = document.chara.armor;		//	鎧/服
	var Shoes = document.chara.shoes;		//	靴

	if( Armor.value == 49 && Shoes.value == 20 ){
		Armor.value = 0;
		Shoes.value = 0;
	}
	else{
		Armor.value = 49;					//	バロンアーマー
		Shoes.value = 20;					//	バロンシューズ
	}
}

//------------------------------------------------------------------------------
// 関数名       ：ライトプリンス・羽靴選択処理
// 機能説明     ：ライトプリンス/ライトプリンセス・ウィングブーツを選択する。
// パラメータ   ：なし
// 戻り値       ：なし
// 備考         ：すでに選択している場合はなしとする。
//------------------------------------------------------------------------------
function SelectLightPrince()
{
	var Armor = document.chara.armor;		// 鎧/服
	var Shoes = document.chara.shoes;		// 靴

	if (Armor.value == 52 && Shoes.value == 8) {
		Armor.value = 0;
		Shoes.value = 0;
	}
	else {
		Armor.value = 52;					// ライトプリンス/ライトプリンセス
		Shoes.value = 8;					// ウィングブーツ
	}
}

//------------------------------------------------------------------------------
//	関数名		：	堅固セット＋護衛指選択処理
//	機能説明	：	堅固指、堅固首、護衛指を選択する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	すでに選択している場合はなしとする。
//------------------------------------------------------------------------------
function SelectSolidSet()
{
	var Ring1 = document.chara.ring1;		//	指輪１
	var Ring2 = document.chara.ring2;		//	指輪２
	var Necklace = document.chara.necklace;	//	ネクレ

	if( Ring1.value == 22 && Necklace.value == 22 && Ring2.value == 23 ){
		Ring1.value = 0;
		Ring2.value = 0;
		Necklace.value = 0;
	}
	else{
		Ring1.value = 22;					//	堅固の指輪
		Ring2.value = 23;					//	護衛の指輪
		Necklace.value = 22;				//	堅固のネックレス
	}
}
//------------------------------------------------------------------------------
//	関数名		：	鋼鉄セット＋陽炎指選択処理
//	機能説明	：	鋼鉄指、鋼鉄首、陽炎指を選択する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	すでに選択している場合はなしとする。
//------------------------------------------------------------------------------
function SelectSteelSet()
{
	var Ring1 = document.chara.ring1;		//	指輪１
	var Ring2 = document.chara.ring2;		//	指輪２
	var Necklace = document.chara.necklace;	//	ネクレ

	if( Ring1.value == 47 && Necklace.value == 47 && Ring2.value == 44 ){
		Ring1.value = 0;
		Ring2.value = 0;
		Necklace.value = 0;
	}
	else{
		Ring1.value = 47;					//	鋼鉄の指輪
		Ring2.value = 44;					//	陽炎の指輪
		Necklace.value = 47;				//	鋼鉄のネックレス
	}
}
//------------------------------------------------------------------------------
//	関数名		：	狂拳セット＋突撃指選択処理
//	機能説明	：	狂拳指、狂拳首、突撃指を選択する。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	すでに選択している場合はなしとする。
//------------------------------------------------------------------------------
function SelectOnslaughtSet()
{
	var Ring1 = document.chara.ring1;		//	指輪１
	var Ring2 = document.chara.ring2;		//	指輪２
	var Necklace = document.chara.necklace;	//	ネクレ

	if( Ring1.value == 45 && Necklace.value == 45 && Ring2.value == 41 ){
		Ring1.value = 0;
		Ring2.value = 0;
		Necklace.value = 0;
	}
	else{
		Ring1.value = 45;					//	狂拳の指輪
		Ring2.value = 41;					//	突撃の指輪
		Necklace.value = 45;				//	狂拳のネックレス
	}
}

//------------------------------------------------------------------------------
// 関数名       ：金剛セット＋鋼鉄指選択処理
// 機能説明     ：金剛指、金剛首、鋼鉄指を選択する。
// パラメータ   ：なし
// 戻り値       ：なし
// 備考         ：すでに選択している場合はなしとする。
//------------------------------------------------------------------------------
function SelectDiamondSet()
{
	var Ring1 = document.chara.ring1;		// 指輪１
	var Ring2 = document.chara.ring2;		// 指輪２
	var Necklace = document.chara.necklace;	// ネクレ

	if (Ring1.value == 50 && Necklace.value == 50 && Ring2.value == 47) {
		Ring1.value = 0;
		Ring2.value = 0;
		Necklace.value = 0;
	}
	else {
		Ring1.value = 50;					// 金剛の指輪
		Ring2.value = 47;					// 鋼鉄の指輪
		Necklace.value = 50;				// 金剛のネックレス
	}
}

//------------------------------------------------------------------------------
// 関数名       ：闘神セット＋狂拳指選択処理
// 機能説明     ：闘神指、闘神首、狂拳指を選択する。
// パラメータ   ：なし
// 戻り値       ：なし
// 備考         ：すでに選択している場合はなしとする。
//------------------------------------------------------------------------------
function SelectFightingGodSet()
{
	var Ring1 = document.chara.ring1;		//	指輪１
	var Ring2 = document.chara.ring2;		//	指輪２
	var Necklace = document.chara.necklace;	//	ネクレ

	if (Ring1.value == 49 && Necklace.value == 49 && Ring2.value == 45) {
		Ring1.value = 0;
		Ring2.value = 0;
		Necklace.value = 0;
	}
	else {
		Ring1.value = 49;					//	闘神の指輪
		Ring2.value = 45;					//	狂拳の指輪
		Necklace.value = 49;				//	闘神のネックレス
	}
}

//------------------------------------------------------------------------------
// 関数名       ：韋駄天セット＋旋風指選択処理
// 機能説明     ：韋駄天指、韋駄天首、旋風指を選択する。
// パラメータ   ：なし
// 戻り値       ：なし
// 備考         ：すでに選択している場合はなしとする。
//------------------------------------------------------------------------------
function SelectSkandaSet()
{
	var Ring1 = document.chara.ring1;		//	指輪１
	var Ring2 = document.chara.ring2;		//	指輪２
	var Necklace = document.chara.necklace;	//	ネクレ

	if (Ring1.value == 55 && Necklace.value == 55 && Ring2.value == 43) {
		Ring1.value = 0;
		Ring2.value = 0;
		Necklace.value = 0;
	}
	else {
		Ring1.value = 55;					//	韋駄天の指輪
		Ring2.value = 43;					//	旋風の指輪
		Necklace.value = 55;				//	韋駄天のネックレス
	}
}

//------------------------------------------------------------------------------
//	関数名		：	スキル取得処理
//	機能説明	：	引数で指定した職業のフォームスキル値を取得する。
//	パラメータ	：	Job			主職業
//					SideJob		副業
//					SkillList	スキルリスト
//	戻り値		：	-1			職業該当なし
//	備考		：	スキルは装備シミュレーターに関連する項目のみを対象とする。
//------------------------------------------------------------------------------
function GetSkillValue( Job, SideJob, SkillList )
{
	var Pair = Job + SideJob;	//	主職業＋副業
	var Skill =					//	職業別スキル位置保持テーブル
								//	剣,斧,メイス,素手,回避,暗殺,槍,火,氷,援護,聖,呪文,錬金,応急
		[
			["戦盗",	1,	2,	3,	4,	5,	6,	0,	0,	0,	0,	0,	0,	0,	0],		//	戦盗
			["戦錬",	1,	2,	3,	4,	5,	0,	0,	0,	0,	0,	0,	0,	6,	7],		//	戦錬
			["戦聖",	1,	2,	3,	4,	5,	0,	0,	0,	0,	6,	7,	0,	0,	0],		//	戦聖
			["戦裁",	1,	2,	3,	4,	5,	0,	0,	0,	0,	0,	0,	0,	0,	0],		//	戦裁
			["戦鍛",	1,	2,	3,	4,	5,	0,	0,	0,	0,	0,	0,	0,	0,	0],		//	戦鍛
			["戦鳥",	1,	2,	3,	4,	5,	0,	6,	0,	0,	0,	0,	7,	0,	0],		//	戦鳥
			["剣戦",	1,	2,	3,	4,	5,	6,	7,	0,	0,	0,	0,	0,	0,	0],		//	剣戦
			["剣盗",	0,	1,	2,	3,	4,	5,	6,	0,	0,	0,	0,	0,	0,	0],		//	剣盗
			["剣裁",	1,	2,	3,	4,	5,	6,	7,	0,	0,	0,	0,	0,	0,	0],		//	剣裁
			["剣鍛",	0,	1,	2,	3,	4,	6,	7,	0,	0,	0,	0,	0,	0,	0],		//	剣鍛
			["剣鳥",	0,	1,	2,	3,	4,	5,	6,	0,	0,	0,	0,	7,	0,	0],		//	剣鳥
			["剣錬",	1,	2,	3,	4,	5,	6,	7,	0,	0,	0,	0,	0,	8,	9],		//	剣錬
			["盗戦",	1,	2,	3,	4,	5,	6,	0,	0,	0,	0,	0,	0,	0,	0],		//	盗戦
			["盗錬",	0,	1,	0,	0,	2,	3,	0,	0,	0,	0,	0,	0,	8,	9],		//	盗錬
			["盗聖",	0,	1,	2,	0,	3,	4,	0,	0,	0,	9,	10,	0,	0,	0],		//	盗聖
			["盗裁",	1,	2,	0,	0,	3,	4,	0,	0,	0,	0,	0,	0,	0,	0],		//	盗裁
			["盗鍛",	0,	1,	2,	0,	3,	4,	0,	0,	0,	0,	0,	0,	0,	0],		//	盗鍛
			["盗鳥",	0,	1,	0,	0,	2,	3,	4,	0,	0,	0,	0,	9,	0,	0],		//	盗鳥
			["魔戦",	1,	2,	3,	4,	5,	0,	0,	6,	7,	8,	0,	0,	0,	0],		//	魔戦
			["魔盗",	0,	1,	0,	2,	3,	4,	0,	9,	10,	11,	0,	0,	0,	0],		//	魔盗
			["魔錬",	0,	1,	0,	2,	0,	0,	0,	3,	4,	5,	0,	0,	6,	7],		//	魔錬
			["魔聖",	0,	0,	1,	2,	0,	0,	0,	3,	4,	5,	6,	0,	0,	0],		//	魔聖
			["魔裁",	1,	0,	0,	2,	0,	0,	0,	3,	4,	5,	0,	0,	0,	0],		//	魔裁
			["魔鍛",	0,	0,	1,	2,	0,	0,	0,	3,	4,	5,	0,	0,	0,	0],		//	魔鍛
			["魔鳥",	0,	0,	0,	1,	0,	0,	2,	3,	4,	5,	0,	6,	0,	0],		//	魔鳥
			["聖戦",	1,	2,	3,	4,	5,	0,	0,	0,	0,	6,	7,	0,	0,	0],		//	聖戦
			["聖盗",	0,	1,	2,	0,	3,	4,	0,	0,	0,	9,	10,	0,	0,	0],		//	聖盗
			["聖錬",	0,	1,	2,	0,	0,	0,	0,	0,	0,	3,	4,	0,	5,	6],		//	聖錬
			["聖裁",	1,	0,	2,	0,	0,	0,	0,	0,	0,	3,	4,	0,	0,	0],		//	聖裁
			["聖鍛",	0,	0,	1,	0,	0,	0,	0,	0,	0,	2,	3,	0,	0,	0],		//	聖鍛
			["聖鳥",	0,	0,	1,	0,	0,	0,	2,	0,	0,	3,	4,	5,	0,	0],		//	聖鳥
			[0,			0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0]		//	EOR
		];

	//	レコード終端までループ
	for( var i = 0; Skill[i][0] != 0; ++i ){
		//	職業が一致する場合
		if( Pair == Skill[i][0] ){

			//	スキル分ループ
			for( var j = 1; j <= 14; ++j ){
				if( Skill[i][j] != 0 ){
					SkillList[j-1] = Skill[i][j];
				}
			}
			break;
		}

		//	該当なし(EOR)
		if( Skill[i][0] == 0 ){
			return -1;
		}
	}

	//	スキル取得式設定
	for( var i = 0; i <= 13; ++i ){
		if( SkillList[i] != 0 ){
			SkillList[i] = eval( "document.chara.skill" + SkillList[i] + ".value - 0" );
		}
	}
}
//------------------------------------------------------------------------------
//	関数名		：	ステータス内訳設定処理
//	機能説明	：	WC、HC、AC、DCの内訳を出力する
//	パラメータ	：	
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function SetStatusDetail( Lv, StrDiv5, DexDiv5, AgrDiv5, VitDiv5, MenDiv5, IntDiv5, Wc, Hc, Ac, Dc, Weight, SkillList, WeaponList, Weapon, WeaponP, WeaponKind, WeaponKindIndex, ArmorList, Armor, ArmorP, ShieldList, Shield, ShoesList, Shoes, ShoesP, Ring1List, Ring1, Ring2List, Ring2, NecklaceList, Necklace, AssasinBonusFlag, SpiritName, SpiritValue, DopingList, SetAccessoryNo)
{
	//	変数宣言
	var Msg = "";
	var WeaponName = "";
	var ArmorName = "";
	var ShoesName = "";
	var Ring1Name = "";
	var Ring2Name = "";
	var NecklaceName = "";
	var LvString = GetLvString(Lv);
	var i;

	//	武器名称設定
	if( WeaponP == 0 ){
		WeaponName = WeaponList[Weapon][0];
	}
	else{
		WeaponName = WeaponList[Weapon][0] + "＋" + WeaponP;
	}

	//	鎧/服名称設定
	if( ArmorP == 0 ){
		ArmorName = ArmorList[Armor][0];
	}
	else{
		ArmorName = ArmorList[Armor][0] + "＋" + ArmorP;
	}

	//	靴名称設定
	if( ShoesP == 0 ){
		ShoesName = ShoesList[Shoes][0];
	}
	else{
		ShoesName = ShoesList[Shoes][0] + "＋" + ShoesP;
	}

	//	指輪1名称設定
	Ring1Name = Ring1List[Ring1][0] + "指";

	//	指輪2名称設定
	Ring2Name = Ring2List[Ring2][0] + "指";

	//	指輪2名称設定
	NecklaceName = NecklaceList[Necklace][0] + "首";

	//-------------------------------------------------------------------
	//	WC設定
	//-------------------------------------------------------------------
	Msg += "WC:" + Wc + "\n";

	//	武器
	if( WeaponList[Weapon][1] != 0 ){
		//	暗殺ボーナス適用時、適用前WC出力するためボーナスなしとする
		if( AssasinBonusFlag == 1 ){
			WeaponList[Weapon][1] -= 2;
		}

		Msg += " (" + WeaponList[Weapon][1] + ")" + WeaponName + "\n";
	}

	//	スキル
	if( SkillList[WeaponKindIndex] != 0 ){
		Msg += " (" + SkillList[WeaponKindIndex] + ")" + WeaponList[Weapon][5] + "スキル" + SkillList[WeaponKindIndex] + "\n";
	}
	else if( WeaponKind == "精霊剣" ){
		Msg += " (" + SpiritValue + ")" + WeaponList[Weapon][5] + "スキル" + SpiritValue + "\n";
	}

	//	暗殺ボーナス
	if( AssasinBonusFlag == 1 ){
		Msg += " (2)暗殺ボーナスあり\n";
	}

	//	指輪1
	if( Ring1List[Ring1][1] != 0 ){
		Msg += " (" + Ring1List[Ring1][1] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][1] != 0 ){
		Msg += " (" + Ring2List[Ring2][1] + ")" + Ring2Name + "\n";
	}

	//	ネックレス
	if( NecklaceList[Necklace][1] != 0 ){
		Msg += " (" + NecklaceList[Necklace][1] + ")" + NecklaceName + "\n";
	}

	//	STR
	Msg += " (" + StrDiv5 + ")STR" + document.chara.str.value + "\n";

	//	MEN
	Msg += " (" + MenDiv5 + ")MEN" + document.chara.men.value + "\n";

	// ドーピング
	for (i = 0; i < DopingList.length; ++i) {
		if (DopingList[i][1] != 0) {
			Msg += " (" + DopingList[i][1] + ")" + DopingList[i][0] + "\n";
		}
	}

	//-------------------------------------------------------------------
	//	AC設定
	//-------------------------------------------------------------------
	Msg += "AC:" + Ac + "\n";

	//	服/鎧
	if( ArmorList[Armor][1] != 0 ){
		Msg += " (" + ArmorList[Armor][1] + ")" + ArmorName + "\n";
	}

	//	靴
	if( ShoesList[Shoes][1] != 0 ){
		Msg += " (" + ShoesList[Shoes][1] + ")" + ShoesName + "\n";
	}

	//	盾
	if( ShieldList[Shield][1] != 0 ){
		Msg += " (" + ShieldList[Shield][1] + ")" + ShieldList[Shield][0] + "\n";
	}

	//	指輪1
	if( Ring1List[Ring1][3] != 0 ){
		Msg += " (" + Ring1List[Ring1][3] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][3] != 0 ){
		Msg += " (" + Ring2List[Ring2][3] + ")" + Ring2Name + "\n";
	}

	//	ネックレス
	if( NecklaceList[Necklace][3] != 0 ){
		Msg += " (" + NecklaceList[Necklace][3] + ")" + NecklaceName + "\n";
	}

	//	VIT
	Msg += " (" + VitDiv5 + ")VIT" + document.chara.vit.value + "\n";

	// ドーピング
	for (i = 0; i < DopingList.length; ++i) {
		if (DopingList[i][2] != 0) {
			Msg += " (" + DopingList[i][2] + ")" + DopingList[i][0] + "\n";
		}
	}

	//-------------------------------------------------------------------
	//	HC設定
	//-------------------------------------------------------------------
	Msg += "HC:" + Hc + "\n";

	//	Lv
	//	回避なし職の場合
	if( SkillList[4] == 0 ){
		Msg += " (" + Math.floor( Lv * 0.75 ) + ")" + LvString + "\n";
	}
	else{
		Msg += " (" + Lv + ")" + LvString + "\n";
	}

	//	武器
	if( WeaponList[Weapon][2] != 0 ){
		Msg += " (" + WeaponList[Weapon][2] + ")" + WeaponName + "\n";
	}

	//	スキル
	if( SkillList[WeaponKindIndex] != 0 ){
		Msg += " (" + SkillList[WeaponKindIndex] + ")" + WeaponList[Weapon][5] + "スキル" + SkillList[WeaponKindIndex] + "\n";
	}
	else if( WeaponKind == "精霊剣" ){
		Msg += " (" + SpiritValue + ")" + WeaponList[Weapon][5] + "スキル" + SpiritValue + "\n";
	}

	//	指輪1
	if( Ring1List[Ring1][2] != 0 ){
		Msg += " (" + Ring1List[Ring1][2] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][2] != 0 ){
		Msg += " (" + Ring2List[Ring2][2] + ")" + Ring2Name + "\n";
	}

	//	ネックレス
	if( NecklaceList[Necklace][2] != 0 ){
		Msg += " (" + NecklaceList[Necklace][2] + ")" + NecklaceName + "\n";
	}

	//	DEX
	Msg += " (" + DexDiv5 + ")DEX" + document.chara.dex.value + "\n";

	// ドーピング
	for (i = 0; i < DopingList.length; ++i) {
		if (DopingList[i][3] != 0) {
			Msg += " (" + DopingList[i][3] + ")" + DopingList[i][0] + "\n";
		}
	}

	//-------------------------------------------------------------------
	//	DC設定
	//-------------------------------------------------------------------
	Msg += "DC:" + Dc + "\n";

	//	Lv
	//	回避なし職の場合
	if( SkillList[4] == 0 ){
		Msg += " (" + Math.floor( Lv * 0.75 ) + ")" + LvString + "\n";
	}
	else{
		Msg += " (" + Lv + ")" + LvString + "\n";
	}

	//	服/鎧
	if( ArmorList[Armor][2] != 0 ){
		Msg += " (" + ArmorList[Armor][2] + ")" + ArmorName + "\n";
	}

	//	靴
	if( ShoesList[Shoes][2] != 0 ){
		Msg += " (" + ShoesList[Shoes][2] + ")" + ShoesName + "\n";
	}

	//	盾
	if( ShieldList[Shield][2] != 0 ){
		Msg += " (" + ShieldList[Shield][2] + ")" + ShieldList[Shield][0] + "\n";
	}

	//	指輪1
	if( Ring1List[Ring1][4] != 0 ){
		Msg += " (" + Ring1List[Ring1][4] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][4] != 0 ){
		Msg += " (" + Ring2List[Ring2][4] + ")" + Ring2Name + "\n";
	}

	//	ネックレス
	if( NecklaceList[Necklace][4] != 0 ){
		Msg += " (" + NecklaceList[Necklace][4] + ")" + NecklaceName + "\n";
	}

	//	スキル
	if( SkillList[4] != 0 ){
		Msg += " (" + SkillList[4] + ")回避スキル" +  SkillList[4] + "\n";
	}

	//	AGR
	Msg += " (" + AgrDiv5 + ")AGR" + document.chara.agr.value + "\n";

	// ドーピング
	for (i = 0; i < DopingList.length; ++i) {
		if (DopingList[i][4] != 0) {
			Msg += " (" + DopingList[i][4] + ")" + DopingList[i][0] + "\n";
		}
	}

	//-------------------------------------------------------------------
	//	重さ
	//-------------------------------------------------------------------
	Msg += "重さ:" + Weight + "\n";

	//	武器
	if( WeaponList[Weapon][4] != 0 ){
		Msg += " (" + WeaponList[Weapon][4] + ")" + WeaponName + "\n";
	}

	//	服/鎧
	if( ArmorList[Armor][3] != 0 ){
		Msg += " (" + ArmorList[Armor][3] + ")" + ArmorName + "\n";
	}

	//	靴
	if( ShoesList[Shoes][3] != 0 ){
		Msg += " (" + ShoesList[Shoes][3] + ")" + ShoesName + "\n";
	}

	//	盾
	if( ShieldList[Shield][3] != 0 ){
		Msg += " (" + ShieldList[Shield][3] + ")" + ShieldList[Shield][0] + "\n";
	}

	//-------------------------------------------------------------------
	//	耐性
	//-------------------------------------------------------------------
	//	火耐性
	Msg += "火耐性:" + (document.chara.taiseif.value - 0) + "\n";

	//	DEX
	Msg += " (" + (DexDiv5 - 5) + ")DEX" + document.chara.dex.value + "\n";

	//	指輪1
	if( Ring1List[Ring1][5] != 0 ){
		Msg += " (" + Ring1List[Ring1][5] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][5] != 0 ){
		Msg += " (" + Ring2List[Ring2][5] + ")" + Ring2Name + "\n";
	}

	//	ネックレス
	if( NecklaceList[Necklace][5] != 0 ){
		// 風林火山セット
		if (SetAccessoryNo == 56) {
			Msg += " (" + NecklaceList[Necklace][5] + ")" + NecklaceList[Necklace][0] + "セット" + "\n";
		}
		else {
			Msg += " (" + NecklaceList[Necklace][5] + ")" + NecklaceName + "\n";
		}
	}

	//	氷耐性
	Msg += "氷耐性:" + (document.chara.taiseii.value - 0) + "\n";

	//	AGR
	Msg += " (" + (AgrDiv5 - 5) + ")AGR" + document.chara.agr.value + "\n";

	//	指輪1
	if( Ring1List[Ring1][6] != 0 ){
		Msg += " (" + Ring1List[Ring1][6] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][6] != 0 ){
		Msg += " (" + Ring2List[Ring2][6] + ")" + Ring2Name + "\n";
	}

	//	ネックレス
	if( NecklaceList[Necklace][6] != 0 ){
		// 風林火山セット
		if (SetAccessoryNo == 56) {
			Msg += " (" + NecklaceList[Necklace][6] + ")" + NecklaceList[Necklace][0] + "セット" + "\n";
		}
		else {
			Msg += " (" + NecklaceList[Necklace][6] + ")" + NecklaceName + "\n";
		}
	}

	//	聖耐性
	Msg += "聖耐性:" + (document.chara.taiseih.value - 0) + "\n";

	//	INT
	Msg += " (" + IntDiv5 + ")INT" + document.chara.int.value + "\n";

	//	指輪1
	if( Ring1List[Ring1][7] != 0 ){
		Msg += " (" + Ring1List[Ring1][7] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][7] != 0 ){
		Msg += " (" + Ring2List[Ring2][7] + ")" + Ring2Name + "\n";
	}

	//	ネックレス
	if( NecklaceList[Necklace][7] != 0 ){
		// 風林火山セット
		if (SetAccessoryNo == 56) {
			Msg += " (" + NecklaceList[Necklace][7] + ")" + NecklaceList[Necklace][0] + "セット" + "\n";
		}
		else {
			Msg += " (" + NecklaceList[Necklace][7] + ")" + NecklaceName + "\n";
		}
	}

	//	援護耐性
	Msg += "援護耐性:" + (document.chara.taiseim.value - 0) + "\n";

	//	MEN
	Msg += " (" + (MenDiv5 - 5) + ")MEN" + document.chara.men.value + "\n";

	//	指輪1
	if( Ring1List[Ring1][8] != 0 ){
		Msg += " (" + Ring1List[Ring1][8] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][8] != 0 ){
		Msg += " (" + Ring2List[Ring2][8] + ")" + Ring2Name + "\n";
	}

	//	ネックレス
	if( NecklaceList[Necklace][8] != 0 ){
		// 風林火山セット
		if (SetAccessoryNo == 56) {
			Msg += " (" + NecklaceList[Necklace][8] + ")" + NecklaceList[Necklace][0] + "セット" + "\n";
		}
		else {
			Msg += " (" + NecklaceList[Necklace][8] + ")" + NecklaceName + "\n";
		}
	}

	//	病気耐性
	Msg += "病気耐性:" + (document.chara.taiseis.value - 0) + "\n";

	//	VIT
	Msg += " (" + (VitDiv5 - 5) + ")VIT" + document.chara.vit.value + "\n";

	//	指輪1
	if( Ring1List[Ring1][9] != 0 ){
		Msg += " (" + Ring1List[Ring1][9] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][9] != 0 ){
		Msg += " (" + Ring2List[Ring2][9] + ")" + Ring2Name + "\n";
	}

	//	ネックレス
	if( NecklaceList[Necklace][9] != 0 ){
		Msg += " (" + NecklaceList[Necklace][9] + ")" + NecklaceName + "\n";
	}

	//	毒耐性
	Msg += "毒耐性:" + (document.chara.taiseip.value - 0) + "\n";

	//	STR
	Msg += " (" + (StrDiv5 - 5) + ")STR" + document.chara.str.value + "\n";

	//	指輪1
	if( Ring1List[Ring1][10] != 0 ){
		Msg += " (" + Ring1List[Ring1][10] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][10] != 0 ){
		Msg += " (" + Ring2List[Ring2][10] + ")" + Ring2Name + "\n";
	}

	//	ネックレス
	if( NecklaceList[Necklace][10] != 0 ){
		Msg += " (" + NecklaceList[Necklace][10] + ")" + NecklaceName + "\n";
	}

	//-------------------------------------------------------------------
	//	耐性減
	//-------------------------------------------------------------------
	//	火耐性減
	Msg += "火耐性減:" + (document.chara.taiseigenf.value - 0) + "\n";

	//	武器
	if( WeaponList[Weapon][7] != 0 ){
		Msg += " (" + WeaponList[Weapon][7] + ")" + WeaponName + "\n";
	}

	//	指輪1
	if( Ring1List[Ring1][9] != 0 ){
		Msg += " (" + Ring1List[Ring1][9] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][9] != 0 ){
		Msg += " (" + Ring2List[Ring2][9] + ")" + Ring2Name + "\n";
	}

	//	ネックレス
	if( NecklaceList[Necklace][9] != 0 ){
		Msg += " (" + NecklaceList[Necklace][9] + ")" + NecklaceName + "\n";
	}

	//	氷耐性減
	Msg += "氷耐性減:" + (document.chara.taiseigeni.value - 0) + "\n";

	//	武器
	if( WeaponList[Weapon][8] != 0 ){
		Msg += " (" + WeaponList[Weapon][7] + ")" + WeaponName + "\n";
	}

	//	指輪1
	if( Ring1List[Ring1][10] != 0 ){
		Msg += " (" + Ring1List[Ring1][6] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][10] != 0 ){
		Msg += " (" + Ring2List[Ring2][6] + ")" + Ring2Name + "\n";
	}

	//	ネックレス
	if( NecklaceList[Necklace][10] != 0 ){
		Msg += " (" + NecklaceList[Necklace][10] + ")" + NecklaceName + "\n";
	}

	//	聖耐性減
	Msg += "聖耐性減:" + (document.chara.taiseigenh.value - 0) + "\n";

	//	指輪1
	if( Ring1List[Ring1][11] != 0 ){
		Msg += " (" + Ring1List[Ring1][11] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][11] != 0 ){
		Msg += " (" + Ring2List[Ring2][11] + ")" + Ring2Name + "\n";
	}

	//	援護耐性減
	Msg += "援護耐性減:" + (document.chara.taiseigenm.value - 0) + "\n";

	//	指輪1
	if( Ring1List[Ring1][12] != 0 ){
		Msg += " (" + Ring1List[Ring1][12] + ")" + Ring1Name + "\n";
	}

	//	指輪2
	if( Ring2List[Ring2][12] != 0 ){
		Msg += " (" + Ring2List[Ring2][12] + ")" + Ring2Name + "\n";
	}

	//	内訳フォーム設定
	document.chara.detail.value = Msg;
}
//------------------------------------------------------------------------------
//	関数名		：	レベル文字列取得処理
//	機能説明	：	AGを考慮したレベル文字列を返す
//	パラメータ	：	Lv		レベル
//	戻り値		：	String	レベル文字列
//	備考		：	なし
//------------------------------------------------------------------------------
function GetLvString(Lv)
{
	var String = "";
	var LvWork = GetLv(Lv);

	if( Lv < 100 ){
		String = "Lv" + LvWork;
	}
	else{
		String = "AG" + LvWork;
	}

	return String;
}
//------------------------------------------------------------------------------
//	関数名		：	レベル取得処理
//	機能説明	：	AGを考慮したレベルを返す
//	パラメータ	：	Lv		変換前レベル
//	戻り値		：	変換後レベル(Lv99の場合は99を、Lv100の場合は1を返す）
//	備考		：	なし
//------------------------------------------------------------------------------
function GetLv(Lv)
{
	if( Lv < 100 ){
		return Lv;
	}
	else{
		return (Lv - 99);
	}
}
//------------------------------------------------------------------------------
//	関数名		：	暗黒守護指輪判定処理
//	機能説明	：	暗黒守護指輪の適用条件を判定し、条件に当てはまらない場合は、
//					効果なしとするため0を設定する。
//	パラメータ	：	Ring1		指輪1種別
//					Ring2		指輪2種別
//					Ring1List	指輪1リスト
//					Ring2List	指輪2リスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function AdjustDarkProtectionRing(Ring1, Ring2, Ring1List, Ring2List)
{
	//	指輪１が暗黒守護指輪の場合
	if( Ring1 >= 36 && Ring1 <= 40 ){

		//	指輪２が暗黒アクセでない場合
		if( Ring2 < 31 || Ring2 > 35 ){
			//	指輪１のAC、DCを0とする
			Ring1List[Ring1][3] = 0;
			Ring1List[Ring1][4] = 0;
			Ring1List[Ring1][5] = 0;
			Ring1List[Ring1][6] = 0;
			Ring1List[Ring1][7] = 0;
			Ring1List[Ring1][8] = 0;
			return;
		}

		//	指輪１の暗黒守護指輪と指輪２の暗黒アクセが一致しない場合
		if( Ring1 != Ring2 + 5 ){
			//	指輪１のAC、DCを0とする
			Ring1List[Ring1][3] = 0;
			Ring1List[Ring1][4] = 0;
			Ring1List[Ring1][5] = 0;
			Ring1List[Ring1][6] = 0;
			Ring1List[Ring1][7] = 0;
			Ring1List[Ring1][8] = 0;
			return;
		}
	}

	//	指輪２が暗黒守護指輪の場合
	if( Ring2 >= 36 && Ring2 <= 40 ){

		//	指輪１が暗黒アクセでない場合
		if( Ring1 < 31 || Ring1 > 35 ){
			//	指輪２のAC、DCを0とする
			Ring2List[Ring2][3] = 0;
			Ring2List[Ring2][4] = 0;
			Ring2List[Ring2][5] = 0;
			Ring2List[Ring2][6] = 0;
			Ring2List[Ring2][7] = 0;
			Ring2List[Ring2][8] = 0;
			return;
		}

		//	指輪２の暗黒守護指輪と指輪１の暗黒アクセが一致しない場合
		if( Ring2 != Ring1 + 5 ){
			//	指輪２のAC、DCを0とする
			Ring2List[Ring2][3] = 0;
			Ring2List[Ring2][4] = 0;
			Ring2List[Ring2][5] = 0;
			Ring2List[Ring2][6] = 0;
			Ring2List[Ring2][7] = 0;
			Ring2List[Ring2][8] = 0;
			return;
		}
	}
}
//------------------------------------------------------------------------------
//	関数名		：	耐性設定処理
//	機能説明	：	パラメータおよび装備アイテムから耐性の設定を行う
//	パラメータ	：	StrDiv5			STR / 5
//					VitDiv5			VIT / 5
//					DexDiv5			DEX / 5
//					AgrDiv5			AGR / 5
//					IntDiv5			INT / 5
//					MenDiv5			MEN / 5
//					Ring1			指輪1種別
//					Ring1List		指輪1リスト
//					Ring2			指輪2種別
//					Ring2List		指輪2リスト
//					Necklace		ネクレ種別
//					NecklaceList	ネクレリスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function SetTaisei(StrDiv5, VitDiv5, DexDiv5, AgrDiv5, IntDiv5, MenDiv5, Ring1, Ring1List, Ring2, Ring2List, Necklace, NecklaceList)
{
	var Taisei = [-5, -5, 0, -5, -5, -5];		//	耐性配列(火、氷、聖、援護、病気、毒)

	//	耐性火
	Taisei[0] += DexDiv5;						//	DEX / 5
	Taisei[0] += Ring1List[Ring1][5];			//	指輪１
	Taisei[0] += Ring2List[Ring2][5];			//	指輪２
	Taisei[0] += NecklaceList[Necklace][5];		//	ネクレ

	//	耐性氷
	Taisei[1] += AgrDiv5;						//	AGR / 5
	Taisei[1] += Ring1List[Ring1][6];			//	指輪１
	Taisei[1] += Ring2List[Ring2][6];			//	指輪２
	Taisei[1] += NecklaceList[Necklace][6];		//	ネクレ

	//	耐性聖
	Taisei[2] += IntDiv5;						//	INT / 5
	Taisei[2] += Ring1List[Ring1][7];			//	指輪１
	Taisei[2] += Ring2List[Ring2][7];			//	指輪２
	Taisei[2] += NecklaceList[Necklace][7];		//	ネクレ

	//	耐性援護
	Taisei[3] += MenDiv5;						//	MEN / 5
	Taisei[3] += Ring1List[Ring1][8];			//	指輪１
	Taisei[3] += Ring2List[Ring2][8];			//	指輪２
	Taisei[3] += NecklaceList[Necklace][8];		//	ネクレ

	//	耐性病気
	Taisei[4] += VitDiv5;						//	VIT / 5

	//	耐性毒
	Taisei[5] += StrDiv5;						//	STR / 5

	document.chara.taiseif.value = Taisei[0];
	document.chara.taiseii.value = Taisei[1];
	document.chara.taiseih.value = Taisei[2];
	document.chara.taiseim.value = Taisei[3];
	document.chara.taiseis.value = Taisei[4];
	document.chara.taiseip.value = Taisei[5];

	return;
}
//------------------------------------------------------------------------------
//	関数名		：	耐性減設定処理
//	機能説明	：	装備アイテムから耐性減の設定を行う
//	パラメータ	：	Weapon			武器種別
//					WeaponList		武器リスト
//					Ring1			指輪1種別
//					Ring1List		指輪1リスト
//					Ring2			指輪2種別
//					Ring2List		指輪2リスト
//					Necklace		ネクレ種別
//					NecklaceList	ネクレリスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function SetTaiseiGen(Weapon, WeaponList, Ring1, Ring1List, Ring2, Ring2List, Necklace, NecklaceList)
{
	var TaiseiGen = [0, 0, 0, 0];					//	耐性減配列(火、氷、聖、援護)

	//	耐性減火
	TaiseiGen[0] += WeaponList[Weapon][7];			//	武器
	TaiseiGen[0] += Ring1List[Ring1][9];			//	指輪１
	TaiseiGen[0] += Ring2List[Ring2][9];			//	指輪２
	TaiseiGen[0] += NecklaceList[Necklace][9];		//	ネクレ

	//	耐性減氷
	TaiseiGen[1] += WeaponList[Weapon][8];			//	武器
	TaiseiGen[1] += Ring1List[Ring1][10];			//	指輪１
	TaiseiGen[1] += Ring2List[Ring2][10];			//	指輪２
	TaiseiGen[1] += NecklaceList[Necklace][10];		//	ネクレ

	//	耐性減聖
	TaiseiGen[2] += Ring1List[Ring1][11];			//	指輪１
	TaiseiGen[2] += Ring2List[Ring2][11];			//	指輪２
	TaiseiGen[2] += NecklaceList[Necklace][11];		//	ネクレ

	//	耐性減援護
	TaiseiGen[3] += Ring1List[Ring1][12];			//	指輪１
	TaiseiGen[3] += Ring2List[Ring2][12];			//	指輪２
	TaiseiGen[3] += NecklaceList[Necklace][12];		//	ネクレ

	//	耐性減フォーム設定
	document.chara.taiseigenf.value = TaiseiGen[0];	//	火
	document.chara.taiseigeni.value = TaiseiGen[1];	//	氷
	document.chara.taiseigenh.value = TaiseiGen[2];	//	聖
	document.chara.taiseigenm.value = TaiseiGen[3];	//	援護

	return;
}
//------------------------------------------------------------------------------
//	関数名		：	一体化鎧/服判定処理
//	機能説明	：	一体化鎧/服の判定を行う
//	パラメータ	：	Armor	鎧種別
//	戻り値		：	2		一体化でないが、一体化装備を適用(ライトプリンス)
//					1		一体化である
//					0		一体化でない
//	備考		：	なし
//------------------------------------------------------------------------------
function GetUnitArmor(Armor)
{
	// 鎧/服種別がマシーヴ、またはモールマシーヴ、またはバロンプレート、またはモールバロンプレート
	// またはドラゴンメイル、またはモールドラゴンメイルの場合
	if (Armor == 35 || Armor == 48 || Armor == 50 || Armor == 51 || Armor == 54 || Armor == 55) {
		return 1;
	}

	// 鎧/服種別がライトプリンス/ライトプリンセス、またはモールライトプリンス/ライトプリンセスの場合
	if (Armor == 52 || Armor == 53) {
		return 2;
	}

	return 0;
}

//------------------------------------------------------------------------------
//	関数名		：	ドーピング設定処理
//	機能説明	：	引数1へドーピング結果を、引数2へドーピングリストを設定する
//	パラメータ	：	DopingParameter	ドーピングパラメータ
//					SetDopingList	設定ドーピングリスト
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function SetDopingValue(DopingParameter, SetDopingList)
{
	var DopingCount = 0;
	var Doping = document.chara.doping;
	var DopingList = [
		["力の薬",		0,	3,	0,	0],		// 力の薬
		["マジブレ",	1,	0,	0,	0],		// マジブレ
		["ブレス",		2,	0,	2,	2],		// ブレス
		["グロース",	4,	0,	0,	0],		// グロース
		["歌30勇気",	4,	0,	9,	5]		// 歌30勇気
	];

	// テーブル分ループ
	for (var i = 0; i < Doping.length; ++i) {
		// チェックされている場合
		if (Doping[i].checked == true) {
			// ドーピング値を加算
			DopingParameter[0] += DopingList[i][1];
			DopingParameter[1] += DopingList[i][2];
			DopingParameter[2] += DopingList[i][3];
			DopingParameter[3] += DopingList[i][4];
			// ドーピング対象の配列を設定
			SetDopingList[DopingCount++] = DopingList[i];
		}
	}
}
