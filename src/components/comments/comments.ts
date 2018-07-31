import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonicPage, ViewController, NavParams} from 'ionic-angular'
import { FirebaseService } from '../../shared/services/firebase.service';
import { Subscription } from 'rxjs';

@IonicPage()
@Component({
   selector: 'page-comments',
   templateUrl: 'comments.html'
})
export class CommentsPage implements OnInit, OnDestroy {
   @ViewChild('comLst') content: any;

   title: string
   user: any
   evt: any
   comments: any = []
   searchText: string
   newComment: string = ""
   subComments: Subscription

   constructor(
      private navParams: NavParams,
      private view: ViewController,
      private fs: FirebaseService
   ) {
      console.log('CommentsPage constructor');
      this.title = this.navParams.get('title')
      this.evt = this.navParams.get('evt')
      this.user = this.navParams.get('user')
   }
   ngOnDestroy() {
      console.warn('CommentsPage destroy');
      this.subComments.unsubscribe()
   }
   ngOnInit(): void {
      console.log('CommentsPage init');
      this.subComments = this.fs.getCommentsByEvtId(this.evt.id).subscribe(data => {
         this.comments = data
      })
   }
   ionViewDidEnter() {
      this.scrollDown()
   }
   add() {
      if (this.newComment != "") {
         const cmt = {
            creationDate: new Date().getTime(),
            comment: this.newComment,
            owner: this.user.uid,
            ownerName: this.user.displayName,
            photoURL: this.user.photoURL
         }
         this.fs.saveComment(this.evt.id, cmt)
         this.newComment = ""
      }
      this.scrollDown()
   }
   closeModal() {
      this.view.dismiss(null)
   }

   private scrollDown(){
      setTimeout(() => {
         this.content.scrollToBottom(300);
      }, 500);
   }
}
