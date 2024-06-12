import { useAppSelector } from '@/hooks'
import { selectFileExecuteResult } from '@/store/ideSlice'
import { Terminal as xterm } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import { useEffect, useRef } from 'react'

const Terminal = () => {
  const terminalRef = useRef(null)
  const terminal = useRef<xterm>()
  const fileExecuteResult = useAppSelector(selectFileExecuteResult)

  useEffect(() => {
    terminal.current = new xterm()
    terminal.current.open(terminalRef.current!)
    terminal.current.write('$ ')

    terminal.current.options = {
      cursorBlink: true,
    }

    terminal.current.onKey(({ key, domEvent }) => {
      const printable =
        !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey

      if (domEvent.key === 'Enter') {
        terminal.current!.write('\r\n$ ')
      } else if (domEvent.key === 'Backspace') {
        // Do not delete the prompt
        if (terminal.current!.buffer.active.cursorX > 2) {
          terminal.current!.write('\b \b')
        }
      } else if (printable) {
        terminal.current!.write(key)
      }
    })

    return () => {
      terminal.current!.dispose()
    }
  }, [])

  useEffect(() => {
    if (fileExecuteResult) {
      terminal.current!.writeln(`\r\n${fileExecuteResult}`)
    }
  }, [fileExecuteResult])

  return <div ref={terminalRef} />
}

export default Terminal
