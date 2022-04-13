var haveEvents = 'ongamepadconnected' in window;
var maxAbs = (val, max) => ((Math.abs(val) > max) ? Math.sign(val) * max : val);

class Controller {
    // ATTRIBUTES //
    static container;
    static controllers = {};
    static buttons = [];
    static velocity = {
        x: 0,
        y: 0,
    };
    static axes = {
        left: {
            x: 0,
            y: 0,
        },
        right: {
            x: 0,
            y: 0,
        }
    }

    // SETTINGS //
    static acceleration = 8;
    static drag = 5;
    static velocityMax = 13;
    static isAccelerated = true;

    // INIT SETUP //
    static init() {
        window.addEventListener("gamepadconnected", this.connecthandler);
        window.addEventListener("gamepadconnected", console.info);
        window.addEventListener("gamepaddisconnected", this.disconnecthandler);
        window.addEventListener("keydown", this.keyHandler);
        
        
        if (!haveEvents) {
            setInterval(this.scangamepads, 500);
        }
    }
    static keyHandler (key) {
        console.log(key);
        switch (key) {
            case value:
                toggleVisuals();
                break;
        
            default:
                break;
        }
    }

    static getPattern() {
        let rand = Math.random();
        let val = [rand * 0.1, rand * 0.3, rand * 0.25];
        val = [0.2*Controller.axes.right.x, 0.1, -0.5, 1]
        console.log(val);

        
        return val;  
        // Finetunning and corection vith min-max
    }

    // UPDATE STEP //
    static render() {
        Controller.updateStatus();
        //////////////////////
        if (this.buttons[7]) speed += .5;
        else if (this.buttons[5]) speed -= .5;
        //////////////////////


        let newVelAbs;
        //this = Controller;


        this.velocity.x += this.acceleration * this.axes.left.x;
        this.velocity.x = (Math.abs(this.velocity.x) > this.velocityMax) ? Math.sign(this.velocity.x) * this.velocityMax : this.velocity.x;
        // drag
        newVelAbs = Math.abs(this.velocity.x) - this.drag;
        this.velocity.x = (newVelAbs < 0) ? 0 : (this.velocity.x - Math.sign(this.velocity.x) * this.drag);


        this.velocity.y += this.acceleration * this.axes.left.y;
        this.velocity.y = (Math.abs(this.velocity.y) > this.velocityMax) ? Math.sign(this.velocity.y) * this.velocityMax : this.velocity.y;
        // drag
        newVelAbs = Math.abs(this.velocity.y) - this.drag;
        this.velocity.y = (newVelAbs < 0) ? 0 : (this.velocity.y - Math.sign(this.velocity.y) * this.drag);


        //console.log(this.velocity);
        if (this.isAccelerated) {
            mouseX += this.velocity.x;
            mouseY += this.velocity.y;
        } else {
            mouseX += this.acceleration * this.axes.left.x;
            mouseY += this.acceleration * this.axes.left.y;
        }
        if (this.isSetMode) { }

        mouseX = maxAbs(mouseX, 500);
        mouseY = maxAbs(mouseY, 500);
    }

    // GAMEPAD LOGIC //
    static scangamepads() {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (var i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                if (gamepads[i].index in Controller.controllers) {
                    Controller.controllers[gamepads[i].index] = gamepads[i];
                } else {
                    Controller.addgamepad(gamepads[i]);
                }
            }
        }
    }

    static connecthandler(e) {
        let parent = document.getElementsByTagName('canvas')[0].parentNode;
        Controller.container = document.createElement('div');

        Controller.container.id = "containerController";
        Controller.container.style = "cursor: pointer; width: 120px; opacity: 0.9; z-index: 10001; position: absolute; top: 80px; right: 10px; color:white;";
        parent.appendChild(Controller.container);

        Controller.addgamepad(e.gamepad);
    }

    static addgamepad(gamepad) {
        Controller.controllers[gamepad.index] = gamepad;

        console.log(Controller.controllers);

        requestAnimationFrame(Controller.updateStatus);
    }

    static disconnecthandler(e) {
        removegamepad(e.gamepad);
    }

    static removegamepad(gamepad) {
        var d = document.getElementById("controller" + gamepad.index);
        document.body.removeChild(d);
        delete this.controllers[gamepad.index];
    }

    static updateStatus() {
        if (!haveEvents) {
            Controller.scangamepads();
        }

        var i = 0;
        var j;

        // Last controller rewrites all !! (no-mult)
        for (j in Controller.controllers) {
            var controller = Controller.controllers[j];

            var buttons = controller.buttons.map((val, i) => {
                var pressed = val == 1.0;
                if (typeof (val) == "object") {
                    pressed = val.pressed;
                    val = val.value;
                }
                return pressed ? i : false;
            });
            Controller.buttons = buttons;
            
            

            const min = (val) => (Math.abs(val) < 0.1 ? 0 : val);

            const axes = {
                left: {
                    x: min(controller.axes[0].toFixed(4)),
                    y: min(controller.axes[1].toFixed(4)),
                },
                right: {
                    x: min(controller.axes[2].toFixed(4)),
                    y: min(controller.axes[3].toFixed(4)),
                }
            }
            Controller.axes = axes;


            var info = {
                buttons,
                axes,
                mouseX,
                mouseY,
            }
            Controller.container.innerHTML = "<pre>" +
                JSON.stringify(info, null, 2)
                    .replaceAll('"', '').replaceAll('{', '').replaceAll('}', '')
                + "<pre>"
        }

        //requestAnimationFrame(Controller.updateStatus);
    }
}