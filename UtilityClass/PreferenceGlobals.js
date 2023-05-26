import AsyncStorage from '@react-native-community/async-storage';

export const isLogin_KEY = 'isLoginTerminal';
export const ClientID = 'ClientID';
export const USERID = 'UserLoginID';
export const PASSWORD = 'Password';
export const UserLoginDetail = 'UserLoginDetail';

export default  {

    getisLogin: async () => {
        try {
            let result = await AsyncStorage.getItem(isLogin_KEY);
            return JSON.parse(result);
        } 
        catch (e) {
            throw e;
        }
    },
    setisLogin: async (value) => {
        try {
            const item = JSON.stringify(value);
            return await AsyncStorage.setItem(isLogin_KEY, item);
        } catch (e) {
            throw e;
        }
    },
    getUserLoginDetail: async () => {
        try {
            let result = await AsyncStorage.getItem(UserLoginDetail);
            return JSON.parse(result);
        } 
        catch (e) {
            throw e;
        } 
    },
    setUserLoginDetail: async (value) => {
        try {
            const item = JSON.stringify(value);
            return await AsyncStorage.setItem(UserLoginDetail, item);
        } catch (e) {
            throw e;
        }
    },

    getUserLoginID: async () => {
            try {
                let result = await AsyncStorage.getItem(USERID);
                return JSON.parse(result);
            } 
            catch (e) {
                throw e;
            } 
    },
    setUserLoginID: async (value) => {
        try {
            const item = JSON.stringify(value);
            return await AsyncStorage.setItem(USERID, item);
        } catch (e) {
            throw e;
        }
    },

    getPassword: async () => {
            try {
                let result = await AsyncStorage.getItem(PASSWORD);
                return JSON.parse(result);
            } 
            catch (e) {
                throw e;
            } 
    },
    setPassword: async (value) => {
        try {
            const item = JSON.stringify(value);
            return await AsyncStorage.setItem(PASSWORD, item);
        } catch (e) {
            throw e;
        }
    }
}