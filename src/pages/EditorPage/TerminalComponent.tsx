import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import { useEffect, useRef } from 'react'

const TerminalComponent = () => {
  const terminalRef = useRef(null)

  useEffect(() => {
    const terminal = new Terminal()
    terminal.open(terminalRef.current!)
    terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    terminal.options = {
      cursorBlink: true,
    }

    return () => {
      terminal.dispose()
    }
  }, [])

  return <div ref={terminalRef} />
}

export default TerminalComponent
