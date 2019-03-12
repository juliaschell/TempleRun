window.Square = window.classes.Square = class Square extends Shape {
    constructor() {
        super("positions", "normals", "texture_coords");
        this.positions.push(     ...Vec.cast([-1, -1, 0], [1, -1, 0], [-1, 1, 0], [1, 1, 0] ));
        this.normals.push(       ...Vec.cast([ 0,  0, 1], [0,  0, 1], [ 0, 0, 1], [0, 0, 1] ));
        this.texture_coords.push(...Vec.cast([ 0, 0],     [1, 0],     [ 0, 1],    [1, 1]   ));
        this.indices.push(0, 1, 2, 1, 3, 2);
    }
}

window.Circle = window.classes.Circle = class Circle extends Shape {
    constructor(sections) {
        super("positions", "normals", "texture_coords");

        this.positions.push(...Vec.cast([0, 0, 0], [1, 0, 0]));
        this.normals.push(...Vec.cast(  [0, 0, 1], [0, 0, 1]));
        this.texture_coords.push(...Vec.cast([0.5, 0.5], [1, 0.5]));

        for (let i = 0; i < sections; ++i) {
            const angle = 2 * Math.PI * (i + 1) / sections,
                v = Vec.of(Math.cos(angle), Math.sin(angle)),
                id = i + 2;

            this.positions.push(...Vec.cast([v[0], v[1], 0]));
            this.normals.push(...Vec.cast(  [0,    0,    1]));
            this.texture_coords.push(...Vec.cast([(v[0] + 1) / 2, (v[1] + 1) / 2]));
            this.indices.push(
                0, id - 1, id);
        }
    }
}

window.Cube = window.classes.Cube = class Cube extends Shape {
    constructor() {
        super("positions", "normals", "texture_coords");

        this.positions.push(...Vec.cast(
            [-1,  1, -1], [-1, -1, -1], [ 1,  1, -1], [ 1, -1, -1],
            [-1, -1,  1], [ 1, -1,  1], [-1,  1,  1], [ 1,  1,  1],
            [-1,  1,  1], [ 1,  1,  1], [-1,  1, -1], [ 1,  1, -1],
            [-1, -1, -1], [ 1, -1, -1], [-1, -1,  1], [ 1, -1,  1],
            [-1, -1, -1], [-1, -1,  1], [-1,  1, -1], [-1,  1,  1],
            [ 1, -1, -1], [ 1, -1,  1], [ 1,  1, -1], [ 1,  1,  1] 
        ));

        this.texture_coords.push(...Vec.cast(
            [0,    2/3], [0.25, 2/3], [0,    1/3], [0.25, 1/3],
            [0.5,  2/3], [0.5,  1/3], [0.75, 2/3], [0.75, 1/3],
            [0.75, 2/3], [0.75, 1/3], [1,    2/3], [1,    1/3],
            [0.25, 2/3], [0.25, 1/3], [0.5,  2/3], [0.5,  1/3],
            [0.25, 2/3], [0.5,  2/3], [0.25, 1  ], [0.5,  1  ],
            [0.25, 1/3], [0.5,  1/3], [0.25, 0  ], [0.5,  0  ]
        )); 

        this.normals.push(...Vec.cast(
            ...Array(4).fill([ 0,  0, -1]),
            ...Array(4).fill([ 0,  0,  1]),
            ...Array(4).fill([ 0,  1,  0]),
            ...Array(4).fill([ 0, -1,  0]),
            ...Array(4).fill([-1,  0,  0]),
            ...Array(4).fill([ 1,  0,  0])
        ));

        this.indices.push(
            0, 2, 1, 1, 2, 3,
            4, 5, 6, 5, 7, 6,
            8, 9, 10, 9, 11, 10,    
            12, 13, 14, 13, 15, 14,
            16, 19, 18, 16, 17, 19,
            20, 22, 21, 21, 22, 23
        );
    }
}


window.SimpleCube = window.classes.SimpleCube = class SimpleCube extends Shape {
    constructor() {
      super( "positions", "normals", "texture_coords" );
      for( var i = 0; i < 3; i++ )                    
        for( var j = 0; j < 2; j++ ) {
          var square_transform = Mat4.rotation( i == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) )
                         .times( Mat4.rotation( Math.PI * j - ( i == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                         .times( Mat4.translation([ 0, 0, 1 ]) );
          Square.insert_transformed_copy_into( this, [], square_transform );
      }
    }
}

window.Tetrahedron = window.classes.Tetrahedron = class Tetrahedron extends Shape {
    constructor(using_flat_shading) {
        super("positions", "normals", "texture_coords");
        const s3 = Math.sqrt(3) / 4,
            v1 = Vec.of(Math.sqrt(8/9), -1/3, 0),
            v2 = Vec.of(-Math.sqrt(2/9), -1/3, Math.sqrt(2/3)),
            v3 = Vec.of(-Math.sqrt(2/9), -1/3, -Math.sqrt(2/3)),
            v4 = Vec.of(0, 1, 0);

        this.positions.push(...Vec.cast(
            v1, v2, v3,
            v1, v3, v4,
            v1, v2, v4,
            v2, v3, v4));

        this.normals.push(...Vec.cast(
            ...Array(3).fill(v1.plus(v2).plus(v3).normalized()),
            ...Array(3).fill(v1.plus(v3).plus(v4).normalized()),
            ...Array(3).fill(v1.plus(v2).plus(v4).normalized()),
            ...Array(3).fill(v2.plus(v3).plus(v4).normalized())));

        this.texture_coords.push(...Vec.cast(
            [0.25, s3], [0.75, s3], [0.5, 0], 
            [0.25, s3], [0.5,  0 ], [0,   0],
            [0.25, s3], [0.75, s3], [0.5, 2 * s3], 
            [0.75, s3], [0.5,  0 ], [1,   0]));

        this.indices.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
    }
}

window.Cylinder = window.classes.Cylinder = class Cylinder extends Shape {
    constructor(sections) {
        super("positions", "normals", "texture_coords");

        this.positions.push(...Vec.cast([1, 0, 1], [1, 0, -1]));
        this.normals.push(...Vec.cast(  [1, 0, 0], [1, 0,  0]));
        this.texture_coords.push(...Vec.cast([0, 1], [0, 0]));

        for (let i = 0; i < sections; ++i) {
            const ratio = (i + 1) / sections,
                angle = 2 * Math.PI * ratio,
                v = Vec.of(Math.cos(angle), Math.sin(angle)),
                id = 2 * i + 2;

            this.positions.push(...Vec.cast([v[0], v[1], 1], [v[0], v[1], -1]));
            this.normals.push(...Vec.cast(  [v[0], v[1], 0], [v[0], v[1],  0]));
            this.texture_coords.push(...Vec.cast([ratio, 1], [ratio, 0]));
            this.indices.push(
                id, id - 1, id + 1,
                id, id - 1, id - 2);
        }
    }
}

window.Cone = window.classes.Cone = class Cone extends Shape {
    constructor(sections) {
        super("positions", "normals", "texture_coords");

        this.positions.push(...Vec.cast([1, 0, 0]));
        this.normals.push(...Vec.cast(  [0, 0, 1]));
        this.texture_coords.push(...Vec.cast([1, 0.5]));

        let t = Vec.of(0, 0, 1);
        for (let i = 0; i < sections; ++i) {
            const angle = 2 * Math.PI * (i + 1) / sections,
                v = Vec.of(Math.cos(angle), Math.sin(angle), 0),
                id = 2 * i + 1;

            this.positions.push(...Vec.cast(t, v));
            this.normals.push(...Vec.cast(
                v.mix(this.positions[id - 1], 0.5).plus(t).normalized(),
                v.plus(t).normalized()));
            this.texture_coords.push(...Vec.cast([0.5, 0.5], [(v[0] + 1) / 2, (v[1] + 1) / 2]));
            this.indices.push(
                id - 1, id, id + 1);
        }
    }
}

// This Shape defines a Sphere surface, with nice (mostly) uniform triangles.  A subdivision surface
// (see) Wikipedia article on those) is initially simple, then builds itself into a more and more 
// detailed shape of the same layout.  Each act of subdivision makes it a better approximation of 
// some desired mathematical surface by projecting each new point onto that surface's known 
// implicit equation.  For a sphere, we begin with a closed 3-simplex (a tetrahedron).  For each
// face, connect the midpoints of each edge together to make more faces.  Repeat recursively until 
// the desired level of detail is obtained.  Project all new vertices to unit vectors (onto the
// unit sphere) and group them into triangles by following the predictable pattern of the recursion.
window.Subdivision_Sphere = window.classes.Subdivision_Sphere = class Subdivision_Sphere extends Shape {
    constructor(max_subdivisions) {
        super("positions", "normals", "texture_coords");

        // Start from the following equilateral tetrahedron:
        this.positions.push(...Vec.cast([0, 0, -1], [0, .9428, .3333], [-.8165, -.4714, .3333], [.8165, -.4714, .3333]));

        // Begin recursion.
        this.subdivideTriangle(0, 1, 2, max_subdivisions);
        this.subdivideTriangle(3, 2, 1, max_subdivisions);
        this.subdivideTriangle(1, 0, 3, max_subdivisions);
        this.subdivideTriangle(0, 2, 3, max_subdivisions);

        for (let p of this.positions) {
            this.normals.push(p.copy());
            this.texture_coords.push(Vec.of(
                0.5 + Math.atan2(p[2], p[0]) / (2 * Math.PI),
                0.5 - Math.asin(p[1]) / Math.PI));
        }

        // Fix the UV seam by duplicating vertices with offset UV
        let tex = this.texture_coords;
        for (let i = 0; i < this.indices.length; i += 3) {
            const a = this.indices[i], b = this.indices[i + 1], c = this.indices[i + 2];
            if ([[a, b], [a, c], [b, c]].some(x => (Math.abs(tex[x[0]][0] - tex[x[1]][0]) > 0.5))
                && [a, b, c].some(x => tex[x][0] < 0.5))
            {
                for (let q of [[a, i], [b, i + 1], [c, i + 2]]) {
                    if (tex[q[0]][0] < 0.5) {
                        this.indices[q[1]] = this.positions.length;
                        this.positions.push(this.positions[q[0]].copy());
                        this.normals.push(this.normals[q[0]].copy());
                        tex.push(tex[q[0]].plus(Vec.of(1, 0)));
                    }
                }
            }
        }
    }

    subdivideTriangle(a, b, c, count) {
        if (count <= 0) {
            this.indices.push(a, b, c);
            return;
        }

        let ab_vert = this.positions[a].mix(this.positions[b], 0.5).normalized(),
            ac_vert = this.positions[a].mix(this.positions[c], 0.5).normalized(),
            bc_vert = this.positions[b].mix(this.positions[c], 0.5).normalized();

        let ab = this.positions.push(ab_vert) - 1,
            ac = this.positions.push(ac_vert) - 1,
            bc = this.positions.push(bc_vert) - 1;

        this.subdivideTriangle( a, ab, ac, count - 1);
        this.subdivideTriangle(ab,  b, bc, count - 1);
        this.subdivideTriangle(ac, bc,  c, count - 1);
        this.subdivideTriangle(ab, bc, ac, count - 1);
    }
}

//////////////////////////////////////////////////////
//              ARCH
//////////////////////////////////////////////////////

window.Arch = window.classes.Arch = class Arch extends Shape {
    constructor(sections) {
        super("positions", "normals", "texture_coords");
        
        // top/bottom
        
        for ( var k = 0; k < 2; k++) {
            for( var i = 0; i < 3; i++ ) {
                for( var j = 0; j < 2; j++ ) {
                    var square_transform = Mat4.translation(Vec.of(i == 1 ? (2*j - 1) * 11 : 0, k*12, 0))
                        .times( Mat4.rotation( i == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) ) )
                        .times( Mat4.rotation( Math.PI * j - ( i == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                        .times( Mat4.translation([ 0, 0, 1]) )
                        .times( Mat4.scale( [ i == 1 ? 1 : 12, 1, 1]) ) ;

                    Square.insert_transformed_copy_into( this, [], square_transform );
                }
            }
        }

        // posts

        for ( var k = -1; k < 2; k+= 2){
            for ( var m = 0; m < 3; m++ ) {
                for( var n = 0; n < (m == 0 ? 1 : 2); n++ ) {
                    var square_transform = Mat4.translation( [k * 11, 5, 0])
                        .times( Mat4.rotation( m == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) ) )
                        .times( Mat4.rotation( Math.PI * n - ( m == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                        .times( Mat4.translation([ 0, 0, m == 0 ? 6 : 1 ]) )
                        .times( Mat4.scale( [ 1, m == 0 ? 1 : 6, 1]) ) ;

                    Square.insert_transformed_copy_into( this, [], square_transform );
                }
            }
        }

    }
}

//////////////////////////////////////////////////////
//              PATH
//////////////////////////////////////////////////////

window.Path = window.classes.Path = class Path extends Shape {
    constructor() {
        super("positions", "normals", "texture_coords");
       this.positions.push(...Vec.cast(
            [-10, -1, -10], [-10, -1, 10], [10, -1, -10], [10, -1, 10],     // n1
            [10, -1, -10], [10, -1, 10], [10, 3, -10], [10, 3, 10],         // n2
            [-10, -1, -10], [-10, -1, 10], [-10, 3, -10], [-10, 3, 10],     // n3
            [10, 3, -10], [10, 3, 10], [12, 3, -10], [12, 3, 10],           // n4
            [-12, 3, -10], [-12, 3, 10], [-10, 3, -10], [-10, 3, 10],       // n5
            [12, 3, -10], [12, 3, 10], [12, -3, -10], [12, -3, 10],         // n6
            [-12, -3, -10], [-12, -3, 10], [-12, 3, -10], [-12, 3, 10],     // n7
            [-10, -1, -10], [10, -1, -10], [-10, -3, -10], [10, -3, -10],   // n8
            [-10, -1, 10], [10, -1, 10], [-10, -3, 10], [10, -3, 10],       // n9
            [-12, 3, -10], [-10, 3, -10], [-12, -3, -10], [-10, -3, -10],   // n10
            [10, 3, -10], [12, 3, -10], [10, -3, -10], [12, -3, -10],       // n11
            [-12, 3, 10], [-10, 3, 10], [-12, -3, 10], [-10, -3, 10],       // n12
            [10, 3, 10], [12, 3, 10], [10, -3, 10], [12, -3, 10],           // n13
            [-12, -3, -10], [-12, -3, 10], [12, -3, -10], [12, -3, 10]      // n14
        ));


        this.texture_coords.push(...Vec.cast(
            [6/34, 20/34], [6/34, 10/34], [16/34, 20/34], [16/34, 10/34],   // n1
            [16/34, 20/34], [16/34, 10/34], [18/34, 20/34], [18/34, 10/34], // n2
            [4/34, 20/34], [4/34, 10/34], [6/34, 20/34], [6/34, 10/34],     // n3
            [18/34, 20/34], [18/34, 10/34], [19/34, 20/34], [19/34, 10/34], // n4
            [3/34, 20/34], [3/34, 10/34], [4/34, 20/34], [4/34, 10/34],     // n5
            [19/34, 20/34], [19/34, 10/34], [22/34, 20/34], [22/34, 10/34], // n6
            [0, 20/34], [0, 10/34], [3/34, 20/34], [3/34, 10/34],           // n7
            [6/34, 20/34], [16/34, 20/34], [6/34, 21/34], [16/34, 21/34],   // n8
            [6/34, 10/34], [16/34, 10/34], [6/34, 9/34], [16/34, 9/34],     // n9
            [3/34, 20/34], [4/34, 20/34], [3/34, 23/34], [4/34, 23/34],     // n10
            [18/34, 20/34], [19/34, 10/34], [18/34, 23/34], [19/34, 23/34], // n11
            [3/34, 10/34], [4/34, 10/34], [3/34, 7/34], [4/34, 7/34],       // n12
            [18/34, 10/34], [19/34, 10/34], [18/34, 7/34], [19/34, 7/34],   // n13
            [22/34, 20/34], [22/34, 10/34], [1, 20/34], [1, 10/34]       // n14
        )); 

        this.normals.push(...Vec.cast(
            ...Array(4).fill([ 0,  1,  0]),     // n1
            ...Array(4).fill([-1,  0,  0]),     // n2
            ...Array(4).fill([1,  0,  0]),      // n3
            ...Array(4).fill([ 0,  1,  0]),     // n4
            ...Array(4).fill([ 0,  1,  0]),     // n5
            ...Array(4).fill([1,  0,  0]),      // n6
            ...Array(4).fill([-1,  0,  0]),     // n7
            ...Array(4).fill([ 0,  0, -1]),     // n8
            ...Array(4).fill([ 0,  0,  1]),     // n9
            ...Array(4).fill([ 0,  0, -1]),     // n10
            ...Array(4).fill([ 0,  0, -1]),     // n11
            ...Array(4).fill([ 0,  0,  1]),     // n12
            ...Array(4).fill([ 0,  0,  1]),     // n13
            ...Array(4).fill([ 0, -1,  0]),     // n14
        ));

        this.indices.push(
            0, 1, 2, 1, 3, 2,       // n1
            4, 5, 6, 5, 7, 6,       // n2
            8, 9, 10, 9, 11, 10,    // n3
            12, 13, 14, 13, 15, 14, // n4
            16, 17, 18, 17, 19, 18, // n5
            20, 21, 22, 21, 23, 22, // n6
            24, 25, 26, 25, 27, 26, // n7
            28, 31, 30, 28, 29, 31, // n8
            32, 34, 33, 33, 34, 35, // n9 --> diff
            36, 39, 38, 36, 37, 39, // n10
            40, 43, 42, 40, 41, 43, // n11
            44, 46, 45, 45, 46, 47, // n12
            48, 50, 49, 49, 50, 51, // n13
            52, 53, 54, 53, 55, 54  // n14

        );
    }
}


//////////////////////////////////////////////////////
//              TURN
//////////////////////////////////////////////////////

window.Turn = window.classes.Turn = class Turn extends Shape {
    constructor() {
        super("positions", "normals", "texture_coords");
        
       this.positions.push(...Vec.cast(
            [-10, -1, -10], [-10, -1, 12], [12, -1, -10], [12, -1, 12],     // n1
            [-10, 3, -10], [-10, 3, 12], [-10, -1, -10], [-10, -1, 12],     // n2
            [-12, 3, -12], [-12, 3, 12], [-10, 3, -12], [-10, 3, 12],       // n3
            [-12, -3, -12], [-12, -3, 12], [-12, 3, -12], [-12, 3, 12],     // n4
            [-12, 3, 12], [-12, -3, 12], [-10, 3, 12], [-10, -3, 12],       // n5
            [-10, -1, -10], [12, -1, -10], [-10, 3, -10], [12, 3, -10],     // n6
            [-10, 3, -10], [12, 3, -10], [-10, 3, -12], [12, 3, -12],       // n7
            [-10, 3, -12], [12, 3, -12], [-10, -3, -12], [12, -3, -12],     // n8
            [12, 3, -12], [12, 3, -12], [12, -3, -12], [12, -3, -12],       // n9
            [12, -1, -10], [12, -1, 12], [12, -3, -10], [12, -3, 12],       // n10
            [-10, -1, 12], [12, -1, 12], [-10, -3, 12], [12, -3, 12],       // n11
            [12, -3, -12], [12, -3, 12], [-12, -3, -12], [-12, -3, 12]      // n12
        ));

        this.texture_coords.push(...Vec.cast(
            [18/34, 20/34], [18/34, 9/34], [29/34, 20/34], [29/34, 9/34],   // n1
            [16/34, 20/34], [16/34, 9/34], [18/34, 20/34], [18/34, 9/34], // n2
            [15/34, 21/34], [15/34, 9/34], [16/34, 21/34], [16/34, 9/34],     // n3
            [12/34, 21/34], [12/34, 9/34], [15/34, 21/34], [15/34, 9/34], // n4
            [15/34, 9/34], [16/34, 9/34], [15/34, 6/34], [16/34, 6/34],     // n5
            [18/34, 20/34], [29/34, 20/34], [18/34, 22/34], [29/34, 22/34], // n6
            [18/34, 22/34], [29/34, 22/34], [18/34, 23/34], [29/34, 23/34],           // n7
            [18/34, 23/34], [29/34, 23/34], [18/34, 26/34], [29/34, 26/34],   // n8
            [29/34, 23/34], [29/34, 22/34], [32/34, 23/34], [32/34, 22/34],     // n9
            [29/34, 20/34], [29/34, 9/34], [20/34, 20/34], [30/34, 9/34],     // n10
            [18/34, 9/34], [29/34, 9/34], [18/34, 8/34], [29/34, 8/34], // n11
            [0, 21/34], [0, 9/34], [12/34, 21/34], [12/34, 9/34],       // n12
        )); 

        this.normals.push(...Vec.cast(
            ...Array(4).fill([ 0,  1,  0]),     // n1
            ...Array(4).fill([1,  0,  0]),     // n2
            ...Array(4).fill([ 0,  1,  0]),      // n3
            ...Array(4).fill([ -1,  0,  0]),     // n4
            ...Array(4).fill([ 0,  0,  1]),     // n5
            ...Array(4).fill([ 0,  0,  1]),      // n6
            ...Array(4).fill([ 0,  1,  0]),     // n7
            ...Array(4).fill([ 0,  0, -1]),     // n8
            ...Array(4).fill([1,  0,  0]),     // n9
            ...Array(4).fill([1,  0,  0]),     // n10
            ...Array(4).fill([ 0,  0,  1]),     // n11
            ...Array(4).fill([ 0,  -1,  0]),     // n12

        ));

        this.indices.push(
            0, 1, 2, 1, 3, 2,       // n1
            4, 5, 6, 5, 7, 6,       // n2
            8, 9, 10, 9, 11, 10,    // n3
            12, 13, 14, 13, 15, 14, // n4
            16, 18, 17, 17, 18, 19, // n5
            20, 23, 22, 20, 21, 23, // n6
            24, 27, 26, 24, 25, 27, // n7
            28, 31, 30, 28, 29, 31, // n8
            32, 33, 34, 33, 35, 34, // n9 --> diff
            36, 37, 38, 37, 39, 38, // n10
            40, 42, 41, 41, 42, 43, // n11
            44, 45, 46, 45, 46, 47, // n12

        );
    }
}
