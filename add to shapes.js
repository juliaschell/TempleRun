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
        
        // main body

        for( var i = 0; i < 1; i++ ) {
            for( var j = 0; j < 2; j++ ) {
                var square_transform = Mat4.rotation( i == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) )
                    .times( Mat4.rotation( Math.PI * j - ( i == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                    .times( Mat4.translation([ 0, 0, i == 0 ? 1 : 10 ]) )
                    .times( Mat4.scale( [ 10, i == 0 ? 10 : 1, 1]) ) ;
        
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
        }

        // left ridge

        for ( var m = 0; m < 2; m++ ) {
            for( var n = 0; n < 2; n++ ) {
                var square_transform = Mat4.translation( [-11, n == 1 ? (m == 1 ? 3 : 2) : 2, 0])
                    .times( Mat4.rotation( m == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) ) )
                    .times( Mat4.rotation( Math.PI * n - ( m == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                    .times( Mat4.translation([ 0, 0, m == 0 ? 3 : (m == 1 ? 1 : 10) ]) )
                    .times( Mat4.scale( [ m == 1 ? 10 : 1, m == 0 ? 10 : (3 - n), 1]) ) ;
        
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
        }    

        // right ridge

        for ( m = 0; m < 2; m++ ) {
            for( n = 0; n < 2; n++ ) {
                var square_transform = Mat4.translation( [11, n == 0 ? (m == 1 ? 3 : 2) : 2, 0])
                    .times( Mat4.rotation( m == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) ) )
                    .times( Mat4.rotation( Math.PI * n - ( m == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                    .times( Mat4.translation([ 0, 0, m == 0 ? 3 : (m == 1 ? 1 : 10) ]) )
                    .times( Mat4.scale( [ m == 1 ? 10 : 1, m == 0 ? 10 : (2 + n), 1]) ) ;
        
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
        }    
    
    }
}

//////////////////////////////////////////////////////
//              RIGHT TURN
//////////////////////////////////////////////////////

window.RightTurn = window.classes.RightTurn = class RightTurn extends Shape {
    constructor() {
        super("positions", "normals", "texture_coords");
        
        // main body

        for( var i = 0; i < 2; i+=2 ) {
            for( var j = 0; j < 2; j++ ) {
                var square_transform = Mat4.translation(Vec.of(0, 0, i == 0 ? -1 : 0))
                    .times( Mat4.rotation( i == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) ))
                    .times( Mat4.rotation( Math.PI * j - ( i == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                    .times( Mat4.translation([ 0, 0, 1 ]) )
                    .times( Mat4.scale( [ i == 1 ? 10 : 12, i == 0 ? 11 : 1, 1]) ) ;
        
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
        }

        // left ridge

        for ( var m = 0; m < 2; m++ ) {
            for( var n = 0; n < 2; n++ ) {
                var square_transform = Mat4.translation( [-11, n == 1 ? (m == 1 ? 3 : 2) : 2, -1])
                    .times( Mat4.rotation( m == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) ) )
                    .times( Mat4.rotation( Math.PI * n - ( m == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                    .times( Mat4.translation([ 0, 0, m == 0 ? 3 : (m == 1 ? 1 : 11) ]) )
                    .times( Mat4.scale( [ m == 1 ? 11 : 1, m == 0 ? 11 : (3 - n), 1]) ) ;
        
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
        }    

        // back ridge

        for ( var m = 0; m < 3; m++ ) {
            for( var n = (m == 2 ? 1 : 0); n < 2; n++ ) {
                var square_transform = Mat4.translation( [0, 2, -13])
                    .times( Mat4. rotation(Math.PI/2, Vec.of(0, 1, 0)))
                    .times( Mat4.rotation( m == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) ) )
                    .times( Mat4.rotation( Math.PI * n - ( m == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                    .times( Mat4.translation([ 0, 0, m == 0 ? 3 : (m == 1 ? 1 : 12) ]) )
                    .times( Mat4.scale( [ m == 1 ? 12 : 1, m == 0 ? 12 : 3, 1]) ) ;
        
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
        }

        // right pillar

        for ( m = 0; m < 3; m++ ) {
            for( n = (m == 1 ? 0 : 1); n < (m == 1 ? 1: 2); n++ ) {
                var square_transform = Mat4.translation( [11, 3, 9])
                    .times( Mat4.rotation( m == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) ) )
                    .times( Mat4.rotation( Math.PI * n - ( m == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                    .times( Mat4.translation([ 0, 0, m == 0 ? 2 : (m == 1 ? 1 : 1) ]) )
                    .times( Mat4.scale( [ m == 1 ? 1 : 1, m == 0 ? 1 : 2, 1]) ) ;
        
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
        }        
    
    }
}

//////////////////////////////////////////////////////
//              LEFT TURN
//////////////////////////////////////////////////////

window.LeftTurn = window.classes.LeftTurn = class LeftTurn extends Shape {
    constructor() {
        super("positions", "normals", "texture_coords");
              
        // main body

        for( var i = 0; i < 2; i+=2 ) {
            for( var j = 0; j < 2; j++ ) {
                var square_transform = Mat4.translation(Vec.of(0, 0, i == 0 ? -1 : 0))
                    .times( Mat4.rotation( i == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) ))
                    .times( Mat4.rotation( Math.PI * j - ( i == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                    .times( Mat4.translation([ 0, 0, 1 ]) )
                    .times( Mat4.scale( [ i == 1 ? 10 : 11, i == 0 ? 11 : 1, 1]) ) ;
        
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
        }

        // right ridge

        for ( var m = 0; m < 2; m++ ) {
            for( var n = 0; n < 2; n++ ) {
                var square_transform = Mat4.translation( [11, n == 0 ? (m == 1 ? 3 : 2) : 2, -1])
                    .times( Mat4.rotation( m == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) ) )
                    .times( Mat4.rotation( Math.PI * n - ( m == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                    .times( Mat4.translation([ 0, 0, m == 0 ? 3 : (m == 1 ? 1 : 11) ]) )
                    .times( Mat4.scale( [ m == 1 ? 11 : 1, m == 0 ? 11 : (2 + n), 1]) ) ;
        
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
        }    

        // back ridge

        for ( var m = 0; m < 3; m++ ) {
            for( var n = 0; n < (m == 2 ? 1 : 2); n++ ) {
                var square_transform = Mat4.translation( [0, 2, -13])
                    .times( Mat4. rotation(Math.PI/2, Vec.of(0, 1, 0)))
                    .times( Mat4.rotation( m == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) ) )
                    .times( Mat4.rotation( Math.PI * n - ( m == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                    .times( Mat4.translation([ 0, 0, m == 0 ? 3 : (m == 1 ? 1 : 12) ]) )
                    .times( Mat4.scale( [ m == 1 ? 12 : 1, m == 0 ? 12 : 3, 1]) ) ;
        
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
        }

        // left pillar

        for ( m = 0; m < 3; m++ ) {
            for( n = 1; n < 2; n++ ) {
                var square_transform = Mat4.translation( [-11, 3, 9])
                    .times( Mat4.rotation( m == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) ) )
                    .times( Mat4.rotation( Math.PI * n - ( m == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                    .times( Mat4.translation([ 0, 0, m == 0 ? 2 : (m == 1 ? 1 : 1) ]) )
                    .times( Mat4.scale( [ m == 1 ? 1 : 1, m == 0 ? 1 : 2, 1]) ) ;
        
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
        }       
    }
}
}
