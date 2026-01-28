export type Filter = 'all' | 'active' | 'completed'

export type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}
