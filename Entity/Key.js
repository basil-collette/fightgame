class Key {
    constructor({key, action, endAction}) {
        this.key = key;
        this.pressed = false;
        this.action = action;
        this.endAction = endAction;
    }
}