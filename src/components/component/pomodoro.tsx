"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Pomodoro() {
  const [isRunning, setIsRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(25 * 60)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [tasks, setTasks] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleCycleComplete = useCallback(() => {
    if (currentCycle % 4 === 0) {
      setTimeRemaining(15 * 60)
    } else {
      setTimeRemaining(5 * 60)
    }
    setCurrentCycle((prevCycle) => prevCycle + 1)
    setIsRunning(true)
  }, [currentCycle])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  useEffect(() => {
    if (timeRemaining === 0) {
      handleCycleComplete()
    }
  }, [timeRemaining, handleCycleComplete])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeRemaining(25 * 60)
    setCurrentCycle(1)
  }

  const handleAddTask = (task: string) => {
    setTasks((prevTasks) => [...prevTasks, task])
  }

  const handleDeleteTask = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index))
  }

  const handleTaskReorder = (oldIndex: number, newIndex: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks]
      const [removedTask] = updatedTasks.splice(oldIndex, 1)
      updatedTasks.splice(newIndex, 0, removedTask)
      return updatedTasks
    })
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex flex-col w-full max-w-2xl bg-card text-card-foreground rounded-lg p-8 shadow-lg">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
          <button
            className={`p-2 rounded-full transition-colors duration-300 ${
              isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>
        </header>
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="text-6xl font-bold mb-4">{formatTime(timeRemaining)}</div>
          <div className="text-lg mb-8">
            Cycle {currentCycle} / {isRunning ? "Running" : "Paused"}
          </div>
          <div className="flex gap-4">
            {isRunning ? <Button onClick={handlePause}>Pause</Button> : <Button onClick={handleStart}>Start</Button>}
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full max-w-2xl bg-card text-card-foreground rounded-lg p-8 shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-4">Task List</h2>
        <ul
          className="space-y-2 flex-1 overflow-auto"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const from = parseInt(e.dataTransfer.getData("text/plain"))
            const toElement = (e.target as HTMLElement).closest("li")
            if (toElement) {
              const to = Array.from(e.currentTarget.children).indexOf(toElement)
              handleTaskReorder(from, to)
            }
          }}
        >
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-muted p-2 rounded cursor-move"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", index.toString())}
            >
              <span>{task}</span>
              <button className="text-muted-foreground hover:text-red-500" onClick={() => handleDeleteTask(index)}>
                <XIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
          <li>
            <Input
              placeholder="Add a new task"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleAddTask(e.currentTarget.value)
                  e.currentTarget.value = ""
                }
              }}
              className="w-full"
            />
          </li>
        </ul>
      </div>
    </div>
  )
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}