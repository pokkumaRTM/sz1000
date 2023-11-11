
var renderClass = "jp.ngt.rtm.render.VehiclePartsRenderer";
importPackage(Packages.org.lwjgl.opengl);
importPackage(Packages.jp.ngt.rtm.render);
importPackage(Packages.jp.ngt.ngtlib.math);
importPackage(Packages.jp.ngt.rtm)
importPackage(Packages.jp.ngt.rtm.entity.train.util);
importPackage(Packages.jp.ngt.ngtlib.util);
importPackage(Packages.org.lwjgl.input);
importPackage(Packages.jp.ngt.ngtlib.io);

//##### オブジェクト定義 ####################
function init(par1, par2)
{
	//車体
	body = renderer.registerParts(new Parts("exterior","Interior","front","in_car_equipment","in_car_equipment_mx","through_door","hood","lambord","roof_eq","cooler","cable","cab","skirt","Uf1","Uf2","light","coupler","obj1","logo","int_light"));
	lightF = renderer.registerParts(new Parts("lightF"));
	lightB = renderer.registerParts(new Parts("lightB"));
	ExLF = renderer.registerParts(new Parts("ExlightF"));
	ExLB = renderer.registerParts(new Parts("ExlightB"));
	door_LF = renderer.registerParts(new Parts("doorFL","doorFL2"));
	door_RF = renderer.registerParts(new Parts("doorFR","doorFR2"));
	door_LB = renderer.registerParts(new Parts("doorBL","doorBL2"));
	door_RB = renderer.registerParts(new Parts("doorBR","doorBR2"));
	alpha = renderer.registerParts(new Parts("alpha"));
	door_LFa = renderer.registerParts(new Parts("doorFL1"));
	door_RFa = renderer.registerParts(new Parts("doorFR1"));
	door_LBa = renderer.registerParts(new Parts("doorBL1"));
	door_RBa = renderer.registerParts(new Parts("doorBR1"));
	//パンタ
	pantabase = renderer.registerParts(new Parts("panta_AB1","panta_AB2","panta_C1","panta_D2"));
	pantaC11 = renderer.registerParts(new Parts("panta_C1_1"));
	pantaC12 = renderer.registerParts(new Parts("panta_C1_2"));
	pantaC13 = renderer.registerParts(new Parts("panta_C1_3"));
	pantaC14 = renderer.registerParts(new Parts("panta_C1_4"));
	pantaC15 = renderer.registerParts(new Parts("panta_C1_5"));
	pantaD21 = renderer.registerParts(new Parts("panta_D2_1"));
	pantaD22 = renderer.registerParts(new Parts("panta_D2_2"));
	pantaD23 = renderer.registerParts(new Parts("panta_D2_3"));
	pantaD24 = renderer.registerParts(new Parts("panta_D2_4"));
	pantaD25 = renderer.registerParts(new Parts("panta_D2_5"));
	//ドアランプ
	door_LM = renderer.registerParts(new Parts("door_L_Lamp"));
	door_RM = renderer.registerParts(new Parts("door_R_Lamp"));
	door_EM = renderer.registerParts(new Parts("L_empty_lamp","R_empty_lamp"));
	door_LS = renderer.registerParts(new Parts("door_LS"));
	door_RS = renderer.registerParts(new Parts("door_RS"));
	door_SE = renderer.registerParts(new Parts("door_LSE","door_RSE"));
	//レバー類
	L_F = renderer.registerParts(new Parts("F"));
	L_M = renderer.registerParts(new Parts("M"));
	L_B = renderer.registerParts(new Parts("B"));
	L_N = renderer.registerParts(new Parts("N"));
	L_B1 = renderer.registerParts(new Parts("B1"));
	L_B2 = renderer.registerParts(new Parts("B2"));
	L_B3 = renderer.registerParts(new Parts("B3"));
	L_B4 = renderer.registerParts(new Parts("B4"));
	L_B5 = renderer.registerParts(new Parts("B5"));
	L_B6 = renderer.registerParts(new Parts("B6"));
	L_B7 = renderer.registerParts(new Parts("B7"));
	L_EB = renderer.registerParts(new Parts("EB"));
	L_P1 = renderer.registerParts(new Parts("P1"));
	L_P2 = renderer.registerParts(new Parts("P2"));
	L_P3 = renderer.registerParts(new Parts("P3"));
	L_P4 = renderer.registerParts(new Parts("P4"));
	L_P5 = renderer.registerParts(new Parts("P5"));
	//運番
	u_base = renderer.registerParts(new Parts("unban-base"));

	sz_u1_ = [];
	for	 (var i = 0; i <= 11; i++) {
		var idx = (i < 10) ? ( "0" + i ) : i;
		sz_u1_[i] = renderer.registerParts(new Parts("unban1-" + idx));
	}
	sz_u2_ = [];
	for	 (var i = 0; i <= 11; i++) {
		var idx = (i < 10) ? ( "0" + i ) : i;
		sz_u2_[i] = renderer.registerParts(new Parts("unban2-" + idx));
	}
	sz_u3_ = [];
	for	 (var i = 0; i <= 11; i++) {
		var idx = (i < 10) ? ( "0" + i ) : i;
		sz_u3_[i] = renderer.registerParts(new Parts("unban3-" + idx));
	}
	sz_u4_ = [];
	for	 (var i = 0; i <= 11; i++) {
		var idx = (i < 10) ? ( "0" + i ) : i;
		sz_u4_[i] = renderer.registerParts(new Parts("unban4-" + idx));
	}
	sz_u5_ = [];
	for	 (var i = 0; i <= 27; i++) {
		var idx = (i < 10) ? ( "0" + i ) : i;
		sz_u5_[i] = renderer.registerParts(new Parts("unban5-" + idx));
	}
}
//バージョンチェック
function MCVersionChecker() {
    var varsion = RTMCore.VERSION;
    if (varsion.indexOf("1.7.10") >= 0) return "1.7.10";
    else if (varsion.indexOf("2.0") >= 0) return "1.8.9";
    else if (varsion.indexOf("2.1") >= 0) return "1.9.4";
    else if (varsion.indexOf("2.2") >= 0) return "1.10.2";
    else if (varsion.indexOf("2.4") >= 0) return "1.12.2";
    else return "unknown";
}
//##### render ####################
function render(entity, pass, par3)
{
	//数値設定
	var doorMove = 0.65, //ドア開閉距離(m)
		pantaDistance = 7.0, //パンタ中心の前後位置(m)
		pantaType = "W51"; //パンタ高(Normal:標準-格納 / W51:W51-格納 / Compatible:標準-W51)
	GL11.glPushMatrix();
	//通常描画
	if(pass == 0){
		body.render(renderer);
		door_EM.render(renderer);
		door_SE.render(renderer);
		render_door(entity, doorMove);
		render_light(entity);
		render_cab(entity);
		render_panta(entity, pantaDistance, pantaType);
		suzu_unban_script(entity);
		u_base.render(renderer);
	}
	//半透明描画
	if(pass == 1){
		alpha.render(renderer);
		door_EM.render(renderer);
		render_door_a(entity, doorMove);
	}
	//発光部描画
	if(pass > 1){
		body.render(renderer);
		door_EM.render(renderer);
		door_SE.render(renderer);
		render_light(entity);
		render_cab(entity);
		render_door(entity, doorMove);
		suzu_unban_script(entity);
		u_base.render(renderer);
	}
	GL11.glPopMatrix();

	//車掌スクリプト呼び出し
	hi03_render_conductorSystem(entity, pass, par3);
}

//##### render_ライト ####################
function render_light(entity){
	var varsion = MCVersionChecker();
	var lightMove = 0;
	var ExState = 0;

	if(entity != null){
		if(varsion == "1.7.10" || varsion == "1.8.9" || varsion == "1.9.4"){
		    ExState = entity.getTrainStateData(11);
		    lightMove = entity.getTrainStateData(0);
		}else{
		    ExState = entity.getVehicleState(TrainState.getStateType(11));
		    lightMove = entity.getVehicleState(TrainState.getStateType(0));
		}

	}

	GL11.glPushMatrix();
		if(lightMove == 0){
 		  if(ExState >= 1){
		   GL11.glPushMatrix();
		    ExLF.render(renderer);
		   GL11.glPopMatrix();
		  }else{
		   GL11.glPushMatrix();
		    ExLB.render(renderer);
		   GL11.glPopMatrix();
  		  }
		}else{
		 GL11.glPushMatrix();
		 ExLB.render(renderer);
		 GL11.glPopMatrix();
		}
		if(lightMove == 0){
		 GL11.glPushMatrix();
		 lightF.render(renderer);
		 GL11.glPopMatrix();
		}else{
		 GL11.glPushMatrix();
		 lightB.render(renderer);
		 GL11.glPopMatrix();
		}
	GL11.glPopMatrix();
}

//##### render_運転台 ####################
function render_cab(entity){
	var varsion = MCVersionChecker();
	var st1 = 8;
	var st10 = 0;
	if(entity != null){
		if(varsion == "1.7.10" || varsion == "1.8.9" || varsion == "1.9.4"){
			st1 = entity.getTrainStateData(1) + 8;
			st10 = entity.getTrainStateData(10);
		}else{
			st1 = entity.getVehicleState(TrainState.getStateType(1)) + 8;
			st10 = entity.getVehicleState(TrainState.getStateType(10));
		}
	}

	GL11.glPushMatrix();
	switch (st10){
		case 0:
			L_F.render(renderer);
			break;
		case 1:
			L_M.render(renderer);
			break;
	  	default:
			L_B.render(renderer);
			break;
	}

	switch (st1){
		case 0:
			L_EB.render(renderer);
			break;
		case 1:
			L_B7.render(renderer);
			break;
		case 2:
			L_B6.render(renderer);
			break;
		case 3:
			L_B5.render(renderer);
			break;
		case 4:
			L_B4.render(renderer);
			break;
		case 5:
			L_B3.render(renderer);
			break;
		case 6:
			L_B2.render(renderer);
			break;
		case 7:
			L_B1.render(renderer);
			break;
		case 8:
			L_N.render(renderer);
			break;
		case 9:
			L_P1.render(renderer);
			break;
		case 10:
			L_P2.render(renderer);
			break;
		case 11:
			L_P3.render(renderer);
			break;
		case 12:
			L_P4.render(renderer);
			break;
	  	default:
			L_P5.render(renderer);
			break;
	}
	GL11.glPopMatrix();
}

//##### render_ドア ####################
function render_door(entity,doorMove){
	var doorMoveL = 0.0,
		doorMoveR = 0.0,
		doorLmL = 0.0,
		doorLmR = 0.0;
	try{
		doorMoveL = renderer.sigmoid(entity.doorMoveL / 60) * doorMove;
		doorMoveR = renderer.sigmoid(entity.doorMoveR / 60) * doorMove;
		doorLmL = renderer.sigmoid(entity.doorMoveL / 60);
		doorLmR = renderer.sigmoid(entity.doorMoveR / 60);
	}catch(e){}
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, doorMoveL);
	door_LF.render(renderer);
	GL11.glPopMatrix();
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, -doorMoveL);
	door_LB.render(renderer);
	GL11.glPopMatrix();
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, doorMoveR);
	door_RF.render(renderer);
	GL11.glPopMatrix();
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, -doorMoveR);
	door_RB.render(renderer);
	GL11.glPopMatrix();
	
	//この先ランプ系統

	//車外ドアランプ
	if (doorMoveL > 0) {
		door_LS.render(renderer);	
	};
	if (doorMoveR > 0) {
		door_RS.render(renderer);	
	};

	//車内ドアランプ
    if (doorLmL >= 0.1 && doorLmL <= 0.2){
	    door_LM.render(renderer);
	}else if(doorLmL >= 0.35 && doorLmL <= 0.65){
	    door_LM.render(renderer);
	}else if(doorLmL >= 0.8 && doorLmL <= 0.9){
	    door_LM.render(renderer);
	}
    if (doorLmR >= 0.1 && doorLmR <= 0.2){
		door_RM.render(renderer);
	}else if(doorLmR >= 0.35 && doorLmR <= 0.65){
	    door_RM.render(renderer);
	}else if(doorLmR >= 0.8 && doorLmR <= 0.9){
	    door_RM.render(renderer);
	}
}
//##### render_半透ドア ####################
function render_door_a(entity,doorMove){
	var doorMoveL = 0.0,
		doorMoveR = 0.0;
	try{
		doorMoveL = renderer.sigmoid(entity.doorMoveL / 60) * doorMove;
		doorMoveR = renderer.sigmoid(entity.doorMoveR / 60) * doorMove;
	}catch(e){}
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, doorMoveL);
	door_LFa.render(renderer);
	GL11.glPopMatrix();
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, -doorMoveL);
	door_LBa.render(renderer);
	GL11.glPopMatrix();
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, doorMoveR);
	door_RFa.render(renderer);
	GL11.glPopMatrix();
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, -doorMoveR);
	door_RBa.render(renderer);
	GL11.glPopMatrix();
}
//##### render_パンタ ####################
function render_panta(entity,pantaDistance,pantaType){
	var pantaState = 0.0,
		pDis = pantaDistance;
	try{
		pantaState = renderer.sigmoid(entity.pantograph_F / 40);
	}catch(e){}
	switch(pantaType){
		case "W51" :
			var pCro1 = pantaState * 15 + 14,
				pCro2 = pantaState * 35 + 24,
				pCro4 = pantaState * 36 + 24,
				pCro5 = pantaState * 38 + 28;
			break;
		case "Compatible" :
			var pCro1 = pantaState * 14,
				pCro2 = pantaState * 24,
				pCro4 = pantaState * 24,
				pCro5 = pantaState * 28;
			break;
		default :
			var pCro1 = pantaState * 29,
				pCro2 = pantaState * 59,
				pCro4 = pantaState * 60,
				pCro5 = pantaState * 66;
			break;
	}
	pantabase.render(renderer);
	//パンタC1
	GL11.glPushMatrix();
	renderer.rotate(pCro1, 'X', 0.0, 3.0118, pDis-0.314);
	pantaC11.render(renderer);
			GL11.glPushMatrix();
			renderer.rotate(-pCro4, 'X', 0.0, 3.6084, pDis+0.7523);
			pantaC14.render(renderer);
			GL11.glPopMatrix();
		renderer.rotate(-pCro2, 'X', 0.0, 3.7151, pDis+0.8641);
		pantaC12.render(renderer);
			GL11.glPushMatrix();
			renderer.rotate(pCro2-pCro1, 'X', 0.0, 4.5998, pDis-0.6186);
			pantaC13.render(renderer);
			GL11.glPopMatrix();
			renderer.rotate(pCro5, 'X', 0.0, 3.5258, pDis+0.9758);
			pantaC15.render(renderer);
	GL11.glPopMatrix();	
	//パンタD2
	GL11.glPushMatrix();
	renderer.rotate(-pCro1, 'X', 0.0, 3.0118, -pDis+0.314);
	pantaD21.render(renderer);
			GL11.glPushMatrix();
			renderer.rotate(pCro4, 'X', 0.0, 3.6084, -pDis-0.7523);
			pantaD24.render(renderer);
			GL11.glPopMatrix();
		renderer.rotate(pCro2, 'X', 0.0, 3.7151, -pDis-0.8641);
		pantaD22.render(renderer);
			GL11.glPushMatrix();
			renderer.rotate(-pCro2+pCro1, 'X', 0.0, 4.5998, -pDis+0.6186);
			pantaD23.render(renderer);
			GL11.glPopMatrix();
			renderer.rotate(-pCro5, 'X', 0.0, 3.5258, -pDis-0.9758);
			pantaD25.render(renderer);
	GL11.glPopMatrix();
}

//## 車掌システム関数 ver 1.4 ##
function hi03_render_conductorSystem(entity, pass, par3) {
    //##  SETTINGS  ##
    var BuzzerKey = Keyboard.KEY_O;//ブザー
    var BellKey = Keyboard.KEY_L;//電鈴
    var DoorControlKey = Keyboard.KEY_LBRACKET;//ドア開閉
    var NextAnnounceKey = Keyboard.KEY_RIGHT;//次の放送
    var PrevAnnounceKey = Keyboard.KEY_LEFT;//前の放送
    var AnnounceKey = Keyboard.KEY_I;//車内放送
    var EBKey = Keyboard.KEY_Q;//非常ブレーキ
    // END

    var player = MCWrapperClient.getPlayer();
    if (player && entity) {
        var dataMap = entity.getResourceState().getDataMap();
        var getPacketName = function (name) { return "hi03_keys_" + player.func_145782_y() + name; };
        var sendKeyData = function(name, key){
            var prevInput = dataMap.getBoolean(getPacketName(name));
            var input = Keyboard.isKeyDown(key);
            if(input !== prevInput) dataMap.setBoolean(getPacketName(name), input, 1);
        };
        sendKeyData("BuzzerKey", BuzzerKey);
        sendKeyData("BellKey", BellKey);
        sendKeyData("DoorControlKey", DoorControlKey);
        sendKeyData("NextAnnounceKey", NextAnnounceKey);
        sendKeyData("PrevAnnounceKey", PrevAnnounceKey);
        sendKeyData("AnnounceKey", AnnounceKey);
        sendKeyData("EBKey", EBKey);
    }
}

//すずみや製運番スクリプト
function suzu_unban_script(entity) {
	var version = MCVersionChecker();
    if (entity != null) {
		
        var sz_u1 = entity.getResourceState().getDataMap().getInt("Button0");
        var sz_u2 = entity.getResourceState().getDataMap().getInt("Button1");
        var sz_u3 = entity.getResourceState().getDataMap().getInt("Button2");
        var sz_u4 = entity.getResourceState().getDataMap().getInt("Button3");
        var sz_u5 = entity.getResourceState().getDataMap().getInt("Button4");
		

	var sz_u1 = Math.floor(sz_u1);
	sz_u1_[sz_u1].render(renderer);

	var sz_u2 = Math.floor(sz_u2);
	sz_u2_[sz_u2].render(renderer);

	var sz_u3 = Math.floor(sz_u3);
	sz_u3_[sz_u3].render(renderer);

	var sz_u4 = Math.floor(sz_u4);
	sz_u4_[sz_u4].render(renderer);

	var sz_u5 = Math.floor(sz_u5);
	sz_u5_[sz_u5].render(renderer);
		
}
}