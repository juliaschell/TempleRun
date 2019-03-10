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
            'ball': new Subdivision_Sphere(4)
        }
        this.submit_shapes(context, shapes);
        this.shape_count = Object.keys(shapes).length;

        // Make some Material objects available to you:
        this.clay = context.get_instance(Phong_Shader).material(Color.of(.9, .5, .9, 1), {
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

        const numGens = 3;
        this.thisPath = 'S';

        for(let n = 0; n <= numGens; n++){
            this.thisPath = this.generate_path(this.thisPath);
        }
    }


    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
    make_control_panel() {
        this.key_triggered_button("Pause Time", ["n"], () => {
            this.paused = !this.paused;
        });
    }


    display(graphics_state) {
        // Use the lights stored in this.lights.
        graphics_state.lights = this.lights;
                
        // Find how much time has passed in seconds, and use that to place shapes.
        if (!this.paused)
            this.t += graphics_state.animation_delta_time / 1000;
        const t = this.t;

        
        let m = Mat4.identity();
        let numR = 0;
        let numL = 0;
        
        for(let i = 0; i<this.thisPath.length; i++){

            switch(this.thisPath.charAt(i)){
                case 'S':
                    m = this.draw_path(graphics_state, m);
                    console.log('Start');
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
                    console.log('Right');
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
                    console.log('Left');
                    break;
                case 'F':
                    m = this.draw_fire(graphics_state, m);
                    console.log('Fire');
                    break;
                case 'P':
                    m = this.draw_tile(graphics_state, m);

            }

        }
         
/*  
*/  


    }

    draw_tile(graphics_state, m){
        this.shapes['square'].draw(
            graphics_state,
            m,
            this.shape_materials['cylinder'] );
        
        return m.times(Mat4.translation(Vec.of(0, 2, 0)));
    }

    draw_path(graphics_state, m){
        
        m = this.draw_tile(graphics_state, m);
        m = this.draw_tile(graphics_state, m);

        return m;                 
    }

    draw_R_turn(graphics_state, m){

        m = this.draw_tile(graphics_state, m);
        
        m = m.times(Mat4.rotation(-Math.PI/2, Vec.of(0,0,1)));

        return this.draw_path(graphics_state, m);
    }

    draw_L_turn(graphics_state, m){

        m = this.draw_tile(graphics_state, m);
        
        m = m.times(Mat4.rotation(Math.PI/2, Vec.of(0,0,1)));

        return this.draw_path(graphics_state, m);        
    }

    draw_fire(graphics_state, m){
        
        this.shapes['square'].draw(
            graphics_state,
            m,
            this.shape_materials['fire'] );
        
        m = m.times(Mat4.translation(Vec.of(0, 2, 0)));

        return this.draw_tile(graphics_state, m);
    }    

    generate_path(str){
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