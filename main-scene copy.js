class Assignment_Two_Skeleton extends Scene_Component {
    // The scene begins by requesting the camera, shapes, and materials it will need.
    constructor(context, control_box) {
        super(context, control_box);

        // First, include a secondary Scene that provides movement controls:
        if(!context.globals.has_controls)
            context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

        // Locate the camera here (inverted matrix).
        const r = context.width / context.height;
        context.globals.graphics_state.camera_transform = Mat4.translation([0, 0, -35]);
        context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

        // At the beginning of our program, load one of each of these shape
        // definitions onto the GPU.  NOTE:  Only do this ONCE per shape
        // design.  Once you've told the GPU what the design of a cube is,
        // it would be redundant to tell it again.  You should just re-use
        // the one called "box" more than once in display() to draw
        // multiple cubes.  Don't define more than one blueprint for the
        // same thing here.
        const shapes = {
            'square': new Square(),
            'circle': new Circle(15),
            'pyramid': new Tetrahedron(false),
            'simplebox': new SimpleCube(),
            'box': new Cube(),
            'cylinder': new Cylinder(15),
            'cone': new Cone(20),
            'ball': new Subdivision_Sphere(4),
            'path' : new Path(),
            'right_turn' : new RightTurn(),
            'left_turn' : new LeftTurn(),
            'arch': new Arch()
        }
        this.submit_shapes(context, shapes);
        this.shape_count = Object.keys(shapes).length;

        // Make some Material objects available to you:
        this.clay = context.get_instance(Phong_Shader).material(Color.of(.9, .5, .9, 1), {
            ambient: .4,
            diffusivity: .4
        });

        this.difclay = context.get_instance(Phong_Shader).material(Color.of(1, 1, 0, 1), {
            ambient: .4,
            diffusivity: .4
        });

        this.plastic = this.clay.override({
            specularity: .6
        });
        this.texture_base = context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {
            ambient: 1,
            diffusivity: 0.4,
            specularity: 0.3
        });

        // Load some textures for the demo shapes
        this.shape_materials = {};
        const shape_textures = {
            square: "assets/butterfly.png",
            box: "assets/even-dice-cubemap.png",
            ball: "assets/soccer_sph_s_resize.png",
            cylinder: "assets/treebark.png",
            pyramid: "assets/tetrahedron-texture2.png",
            simplebox: "assets/tetrahedron-texture2.png",
            cone: "assets/hypnosis.jpg",
            circle: "assets/hypnosis.jpg",
            fire: "assets/fire.png"
        };
        for (let t in shape_textures)
            this.shape_materials[t] = this.texture_base.override({
                texture: context.get_instance(shape_textures[t])
            });
        
        this.lights = [new Light(Vec.of(10, 10, 20, 1), Color.of(1, .4, 1, 1), 100000)];

        this.t = 0;


        // CODE FOR FIRE PARTICLES ---------------------------------------------------------------------
        this.rotation_count = 0;
        this.jumpStartTime = 0;
        this.currentlyJumping = 0;
        this.jumpHeight = 0;

        this.XZposition = Mat4.translation(Vec.of(0,0,0));
        this.time_of_turn = 0;

        const numGens = 3;
        this.thisPath = 'S';

        for(let n = 0; n <= numGens; n++){
            this.thisPath = this.generate_path_complex(this.thisPath);
        }

        this.bright = [];
        this.x = [];
        this.y = [];
        this.z = [];
        this.xVel = [];

        this.numparticles = 250;
        this.xMax = 15;          // initial position scalars
        this.yMax = 0;
        this.zMax = 2;
        this.velocity = 1;      // initial velocity scalar

        for (var i = 0; i < this.numparticles; i ++) {
            this.bright.push(.2 + Math.random());

            this.x.push(this.xMax*(Math.random()-0.5));
            this.y.push(1 + this.yMax*Math.random());
            this.z.push(this.zMax*(Math.random()-0.5));
            this.xVel.push(this.velocity*(Math.random()-0.5));
        }

    }


    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
    make_control_panel() {
         this.key_triggered_button("Pause Time", ["n"], () => {
            this.paused = !this.paused;
        });
        this.key_triggered_button("Turn Left", ["h"], () => {
            this.Turn_Left = !this.Turn_Left;
        });
         this.key_triggered_button("Turn Right", ["k"], () => {
            this.Turn_Right = !this.Turn_Right;
        });
         this.key_triggered_button("Jump", ["u"], () => {
            this.Jump = !this.Jump;
        });
    }
       


    display(graphics_state) {
        // Use the lights stored in this.lights.
        graphics_state.lights = this.lights;
                
        // Find how much time has passed in seconds, and use that to place shapes.
        if (!this.paused)
            this.t += graphics_state.animation_delta_time / 1000;
        const t = this.t;

        //Begin Stephen's code
        
        let Floor_Center = Mat4.translation(Vec.of(0,0,0)).times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0)));


        let gravity = -10;
        let jumpTime = 3;
        let Up_Velocity = -gravity*jumpTime/2;
        
        let RunSpeed = 25;

        let Speed = 3;
        let Bone_Thickness = 0.1;

        let Pelvis_Height = 2;
        let Torso_Length = 1;
        let Torso_Tilt = Math.PI/8

        this.jumpHeight = (Up_Velocity*(t-this.jumpStartTime)+gravity*0.5*(t-this.jumpStartTime)*(t-this.jumpStartTime))*this.currentlyJumping;
        let Variable_Transforms = this.XZposition.times(Mat4.translation(Vec.of(0,0,-RunSpeed*(t-this.time_of_turn)))).times(Mat4.translation(Vec.of(0,this.jumpHeight,0)));

        let Torso_Center = Variable_Transforms.times(Floor_Center).times(Mat4.translation(Vec.of(0,0,-1*(Pelvis_Height+Torso_Length)))).times(Mat4.rotation(-Torso_Tilt,Vec.of(1,0,0)));
        
        graphics_state.camera_transform = Mat4.translation(Vec.of(0,-10,-35)).times(Mat4.inverse(Variable_Transforms));

        //this.shapes.square.draw(graphics_state, (Floor_Center).times(Mat4.scale(Vec.of(400,400,400))), this.shape_materials[1]|| this.difclay);
        

        if (this.Turn_Left){
            this.XZposition = this.XZposition.times(Mat4.translation(Vec.of(0,0,-RunSpeed*(t-this.time_of_turn)))).times(Mat4.rotation(Math.PI*(1)/2, Vec.of(0,1,0)));
            this.time_of_turn = t; 
            this.Turn_Left = false;
         }
               
        if(this.Turn_Right){
          this.XZposition = this.XZposition.times(Mat4.translation(Vec.of(0,0,-RunSpeed*(t-this.time_of_turn)))).times(Mat4.rotation(Math.PI*(-1)/2, Vec.of(0,1,0)));
          this.time_of_turn = t;
          this.Turn_Right = false;
        }


        if(this.Jump){
           this.jumpStartTime = t;
           this.currentlyJumping = 1;
            this.Jump = false;
        }

        if(this.currentlyJumping > 0)
        {
            if((t-this.jumpStartTime) > jumpTime){
                this.currentlyJumping = 0;
            }
        }


        //Draw Body

        this.shapes.simplebox.draw(graphics_state, Torso_Center.times(Mat4.scale(Vec.of(Bone_Thickness,Bone_Thickness, Torso_Length))), this.shape_materials[1]|| this.plastic);

        let Shoulders_Center = Torso_Center.times(Mat4.translation(Vec.of(0,0,-1*(Torso_Length+Bone_Thickness))));


        let Shoulder_Length = Torso_Length * 0.75;

        this.shapes.simplebox.draw(graphics_state, Shoulders_Center.times(Mat4.scale(Vec.of(Shoulder_Length, Bone_Thickness, Bone_Thickness))), this.shape_materials[1]|| this.plastic);



        let Pelvis_Center = Torso_Center.times(Mat4.translation(Vec.of(0,0,Torso_Length+Bone_Thickness)))
        this.shapes.simplebox.draw(graphics_state, Pelvis_Center.times(Mat4.scale(Vec.of(Shoulder_Length, Bone_Thickness, Bone_Thickness))), this.shape_materials[1]||this.plastic);

        let Thigh_Length = Pelvis_Height/4;
        let Shin_Length = Pelvis_Height/4;
        let Left_Thigh_Rotation = (Math.PI/4)*( Math.sin(Speed*t) +1);
        let Left_Shin_Rotation = Left_Thigh_Rotation;
        let Right_Thigh_Rotation = (Math.PI/4)*(-1*Math.sin(Speed*t) +1);
        let Right_Shin_Rotation = Right_Thigh_Rotation;

        let Left_Thigh = Pelvis_Center.times(Mat4.translation(Vec.of(-1*(Shoulder_Length+Bone_Thickness), 0,Thigh_Length - Bone_Thickness))).times(Mat4.translation(Vec.of(0,0, -Thigh_Length + Bone_Thickness))).times(Mat4.rotation(Left_Thigh_Rotation, Vec.of(1,0,0))).times(Mat4.translation(Vec.of(0,0,-Bone_Thickness+Thigh_Length)));    
        this.shapes.simplebox.draw(graphics_state, Left_Thigh.times(Mat4.scale(Vec.of(Bone_Thickness, Bone_Thickness, Thigh_Length))), this.shape_materials[1]||this.plastic);
        

        let Left_Shin = Left_Thigh.times(Mat4.translation(Vec.of(0,0,Thigh_Length+Shin_Length))).times(Mat4.translation(Vec.of(0,1*Bone_Thickness,-1*Shin_Length))).times(Mat4.rotation(Left_Shin_Rotation, Vec.of(-1,0,0))).times(Mat4.translation(Vec.of(0,-1*Bone_Thickness,Shin_Length)));
        this.shapes.simplebox.draw(graphics_state, Left_Shin.times(Mat4.scale(Vec.of(Bone_Thickness, Bone_Thickness, Shin_Length))), this.shape_materials[1]||this.plastic);


        let Right_Thigh = Pelvis_Center.times(Mat4.translation(Vec.of(Shoulder_Length+Bone_Thickness, 0 ,Thigh_Length - Bone_Thickness))).times(Mat4.translation(Vec.of(0,0, -Thigh_Length + Bone_Thickness))).times(Mat4.rotation(Right_Thigh_Rotation, Vec.of(1,0,0))).times(Mat4.translation(Vec.of(0,0,-Bone_Thickness+Thigh_Length)));
        this.shapes.simplebox.draw(graphics_state, Right_Thigh.times(Mat4.scale(Vec.of(Bone_Thickness, Bone_Thickness, Thigh_Length))), this.shape_materials[1]||this.plastic);
        
        let Right_Shin = Right_Thigh.times(Mat4.translation(Vec.of(0,0,Thigh_Length+Shin_Length))).times(Mat4.translation(Vec.of(0,1*Bone_Thickness,-1*Shin_Length))).times(Mat4.rotation(Right_Shin_Rotation, Vec.of(-1,0,0))).times(Mat4.translation(Vec.of(0,-1*Bone_Thickness,Shin_Length)));
        this.shapes.simplebox.draw(graphics_state, Right_Shin.times(Mat4.scale(Vec.of(Bone_Thickness, Bone_Thickness, Shin_Length))), this.shape_materials[1]||this.plastic);

        
        let Arm_Length = Thigh_Length*0.75;
        let Forearm_Length = Arm_Length;

        let Right_Arm_Rotation = (Math.PI/2)*(Math.sin(Speed*t));
        let Left_Arm_Rotation = (Math.PI/2)*(Math.sin(-Speed*t));
        let Right_Forearm_Rotation = -(Math.PI/4)*(Math.sin(-Speed*t)+2);
        let Left_Forearm_Rotation = -(Math.PI/4)*(Math.sin(Speed*t)+2)

        let Left_Arm = Shoulders_Center.times(Mat4.translation(Vec.of(-1*(Shoulder_Length+Bone_Thickness), 0,Arm_Length - Bone_Thickness))).times(Mat4.translation(Vec.of(0,0, -Arm_Length + Bone_Thickness))).times(Mat4.rotation(Left_Arm_Rotation, Vec.of(1,0,0))).times(Mat4.translation(Vec.of(0,0,-Bone_Thickness+Arm_Length)));    
        this.shapes.simplebox.draw(graphics_state, Left_Arm.times(Mat4.scale(Vec.of(Bone_Thickness, Bone_Thickness, Arm_Length))), this.shape_materials[1]||this.plastic);
        
        let Left_Forearm = Left_Arm.times(Mat4.translation(Vec.of(0,0,Arm_Length+Forearm_Length))).times(Mat4.translation(Vec.of(0,-1*Bone_Thickness,-1*Forearm_Length))).times(Mat4.rotation(Left_Forearm_Rotation, Vec.of(-1,0,0))).times(Mat4.translation(Vec.of(0,1*Bone_Thickness,Forearm_Length)));
        this.shapes.simplebox.draw(graphics_state, Left_Forearm.times(Mat4.scale(Vec.of(Bone_Thickness, Bone_Thickness, Forearm_Length))), this.shape_materials[1]||this.plastic);

        let Right_Arm = Shoulders_Center.times(Mat4.translation(Vec.of(1*(Shoulder_Length+Bone_Thickness), 0,Arm_Length - Bone_Thickness))).times(Mat4.translation(Vec.of(0,0, -Arm_Length + Bone_Thickness))).times(Mat4.rotation(Right_Arm_Rotation, Vec.of(1,0,0))).times(Mat4.translation(Vec.of(0,0,-Bone_Thickness+Arm_Length)));    
        this.shapes.simplebox.draw(graphics_state, Right_Arm.times(Mat4.scale(Vec.of(Bone_Thickness, Bone_Thickness, Arm_Length))), this.shape_materials[1]||this.plastic);
        
        let Right_Forearm = Right_Arm.times(Mat4.translation(Vec.of(0,0,Arm_Length+Forearm_Length))).times(Mat4.translation(Vec.of(0,-1*Bone_Thickness,-1*Forearm_Length))).times(Mat4.rotation(Right_Forearm_Rotation, Vec.of(-1,0,0))).times(Mat4.translation(Vec.of(0,1*Bone_Thickness,Forearm_Length)));
        this.shapes.simplebox.draw(graphics_state, Right_Forearm.times(Mat4.scale(Vec.of(Bone_Thickness, Bone_Thickness, Forearm_Length))), this.shape_materials[1]||this.plastic);

        let Neck_Length = Torso_Length/5;
        let Neck_Rotation = 0;  

        let Neck = Shoulders_Center.times(Mat4.translation(Vec.of(0,0,-1*(Bone_Thickness+Neck_Length)))).times(Mat4.rotation(Neck_Rotation, Vec.of(0,0,1)));
        this.shapes.simplebox.draw(graphics_state, Neck.times(Mat4.scale(Vec.of(Bone_Thickness, Bone_Thickness, Neck_Length))), this.plastic);  
        

        let Head_Size = 2*Neck_Length
        let Head = Neck.times(Mat4.translation(Vec.of(0,0, -1*(Neck_Length + Head_Size))));

        this.shapes.ball.draw(graphics_state, Head.times(Mat4.scale(Vec.of(Head_Size,Head_Size, Head_Size))), this.plastic);








        //End Stephen's code

        
        let m = Mat4.identity();
        let numR = 0;
        let numL = 0;

        
        
        for(let i = 0; i<this.thisPath.length; i++){

            switch(this.thisPath.charAt(i)){
                case 'S':
                    m = this.draw_arch(graphics_state, m);
                    m = this.draw_path(graphics_state, m);
                    break;
                case 'R':
                    if(numR!=2){
                        m = this.draw_R_turn(graphics_state, m);
                        numR++;
                        numL = 0;
                    } else {
                        m = this.draw_L_turn(graphics_state, m);
                        numL++;
                        numR = 0;
                    }
                    break;
                case 'L':
                    if(numL!=2){
                        m = this.draw_L_turn(graphics_state, m);
                        numL++;
                        numR = 0;
                    } else {
                        m = this.draw_R_turn(graphics_state, m);
                        numR++;
                        numL = 0;
                    }
                    break;
                case 'F':
                    m = this.draw_fire(graphics_state, m, this.bright);
                    break;
                case 'P':
                    m = this.draw_tile(graphics_state, m);

            }

        }
        
        m = m.times(Mat4.translation(Vec.of(0, 0, 9)));
        this.draw_arch(graphics_state, m);

/*  
*/  


    }

    draw_tile(graphics_state, m){
        this.shapes['path'].draw(
            graphics_state,
            m,
            this.shape_materials['cylinder'] );
        
        return m.times(Mat4.translation(Vec.of(0, 0, -20)));
    }

    draw_path(graphics_state, m){
        
        m = this.draw_tile(graphics_state, m);
        m = this.draw_tile(graphics_state, m);

        return m;                 
    }

    draw_R_turn(graphics_state, m){

        this.shapes['right_turn'].draw(
            graphics_state,
            m,
            this.shape_materials['cylinder'] );
        
        m = m.times(Mat4.rotation(-Math.PI/2, Vec.of(0,1,0))).times(Mat4.translation(Vec.of(-2, 0, -22)));

        return this.draw_path(graphics_state, m);
    }

    draw_L_turn(graphics_state, m){

        this.shapes['left_turn'].draw(
            graphics_state,
            m,
            this.shape_materials['cylinder'] );
        
        m = m.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0))).times(Mat4.translation(Vec.of(2, 0, -22)));

        return this.draw_path(graphics_state, m);        
    }

     draw_fire(graphics_state, m, bright) {
        
        this.draw_tile(graphics_state,m);
       
        let mScale = Mat4.scale(Vec.of(0.3,0.3,0.3));

        // update them, and draw them
        for (var i = 0; i < this.numparticles; i++) {

            // update brightness, velocity, position
            this.bright[i] = this.bright[i] - 0.01*Math.random();
            this.xVel[i] = this.xVel[i]*(2.5*(Math.random() - 0.5));


            this.x[i] = this.x[i] + this.xVel[i];
            //this.x[i] = this.x[i] + 0.2*(Math.random() - 0.5);
            this.y[i] = this.y[i] + 0.03*Math.random();
            this.z[i] = this.z[i] + 0.1*(Math.random() - 0.5);

            
            // particle is dead, must be "respawned"
            if (this.bright[i] <= .3) {
                this.bright[i] = .3 + Math.random();
                this.x[i] = this.xMax*(Math.random()-0.5);
                this.y[i] = 2 + this.yMax*Math.random();
                this.z[i] = this.zMax*(Math.random()-0.5);
                this.xVel[i] = this.velocity*(Math.random()-0.5);
            }


            let position = Vec.of(this.x[i], this.y[i], this.z[i]);

            // draw particle
            this.shapes.circle.draw(
                graphics_state, m.times(Mat4.translation(position)).times(mScale),
                this.clay.override({color: Color.of(2*this.bright[i], bright[i], 0, bright[i])})
            )
        }
        
        return this.draw_tile(graphics_state,m);
    }

    draw_arch(graphics_state, m){
        this.shapes['arch'].draw(
            graphics_state,
            m,
            this.shape_materials['fire'] );
        
        return m.times(Mat4.translation(Vec.of(0, 0, -12)));
        
    }

    generate_path(str){
        let newPath = '';
        let mostRecentTurn = 'R';
        for(var i = 0; i<str.length; i++){

            switch(str.charAt(i)){
                case 'S':
                    newPath = newPath + 'SF';
                    break;
                case 'R':
                    newPath = newPath + 'FL';
                    mostRecentTurn = 'L';
                    break;
                case 'L':
                    newPath = newPath + 'FR';
                    mostRecentTurn = 'R';
                    break;
                case 'F':
                    if(mostRecentTurn=='R'){
                        newPath = newPath + 'LFR';
                    } else {
                        newPath = newPath + 'RFL';
                        mostRecentTurn = 'L'
                    }
            }
        }
        return newPath;
    }
    

    generate_path_complex(str){
        var R_turns = ['FL','FPL','FRL'];
        var L_turns = ['FR','PRF','RPL'];
        var fire = ['LFR','RFL','RPR'];
        var path = ['LP','RP','FP'];


        let newPath = '';
        let mostRecentTurn = 'R';
        for(var i = 0; i<str.length; i++){
            let rand = Math.floor(Math.random()*3);

            switch(str.charAt(i)){
                case 'S':
                    newPath = newPath + 'SF';
                    break;
                case 'R':
                    newPath = newPath + R_turns[rand];
                    //mostRecentTurn = 'L';
                    break;
                case 'L':
                    newPath = newPath + L_turns[rand];
                    //mostRecentTurn = 'R';
                    break;
                case 'F':
                    newPath = newPath + fire[rand];
                    break;
                case 'P':
                    newPath = newPath + path[rand];
            }
        }
        return newPath;
    }

}

window.Assignment_Two_Skeleton = window.classes.Assignment_Two_Skeleton = Assignment_Two_Skeleton;
