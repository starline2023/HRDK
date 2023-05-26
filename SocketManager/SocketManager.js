/* eslint-disable eqeqeq */
import React from 'react';
import { NativeAppEventEmitter } from 'react-native';
import GLOBALS from '../UtilityClass/Globals';
import AsyncStorage from '@react-native-community/async-storage';
import SocketIOClient from 'socket.io-client';

// const socket = SocketIOClient(GLOBALS.AdminSocket);

const socket = SocketIOClient(GLOBALS.LiverateSocket);

export function SocketManagerIOEmit() {

  socket.disconnect();
  socket.connect();

  let dataUser = GLOBALS.UserAccountDetail;
  GLOBALS.Token_User_Login = dataUser["Token"];
  GLOBALS.Client_LoginID = dataUser["LoginId"];

  socket.emit('End_Client', GLOBALS.ClientName + '_' + dataUser["LoginId"]);
  socket.emit('room', GLOBALS.ClientName);
}

export function SocketManagerIO() {
  socket.on('connect', function () {

    socket.emit('Client', GLOBALS.ClientName)

    AsyncStorage.getItem('UserLoginDetail').then((value) => {
      if (value != null && value != "null") {

        const UserAccountDetail = JSON.parse(value);
        GLOBALS.UserAccountDetail = UserAccountDetail;

        let dataUser = JSON.parse(UserAccountDetail);

        GLOBALS.Token_User_Login = dataUser["Token"];
        GLOBALS.Client_LoginID = dataUser["LoginId"];

        socket.emit('End_Client', GLOBALS.ClientName + '_' + dataUser["LoginId"]);
      }
    })
    socket.emit('room', GLOBALS.ClientName)
  });
  socket.on('ClientData', data => {
    try {
      GLOBALS.SocketManager.EventClientData = data;
      NativeAppEventEmitter.emit('eventKeyClientData', data);
    } catch (e) {
    }
  });
  socket.on('ClientHeaderDetails', data => {
    try {
      NativeAppEventEmitter.emit('eventKeyClientHeaderDetails', data);
    } catch (e) {
    }
  });
  socket.on('coinrate', data => {
    try {
      GLOBALS.ProductHeader.CoinRate = data;
      NativeAppEventEmitter.emit('eventKeyCoin', data);
    } catch (e) {
    }
  });
  socket.on('message', data => {
    try {
      GLOBALS.SocketManager.Eventmessage = data;
      NativeAppEventEmitter.emit('eventKeymessage', data);
    } catch (error) {
    }
  });
  socket.on('Liverate', data => {
    try {
      GLOBALS.SocketManager.EventLiverate = data;
      NativeAppEventEmitter.emit('eventKeyLiverate', data);
    } catch (error) {
    }
  });
  socket.on('Accountdetails', data => {

    try {
      if (data != "") {

        if (data["Status"] == false) {
          // socket.disconnect();
          NativeAppEventEmitter.emit('eventKeyUserAccountDetailLogout');
        } else {
          GLOBALS.SettingUserAccountDetail = data;
          NativeAppEventEmitter.emit('eventKeyUserAccountDetail');
          NativeAppEventEmitter.emit("eventKeyReloadUserName", data);
        }
      }
    } catch (error) {
    }
  });

  socket.on('disconnect', function () {
    // socket.connect();
  });

  socket.on('Orders', data => {
    try {
      NativeAppEventEmitter.emit('eventKeyOrders', data);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on('GroupDetails', function (Groupdata, SymbolGroupdata) {
    try {
      NativeAppEventEmitter.emit('eventKeyGroupDetails', Groupdata);
      GLOBALS.SocketManager.EventGroupDetails = Groupdata;
      if (Groupdata[0].Status != false) {

        NativeAppEventEmitter.emit('eventKeyGroup', SymbolGroupdata);
        GLOBALS.SocketManager.EventGroup = SymbolGroupdata;
        socket.emit('GroupDetails', GLOBALS.ClientName + '_' + Groupdata[0]["GroupName"]);
      }
    } catch (e) {
    }
  });

  socket.on('checklogin', data => {
    try {
      NativeAppEventEmitter.emit('eventKeychecklogin', data);
    } catch (e) {
    }
  });
}