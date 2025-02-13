package logger

import (
	"os"
	"path/filepath"
	"runtime"

	"github.com/rs/zerolog"
)

var (
	Log      zerolog.Logger
	ErrorLog zerolog.Logger
)

func InitLogger() {
	// Set log level based on environment, default to debug if still in development
	if os.Getenv("ENVIRONMENT") == "production" {
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	} else {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	}
	// Create log file path in container WORKDIR
	logPath := "var/log/soal-service"

	// Create log file if not exists
	if err := os.MkdirAll(logPath, os.ModePerm); err != nil {
		panic(err)
	}
	// Create app log file, allow read write permission (same goes for the error log file)
	appLogFile, err := os.OpenFile(filepath.Join(logPath, "app.log"), os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		panic(err)
	}
	errorLogFile, err := os.OpenFile(filepath.Join(logPath, "error.log"), os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		panic(err)
	}

	// Create logger with timestamp, service name, and log level
	Log = zerolog.New(appLogFile).With().
		Timestamp().
		Str("service", "soal-service").
		Logger()

	ErrorLog = zerolog.New(errorLogFile).With().
		Timestamp().
		Str("service", "soal-service").
		Logger()
}

// LogDebug to create debug log with function name and line number
func LogDebug(message string, fields ...map[string]interface{}) {
	// Get function name, file name, and line number of the caller
	pc, file, line, _ := runtime.Caller(1)
	// Get function name from the program counter (if u took OS class u'll know program counter lmao)
	funcName := runtime.FuncForPC(pc).Name()
	// Create log event with function name, file name, line number, and log type
	event := Log.Debug().
		Str("function", funcName).
		Str("file", filepath.Base(file)).
		Int("line", line).
		Str("log_type", "debug")

	// Add fields to the log event using the addField helper function
	if len(fields) > 0 {
		for key, value := range fields[0] {
			event = addField(event, key, value)
		}
	}
	// Log the debug message
	event.Msg(message)
}

// LogError creates an error log with function name
func LogError(err error, message string, fields ...map[string]interface{}) {
	pc, _, _, _ := runtime.Caller(1)
	funcName := runtime.FuncForPC(pc).Name()

	event := ErrorLog.Error().
		Str("function", funcName).
		Err(err)

	if len(fields) > 0 {
		for key, value := range fields[0] {
			event = addField(event, key, value)
		}
	}
	// Log the error message
	event.Msg(message)
}

// addField adds a field to the log event based on its type (we will specify the fields in the code later)
func addField(event *zerolog.Event, key string, value interface{}) *zerolog.Event {
	// Switch on the type of the value and add it to the log event
	switch v := value.(type) {
	case string:
		return event.Str(key, v)
	case int:
		return event.Int(key, v)
	case float64:
		return event.Float64(key, v)
	default:
		return event.Interface(key, v)
	}
}
