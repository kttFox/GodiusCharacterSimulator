//------------------------------------------------------------------------------
//	関数名		：	おまけ情報取得処理
//	機能説明	：	おまけ情報の取得を一括して行う。
//	パラメータ	：	Lv			レベル
//					Job			主職業
//					SideJob		副業
//					Hp			HP
//					Mp			MP
//					Sp			SP
//					Str			STR
//					Int			INT
//					Dex			DEX
//					Agr			AGR
//					Vit			VIT
//					Men			MEN
//					Accessory	回復アクセ（0点～3点）
//					Kaihuku		回復の歌影響フラグ（1：回復影響あり、0：回復影響なし）
//					Fuji		不治の歌影響フラグ（1：不治影響あり、0：不治影響なし）
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetExtraInformation( Lv, Job, SideJob, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men, Accessory, Kaihuku, Fuji )
{
	//	変数宣言
	var SkillList = [			//	スキルリスト
			0,					//	[0]剣
			0,					//	[1]斧
			0,					//	[2]メイス
			0,					//	[3]素手
			0,					//	[4]回避
			0,					//	[5]暗殺
			0,					//	[6]槍
			0,					//	[7]火
			0,					//	[8]氷
			0,					//	[9]援護
			0,					//	[10]聖
			0,					//	[11]歌
			0,					//	[12]錬金
			0,					//	[13]応急
			0					//	[14]EOR
		];

	//	スキル取得
	GetSkillValue( Job, SideJob, SkillList );


	//	火スキルあり、または氷スキルあり、または援護スキルあり、または聖スキルありの場合
	if( SkillList[7] != 0 || SkillList[8] != 0 || SkillList[9] != 0 || SkillList[10] != 0 ){
		//	消費ＭＰ設定テーブル
		var MagicMpTable = [
				[0,0,0,0,0,0,0],			//	[0]火
				[0,0,0,0,0,0,0],			//	[1]氷
				[0,0,0,0,0,0,0],			//	[2]援護
				[0,0,0,0,0,0,0,0,0,0]		//	[3]聖
			];

		//	魔法発動率設定テーブル
		var MagicPerTable = [
				[0,0,0,0,0,0,0],			//	[0]火
				[0,0,0,0,0,0,0],			//	[1]氷
				[0,0,0,0,0,0,0],			//	[2]援護
				[0,0,0,0,0,0,0,0,0,0]		//	[3]聖
			];

		//	減少ＭＰ取得処理
		GetExtraMpCost( Lv, MagicMpTable );
		
		//	魔法発動率取得処理
		GetExtraMagicPercent( Lv, Int, SkillList, MagicPerTable );
	}

	//	火スキルありの場合
	if( SkillList[7] != 0 ){
		//	セクション表示
		document.getElementById("extra_fire_sec").style.display = "block";
		//	火炎魔法項目設定
		document.chara.firemp01.value = MagicMpTable[0][0];
		document.chara.firemp02.value = MagicMpTable[0][1];
		document.chara.firemp03.value = MagicMpTable[0][2];
		document.chara.firemp04.value = MagicMpTable[0][3];
		document.chara.firemp05.value = MagicMpTable[0][4];
		document.chara.firemp06.value = MagicMpTable[0][5];
		document.chara.firemp07.value = MagicMpTable[0][6];
		document.chara.firemp01.disabled = false;
		document.chara.firemp02.disabled = false;
		document.chara.firemp03.disabled = false;
		document.chara.firemp04.disabled = false;
		document.chara.firemp05.disabled = false;
		document.chara.firemp06.disabled = false;
		document.chara.firemp07.disabled = false;
		document.chara.fireper01.value = MagicPerTable[0][0];
		document.chara.fireper02.value = MagicPerTable[0][1];
		document.chara.fireper03.value = MagicPerTable[0][2];
		document.chara.fireper04.value = MagicPerTable[0][3];
		document.chara.fireper05.value = MagicPerTable[0][4];
		document.chara.fireper06.value = MagicPerTable[0][5];
		document.chara.fireper07.value = MagicPerTable[0][6];
		document.chara.fireper01.disabled = false;
		document.chara.fireper02.disabled = false;
		document.chara.fireper03.disabled = false;
		document.chara.fireper04.disabled = false;
		document.chara.fireper05.disabled = false;
		document.chara.fireper06.disabled = false;
		document.chara.fireper07.disabled = false;
	}

	//	火スキルなしの場合
	else{
		//	セクション非表示
		document.getElementById("extra_fire_sec").style.display = "none";
		//	火炎魔法項目初期化
		document.chara.firemp01.value = "0";
		document.chara.firemp02.value = "0";
		document.chara.firemp03.value = "0";
		document.chara.firemp04.value = "0";
		document.chara.firemp05.value = "0";
		document.chara.firemp06.value = "0";
		document.chara.firemp07.value = "0";
		document.chara.firemp01.disabled = true;
		document.chara.firemp02.disabled = true;
		document.chara.firemp03.disabled = true;
		document.chara.firemp04.disabled = true;
		document.chara.firemp05.disabled = true;
		document.chara.firemp06.disabled = true;
		document.chara.firemp07.disabled = true;
		document.chara.fireper01.value = "0.0";
		document.chara.fireper02.value = "0.0";
		document.chara.fireper03.value = "0.0";
		document.chara.fireper04.value = "0.0";
		document.chara.fireper05.value = "0.0";
		document.chara.fireper06.value = "0.0";
		document.chara.fireper07.value = "0.0";
		document.chara.fireper01.disabled = true;
		document.chara.fireper02.disabled = true;
		document.chara.fireper03.disabled = true;
		document.chara.fireper04.disabled = true;
		document.chara.fireper05.disabled = true;
		document.chara.fireper06.disabled = true;
		document.chara.fireper07.disabled = true;
	}

	//	氷スキルありの場合
	if( SkillList[8] != 0 ){
		//	セクション表示
		document.getElementById("extra_ice_sec").style.display = "block";
		//	冷凍魔法項目設定
		document.chara.icemp01.value = MagicMpTable[1][0];
		document.chara.icemp02.value = MagicMpTable[1][1];
		document.chara.icemp03.value = MagicMpTable[1][2];
		document.chara.icemp04.value = MagicMpTable[1][3];
		document.chara.icemp05.value = MagicMpTable[1][4];
		document.chara.icemp06.value = MagicMpTable[1][5];
		document.chara.icemp07.value = MagicMpTable[1][6];
		document.chara.icemp01.disabled = false;
		document.chara.icemp02.disabled = false;
		document.chara.icemp03.disabled = false;
		document.chara.icemp04.disabled = false;
		document.chara.icemp05.disabled = false;
		document.chara.icemp06.disabled = false;
		document.chara.icemp07.disabled = false;
		document.chara.iceper01.value = MagicPerTable[1][0];
		document.chara.iceper02.value = MagicPerTable[1][1];
		document.chara.iceper03.value = MagicPerTable[1][2];
		document.chara.iceper04.value = MagicPerTable[1][3];
		document.chara.iceper05.value = MagicPerTable[1][4];
		document.chara.iceper06.value = MagicPerTable[1][5];
		document.chara.iceper07.value = MagicPerTable[1][6];
		document.chara.iceper01.disabled = false;
		document.chara.iceper02.disabled = false;
		document.chara.iceper03.disabled = false;
		document.chara.iceper04.disabled = false;
		document.chara.iceper05.disabled = false;
		document.chara.iceper06.disabled = false;
		document.chara.iceper07.disabled = false;
	}

	//	氷スキルなしの場合
	else{
		//	セクション非表示
		document.getElementById("extra_ice_sec").style.display = "none";
		//	冷凍魔法項目初期化
		document.chara.icemp01.value = "0";
		document.chara.icemp02.value = "0";
		document.chara.icemp03.value = "0";
		document.chara.icemp04.value = "0";
		document.chara.icemp05.value = "0";
		document.chara.icemp06.value = "0";
		document.chara.icemp07.value = "0";
		document.chara.icemp01.disabled = true;
		document.chara.icemp02.disabled = true;
		document.chara.icemp03.disabled = true;
		document.chara.icemp04.disabled = true;
		document.chara.icemp05.disabled = true;
		document.chara.icemp06.disabled = true;
		document.chara.icemp07.disabled = true;
		document.chara.iceper01.value = "0.0";
		document.chara.iceper02.value = "0.0";
		document.chara.iceper03.value = "0.0";
		document.chara.iceper04.value = "0.0";
		document.chara.iceper05.value = "0.0";
		document.chara.iceper06.value = "0.0";
		document.chara.iceper07.value = "0.0";
		document.chara.iceper01.disabled = true;
		document.chara.iceper02.disabled = true;
		document.chara.iceper03.disabled = true;
		document.chara.iceper04.disabled = true;
		document.chara.iceper05.disabled = true;
		document.chara.iceper06.disabled = true;
		document.chara.iceper07.disabled = true;
	}

	//	援護スキルありの場合
	if( SkillList[9] != 0 ){
		//	セクション表示
		document.getElementById("extra_magical_sec").style.display = "block";
		//	援護魔法項目設定
		document.chara.magicalmp01.value = MagicMpTable[2][0];
		document.chara.magicalmp02.value = MagicMpTable[2][1];
		document.chara.magicalmp03.value = MagicMpTable[2][2];
		document.chara.magicalmp04.value = MagicMpTable[2][3];
		document.chara.magicalmp05.value = MagicMpTable[2][4];
		document.chara.magicalmp06.value = MagicMpTable[2][5];
		document.chara.magicalmp07.value = MagicMpTable[2][6];
		document.chara.magicalmp01.disabled = false;
		document.chara.magicalmp02.disabled = false;
		document.chara.magicalmp03.disabled = false;
		document.chara.magicalmp04.disabled = false;
		document.chara.magicalmp05.disabled = false;
		document.chara.magicalmp06.disabled = false;
		document.chara.magicalmp07.disabled = false;
		document.chara.magicalper01.value = MagicPerTable[2][0];
		document.chara.magicalper02.value = MagicPerTable[2][1];
		document.chara.magicalper03.value = MagicPerTable[2][2];
		document.chara.magicalper04.value = MagicPerTable[2][3];
		document.chara.magicalper05.value = MagicPerTable[2][4];
		document.chara.magicalper06.value = MagicPerTable[2][5];
		document.chara.magicalper07.value = MagicPerTable[2][6];
		document.chara.magicalper01.disabled = false;
		document.chara.magicalper02.disabled = false;
		document.chara.magicalper03.disabled = false;
		document.chara.magicalper04.disabled = false;
		document.chara.magicalper05.disabled = false;
		document.chara.magicalper06.disabled = false;
		document.chara.magicalper07.disabled = false;

	}

	//	援護スキルなしの場合
	else{
		//	セクション非表示
		document.getElementById("extra_magical_sec").style.display = "none";
		//	援護魔法項目初期化
		document.chara.magicalmp01.value = "0";
		document.chara.magicalmp02.value = "0";
		document.chara.magicalmp03.value = "0";
		document.chara.magicalmp04.value = "0";
		document.chara.magicalmp05.value = "0";
		document.chara.magicalmp06.value = "0";
		document.chara.magicalmp07.value = "0";
		document.chara.magicalmp01.disabled = true;
		document.chara.magicalmp02.disabled = true;
		document.chara.magicalmp03.disabled = true;
		document.chara.magicalmp04.disabled = true;
		document.chara.magicalmp05.disabled = true;
		document.chara.magicalmp06.disabled = true;
		document.chara.magicalmp07.disabled = true;
		document.chara.magicalper01.value = "0.0";
		document.chara.magicalper02.value = "0.0";
		document.chara.magicalper03.value = "0.0";
		document.chara.magicalper04.value = "0.0";
		document.chara.magicalper05.value = "0.0";
		document.chara.magicalper06.value = "0.0";
		document.chara.magicalper07.value = "0.0";
		document.chara.magicalper01.disabled = true;
		document.chara.magicalper02.disabled = true;
		document.chara.magicalper03.disabled = true;
		document.chara.magicalper04.disabled = true;
		document.chara.magicalper05.disabled = true;
		document.chara.magicalper06.disabled = true;
		document.chara.magicalper07.disabled = true;
	}

	//	聖スキルありの場合
	if( SkillList[10] != 0 ){
		//	セクション表示
		document.getElementById("extra_holy_sec").style.display = "block";
		//	聖魔法項目設定
		document.chara.holymp01.value = MagicMpTable[3][0];
		document.chara.holymp02.value = MagicMpTable[3][1];
		document.chara.holymp03.value = MagicMpTable[3][2];
		document.chara.holymp04.value = MagicMpTable[3][3];
		document.chara.holymp05.value = MagicMpTable[3][4];
		document.chara.holymp06.value = MagicMpTable[3][5];
		document.chara.holymp07.value = MagicMpTable[3][6];
		document.chara.holymp08.value = MagicMpTable[3][7];
		document.chara.holymp09.value = MagicMpTable[3][8];
		document.chara.holymp10.value = MagicMpTable[3][9];
		document.chara.holymp01.disabled = false;
		document.chara.holymp02.disabled = false;
		document.chara.holymp03.disabled = false;
		document.chara.holymp04.disabled = false;
		document.chara.holymp05.disabled = false;
		document.chara.holymp06.disabled = false;
		document.chara.holymp07.disabled = false;
		document.chara.holymp08.disabled = false;
		document.chara.holymp09.disabled = false;
		document.chara.holymp10.disabled = false;
		document.chara.holyper01.value = MagicPerTable[3][0];
		document.chara.holyper02.value = MagicPerTable[3][1];
		document.chara.holyper03.value = MagicPerTable[3][2];
		document.chara.holyper04.value = MagicPerTable[3][3];
		document.chara.holyper05.value = MagicPerTable[3][4];
		document.chara.holyper06.value = MagicPerTable[3][5];
		document.chara.holyper07.value = MagicPerTable[3][6];
		document.chara.holyper08.value = MagicPerTable[3][7];
		document.chara.holyper09.value = MagicPerTable[3][8];
		document.chara.holyper10.value = MagicPerTable[3][9];
		document.chara.holyper01.disabled = false;
		document.chara.holyper02.disabled = false;
		document.chara.holyper03.disabled = false;
		document.chara.holyper04.disabled = false;
		document.chara.holyper05.disabled = false;
		document.chara.holyper06.disabled = false;
		document.chara.holyper07.disabled = false;
		document.chara.holyper08.disabled = false;
		document.chara.holyper09.disabled = false;
		document.chara.holyper10.disabled = false;
	}

	//	聖スキルなしの場合
	else{
		//	セクション非表示
		document.getElementById("extra_holy_sec").style.display = "none";
		//	聖魔法項目初期化
		document.chara.holymp01.value = "0";
		document.chara.holymp02.value = "0";
		document.chara.holymp03.value = "0";
		document.chara.holymp04.value = "0";
		document.chara.holymp05.value = "0";
		document.chara.holymp06.value = "0";
		document.chara.holymp07.value = "0";
		document.chara.holymp08.value = "0";
		document.chara.holymp09.value = "0";
		document.chara.holymp10.value = "0";
		document.chara.holymp01.disabled = true;
		document.chara.holymp02.disabled = true;
		document.chara.holymp03.disabled = true;
		document.chara.holymp04.disabled = true;
		document.chara.holymp05.disabled = true;
		document.chara.holymp06.disabled = true;
		document.chara.holymp07.disabled = true;
		document.chara.holymp08.disabled = true;
		document.chara.holymp09.disabled = true;
		document.chara.holymp10.disabled = true;
		document.chara.holyper01.value = "0.0";
		document.chara.holyper02.value = "0.0";
		document.chara.holyper03.value = "0.0";
		document.chara.holyper04.value = "0.0";
		document.chara.holyper05.value = "0.0";
		document.chara.holyper06.value = "0.0";
		document.chara.holyper07.value = "0.0";
		document.chara.holyper08.value = "0.0";
		document.chara.holyper09.value = "0.0";
		document.chara.holyper10.value = "0.0";
		document.chara.holyper01.disabled = true;
		document.chara.holyper02.disabled = true;
		document.chara.holyper03.disabled = true;
		document.chara.holyper04.disabled = true;
		document.chara.holyper05.disabled = true;
		document.chara.holyper06.disabled = true;
		document.chara.holyper07.disabled = true;
		document.chara.holyper08.disabled = true;
		document.chara.holyper09.disabled = true;
		document.chara.holyper10.disabled = true;
	}

	//	魔法グループ表示切替（火・氷・援護・聖のいずれかがある場合のみ表示）
	document.getElementById("extra_magic_grp").style.display =
		( SkillList[7] != 0 || SkillList[8] != 0 || SkillList[9] != 0 || SkillList[10] != 0 ) ? "block" : "none";

	//	歌スキルありの場合
	if( SkillList[11] != 0 ){

		//	セクション表示
		document.getElementById("extra_song_sec").style.display = "block";

		//	歌定義テーブル
		var SongPer = [
			//	固有値	成功率
			[-2,		0],		//	[0]勇気
			[-1,		0],		//	[1]卑怯
			[0,			0],		//	[2]恐怖
			[10,		0],		//	[3]盲目
			[4,			0],		//	[4]回復
			[6,			0],		//	[5]不治
			[14,		0]		//	[6]沈黙
		];

		//	歌発動率設定
		GetExtraSongPercent( SkillList[11], Men, SongPer );
		document.chara.songper01.value = SongPer[0][1];
		document.chara.songper02.value = SongPer[1][1];
		document.chara.songper03.value = SongPer[2][1];
		document.chara.songper04.value = SongPer[3][1];
		document.chara.songper05.value = SongPer[4][1];
		document.chara.songper06.value = SongPer[5][1];
		document.chara.songper07.value = SongPer[6][1];
		document.chara.songper01.disabled = false;
		document.chara.songper02.disabled = false;
		document.chara.songper03.disabled = false;
		document.chara.songper04.disabled = false;
		document.chara.songper05.disabled = false;
		document.chara.songper06.disabled = false;
		document.chara.songper07.disabled = false;

		//	持続時間定義テーブル(MP切れ／SP切れ)
		//	キー：入力項目名の接尾辞、値：[MP切れ時間配列, SP切れ時間配列]
		var SongTimeList = [
			//	接尾辞		回復アクセ	回復の歌	不治の歌
			["",			0,			0,			0],
			["acc1",		1,			0,			0],
			["acc2",		2,			0,			0],
			["acc3",		3,			0,			0],
			["kaihuku",		0,			1,			0],
			["fuji",		0,			0,			1]
		];

		//	回復の歌による回復量の増加値（入力欄。未設定時は5）
		var KaihukuUp = 5;
		if( document.chara.songkaihukuup ){
			KaihukuUp = document.chara.songkaihukuup.value - 0;
		}

		//	回復の歌を全体へ適用するか（チェックONの場合、全条件へ回復の歌の効果を反映）
		var KaihukuAll = 0;
		if( document.chara.songkaihukuall && document.chara.songkaihukuall.checked ){
			KaihukuAll = 1;
		}

		//	歌持続時間設定
		for( var s = 0; s < SongTimeList.length; ++s ){

			//	持続時間取得
			var SongTimeMp = ["00:00","00:00","00:00","00:00","00:00","00:00","00:00"];
			var SongTimeSp = ["00:00","00:00","00:00","00:00","00:00","00:00","00:00"];
			//	全体適用ONの場合は回復の歌ありとして計算する
			var Kaihuku = SongTimeList[s][2];
			if( KaihukuAll == 1 ){
				Kaihuku = 1;
			}

			GetExtraSongTime( SkillList[11], Mp, Sp, Men, Vit, SongTimeMp, SongTimeSp,
							  SongTimeList[s][1], Kaihuku, SongTimeList[s][3], KaihukuUp );

			//	歌数分ループ
			for( var n = 0; n <= 6; ++n ){

				//	項目名作成(例：songtime01acc1)
				var Name = "songtime0" + ( n + 1 ) + SongTimeList[s][0];

				//	先に切れる方の末尾に要因(m：MP切れ、s：SP切れ)を付与
				var StrMp = SongTimeMp[n];
				var StrSp = SongTimeSp[n];
				var SecMp = GetSongTimeSecond( StrMp );
				var SecSp = GetSongTimeSecond( StrSp );

				//	永久の場合は付与しない
				if( StrMp != "永久" && SecMp <= SecSp ){
					StrMp += "m";
				}
				if( StrSp != "永久" && SecSp <= SecMp ){
					StrSp += "s";
				}

				//	1行目：MP切れ時間、2行目：SP切れ時間
				document.chara[Name].value = StrMp + "\n" + StrSp;
				document.chara[Name].disabled = false;
			}
		}
	}

	//	歌スキルなしの場合
	else{
		//	セクション非表示
		document.getElementById("extra_song_sec").style.display = "none";
		//	歌数分ループ
		for( var n = 0; n <= 6; ++n ){

			//	成功率初期化
			document.chara["songper0" + ( n + 1 )].value = "0.0";
			document.chara["songper0" + ( n + 1 )].disabled = true;

			//	持続時間初期化(接尾辞分ループ)
			var ClearList = [ "", "acc1", "acc2", "acc3", "kaihuku", "fuji" ];
			for( var c = 0; c < ClearList.length; ++c ){
				var ClearName = "songtime0" + ( n + 1 ) + ClearList[c];
				document.chara[ClearName].value = "00:00\n00:00";
				document.chara[ClearName].disabled = true;
			}
		}
	}

	//	錬金スキルありの場合
	if( SkillList[12] != 0 ){

		//	セクション表示
		document.getElementById("extra_alchemy_sec").style.display = "block";

		//	錬金アイテム発動率設定テーブル
		//	[0]アイテム, [1]固有値, [2]成功率
		var AlchemyItem = [
			[ "解毒", 4, 0 ],
			[ "特効", 5, 0 ],
			[ "毒薬", 11, 0 ],
			[ "病気", 12, 0 ],
			[ "ＳＰ", 2,, 0 ],
			[ "剣油", 3, 0 ],
			[ "鎧油", 4, 0 ],
			[ "盾油", 5, 0 ],
			[ "石化", 8, 0 ],
			[ "力薬", 9, 0 ],
			[ "火結", 9, 0 ],
			[ "氷結", 10, 0 ],
			[ "復活", 11, 0 ]
		];

		//	錬金アイテム成功率取得
		GetExtraAlchemyPercent( SkillList[12], Int, AlchemyItem );

		//	錬金アイテム分ループ
		for( var i = 0; i <= 12; ++i ){
			var StrAlchemy = "";

			//	錬金成功率設定
			if( (i + 1) < 10 ){
				StrAlchemy = eval( "document.chara.alchemy" + 0 + (i + 1) );
			}
			else{
				StrAlchemy = eval( "document.chara.alchemy" + (i + 1) );
			}
			StrAlchemy.value = AlchemyItem[i][2];
			StrAlchemy.disabled = false;
		}
	}

	//	錬金スキルなしの場合
	else{
		//	セクション非表示
		document.getElementById("extra_alchemy_sec").style.display = "none";
		document.chara.alchemy01.value = "0.0";
		document.chara.alchemy02.value = "0.0";
		document.chara.alchemy03.value = "0.0";
		document.chara.alchemy04.value = "0.0";
		document.chara.alchemy05.value = "0.0";
		document.chara.alchemy06.value = "0.0";
		document.chara.alchemy07.value = "0.0";
		document.chara.alchemy08.value = "0.0";
		document.chara.alchemy09.value = "0.0";
		document.chara.alchemy10.value = "0.0";
		document.chara.alchemy11.value = "0.0";
		document.chara.alchemy12.value = "0.0";
		document.chara.alchemy13.value = "0.0";
	}

	//	応急スキルありの場合
	if( SkillList[13] != 0 ){

		//	セクション表示
		document.getElementById("extra_oq_sec").style.display = "block";

		//	応急回復発動率設定
		var OqCure = 0;
		OqCure = SkillList[13] * 5;
		OqCure = AdjustPercent( OqCure );
		OqCure = OqCure.toFixed(1);
		document.chara.oq01.value = OqCure
		document.chara.oq01.disabled = false;

		var OqResurrect = 0;

		//	応急蘇生発動率設定
		//	応急戦士の部屋 ふうみ様
		//	http://p.cocot.jp/godius/oq/
		OqResurrect = ( Lv - 0 + SkillList[13] * 2 + ( ( ( Men - ( Men % 5 ) ) / 5 ) * 2 - 0 ) - 52 ) * 5;
		OqResurrect = AdjustPercent( OqResurrect );
		OqResurrect = OqResurrect.toFixed(1);
		document.chara.oq02.value = OqResurrect;
		document.chara.oq02.disabled = false;
	}

	//	応急スキルなしの場合
	else{
		//	セクション非表示
		document.getElementById("extra_oq_sec").style.display = "none";
		document.chara.oq01.value = "0.0";
		document.chara.oq02.value = "0.0";
		document.chara.oq01.disabled = true;
		document.chara.oq02.disabled = true;
	}

	//	おまけ情報表示制御処理
	SetExtraVisible();
}
//------------------------------------------------------------------------------
//	関数名		：	おまけ情報表示制御処理
//	機能説明	：	表示中のセクションが無い場合、おまけ情報全体を非表示にする。
//	パラメータ	：	なし
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function SetExtraVisible()
{
	//	変数宣言
	var Extra = document.getElementById("extra");				//	おまけ情報
	var SecList = Extra.querySelectorAll("[id$='_sec']");		//	セクションリスト
	var Visible = false;										//	表示フラグ

	//	セクション分ループ
	for( var i = 0; i < SecList.length; i++ ){
		//	非表示の場合
		if( SecList[i].style.display == "none" ){
			//	区切り線非表示
			SecList[i].classList.remove("extra_sep");
			continue;
		}

		//	先頭の表示セクション以外に区切り線を表示
		if( Visible ){
			SecList[i].classList.add("extra_sep");
		}
		else{
			SecList[i].classList.remove("extra_sep");
		}

		//	表示フラグ設定
		Visible = true;
	}

	//	おまけ情報表示設定
	Extra.style.display = Visible ? "block" : "none";
	//	区切り線表示設定
	document.getElementById("extra_hr").style.display = Visible ? "block" : "none";
}
//------------------------------------------------------------------------------
//	関数名		：	魔法発動率取得処理
//	機能説明	：	各魔法の発動率を取得する
//	パラメータ	：	Lv				Lv
//					Int				INT
//					SkillList		スキルテーブル
//					MagicPerTable	魔法発動率テーブル
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetExtraMagicPercent( Lv, Int, SkillList, MagicPerTable )
{
	var Per = 0;								//	発動率
	var Bonus = 0;								//	発動・安定レベル増減ボーナス

	var RiseTable = [							//	発動レベル定義テーブル(INT15)
			[1,4,5,10,11,24,32],				//	[0]火
			[1,5,6,7,22,27,33],					//	[1]氷
			[5,17,22,30,37,47,68],				//	[2]援護
			[1,10,14,1,17,23,27,39,58,56],		//	[3]聖
		];

	var StabTable = [							//	安定レベル定義テーブル(INT15)
			[11,14,17,23,25,33,44],				//	[0]火
			[11,15,18,26,31,37,45],				//	[1]氷
			[14,25,31,40,47,57,77],				//	[2]援護
			[9,19,25,15,26,31,36,47,67,92]		//	[3]聖
		];

	//	INTボーナス設定
	if( Int >= 95 && Int < 100 ){
		Bonus = -16;
	}
	if( Int >= 90 && Int < 95 ){
		Bonus = -15;
	}
	if( Int >= 85 && Int < 90 ){
		Bonus = -14;
	}
	if( Int >= 80 && Int < 85 ){
		Bonus = -13;
	}
	if( Int >= 75 && Int < 80 ){
		Bonus = -12;
	}
	if( Int >= 70 && Int < 75 ){
		Bonus = -11;
	}
	if( Int >= 65 && Int < 70 ){
		Bonus = -10;
	}
	if( Int >= 60 && Int < 65 ){
		Bonus = -9;
	}
	if( Int >= 55 && Int < 60 ){
		Bonus = -8;
	}
	if( Int >= 50 && Int < 55 ){
		Bonus = -7;
	}
	if( Int >= 40 && Int < 50 ){
		Bonus = -6;
	}
	if( Int >= 35 && Int < 40 ){
		Bonus = -4;
	}
	if( Int >= 30 && Int < 35 ){
		Bonus = -3;
	}
	if( Int >= 25 && Int < 30 ){
		Bonus = -2;
	}
	if( Int >= 20 && Int < 25 ){
		Bonus = -1;
	}
	if( Int >= 15 && Int < 20 ){
		Bonus = 0;
	}
	if( Int >= 10 && Int < 15 ){
		Bonus = 1;
	}
	if( Int >= 6 && Int < 10 ){
		Bonus = 2;
	}
	Bonus -= 0;

	//	火スキルありの場合
	if( SkillList[7] != 0 ){
		for( var i = 0; i <= 6; ++i ){
			StabTable[0][i] -= 0;
			StabTable[0][i] += Bonus;
			RiseTable[0][i] -= 0;
			RiseTable[0][i] += Bonus;
			Per = ( Lv - ( RiseTable[0][i] - 1 ) ) / ( StabTable[0][i] - ( RiseTable[0][i] - 1 ) ) * 100;
			Per = AdjustPercent( Per );
			MagicPerTable[0][i] = Per.toFixed( 1 );
		}
	}

	//	氷スキルありの場合
	if( SkillList[8] != 0 ){
		for( var i = 0; i <= 6; ++i ){
			StabTable[1][i] -= 0;
			StabTable[1][i] += Bonus;
			RiseTable[1][i] -= 0;
			RiseTable[1][i] += Bonus;
			Per = ( Lv - ( RiseTable[1][i] - 1 ) ) / ( StabTable[1][i] - ( RiseTable[1][i] - 1 ) ) * 100;
			Per = AdjustPercent( Per );
			MagicPerTable[1][i] = Per.toFixed( 1 );
		}
	}

	//	援護スキルありの場合
	if( SkillList[9] != 0 ){
		for( var i = 0; i <= 6; ++i ){
			StabTable[2][i] -= 0;
			StabTable[2][i] += Bonus;
			RiseTable[2][i] -= 0;
			RiseTable[2][i] += Bonus;
			Per = ( Lv - ( RiseTable[2][i] - 1 ) ) / ( StabTable[2][i] - ( RiseTable[2][i] - 1 ) ) * 100;
			Per = AdjustPercent( Per );
			MagicPerTable[2][i] = Per.toFixed( 1 );
		}
	}

	//	聖スキルありの場合
	if( SkillList[10] != 0 ){
		for( var i = 0; i <= 8; ++i ){
			StabTable[3][i] -= 0;
			StabTable[3][i] += Bonus;
			RiseTable[3][i] -= 0;
			RiseTable[3][i] += Bonus;
			Per = ( Lv - ( RiseTable[3][i] - 1 ) ) / ( StabTable[3][i] - ( RiseTable[3][i] - 1 ) ) * 100;
			Per = AdjustPercent( Per );
			MagicPerTable[3][i] = Per.toFixed( 1 );
		}

		//	聖リリース発動率取得
		SkillList[10] -= 0;
		var ReleasePercent = GetExtraReleasePercent( Lv, Int, SkillList[10] );
		MagicPerTable[3][9] = ReleasePercent;
	}
}
//------------------------------------------------------------------------------
//	関数名		：	聖リリース発動率取得処理
//	機能説明	：	聖リリースの発動率を返す。
//	パラメータ	：	Lv		レベル
//					Int		INT
//					Skill	聖スキル
//	戻り値		：	聖リリース発動率
//	備考		：	なし
//------------------------------------------------------------------------------
function GetExtraReleasePercent( Lv, Int, Skill )
{
	//	聖リリース発動率
	var Percent = 0;

	//	INT / 5 切り捨て
	Int = Math.floor( Int / 5 );

	//	発動率設定
	//	Godius community 質問掲示板No.1444 リリース(魔法)の発動LVについて
	//	http://gc.e-hobby.net/bbs/help/bbs.cgi?mode=view&Code=1444&R=1
	Percent = Lv * 2.5 + ( Skill + Int ) * 10 - 360;

	//	発動率修正
	Percent = AdjustPercent( Percent );

	return Percent.toFixed(1);
}
//------------------------------------------------------------------------------
//	関数名		：	減少ＭＰ取得処理
//	機能説明	：	各魔法の減少ＭＰを取得する
//	パラメータ	：	Lv				Lv
//					MagicMpTable	消費ＭＰテーブル
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetExtraMpCost( Lv, MagicMpTable)
{
	var DiscountMp = 0;								//	減少ＭＰ
	var MpCost = [									//	消費ＭＰ定義テーブル
			[10,15,18,30,24,20,25],					//	[0]火
			[10,15,18,30,24,23,25],					//	[1]氷
			[18,26,15,28,12,40,30],					//	[2]援護
			[10,10,12,6,14,20,15,25,40,50]			//	[3]聖
		];

	var LvDiscountMp = 0;							//	Lv減少ＭＰ
	var EquipmentDiscountMp = 0;					//	装備減少ＭＰ
	var Weapon = document.chara.weapon.value - 0;	//	武器
	var WeaponList = new Array();					//	武器リスト

	// 武器リスト取得
	GetWeaponList(WeaponList);

	// 装備減少率取得

	var EquipmentMpPercent = WeaponList[Weapon][9] / 100;

	//	火スキル
	for( var i = 0; i <= 6; ++i ){
		MpCost[0][i] -= 0;
		LvDiscountMp = Math.floor(MpCost[0][i] * (Lv / 3) / 100);
		EquipmentDiscountMp = Math.floor(MpCost[0][i] * EquipmentMpPercent);
		DiscountMp = MpCost[0][i] - LvDiscountMp - EquipmentDiscountMp;
		MagicMpTable[0][i] = DiscountMp;
	}

	//	氷スキル
	for( var i = 0; i <= 6; ++i ){
		MpCost[1][i] -= 0;
		LvDiscountMp = Math.floor(MpCost[1][i] * (Lv / 3) / 100);
		EquipmentDiscountMp = Math.floor(MpCost[1][i] * EquipmentMpPercent);
		DiscountMp = MpCost[1][i] - LvDiscountMp - EquipmentDiscountMp;
		MagicMpTable[1][i] = DiscountMp;
	}

	//	援護スキル
	for( var i = 0; i <= 6; ++i ){
		MpCost[2][i] -= 0;
		LvDiscountMp = Math.floor(MpCost[2][i] * (Lv / 3) / 100);
		EquipmentDiscountMp = Math.floor(MpCost[2][i] * EquipmentMpPercent);
		DiscountMp = MpCost[2][i] - LvDiscountMp - EquipmentDiscountMp;
		MagicMpTable[2][i] = DiscountMp;
	}

	//	聖スキル
	for( var i = 0; i <= 9; ++i ){
		MpCost[3][i] -= 0;
		LvDiscountMp = Math.floor(MpCost[3][i] * (Lv / 3) / 100);
		EquipmentDiscountMp = Math.floor(MpCost[3][i] * EquipmentMpPercent);
		DiscountMp = MpCost[3][i] - LvDiscountMp - EquipmentDiscountMp;
		MagicMpTable[3][i] = DiscountMp;
	}
}
//------------------------------------------------------------------------------
//	関数名		：	歌発動率取得処理
//	機能説明	：	歌発動時における成功率を返す。
//	パラメータ	：	Skill	歌スキル
//					Men		MEN
//					SongPer	歌成功率設定配列
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetExtraSongPercent( Skill, Men, SongPer )
{
	//	発動率
	var Percent = 0;

	//	MEN / 5 切り捨て
	Men = Math.floor( Men / 5 );

	//	歌分ループ
	for( var i = 0; i <= 6; ++i ){

		//	成功率設定
		//	歌発動率の予想式（正式版）　ドルクロア様
		//	http://resist.main.jp/topic/hatudosiki.html
		Skill -= 0;
		Percent = ( Skill + Men - SongPer[i][0] ) * 4.4;

		//	発動率修正
		Percent = AdjustPercent( Percent );

		//	成功率設定
		SongPer[i][1] = Percent.toFixed(1);
	}
}
//------------------------------------------------------------------------------
//	関数名		：	歌持続時間秒数変換処理
//	機能説明	：	「分:秒」形式の持続時間を秒数へ変換して返す。
//	パラメータ	：	String	持続時間文字列（「00:00」または「永久」）
//	戻り値		：	秒数（「永久」の場合は最大値）
//	備考		：	なし
//------------------------------------------------------------------------------
function GetSongTimeSecond( String )
{
	//	永久の場合は最大値を返す
	if( String == "永久" ){
		return Number.MAX_VALUE;
	}

	//	分と秒に分解
	var Time = String.split( ":" );

	//	秒数へ変換
	return ( Time[0] - 0 ) * 60 + ( Time[1] - 0 );
}
//------------------------------------------------------------------------------
//	関数名		：	歌持続時間取得処理
//	機能説明	：	歌発動時における持続時間を返す。
//	パラメータ	：	Skill		歌スキル
//					MpOrg		MP
//					SpOrg		SP
//					Men			MEN
//					Vit			VIT
//					SongTime	歌持続時間設定配列
//					Accessory	回復アクセ（0点～3点）
//					Kaihuku		回復の歌影響フラグ（1：回復影響あり、0：回復影響なし）
//					Fuji		不治の歌影響フラグ（1：不治影響あり、0：不治影響なし）
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetExtraSongTime( Skill, MpOrg, SpOrg, Men, Vit, SongTimeMp, SongTimeSp, Accessory, Kaihuku, Fuji, KaihukuUp )
{
	//	変数宣言
	var Mp = 0;											//	MP(計算用)
	var Sp = 0;											//	SP(計算用)
	var Second = 0;										//	経過秒
	var MpUp = MpOrg / 10;								//	1回あたりのMP回復量
	var SpUp = SpOrg / 10;								//	1回あたりのSP回復量
	var MpUpSec = GetRegenerationSecond( Men );			//	MP自動回復秒数取得
	var SpUpSec = GetRegenerationSecond( Vit );			//	SP自動回復秒数取得

	var SongTable = [									//	MPSP管理テーブル
		//初期MP	SP		維持MP	SP
		[5,			10,		4,		4],					//	[0]勇気
		[6,			11,		4,		5],					//	[1]卑怯
		[7,			15,		4,		4],					//	[2]恐怖
		[20,		25,		6,		6],					//	[3]盲目
		[10,		15,		5,		4],					//	[4]回復
		[12,		17,		5,		4],					//	[5]不治
		[20,		20,		6,		7]					//	[6]沈黙
	];

	//	経過秒を「分:秒」形式の文字列へ変換する
	function FormatTime( Sec )
	{
		//	秒数切り捨て
		Sec = Math.floor( Sec );

		//	分および秒設定
		var Minute = Math.floor( Sec / 60 );
		var Rest = Sec % 60;
		var String = "";

		//	持続時間文字列作成
		if( ( Minute + "" ).length == 1 ){
			String = "0" + Minute + ":";
		}
		else{
			String = Minute + ":";
		}

		if( ( Rest + "" ).length == 1 ){
			String += "0" + Rest;
		}
		else{
			String += Rest;
		}

		return String;
	}

	//	不治の歌ありの場合、回復量0とする
	if( Fuji == 1 ){
		MpUp = 0;
		SpUp = 0;
		Accessory = 0;
		Kaihuku = 0;
	}

	//	回復アクセありの場合
	if( Accessory >= 1 && Accessory <= 3 ){
		MpUp += ( Accessory - 0 ) * 3;
	}

	//	MP、SPの回復量が30より大きい場合、30とする
	if( MpUp > 30 ){
		MpUp = 30;
	}
	if( SpUp > 30 ){
		SpUp = 30;
	}

	//	回復の歌ありの場合
	if( Kaihuku == 1 ){
		MpUp += KaihukuUp;
		SpUp += KaihukuUp;
	}

	//	歌の持続中は回復量が半分になる
	MpUp = MpUp / 2;
	SpUp = SpUp / 2;

	//	歌数分ループ
	for( var i = 0; i <= 6; ++i ){

		//	初期化
		Second = 0;
		Mp = MpOrg;
		Sp = SpOrg;
		var NextMpTime = MpUpSec;	//	次回MP回復時刻
		var NextSpTime = SpUpSec;	//	次回SP回復時刻
		var MpEnd = 0;				//	MP切れ確定フラグ
		var SpEnd = 0;				//	SP切れ確定フラグ

		//	歌発動
		Mp -= SongTable[i][0];
		Sp -= SongTable[i][1];

		//	発動と同時にMPがストップする場合
		if( Mp <= 0 ){
			//	０秒を設定
			SongTimeMp[i] = "00:00";
			MpEnd = 1;
		}

		//	発動と同時にSPがストップする場合
		if( Sp <= 0 ){
			//	０秒を設定
			SongTimeSp[i] = "00:00";
			SpEnd = 1;
		}

		//	MP、SPともに確定済の場合は次の歌へ
		if( MpEnd == 1 && SpEnd == 1 ){
			continue;
		}

		//	時間刻みループ(1秒を1/64で分割。2進数で正確に表せる値のため剰余判定も誤差なし)
		while( 1 ){
			//	1刻み経過
			Second += 1 / 64;

			//	1秒経過(発動後3秒間は維持MP、SPを消費しない)
			if( Second % 1 == 0 && 3 < Second){
				//	維持MP、SP消費(確定済のものは計算対象外)
				if( MpEnd == 0 ){
					Mp -= SongTable[i][2];
				}
				if( SpEnd == 0 ){
					Sp -= SongTable[i][3];
				}
			}

			//	MPが切れた場合
			if( MpEnd == 0 && Mp <= 0 ){
				SongTimeMp[i] = FormatTime( Second );
				MpEnd = 1;
			}

			//	SPが切れた場合
			if( SpEnd == 0 && Sp <= 0 ){
				SongTimeSp[i] = FormatTime( Second );
				SpEnd = 1;
			}

			//	MP、SPともに確定した場合
			if( MpEnd == 1 && SpEnd == 1 ){
				break;
			}

			//	MP回復
			//	(時間刻みとの剰余判定では回復周期が割り切れず判定漏れするため、
			//	 次回回復時刻を累積して経過分をまとめて回復する)
			if( MpUpSec > 0 ){
				while( Second + 0.0001 >= NextMpTime ){
					if( MpEnd == 0 ){
						Mp += MpUp;

						//	上限超過時は最大を設定
						if( Mp >= MpOrg ){
							Mp = MpOrg;
						}
					}
					NextMpTime += MpUpSec;
				}
			}

			//	SP回復
			if( SpUpSec > 0 ){
				while( Second + 0.0001 >= NextSpTime ){
					if( SpEnd == 0 ){
						Sp += SpUp;

						//	上限超過時は最大を設定
						if( Sp >= SpOrg ){
							Sp = SpOrg;
						}
					}
					NextSpTime += SpUpSec;
				}
			}

			//	AQ判定(15秒単位経過時点)
			if( Second % 15 == 0 && 3 < Second ){

				//	現在MPが歌発動直後のMP以上の場合、永久とする
				if( MpEnd == 0 && Mp >= MpOrg - SongTable[i][0] ){
					SongTimeMp[i] = "永久";
					MpEnd = 1;
				}

				//	現在SPが歌発動直後のSP以上の場合、永久とする
				if( SpEnd == 0 && Sp >= SpOrg - SongTable[i][1] ){
					SongTimeSp[i] = "永久";
					SpEnd = 1;
				}

				//	MP、SPともに確定した場合
				if( MpEnd == 1 && SpEnd == 1 ){
					break;
				}
			}

			//	永久ループ対策
			if( Second == 10000 ){
				//	10000秒＝約3時間ループしたら永久とする
				if( MpEnd == 0 ){
					SongTimeMp[i] = "永久";
				}
				if( SpEnd == 0 ){
					SongTimeSp[i] = "永久";
				}
				break;
			}
		}
	}
}
//------------------------------------------------------------------------------
//	関数名		：	錬金アイテム成功率取得処理
//	機能説明	：	錬金アイテム作成時の成功率を返す。
//	パラメータ	：	Skill			聖スキル
//					Int				INT
//					AlchemyItem		錬金成功率設定テーブル
//						[0]アイテム, [1]固有値, [2]成功率
//	戻り値		：	なし
//	備考		：	なし
//------------------------------------------------------------------------------
function GetExtraAlchemyPercent( Skill, Int, AlchemyItem )
{
	//	作成成功率
	var Percent = 0;

	//	アイテム固有値
	var Item = 0;

	//	INT / 5 切り捨て
	Int = Math.floor( Int / 5 );

	//	アイテム分ループ
	for( var i = 0; i <= 12; ++i ){

		//	アイテム固有値設定
		Item = AlchemyItem[i][1];

		//	成功率設定
		//	GODIUS Online Forum 
		//	http://godius.s201.xrea.com/p_alchemy.html 
		Percent = ( ( Skill + Int ) - Item ) * 5;

		//	発動率修正
		Percent = AdjustPercent( Percent );

		//	テーブルへ成功率設定
		AlchemyItem[i][2] = Percent.toFixed(1);
	}
}
//------------------------------------------------------------------------------
//	関数名		：	不正パーセント補正処理
//	機能説明	：	入力値が0未満の場合0を、100より大きい場合100を返す。
//					それ以外の場合は入力値をそのまま返す。
//	パラメータ	：	InValue		パーセント
//	戻り値		：	OutValue	補正済みパーセント
//	備考		：	なし
//------------------------------------------------------------------------------
function AdjustPercent( InValue )
{
	//	補正済みパーセント
	var OutValue;

	//	０未満
	if( InValue < 0 ){
		OutValue = 0;
	}

	//	１００より大きい
	else if( InValue > 100 ){
		OutValue = 100;
	}

	//	０～１００
	else{
		OutValue = InValue;
	}

	return OutValue;
}


//	MP/SP自然回復の基準秒数（回復段階で割って1回の回復間隔[秒]を得る）
var REGENERATION_BASE_SECOND = 15.5;

//------------------------------------------------------------------------------
//	関数名		：	自動回復秒数取得処理
//	機能説明	：	MEN、またはVITから自然回復までの秒数を返す。
//	パラメータ	：	Para	MEN、またはVIT
//	戻り値		：	Sec		秒数
//	備考		：	なし
//------------------------------------------------------------------------------
function GetRegenerationSecond( Para )
{
	var Sec = 0;

	if( Para >= 95 && Para < 100 ){
		Sec = REGENERATION_BASE_SECOND / 19;				//	0.74秒
	}
	if( Para >= 90 && Para < 95 ){
		Sec = REGENERATION_BASE_SECOND / 18;				//	0.78秒
	}
	if( Para >= 85 && Para < 90 ){
		Sec = REGENERATION_BASE_SECOND / 17;				//	0.82秒
	}
	if( Para >= 80 && Para < 85 ){
		Sec = REGENERATION_BASE_SECOND / 16;				//	0.88秒
	}
	if( Para >= 75 && Para < 80 ){
		Sec = REGENERATION_BASE_SECOND / 15;				//	0.93秒
	}
	if( Para >= 70 && Para < 75 ){
		Sec = REGENERATION_BASE_SECOND / 14;				//	1秒
	}
	if( Para >= 65 && Para < 70 ){
		Sec = REGENERATION_BASE_SECOND / 13;				//	1.08秒
	}
	if( Para >= 60 && Para < 65 ){
		Sec = REGENERATION_BASE_SECOND / 12;				//	1.17秒
	}
	if( Para >= 55 && Para < 60 ){
		Sec = REGENERATION_BASE_SECOND / 11;				//	1.27秒
	}
	if( Para >= 50 && Para < 55 ){
		Sec = REGENERATION_BASE_SECOND / 10;				//	1.4秒
	}
	if( Para >= 45 && Para < 50 ){
		Sec = REGENERATION_BASE_SECOND / 9;				//	1.56秒
	}
	if( Para >= 40 && Para < 45 ){
		Sec = REGENERATION_BASE_SECOND / 8;				//	1.75秒
	}
	if( Para >= 35 && Para < 40 ){
		Sec = REGENERATION_BASE_SECOND / 7;				//	2秒
	}
	if( Para >= 30 && Para < 35 ){
		Sec = REGENERATION_BASE_SECOND / 6;				//	2.33秒
	}
	if( Para >= 25 && Para < 30 ){
		Sec = REGENERATION_BASE_SECOND / 5;				//	2.8秒
	}
	if( Para >= 20 && Para < 25 ){
		Sec = REGENERATION_BASE_SECOND / 4;				//	3.5秒
	}
	if( Para >= 15 && Para < 20 ){
		Sec = REGENERATION_BASE_SECOND / 3;				//	4.66秒
	}
	if( Para >= 10 && Para < 15 ){
		Sec = REGENERATION_BASE_SECOND / 2;				//	7秒
	}
	if( Para >= 6 && Para < 10 ){
		Sec = REGENERATION_BASE_SECOND / 1;				//	14.0秒
	}

	return Sec;
}

