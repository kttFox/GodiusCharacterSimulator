//	入力項目空欄検査
//	戻り値：空欄項目名
function CheckInputItemBlank( Lv, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, Skill11, Balance )
{
	var Err = "";

	//	HP、MP、SPは検査しない
	if( Lv == "" ) {
		Err = "Lv";
	} else if( Str == "" ) {
		Err = "STR";
	} else if( Int == "" ) {
		Err = "INT";
	} else if( Dex == "" ) {
		Err = "DEX";
	} else if( Agr == "" ) {
		Err = "AGR";
	} else if( Vit == "" ) {
		Err = "VIT";
	} else if( Men == "" ) {
		Err = "MEN";
	} else if( Skill1 == "" ) {
		Err = "スキル1";
	} else if( Skill2 == "" ) {
		Err = "スキル2";
	} else if( Skill3 == "" ) {
		Err = "スキル3";
	} else if( Skill4 == "" ) {
		Err = "スキル4";
	} else if( Skill5 == "" ) {
		Err = "スキル5";
	} else if( Skill6 == "" ) {
		Err = "スキル6";
	} else if( Skill7 == "" ) {
		Err = "スキル7";
	} else if( Skill8 == "" ) {
		Err = "スキル8";
	} else if( Skill9 == "" ) {
		Err = "スキル9";
	} else if( Skill10 == "" ) {
		Err = "スキル10";
	} else if( Skill11 == "" ) {
		Err = "スキル11";
	} else if( Balance == "" ) {
		Err = "残玉";
	}
	return Err;
}

//	入力項目数値検査
//	戻り値：数値以外項目名
function CheckInputItemNaN( Lv, Hp, Mp, Sp, Str, Int, Dex, Agr, Vit, Men, Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8, Skill9, Skill10, Skill11, Balance )
{
	var Err = "";

	//	数値以外の場合
	if( isNaN( Lv ) == true ) {
		Err = "Lv";
	} else if( isNaN( Hp ) == true ) {
		Err = "HP";
	} else if( isNaN( Mp ) == true ) {
		Err = "MP";
	} else if( isNaN( Sp ) == true ) {
		Err = "SP";
	} else if( isNaN( Str ) == true ) {
		Err = "STR";
	} else if( isNaN( Int ) == true ) {
		Err = "INT";
	} else if( isNaN( Dex ) == true ) {
		Err = "DEX";
	} else if( isNaN( Agr )  == true ) {
		Err = "AGR";
	} else if( isNaN( Vit ) == true ) {
		Err = "VIT";
	} else if( isNaN( Men ) == true ) {
		Err = "MEN";
	} else if( isNaN( Skill1 ) == true ) {
		Err = "スキル1";
	} else if( isNaN( Skill2 ) == true ) {
		Err = "スキル2";
	} else if( isNaN( Skill3 ) == true ) {
		Err = "スキル3";
	} else if( isNaN( Skill4 ) == true ) {
		Err = "スキル4";
	} else if( isNaN( Skill5 ) == true ) {
		Err = "スキル5";
	} else if( isNaN( Skill6 ) == true ) {
		Err = "スキル6";
	} else if( isNaN( Skill7 ) == true ) {
		Err = "スキル7";
	} else if( isNaN( Skill8 ) == true ) {
		Err = "スキル8";
	} else if( isNaN( Skill9 ) == true ) {
		Err = "スキル9";
	} else if( isNaN( Skill10 ) == true ) {
		Err = "スキル10";
	} else if( isNaN( Skill11 ) == true ) {
		Err = "スキル11";
	} else if( isNaN( Balance )== true ) {
		Err = "残玉";
	}
	return Err;
}
//	スキル成功率検査
//	戻り値：なし
function CheckPercent( Obj )
{
	//	チェック対象
	var Per = Obj.value;

	//	数値でなければ１００を設定
	if( isNaN( Per ) == true ) {
		Per = 100;
	}

	//	１００より大きければ１００を設定
	else if( Per > 100 ) {
		Per = 100;
	}

	//	１未満であれば１を設定
	else if( Per < 1 ) {
		Per = 1;
	}

	//	成功率の再設定
	Obj.value = Per;
}
