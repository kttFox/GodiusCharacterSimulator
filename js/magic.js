//------------------------------------------------------------------------------
//	魔法定義
//	機能説明	：	魔法１つ分の定義（発動Lv／安定Lv／基本消費MP）と、
//					発動率・消費MPの計算をクラスとして保持する。
//					系統（火／氷／援護／聖）ごとに MagicSystem でまとめ、
//					MAGIC_SYSTEMS から参照する。
//	備考		：	発動Lv／安定LvはINT15時の値。
//					魔法を追加する場合は MAGIC_SYSTEMS に１行追加し、
//					index.html に対応する入力項目（<系統キー>per<連番> /
//					<系統キー>mp<連番>）を追加すること。
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//	クラス名	：	魔法
//	機能説明	：	魔法１つ分の定義を保持し、発動率と消費ＭＰを算出する。
//------------------------------------------------------------------------------
class Magic
{
	//	パラメータ	：	Name	魔法名
	//				：	RiseLv	発動レベル（ＩＮＴ15時）
	//				：	StabLv	安定レベル（ＩＮＴ15時）
	//				：	MpCost	基本消費ＭＰ
	constructor( Name, RiseLv, StabLv, MpCost )
	{
		this.Name = Name;
		this.RiseLv = RiseLv;
		this.StabLv = StabLv;
		this.MpCost = MpCost;
	}

	//	発動率取得処理
	//	パラメータ	：	Ctx		計算コンテキスト
	//							Lv			レベル
	//							Int			ＩＮＴ
	//							Skill		該当系統のスキル値
	//	戻り値		：	発動率（小数１桁の文字列）
	GetPercent( Ctx )
	{
		//	ＩＮＴボーナスを加味した発動Lv／安定Lv
		var _rise = this.RiseLv + 3 - Math.floor( Ctx.Int / 5 );
		var _stab = this.StabLv + 3 - Math.floor( Ctx.Int / 5 );

		var _per = ( Ctx.Lv - ( _rise - 1 ) ) / ( _stab - ( _rise - 1 ) ) * 100;

		return AdjustPercent( _per ).toFixed( 1 );
	}

	//	消費ＭＰ取得処理
	//	パラメータ	：	Lv				レベル
	//				：	EquipmentRate	装備による消費ＭＰ減少率（0～1）
	//	戻り値		：	消費ＭＰ
	GetMpCost( Lv, EquipmentRate )
	{
		//	Lv減少ＭＰ
		var _lvDiscount = Math.floor( this.MpCost * ( Lv / 3 ) / 100 );
		//	装備減少ＭＰ
		var _equipmentDiscount = Math.floor( this.MpCost * EquipmentRate );

		return this.MpCost - _lvDiscount - _equipmentDiscount;
	}
}

//------------------------------------------------------------------------------
//	クラス名	：	聖リリース魔法
//	機能説明	：	発動率のみ専用計算式を用いる魔法。
//	備考		：	Godius community 質問掲示板No.1444 リリース(魔法)の発動LVについて
//					http://gc.e-hobby.net/bbs/help/bbs.cgi?mode=view&Code=1444&R=1
//------------------------------------------------------------------------------
class ReleaseMagic extends Magic
{
	//	発動率取得処理（オーバーライド）
	GetPercent( Ctx )
	{
		//	ＩＮＴ / 5 切り捨て
		var _int = Math.floor( Ctx.Int / 5 );
		//	数値化（後段で加算するため文字列連結を防ぐ）
		var _skill = Number( Ctx.Skill );

		var _per = Ctx.Lv * 2.5 + ( _skill + _int ) * 10 - 360;

		return AdjustPercent( _per ).toFixed( 1 );
	}
}

//------------------------------------------------------------------------------
//	クラス名	：	魔法系統
//	機能説明	：	火／氷／援護／聖それぞれの魔法一覧を保持する。
//------------------------------------------------------------------------------
class MagicSystem
{
	//	パラメータ	：	Key			系統キー（入力項目名の接頭辞）
	//				：	SectionId	セクション要素のID
	//				：	SkillIndex	スキルリスト上の添字
	//				：	MagicList	魔法の配列
	constructor( Key, SectionId, SkillIndex, MagicList )
	{
		this.Key = Key;
		this.SectionId = SectionId;
		this.SkillIndex = SkillIndex;
		this.MagicList = MagicList;
	}

	//	入力項目名取得処理
	//	パラメータ	：	Kind	項目種別（"per"：発動率、"mp"：消費ＭＰ）
	//				：	Index	魔法の添字（０開始）
	//	戻り値		：	入力項目名
	GetFieldName( Kind, Index )
	{
		return this.Key + Kind + ( "0" + ( Index + 1 ) ).slice( -2 );
	}

	//	発動率一覧取得処理
	//	パラメータ	：	Ctx		計算コンテキスト（Magic#GetPercent 参照）
	//	戻り値		：	発動率の配列
	GetPercentList( Ctx )
	{
		return this.MagicList.map( function( Item ) {
			return Item.GetPercent( Ctx );
		} );
	}

	//	消費ＭＰ一覧取得処理
	//	パラメータ	：	Lv				レベル
	//				：	EquipmentRate	装備による消費ＭＰ減少率（0～1）
	//	戻り値		：	消費ＭＰの配列
	GetMpCostList( Lv, EquipmentRate )
	{
		return this.MagicList.map( function( Item ) {
			return Item.GetMpCost( Lv, EquipmentRate );
		} );
	}
}

//	魔法系統定義テーブル
var MAGIC_SYSTEMS = [
	new MagicSystem( "fire", "extra_fire_sec", 7, [
		//						名称					発動Lv	安定Lv	消費MP
		new Magic( "ファイアミサイル",					 1,		11,		10 ),
		new Magic( "ファイアブレード",					 4,		14,		15 ),
		new Magic( "ファイアソード",					 5,		17,		18 ),
		new Magic( "ファイアボール",					10,		23,		30 ),
		new Magic( "ファイアシールド",					11,		25,		24 ),
		new Magic( "ファイアショック",					24,		33,		20 ),
		new Magic( "ファイアストライク",				32,		44,		25 ),
		new Magic( "ファイアストーム",					39,		47,		30 )
	] ),
	new MagicSystem( "ice", "extra_ice_sec", 8, [
		new Magic( "アイスミサイル",					 1,		11,		10 ),
		new Magic( "アイスブレード",					 5,		15,		15 ),
		new Magic( "アイスソード",						 6,		18,		18 ),
		new Magic( "アイスボール",						 7,		26,		30 ),
		new Magic( "アイスシールド",					22,		31,		24 ),
		new Magic( "アイスウェーブ",					27,		37,		23 ),
		new Magic( "アイスストライク",					33,		45,		25 )
	] ),
	new MagicSystem( "magical", "extra_magical_sec", 9, [
		new Magic( "マジカルブレード",					 5,		14,		18 ),
		new Magic( "ホールド",							17,		25,		26 ),
		new Magic( "マジカルグロース",					22,		31,		15 ),
		new Magic( "マジカルシールド",					30,		40,		28 ),
		new Magic( "ウィークネス",						37,		47,		12 ),
		new Magic( "アシッドクラウド",					47,		57,		40 ),
		new Magic( "バインド",							68,		77,		30 )
	] ),
	new MagicSystem( "holy", "extra_holy_sec", 10, [
		new Magic( "キュア",							 1,		 9,		10 ),
		new Magic( "キュアポイズン",					10,		19,		10 ),
		new Magic( "ブレス",							14,		25,		12 ),
		new Magic( "ホーリーミサイル",					 1,		15,		 6 ),
		new Magic( "ホーリーブレード",					17,		26,		14 ),
		new Magic( "カース",							23,		31,		20 ),
		new Magic( "キュアシック",						27,		36,		15 ),
		new Magic( "ホーリーボール",					39,		47,		25 ),
		new Magic( "リザレクト",						58,		67,		40 ),
		new ReleaseMagic( "リリース",					56,		92,		50 )
	] )
];
