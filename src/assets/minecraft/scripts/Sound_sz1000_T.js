//SoundLib等外部の走行音を読み込む場合はsoundLibPathに書く
//例) var soundLibPath = "scripts/sound_223.js";
var soundLibPath = "scripts/SuzumiyaLib_HtFullSic_T.js";

importPackage(Packages.jp.ngt.rtm.modelpack);//ModelPackManager
importPackage(Packages.jp.ngt.ngtlib.io);//NGTText
importPackage(Packages.jp.ngt.ngtlib.util);
importPackage(Packages.jp.ngt.rtm.sound);
importPackage(Packages.jp.ngt.rtm);//RTMCore
importPackage(Packages.net.minecraft.util);//ResourceLocation
importPackage(Packages.org.lwjgl.opengl);
importPackage(Packages.jp.ngt.rtm.render);
importPackage(Packages.jp.ngt.ngtlib.math);
importPackage(Packages.jp.ngt.rtm.entity.train.util);
importPackage(Packages.org.lwjgl.input);

function onUpdate(su) {

    if (soundLibPath === "") sound_playJsonStyle(su);
    else sound_includeSoundLib(su);

	//車掌スクリプト呼び出し
    hi03_sound_conductorSystem(su);

    //車外メロディ呼び出し
    suzu_depmelo_script(su);
}

var soundLibFunction = (function includeScripts() {
    var append = function (list) {
        var sb = new java.lang.StringBuilder();
        for (var i = 0; i < list.size(); i++) { sb.append(list.get(i) + "\n"); }
        return sb.toString();
    }
    return append(NGTText.readText(ModelPackManager.INSTANCE.getResource(soundLibPath)));
})();
function sound_includeSoundLib(su) {
    eval(soundLibFunction);
    onUpdate(su);
}

function sound_playJsonStyle(su) {
    var entity = su.getEntity();
    var speed = entity.getSpeed();
    var notch = entity.getNotch();
    var config = entity.getResourceState().getResourceSet().getConfig();
    var n1 = config.maxSpeed[0];
    var n5 = config.maxSpeed[4];
    var soundData = function (resource) {
        this.isPlaying = false;
        this.pit = 1.0;
        this.vol = 1.0;
        var resourceData = resource.split(":");
        if (resourceData.length < 2) {
            this.dmain = "rtm";
            this.path = resource;
        }
        else {
            this.dmain = resourceData[0];
            this.path = resourceData[1];
        }
    }
    soundData.prototype = {
        setPlaying: function (pit, vol) {
            this.pit = pit;
            this.vol = vol;
            this.isPlaying = true;
        },
        playSound: function () {
            if (this.isPlaying) su.playSound(this.dmain, this.path, this.vol, this.pit, true);
            else su.stopSound(this.dmain, this.path);
        }
    }
    var sound_Acceleration = new soundData(config.sound_Acceleration);
    var sound_Deceleration = new soundData(config.sound_Deceleration);
    var sound_D_S = new soundData(config.sound_D_S);
    var sound_S_A = new soundData(config.sound_S_A);
    var sound_Stop = new soundData(config.sound_Stop);
    if (speed > 0.0) {
        if (speed < n1) {
            if (notch > 0) sound_S_A.setPlaying(1.0, 1.0);
            else sound_D_S.setPlaying(1.0, 1.0);
        }
        else {
            var pit = (speed - n1) / (n5 - n1) + 1.0;
            if (notch > 0) sound_Acceleration.setPlaying(pit, 1.0);
            else sound_Deceleration.setPlaying(pit, 1.0);
        }
    }
    else sound_Stop.setPlaying(1.0, 1.0);
    sound_Acceleration.playSound();
    sound_Deceleration.playSound();
    sound_D_S.playSound();
    sound_S_A.playSound();
    sound_Stop.playSound();
}

//## 車掌システム関数 ver 1.4 ##
function hi03_sound_conductorSystem(su) {

    //## SETTINGS ##
    var BuzzerPath = "";//ブザー(ループ)
    var BellPath = "sound_mugenlib:RTMLib.sound.Buz_1";//電鈴(非ループ)
    // END

    var entity = su.getEntity();
    var dataMap = entity.getResourceState().getDataMap();
    var playsound = function (path) {
        if (RTMCore.VERSION.indexOf("1.7.10") !== -1) {
            var loc = path.split(":");
            path = new ResourceLocation(loc[0], loc[1]);
        }
        RTMCore.proxy.playSound(entity, path, 1, 1);
    };

    //ブザー
    var isBuzzer = dataMap.getBoolean("hi03_isBuzzerFormation");
    switch(BuzzerPath){
		case 1 :
			var buzzerSound = "sound_mugenlib:RTMLib.sound.Water_Crown_3" + BuzzerPath.split(":");
			break;
        case 2 :
            var buzzerSound = "sound_mugenlib:RTMLib.sound.Gota_del_Vient" + BuzzerPath.split(":");
            break;
        case 3 :
            var buzzerSound = "sound_szsoundlib:SZ-Orange-A" + BuzzerPath.split(":");
            break;
        case 4 :
            var buzzerSound = "sound_szsoundlib:SZ-Diary-A" + BuzzerPath.split(":");
            break;
        case 5 :
            var buzzerSound = "sound_szsoundlib:SZ-Diary-B" + BuzzerPath.split(":");
            break;
        case 6 :
            var buzzerSound = "sound_szsoundlib:SZ-Orange-B" + BuzzerPath.split(":");
            break;
		default :
        var buzzerSound = "sound_szsoundlib:sokusin" + BuzzerPath.split(":");
        break;
	}
    if (isBuzzer) su.playSound(buzzerSound[0], buzzerSound[1], 1, 1, true);
    else su.stopSound(buzzerSound[0], buzzerSound[1]);
    //電鈴
    var isBell = dataMap.getBoolean("hi03_isBellFormation");
    if (isBell) playsound(BellPath);
}

function suzu_depmelo_script(su) {
    // var dataMap = entity.getResourceState().getDataMap();
    // var melotype = dataMap.getInt("Button0");
    // //曲の選別
    // if(melotype = 0){
    //     var melo_d = "";
    //     var szdomain = "";
    // }else if(melotype = ""){
    //     var melo_d = "RTMLib.sound.Gota_del_Vient";
    //     var szdomain = "sound_mugenlib";
    // }else if(melotype = 2){
    //     var melo_d = "RTMLib.sound.Water_Crown_3";
    //     var szdomain = "sound_mugenlib";
    // }
    // //onかoffか
    // var onoroff = dataMap.getInt("Button1");
    // if(onoroff = 1){
    //     su.stopSound("sound_szsoundlib", "sokusin");
    //     su.playSound(szdomain, melo_d, 1, 1, true);
    // }else if(onoroff = 0){
    //     su.stopSound(szdomain, melo_d);
    //     su.playSound("sound_szsoundlib", "sokusin", 1, 1, false);
    // }
}