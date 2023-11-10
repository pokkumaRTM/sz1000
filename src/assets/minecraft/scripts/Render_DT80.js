var renderClass = "jp.ngt.rtm.render.VehiclePartsRenderer";
importPackage(Packages.org.lwjgl.opengl);
importPackage(Packages.jp.ngt.rtm.render);
importPackage(Packages.jp.ngt.ngtlib.math);

function init(par1, par2){
    wheel_F = renderer.registerParts(new Parts("flange_F", "wheel_F", "axle_F"));
	wheel_R = renderer.registerParts(new Parts("flange_R", "wheel_R", "axle_R"));
    frame = renderer.registerParts(new Parts("frame1", "frame2", "box1", "box2",
    "U", "rod1", "rod2", "joint1", "suspension-bearing", "suspension-axis", "suspension",
    "suspension-cover", "box", "pillar", "rubber1", "joint2", "rubber2", "brake1",
    "brake2", "brake3", "brake4", "yaw-damper-joint1", "yaw-damper-joint2", "yaw-damper",
    "yaw-damper-joint3"));
}

function render(entity, pass, par3){
    var wheelRotation = renderer.getWheelRotationR(entity);
	var y = -0.5748
	var z = 1.05

	frame.render(renderer);
	
	GL11.glPushMatrix();
	renderer.rotate(wheelRotation, 'X', 0, y, z);
	wheel_F.render(renderer);
	GL11.glPopMatrix();

	GL11.glPushMatrix();
	renderer.rotate(wheelRotation, 'X', 0, y, -z);
	wheel_R.render(renderer);
	GL11.glPopMatrix();
}
