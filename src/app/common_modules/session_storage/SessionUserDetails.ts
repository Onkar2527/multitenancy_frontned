class UserSessionKeys {
    BRANCH_ID: string = '';
    NAME: string = '';
    ROLE_ID: string = '';
    USER_ID: string = '';
    BANK_ID: string = ''; // 🔑 Added to store Bank ID during forced reset
    BRANCH_NAME: string = ''; // 🔑 Added for multitenancy branding
    BANK_NAME: string = '';   // 🔑 Added for multitenancy branding
}


export class SessionUserDetails {

    static user_keys: UserSessionKeys = new UserSessionKeys();

    static checkSessionStorage() {
        let success = true;

        for (let item in this.user_keys) {
            if (!sessionStorage.getItem(item)) {
                success = false;
            }
        }

        return success;
    }

    static getSessionStorage() {
        let result: any = {};

        for (let item in this.user_keys) {
            result[item] = sessionStorage.getItem(item)
        }
        return result;
    }

    static setSessionStorage(data: any) {
        for (let item in this.user_keys) {
            if (item != 'USER_ID') {
                sessionStorage.setItem(item, data[item]);
            }
            else {
                sessionStorage.setItem(item, data['ID']);
            }

        }
    }
}

