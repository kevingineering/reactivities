//interfaces are not compiled into final JS code
//interfaces define structure and provide strong typing
//class is an object factory/blueprint, we don't need that
//class also does type checking but would be included in final code which is unnecessary
export interface IActivity {
  id: string
  title: string
  description: string
  category: string
  date: string
  city: string
  venue: string
}
