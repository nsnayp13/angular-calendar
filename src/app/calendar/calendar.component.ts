import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewChildren,
  AfterViewChecked
} from "@angular/core";
import { registerLocaleData } from "@angular/common";
import localeRu from "@angular/common/locales/ru";
import { CalendarService, Day, Calendar } from "../_service/calendar.service";

interface Suggest {
  title: string;
  dates: [];
}

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  providers: [CalendarService]
})
export class CalendarComponent implements OnInit, OnChanges, AfterViewChecked {
  /**
   * @description
   *  Array of selected dates.
   * */
  @Input() selectedDates: Date[] = [];

  /**
   * @description
   *  Date whould be render for default calendar .
   * */
  @Input() shownDate: Date;

  /**
   * @description
   *  Alignment of days in a week. Default horizontal.
   * */
  @Input() vertical: boolean;

  /**
   * @description
   *  Array custom definitions of days.
   * @See `Day`
   * */
  @Input() days?: Day[];

  /**
   * @description
   * Present mode of calendar. Year, quarter, semester or qty months. Default 1.
   * */
  @Input() viewMode: string | number;

  /************* */

  /** Single, multiple, period or keyboard */
  selectMode: string;
  /** day, month, year */
  private viewSelectorMode: string = "days";

  weekStart: number;
  weekends: [];
  timeMode: string;
  disabled?: {
    // disable date to select
    enabled: true;
    mode: "after"; // 'after'|'before'
  };
  suggestions: [];

  nowDate: Date;
  showMonthQty: number;

  calendar: any[];
  updateDate;

  width: number | null;

  @ViewChildren("someName") someDivs;

  constructor(private calendarService: CalendarService) {
    registerLocaleData(localeRu, "ru");
    //setTimeout(() => this.changeViewSelectorMode(), 1000);
  }

  recountWidth() {
    let width = 0;
    this.someDivs
      ? this.someDivs
          .toArray()
          .map(item => (width += item.elementView.nativeElement.clientWidth))
      : null;
    this.calendarService.animationStep.value === "stop" &&
    this.viewSelectorMode === "days"
      ? (this.width = width)
      : null;
  }

  ngAfterViewChecked() {
    this.recountWidth();
  }

  ngOnInit() {
    this.calendarService.viewSelectorMode.next("days");
    this.calendarService.viewMode.next(this.viewMode);

    this.goToDate();
    this.setSelectedDates();

    this.calendarService.viewSelectorMode.subscribe(
      data => (this.viewSelectorMode = data)
    );

    this.calendarService.calendar.subscribe(data => {
      this.calendar = data;
    });

    this.calendarService.animationStep.subscribe(data => {
      if (data === "stop") {
        setTimeout(() => this.recountWidth(), 10);
      }
    });

    this.calendarService.updateDate.subscribe(data => {
      this.updateDate = data;
    });

    this.calendarService.selectedDates.subscribe(data => {
      console.log("selectedDates changed in calendar.ts");
    });
  }

  ngOnChanges() {
    this.goToDate();
  }

  /** Show date in calendar */
  goToDate() {
    this.calendarService.setShownDate(this.shownDate);
    this.calendarService.getShownMonths(this.shownDate);
  }

  /** Set dates would be selected in calendar. Depend from selectMode */
  setSelectedDates() {
    this.calendarService.setSelectedDates(this.selectedDates);
  }

  /** Set custom Day[] */
  setDays(days: Day[]) {}

  goNext() {
    let lastDate = this.calendar[this.calendar.length - 1];
    this.calendarService.goNext(lastDate);
  }
  goPrev() {
    let firstDate = this.calendar[0];
    this.calendarService.goPrev(firstDate);
  }
}