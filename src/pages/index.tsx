'use client'

// Packages:
import { useEffect, useState } from 'react'
import Fuse from 'fuse.js'
import { nanoid } from 'nanoid'
import { debounce, isArray } from 'lodash'
import localforage from 'localforage'

// Typescript:
export interface Task {
  id: string
  isDone: boolean
  title: string
  description: string
}

// Imports:
import { DotsThree } from '@phosphor-icons/react/dist/ssr/DotsThree'

// Components:
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

// Functions:
const Home = () => {
  // Constants:
  const EMPTY_TASK: Task = {
    id: '',
    isDone: false,
    title: '',
    description: '',
  }
  
  // State:
  const [isMounted, setIsMounted] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [fuse, setFuse] = useState<Fuse<Task>>()
  const [searchResults, setSearchResults] = useState<Task[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [showAddEditTaskDialog, setShowAddEditTaskDialog] = useState(false)
  const [newTask, setNewTask] = useState<Task>(EMPTY_TASK)
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false)
  const [taskToBeDeletedID, setTaskToBeDeletedID] = useState<string | null>(null)

  // Functions:
  const _search = (searchInput: string) => {
    if (!fuse) return
    const results = fuse.search(searchInput)
    setSearchResults(results.map(result => result.item))
  }

  const search = debounce(_search, 400)

  const addTask = () => {
    setShowAddEditTaskDialog(false)
    setTasks(_tasks => [..._tasks, { ...newTask, id: nanoid() }])
    setNewTask(EMPTY_TASK)
  }

  const onCheckedChange = (taskID: string, newState: boolean) => {
    setTasks(_tasks => _tasks.map(task => {
      if (task.id === taskID) return {
        ...task,
        isDone: newState,
      }
      else return task
    }))
  }

  const initiateTaskEdit = (task: Task) => {
    setIsEditMode(true)
    setNewTask(task)
    setShowAddEditTaskDialog(true)
  }

  const editTask = () => {
    setShowAddEditTaskDialog(false)
    setTasks(_tasks => _tasks.map(task => {
      if (task.id === newTask.id) return { ...newTask }
      else return task
    }))
    setNewTask(EMPTY_TASK)
    setIsEditMode(false)
  }

  const duplicateTask = (task: Task) => {
    setTasks(_tasks => [..._tasks, { ...task, isDone: false, id: nanoid() }])
  }

  const initiateDeleteTask = (task: Task) => {
    setTaskToBeDeletedID(task.id)
    setShowDeleteTaskDialog(true)
  }

  const deleteTask = () => {
    setTasks(_tasks => _tasks.filter(task => task.id !== taskToBeDeletedID))
    setTaskToBeDeletedID(null)
    setShowDeleteTaskDialog(false)
  }

  const loadCachedTasks = async () => {
    const tasks = await localforage.getItem('tasks')
    if (tasks && isArray(tasks)) setTasks(tasks)
  }

  // Effects:
  useEffect(() => {
    setIsMounted(true)
    loadCachedTasks()
  }, [])

  useEffect(() => {
    const fuse = new Fuse(tasks, {
      keys: ['title', 'description'],
      isCaseSensitive: false,
    })
    setFuse(fuse)
    localforage.setItem('tasks', tasks)
  }, [tasks])

  // Return:
  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={showAddEditTaskDialog} onOpenChange={setShowAddEditTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit' : 'Add'} Task</DialogTitle>
            <DialogDescription>
              {
                isEditMode ?
                'Edit the title or the description.' :
                'Add a new task with a title and a description.'
              }
              
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Title
              </Label>
              <Input
                id='title'
                value={newTask.title}
                onInput={event => setNewTask(_newTask => ({ ..._newTask, title: event.currentTarget.value }))}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='username' className='text-right'>
                Description
              </Label>
              <Input
                id='description'
                value={newTask.description}
                onInput={event => setNewTask(_newTask => ({ ..._newTask, description: event.currentTarget.value }))}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={
                (newTask.title?.trim().length ?? 0) === 0 ||
                (newTask.description?.trim().length ?? 0) === 0
              }
              onClick={isEditMode ? editTask : addTask}
              variant='default'
              className='transition-all'
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showDeleteTaskDialog} onOpenChange={setShowDeleteTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task?</DialogTitle>
            <DialogDescription>This action cannot be undone. Are you sure?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowDeleteTaskDialog(false)}
              variant='ghost'
            >
              Cancel
            </Button>
            <Button
              onClick={deleteTask}
              variant='destructive'
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className='mt-10 flex justify-center items-center'>
        <div className='flex justify-center flex-col gap-6 w-full sm:w-[50%]'>
          <div className='flex justify-between gap-2   sm:gap-4 w-full'>
            <Input
              value={searchInput}
              onInput={event => {
                setSearchInput(event.currentTarget.value)
                search(event.currentTarget.value)
              }}
              placeholder='Search for any task'
            />
            <Button
              disabled={(searchInput?.trim().length ?? 0) === 0}
              onClick={() => _search(searchInput)}
              variant='secondary'
              className='transition-all'
            >
              Search
            </Button>
            <Button
              onClick={() => setShowAddEditTaskDialog(true)}
              variant='default'
            >
              Add Task
            </Button>
          </div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'><Checkbox checked={false} /></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  (
                    (searchInput?.trim().length ?? 0) === 0 ? tasks : searchResults
                  ).map(task => (
                    <TableRow key={task.id}>
                      <TableHead className='w-[50px]'>
                        <Checkbox
                          checked={task.isDone}
                          onCheckedChange={(newState: boolean) => onCheckedChange(task.id, newState)}
                        />
                      </TableHead>
                      <TableCell className='font-medium'>{task.title}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell align='right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon' className='focus:outline-none'>
                              <DotsThree className='h-[1.2rem] w-[1.2rem] transition-all' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuGroup>
                              <DropdownMenuItem className='cursor-pointer' onClick={() => initiateTaskEdit(task)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className='cursor-pointer' onClick={() => duplicateTask(task)}>
                                Duplicate
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem className='cursor-pointer' onClick={() => initiateDeleteTask(task)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}

// Exports:
export default Home
