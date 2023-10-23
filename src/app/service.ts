import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {PositionInterface} from "./position.interface";

@Injectable({
  providedIn: 'root'
})
export class Service{
  subject: BehaviorSubject<PositionInterface | undefined> = new BehaviorSubject<PositionInterface | undefined>(undefined);
  getSubject(){
    return this.subject.asObservable();
  }
}
