//interfaces are not compiled into final JS code
//interfaces define structure and provide strong typing
//class is an object factory/blueprint, we don't need that
//class also does type checking but would be included in final code which is unnecessary
export interface IActivity {
  id: string
  title: string
  description: string
  category: string
  date: Date
  city: string
  venue: string
  isGoing: boolean
  isHost: boolean
  attendees: IAttendee[]
}

//extends IActivity but makes all properties optional
export interface IActivityFormValues extends Partial<IActivity> {
  time?: Date
}

//when new instance is created it has these default values
export class ActivityFormValues implements IActivityFormValues {
  id?: string = undefined
  title: string = ''
  category: string = ''
  description: string = ''
  date?: Date = undefined
  time?: Date = undefined
  city: string = ''
  venue: string = ''

  //constructor lets you create it with existing activity
  constructor(init?: IActivityFormValues) {
    //copies all properties and values from this and overwrite them with values from init (if they exist on init)
    Object.assign(this, init)
    if (init && init.date) {
      this.time = init.date
    }
  }
}

export interface IAttendee {
  userName: string
  displayName: string
  image: string | null
  isHost: boolean
}