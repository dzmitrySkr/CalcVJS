class Utils{
    static getById(id) {
        const el = document.getElementById(id);
        if (!el) throw new Error(`Element with id "${id}" was not found`);
        return el;
    }

    static emptyOrNull(el){
        return el === "" || el === null;

    }

    static isNull(element){
        return element === null;
    }

    static notNull(element){
        return !Utils.isNull(element);
    }
}

export default class _ extends Utils{}
