"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
//import * as moment from 'moment'
admin.initializeApp(functions.config().firebase);
// export const onEvents = functions.firestore.document('events/{evtId}').onWrite((event) => {
//    // Se a creado o modificado un evento
//    // Tomo los miembros del evento y recorro uno por uno
//    // En cada miembro recorro todos sus contactos para ver si estan todos los miembros
//    // si no esta alguno, lo agrego a sus contactos, sino no hago nada
//    const proms = [];
//    const evt = event.after.data()
//    const memKeys = Object.keys(evt.members)
//    memKeys.forEach(mkey => {
//       const uProm = admin.firestore().collection("users").doc(mkey).get()
//          .then(dss => {
//             const usr = dss.data()
//             let ctKeys: string[] = []
//             if (usr.contacts)
//                ctKeys = Object.keys(usr.contacts)
//             const mergeKeys = ctKeys.concat(memKeys.filter(function (item) {
//                return ctKeys.indexOf(item) < 0;
//             }));
//             const cts = {}
//             mergeKeys.forEach(key => {
//                cts[key] = true
//             })
//             usr.contacts = cts
//             return admin.firestore().collection("users").doc(mkey).set(usr)
//          })
//       proms.push(uProm)
//    });
//    return Promise.all(proms)
// })
exports.notifyMember = functions.https.onRequest((request, response) => {
    const arr = request.params[0].split('/');
    const idEvt = arr[1];
    const idUsr = arr[2];
    console.log('arr: ', arr);
    admin.firestore().collection("events").doc(idEvt).get()
        .then(dsse => {
        const evt = dsse.data();
        admin.firestore().collection("users").doc(idUsr).get()
            .then(dssu => {
            const usr = dssu.data();
            evt.members[usr.uid] = true;
            admin.firestore().collection('events').doc(idEvt).set(evt)
                .then(dssm => {
                console.log('User: ' + usr.uid + ' member of event: ' + evt.name);
                admin.firestore().collection("users").doc(evt.owner).get()
                    .then(dsso => {
                    const ownerInfo = dsso.data();
                    ownerInfo.contacts[usr.uid] = true;
                    admin.firestore().collection('users').doc(evt.owner).set(ownerInfo)
                        .then(dsmc => {
                        console.log('User: ' + usr.uid + ' contact of owner: ' + evt.owner);
                        const payload = {
                            notification: {
                                title: usr.displayName + ', se ha agregado al evento:',
                                body: evt.name
                            },
                            data: {}
                        };
                        console.log('Push: ', payload);
                        admin.messaging().sendToTopic(idEvt, payload)
                            .then(m => {
                            console.log('Pushing OK');
                            response.send(true);
                        })
                            .catch(err => {
                            console.log('Error Pushing: ', err);
                            response.status(500).send(err);
                        });
                    })
                        .catch(err => {
                        console.log('Error Contacts: ', err);
                        response.status(500).send(err);
                    });
                })
                    .catch(err => {
                    console.log('Error Owner: ', err);
                    response.status(500).send(err);
                });
            })
                .catch(err => {
                console.log('Error Members: ', err);
                response.status(500).send(err);
            });
        })
            .catch(err => {
            console.log('Error Users: ', err);
            response.status(500).send(err);
        });
    })
        .catch(err => {
        console.log('Error Events: ', err);
        response.status(500).send(err);
    });
});
//# sourceMappingURL=index.js.map