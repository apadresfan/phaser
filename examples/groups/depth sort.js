var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser-dude.png');
    game.load.tilemap('desert', 'assets/tilemaps/maps/depthsort.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.spritesheet('trees', 'assets/tilemaps/tiles/walls_1x2.png', 32, 64);

}

var map;
var tileset;
var layer;

var sprite;
var group;
var oldY = 0;
var cursors;

function create() {

    //  Create our tilemap to walk around
    map = game.add.tilemap('desert');

    map.addTilesetImage('ground_1x1');

    layer = map.createLayer('Tile Layer 1');

    layer.resizeWorld();

    //  This group will hold the main player + all the tree sprites to depth sort against
    group = game.add.group();

    //  The player
    sprite = group.create(300, 200, 'phaser');

    //  Some trees
    for (var i = 0; i < 50; i++)
    {
        var x = game.math.snapTo(game.world.randomX, 32);
        var y = game.math.snapTo(game.world.randomY, 32);
        group.create(x, y, 'trees', game.rnd.integerInRange(0, 8));
    }

    //  Move it
    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 150;
    }

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -150;
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 150;
    }

    if (sprite.y !== oldY)
    {
        //  Group.sort() is an expensive operation
        //  You really want to minimise how often it is called as much as possible.
        //  So this little check helps at least, but if you can, do it even less than this.
        group.sort();
        oldY = sprite.y;
    }

}
