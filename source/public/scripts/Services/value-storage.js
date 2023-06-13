/* eslint-disable class-methods-use-this */
class ValueStorage {
    setItem(name, value) {
        if (value) {
            localStorage.setItem(name, JSON.stringify(value));
        }
        else {
            localStorage.removeItem(name);
        }
    }

    getItem(name) {
        return JSON.parse(localStorage.getItem(name) || null);
    }
}

// eslint-disable-next-line import/prefer-default-export
export const valueStorage = new ValueStorage();