
importPackage(Packages.jp.ngt.rtm);//RTMCore
importPackage(Packages.jp.ngt.rtm.entity.train.util);//TrainStateType FormationManager
importPackage(Packages.net.minecraft.util);//ResourceLocation
importPackage(Packages.net.minecraft.entity.player);//EntityPlayer
importPackage(Packages.jp.ngt.ngtlib.io);//NGTLog

function onUpdate(entity, scriptExecuter) {
    
    //車掌スクリプト呼び出し
    hi03_server_conductorSystem(entity, scriptExecuter);
}

//## 車掌システム関数 ver 1.4 ##
function hi03_server_conductorSystem(entity, scriptExecuter) {

    //##  SETTINGS  ##
    var IsDoubleCab = false;//両運転台
    var CabPosMinZ = 8.3;//客室仕切りZ座標
    var CabPosMaxZ = 10.0;//前面Z座標
    var CabPosX = 2.0;//X方向の判定(中心からの距離)

    var setTrainState = function (id, state) {
        if (RTMCore.VERSION.indexOf("1.7.10") !== -1) entity.setTrainStateData(id, state);
        else entity.setVehicleState(TrainState.getStateType(id), state);
    };
    var playsound = function (path) {
        if (RTMCore.VERSION.indexOf("1.7.10") !== -1) {
            var loc = path.split(":");
            path = new ResourceLocation(loc[0], loc[1]);
        }
        var formation = entity.getFormation();
        if (formation) {
            for (var i = 0; i < formation.size(); i++) {
                RTMCore.proxy.playSound(formation.get(i).train, path, 1, 1);
            }
        }
    };
    var dataMap = entity.getResourceState().getDataMap();
    var world = entity.field_70170_p;
    var loadedEntityList = world.field_72996_f;
    var playerList = [];
    var trainVec = new Packages.jp.ngt.ngtlib.math.Vec3(entity.field_70165_t, entity.field_70163_u, entity.field_70161_v);
    var yaw = -entity.field_70177_z;
    for (var i = 0; i < loadedEntityList.size(); i++) {
        var target = loadedEntityList.get(i);
        if (target instanceof EntityPlayer) {
            var playerVec = new Packages.jp.ngt.ngtlib.math.Vec3(target.field_70165_t, target.field_70163_u, target.field_70161_v);
            var targetVec = playerVec.sub(trainVec).rotateAroundY(yaw);
            var x = targetVec.getX();
            var y = targetVec.getY();
            var z = targetVec.getZ();
            if (((-CabPosX < x && x < CabPosX) && (CabPosMinZ < z && z < CabPosMaxZ) && (-0.5 < y && y < 2.0)) ||
                (IsDoubleCab && (-CabPosX < x && x < CabPosX) && (-CabPosMinZ > z && z > -CabPosMaxZ) && (-0.5 < y && y < 2.0))
            ) {
                playerList.push([target, x < 0]);
            }
        }
    }
    var pushBuzzer = false;
    var pushBell = false;
    var pushNextAnnounce = false;
    var pushPrevAnnounce = false;
    var pushPlayAnnounce = false;
    var pushEB = false;
    var pushDoorSwitch = false;
    var changer = null;
    var isLeftSide = false;
    for (var i = 0; i < playerList.length; i++) {
        var player = playerList[i][0];
        var getPacketName = function (name) { return "hi03_keys_" + player.func_145782_y() + name; };
        var isInputKey = function (name, isOnce) {
            var f1 = dataMap.getBoolean(getPacketName(name));
            var f2 = dataMap.getBoolean(getPacketName(name) + "_prev");
            dataMap.setBoolean(getPacketName(name) + "_prev", f1, 0);
            return (isOnce ? (f1 && !f2) : f1);
        }
        var isOperator = (function () {
            if (RTMCore.VERSION.indexOf("1.7.10") !== -1) return entity.field_70153_n !== player;
            var list = entity.func_184188_bt();
            return list.isEmpty() ? true : entity.func_184188_bt().get(0) !== player;
        })();
        //ブザー
        if (isInputKey("BuzzerKey", false)) pushBuzzer = true;
        //電鈴
        if (isInputKey("BellKey", true)) pushBell = true;
        if (isOperator) {
            //アナウンス
            if (isInputKey("NextAnnounceKey", true)) {
                pushNextAnnounce = true;
                changer = player;
            }
            if (isInputKey("PrevAnnounceKey", true)) {
                pushPrevAnnounce = true;
                changer = player;
            }
            if (isInputKey("AnnounceKey", true)) {
                pushPlayAnnounce = true;
            }
            //非常制動
            if (isInputKey("EBKey", true)) pushEB = true;
            //ドア
            if (isInputKey("DoorControlKey", true)) {
                pushDoorSwitch = true;
                isLeftSide = playerList[i][1];
            }
        }
    }
    dataMap.setBoolean("hi03_isBuzzer", pushBuzzer, 1);
    dataMap.setBoolean("hi03_isBell", pushBell, 1);
    dataMap.setBoolean("hi03_isEB", pushEB, 1);
    var formation = entity.getFormation();
    if (!formation) {
        formation = FormationManager.getInstance().createNewFormation(entity);
        entity.setFormation(formation);
    }
    if (entity.isControlCar()) {
        var isBuzzerFormation = false;
        var isBellFormation = false;
        for (var i = 0; i < formation.size(); i++) {//取得用のfor
            if (!formation.get(i)) continue;
            var train = formation.get(i).train;
            if (!train) continue;
            var trainDM = train.getResourceState().getDataMap();
            //ブザー
            var isBuzzer = trainDM.getBoolean("hi03_isBuzzer");
            if (isBuzzer) isBuzzerFormation = true;
            //電鈴
            var isBell = trainDM.getBoolean("hi03_isBell");
            if (isBell) isBellFormation = true;
            //非常制動
            var isEB = trainDM.getBoolean("hi03_isEB");
            if (isEB) entity.setNotch(-8);
        }
        for (var i = 0; i < formation.size(); i++) {//更新用のfor
            if (!formation.get(i)) continue;
            var train = formation.get(i).train;
            if (!train) continue;
            var trainDM = train.getResourceState().getDataMap();
            //ブザー
            trainDM.setBoolean("hi03_isBuzzerFormation", isBuzzerFormation, 1);
            //電鈴
            trainDM.setBoolean("hi03_isBellFormation", isBellFormation, 1);
        }
    }
    //アナウンス
    var announceIndex = entity.getTrainStateData(9);
    var announceList = entity.getResourceState().getResourceSet().getConfig().sound_Announcement;
    var announceMax = announceList.length - 1;
    if (pushNextAnnounce) announceIndex++;
    if (pushPrevAnnounce) announceIndex--;
    announceIndex = announceIndex < 0 ? announceMax : (announceIndex > announceMax ? 0 : announceIndex);
    if (pushNextAnnounce || pushPrevAnnounce) {
        NGTLog.sendChatMessage(changer, "Current announce:" + announceList[announceIndex][0]);
        setTrainState(9, announceIndex);
    }
    if (pushPlayAnnounce) playsound(announceList[announceIndex][1]);
    //ドア
    var doorState = entity.getTrainStateData(4);
    var trainDir = entity.getTrainDirection();
    var isLOpen = (doorState & 0x1) === 0x1;
    var isROpen = (doorState & 0x2) === 0x2;
    if (pushDoorSwitch) {
        if (isLeftSide) isLOpen = !isLOpen;
        else isROpen = !isROpen;
        if (trainDir) doorState = isLOpen << 1 | isROpen;
        else doorState = isROpen << 1 | isLOpen;
        setTrainState(4, doorState);
    }
}