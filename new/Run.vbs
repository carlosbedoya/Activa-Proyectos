Dim objShell
Set objShell = WScript.CreateObject ("WScript.shell")
objShell.run "cmd /K CD C:\Program Files (x86)\Service Bascula & NODE index.js " +  WScript.Arguments.Item(0),0
Set objShell = Nothing