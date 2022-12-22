export default class Utils {

    static rectangularCollision({ e1, e2 }) {
        return (
            e1.position.x + e1.width >= e2.position.x
            && e1.position.x <= e2.position.x + e2.width
            && e1.position.y + e1.height >= e2.position.y
            && e1.position.y <= e2.position.y + e2.height
        );
    }
    
    static roundedCollision({ e1, e2 }) {
        return (
            Math.sqrt(
                Math.pow(e1.position.x - e2.position.x)
                + Math.pow(e1.position.y - e2.position.y)
            ) < (e1.height/2 + e2.height/2)
        );
    }

}