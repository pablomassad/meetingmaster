import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavParams, Events, Modal, ModalController, AlertController, NavController } from 'ionic-angular';

import * as moment from 'moment'
import { FirebaseService } from '../../shared/services/firebase.service';
//import { Moment } from 'moment'

@IonicPage()
@Component({
   selector: 'page-event',
   templateUrl: 'event.html'
})
export class EventPage implements OnInit, OnDestroy {
   title: string = "Evento"
   evt: any
   user: any
   membersFull: any
   totalMembers: number = 0
   startWeek: any
   weekData: any
   weekDataKeys: any = []
   assistants: any
   editMode: boolean = false
   allDayFlag: boolean = false
   dirtyFlag: boolean = false
   selectionItemsKeys: string[] = []
   status: string = 'checked'
   private maxValue: number = 0

   constructor(
      private navParams: NavParams,
      private navCtrl: NavController,
      private modal: ModalController,
      private fs: FirebaseService,
      private alertCtrl: AlertController
   ) {
      console.log('EventPage constructor');
   }
   ngOnDestroy() {
      console.warn('EventPage destroy');
   }
   ngOnInit(): void {
      console.log('EventPage init');
      this.title = this.navParams.get('title')
      this.evt = this.navParams.get('evt')
      this.user = this.navParams.get('user')
      this.membersFull = this.navParams.get('membersFull')
      this.totalMembers = this.membersFull.length

      if (this.evt.type == 'calendario') {
         if (this.evt.estimationDate){
            this.startWeek = moment(this.evt.estimationDate.date, 'YYMMDD').day(0)
         }
         else{
            this.evt.estimationDate = {
               date:moment().format('YYMMDD')
            }
            this.startWeek = moment().day(0)   
         }
         this.initAllMemberStatus(true)
         this.processDays()
      }
      else {
         this.processSelections()
      }
   }

   ///////////////////////////
   // Calendario
   //////////////////////////
   editCell(ev, d) {
      //this.editMode = this.checkEditMode()
      if ((this.editMode == true)&&(moment(d, 'YYMMDD').toDate() > moment().toDate())) {
         this.dirtyFlag = true
         let idx = -1;
         let hours = []

         if (!this.evt.availability[this.user.uid]) 
            this.evt.availability[this.user.uid] = {}
         hours = this.evt.availability[this.user.uid][d]
         if (!hours) {
            this.evt.availability[this.user.uid][d] = []
            hours = this.evt.availability[this.user.uid][d]
         }
         idx = hours.indexOf(ev.hour.toString())
         if (idx == -1) {
            hours.push(ev.hour.toString())
            ev.value = ev.value + 1
            ev.members.push(this.user.uid)
         }
         else {
            hours.splice(idx, 1)
            ev.value = ev.value - 1
            const idm = ev.members.indexOf(this.user.uid)
            ev.members.splice(idm, 1)
         }
      }

      if (this.editMode == false){
         this.membersFull.forEach(m => {
            let obj = ev.members.find(uid => uid === m.uid)
            m.present = (obj != undefined)
            m.pending = (this.evt.availability[m.uid] == undefined)
         });
         this.showMembers()
      }
   }
   toggleAllDay(d) {
      //this.editMode = this.checkEditMode()
      if (this.editMode === true) {
         this.dirtyFlag = true

         if (!this.evt.availability[this.user.uid])
            this.evt.availability[this.user.uid] = {}

         this.allDayFlag = !this.allDayFlag
         if (this.allDayFlag == true) {
            if (!this.evt.availability[this.user.uid][d])
               this.evt.availability[this.user.uid][d] = []

            for (let i = 0; i < 24; i++) {
               this.evt.availability[this.user.uid][d].push(i.toString())
               this.weekData[d].info[i].hour = i
               this.weekData[d].info[i].value = 1
               this.weekData[d].info[i].members.push(this.user.uid)
            }
         }
         if (this.allDayFlag == false) {
            if (this.evt.availability[this.user.uid][d])
               delete this.evt.availability[this.user.uid][d]
            for (let i = 0; i < 24; i++) {
               this.weekData[d].info[i] = { hour: i, value: 0, members: [] }
            }
         }
      }
   }
   prevWeek() {
      this.startWeek = moment(this.startWeek).add(-7, 'days')
      this.processDays()
   }
   nextWeek() {
      this.startWeek = moment(this.startWeek).add(7, 'days')
      this.processDays()
   }
   isToday(d) {
      const res = (moment(d, 'YYMMDD').format('DD') == moment().format('DD'))
      return res
   }

   /////////////////////
   // Seleccion
   /////////////////////
   onSelChange(ev, item) {
      this.dirtyFlag = true
      if (ev.checked == true)
         this.evt.selectionItems[item][this.user.uid] = ev.checked
      else
         delete this.evt.selectionItems[item][this.user.uid]
   }
   onRatingChange(ev) {
      console.log('rating... ')
   }
   showSelMembers(item) {
      this.calcMemberStatus(item)
      this.showMembers()
   }
   calcCounter(item) {
      const uids = this.evt.selectionItems[item]
      const keys = Object.keys(uids)
      const total = keys.length
      let res: number = 0
      if (this.evt.type == 'clasificacion') {
         let sum = 0
         keys.forEach(k => {
            sum = sum + uids[k]
         })
         res = sum / total
      }
      else
         res = total
      return res
   }
   getVote(vote) {
      const res = this.evt.selectionItems[vote][this.user.uid]
      return (res == true)
   }
   calcPercent(vote) {
      const opYes = (this.calcCounter(vote) * 100 / (this.calcCounter('yes') + this.calcCounter('no'))).toFixed(0)
      return opYes
   }
   vote(vote) {
      this.dirtyFlag = true
      if (vote == 'yes')
         delete this.evt.selectionItems['no'][this.user.uid]
      else
         delete this.evt.selectionItems['yes'][this.user.uid]

      this.evt.selectionItems[vote][this.user.uid] = true
   }

   ////////////////////////////////////////////////////


   /////////////////////
   // Common methods
   /////////////////////
   closeModal() {
      if (this.dirtyFlag == false) {
         this.navCtrl.pop()
      }
      else {
         let alert = this.alertCtrl.create({
            title: 'Aviso',
            message: 'Cancela sin guardar cambios?',
            buttons: [
               {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: () => {
                     this.navCtrl.pop()
                  }
               },
               {
                  text: 'Guardar',
                  handler: () => {
                     this.fs.saveEvent(this.evt)
                     this.dirtyFlag = false
                  }
               }
            ]
         });
         alert.present();
      }
   }
   showMembers() {
      const mod: Modal = this.modal.create('MemberStatusPage', {
         title: "Miembros",
         evt: this.evt,
         members: this.membersFull
      }, {})
      mod.present()
      mod.onDidDismiss(data => {
         this.membersFull = data
         if (this.evt.type == 'calendario')
            this.processDays()
      })
   }
   showComments() {
      this.navCtrl.push('CommentsPage', {
         title: "Comentarios",
         evt: this.evt,
         user: this.user
      })

      // const mod: Modal = this.modal.create('CommentsPage', {
      //    title: "Comentarios",
      //    evt: this.evt,
      //    user: this.user
      //    // members: this.membersFull,
      //    // comments: this.evt.comments
      // }, {})
      // mod.present()
      // mod.onDidDismiss(data => {
      // })
   }
   save() {
      this.fs.saveEvent(this.evt)
      this.dirtyFlag = false
      this.closeModal()
   }
   toggleEditMode(){
      this.editMode = !this.editMode
      this.initAllMemberStatus(!this.editMode)
      this.turnOnUser()
   }


   private turnOnUser(){
      const u = this.membersFull.find(u=>u.uid == this.user.uid)
      u.onoff = true
   }
   private initAllMemberStatus(flag){
      this.membersFull.forEach(m => {
         m.onoff = flag
      });
   }
   private processDays() {
      this.weekData = this.resetDays(this.startWeek)
      this.weekDataKeys = Object.keys(this.weekData)
      this.membersFull.forEach(member => {
         let memberData = this.evt.availability[member.uid]
         if ((member.onoff === true) && (memberData)) {
            const days = Object.keys(memberData)
            days.forEach(day => {
               memberData[day].forEach(hour => {
                  let wd = this.weekData[day]
                  if (wd) {
                     wd.info[hour].value = wd.info[hour].value + 1
                     wd.info[hour].members.push(member.uid)
                     if (wd.info[hour].value > this.maxValue) {
                        this.maxValue = wd.info[hour].value
                        this.evt.estimationDate = {
                           date: day,
                           day: wd.dayNum,
                           month: wd.month,
                           maxValue: this.maxValue
                        }
                     }
                  }
               });
            });
         }
      })
   }
   private resetDays(startDay) {
      let emptyWeek = {}

      for (let i = 0; i < 7; i++) {
         let d = moment(startDay).add(i, 'days').format('YYMMDD')
         emptyWeek[d] = {
            dayName: moment(startDay).add(i, 'days').format('ddd'),
            dayNum: moment(startDay).add(i, 'days').format('DD'),
            month: moment(startDay).add(i, 'days').format('MMM'),
            info: []
         }
         for (let h = 0; h < 24; h++) {
            emptyWeek[d].info.push({ hour: h, value: 0, members: [] })
         }
      }
      return emptyWeek
   }
   private calcMemberStatus(item) {
      this.selectionItemsKeys.forEach(sel => {
         let elem = this.evt.selectionItems[sel]
         this.membersFull.forEach(m => {
            const mok = elem[m.uid]
            if (mok == true) {
               m.present = (sel == item)
               m.voted = true
            }
         })
         this.membersFull.forEach(m => {
            m.pending = (m.voted != true)
         })
      })
   }
   private processSelections() {
      this.selectionItemsKeys = Object.keys(this.evt.selectionItems)
      // this.selectionItemsKeys.forEach(sel => {
      //    let elem = this.evt.selectionItems[sel]
      //    elem.votes = Object.keys(elem).length
      // })
   }
}

