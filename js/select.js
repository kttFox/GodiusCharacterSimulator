//	火炎魔法チェックボックス切替処理
//	戻り値：なし
function AllSelect1()
{
	aFire = document.chara.fire;
	var Job = document.chara.job.value;

	//	切替前の状態
	aFireCheck = new Array(aFire.length );

	//	切替前の状態取得
	for( i = 0; i < aFire.length; i++ ) {
		aFireCheck[i] = eval( document.chara.fire[i].checked );
	}

	//	切替処理
	if( document.chara.fire[0].checked ) {
		for( i = 0; i < aFire.length; i++ ) {
			document.chara.fire[i].checked = false;
		}
	} else { 
		for( i = 0; i < aFire.length; i++ ) {
			document.chara.fire[i].checked = true;
		}
	}

	//	残玉連動ONの場合のみ処理を行う
	if( document.chara.link.checked ) {

		//	残玉の設定
		var Tama = eval( document.chara.balance.value );

		//	魔以外は処理しない
		if( Job != "魔" ){
			return;
		}

		//	差分取得
		for( i = 0; i < aFire.length; i++ ) {

			//	非チェック→チェック
			if( document.chara.fire[i].checked == true ) {
				if( aFireCheck[i] == false ) {
					//	力の玉を減少
					Tama -= eval( document.chara.fire[i].value );
				}
			}

			//	チェック→非チェック
			if( document.chara.fire[i].checked == false ) {
				if( aFireCheck[i] == true ) {
					//	力の玉を増加
					Tama += eval( document.chara.fire[i].value );
				}
			}
		}

		//	テキストボックスに残玉を設定
		document.chara.balance.value = Tama;
	}
}
//	冷凍魔法チェックボックス切替処理
//	戻り値：なし
function AllSelect2()
{
	aIce = document.chara.ice;
	var Job = document.chara.job.value;

	//	切替前の状態
	aIceCheck = new Array(aIce.length );

	//	切替前の状態取得
	for( i = 0; i < aIce.length; i++ ) {
		aIceCheck[i] = eval( document.chara.ice[i].checked );
	}

	//	切替処理
	if( document.chara.ice[0].checked ) {
		for( i = 0; i < aIce.length; i++ ) {
			document.chara.ice[i].checked = false;
		}
	} else { 
		for( i = 0; i < aIce.length; i++ ) {
			document.chara.ice[i].checked = true;
		}
	}

	//	残玉連動ONの場合のみ処理を行う
	if( document.chara.link.checked ) {

		//	残玉の設定
		var Tama = eval( document.chara.balance.value );

		//	魔以外は処理しない
		if( Job != "魔" ){
			return;
		}

		//	差分取得
		for( i = 0; i < aIce.length; i++ ) {

			//	非チェック→チェック
			if( document.chara.ice[i].checked == true ) {
				if( aIceCheck[i] == false ) {
					//	力の玉を減少
					Tama -= eval( document.chara.ice[i].value );
				}
			}

			//	チェック→非チェック
			if( document.chara.ice[i].checked == false ) {
				if( aIceCheck[i] == true ) {
					//	力の玉を増加
					Tama += eval( document.chara.ice[i].value );
				}
			}
		}

		//	テキストボックスに残玉を設定
		document.chara.balance.value = Tama;
	}
}
//	援護魔法チェックボックス切替処理
//	戻り値：なし
function AllSelect3()
{
	aMagical = document.chara.magical;
	var Job = document.chara.job.value;
	var SideJob = document.chara.sidejob.value;

	//	切替前の状態
	aMagicalCheck = new Array(aMagical.length );

	//	切替前の状態取得
	for( i = 0; i < aMagical.length; i++ ) {
		aMagicalCheck[i] = eval( document.chara.magical[i].checked );
	}

	//	切替処理
	if( document.chara.magical[0].checked ) {
		for( i = 0; i < aMagical.length; i++ ) {
			document.chara.magical[i].checked = false;
		}
	} else { 
		for( i = 0; i < aMagical.length; i++ ) {
			document.chara.magical[i].checked = true;
		}
	}

	//	残玉連動ONの場合のみ処理を行う
	if( document.chara.link.checked ) {

		//	残玉の設定
		var Tama = eval( document.chara.balance.value );

		//	魔、聖以外は処理しない
		if( Job != "魔" && Job != "聖" && SideJob != "聖"){
			return;
		}

		//	差分取得
		for( i = 0; i < aMagical.length; i++ ) {

			//	非チェック→チェック
			if( document.chara.magical[i].checked == true ) {
				if( aMagicalCheck[i] == false ) {
					//	力の玉を減少
					Tama -= eval( document.chara.magical[i].value );
				}
			}

			//	チェック→非チェック
			if( document.chara.magical[i].checked == false ) {
				if( aMagicalCheck[i] == true ) {
					//	力の玉を増加
					Tama += eval( document.chara.magical[i].value );
				}
			}
		}

		//	テキストボックスに残玉を設定
		document.chara.balance.value = Tama;
	}
}
//	聖職魔法チェックボックス切替処理
//	戻り値：なし
function AllSelect4()
{
	aHoly = document.chara.holy;
	var Job = document.chara.job.value;
	var SideJob = document.chara.sidejob.value;

	//	切替前の状態
	aHolyCheck = new Array(aHoly.length );

	//	切替前の状態取得
	for( i = 0; i < aHoly.length; i++ ) {
		aHolyCheck[i] = eval( document.chara.holy[i].checked );
	}

	//	切替処理
	if( document.chara.holy[0].checked ) {
		for( i = 0; i < aHoly.length; i++ ) {
			document.chara.holy[i].checked = false;
		}
	} else { 
		for( i = 0; i < aHoly.length; i++ ) {
			document.chara.holy[i].checked = true;
		}
	}

	//	残玉連動ONの場合のみ処理を行う
	if( document.chara.link.checked ) {

		//	残玉の設定
		var Tama = eval( document.chara.balance.value );

		//	聖以外は処理しない
		if( Job != "聖" && SideJob != "聖"){
			return;
		}

		//	差分取得
		for( i = 0; i < aHoly.length; i++ ) {

			//	非チェック→チェック
			if( document.chara.holy[i].checked == true ) {
				if( aHolyCheck[i] == false ) {
					//	力の玉を減少
					Tama -= eval( document.chara.holy[i].value );
				}
			}

			//	チェック→非チェック
			if( document.chara.holy[i].checked == false ) {
				if( aHolyCheck[i] == true ) {
					//	力の玉を増加
					Tama += eval( document.chara.holy[i].value );
				}
			}
		}

		//	テキストボックスに残玉を設定
		document.chara.balance.value = Tama;
	}
}
